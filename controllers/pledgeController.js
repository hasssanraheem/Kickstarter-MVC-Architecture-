const Pledge = require('../models/Pledge');
const Project = require('../models/Project');
const User = require('../models/User');

// POST /pledges
exports.create = async (req, res) => {
  try {
    const { projectId, amount, rewardTierId, anonymous, message } = req.body;

    const project = await Project.findById(projectId);
    if (!project || project.status !== 'active' || project.isExpired) {
      req.flash('error', 'This project is not accepting pledges.');
      return res.redirect('back');
    }

    // Check for existing pledge
    const existing = await Pledge.findOne({ backer: req.session.userId, project: projectId });
    if (existing) {
      req.flash('error', 'You have already backed this project.');
      return res.redirect(`/projects/${project.slug}`);
    }

    const pledge = await Pledge.create({
      backer: req.session.userId,
      project: projectId,
      amount: Number(amount),
      rewardTier: rewardTierId || null,
      anonymous: !!anonymous,
      message,
      status: 'confirmed' // In production: set to 'pending' until payment confirmed
    });

    // Update project totals
    project.amountRaised += pledge.amount;
    project.backerCount += 1;
    if (project.amountRaised >= project.fundingGoal) project.status = 'funded';
    await project.save();

    // Update user's backed projects
    await User.findByIdAndUpdate(req.session.userId, {
      $addToSet: { backedProjects: projectId }
    });

    req.flash('success', `Thank you for backing "${project.title}"! 🎉`);
    res.redirect(`/projects/${project.slug}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Pledge failed. Please try again.');
    res.redirect('back');
  }
};

// POST /pledges/:id/cancel
exports.cancel = async (req, res) => {
  try {
    const pledge = await Pledge.findById(req.params.id).populate('project');
    if (!pledge || pledge.backer.toString() !== req.session.userId.toString()) {
      req.flash('error', 'Access denied.');
      return res.redirect('/dashboard');
    }

    if (pledge.status !== 'confirmed') {
      req.flash('error', 'This pledge cannot be cancelled.');
      return res.redirect('/dashboard');
    }

    // Reverse project totals
    const project = pledge.project;
    project.amountRaised = Math.max(0, project.amountRaised - pledge.amount);
    project.backerCount = Math.max(0, project.backerCount - 1);
    await project.save();

    pledge.status = 'cancelled';
    await pledge.save();

    req.flash('success', 'Pledge cancelled.');
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Could not cancel pledge.');
    res.redirect('/dashboard');
  }
};

// GET /pledges/my-pledges
exports.myPledges = async (req, res) => {
  try {
    const pledges = await Pledge.find({ backer: req.session.userId })
      .populate('project', 'title slug image status deadline')
      .sort({ createdAt: -1 });

    res.render('pledges/my-pledges', { title: 'My Pledges', pledges });
  } catch (err) {
    req.flash('error', 'Could not load pledges.');
    res.redirect('/dashboard');
  }
};
