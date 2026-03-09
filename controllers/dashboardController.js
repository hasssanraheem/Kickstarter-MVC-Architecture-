const Project = require('../models/Project');
const Pledge = require('../models/Pledge');
const User = require('../models/User');

// GET /dashboard
exports.index = async (req, res) => {
  try {
    const [createdProjects, pledges, user] = await Promise.all([
      Project.find({ creator: req.session.userId }).sort({ createdAt: -1 }),
      Pledge.find({ backer: req.session.userId, status: { $ne: 'cancelled' } })
        .populate('project', 'title slug image status amountRaised fundingGoal deadline')
        .sort({ createdAt: -1 }),
      User.findById(req.session.userId)
    ]);

    const totalPledged = pledges.reduce((sum, p) => sum + p.amount, 0);
    const totalRaised = createdProjects.reduce((sum, p) => sum + p.amountRaised, 0);

    res.render('dashboard/index', {
      title: 'Dashboard',
      user,
      createdProjects,
      pledges,
      stats: {
        totalPledged,
        totalRaised,
        projectsCreated: createdProjects.length,
        projectsBacked: pledges.length
      }
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load dashboard.');
    res.redirect('/');
  }
};
