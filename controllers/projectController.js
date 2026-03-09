const Project = require('../models/Project');
const Pledge = require('../models/Pledge');
const { validationResult } = require('express-validator');

// GET /projects — Browse all projects
exports.index = async (req, res) => {
  try {
    const { category, sort, search, page = 1 } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    const query = { status: 'active' };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { backerCount: -1 };
    if (sort === 'ending') sortOption = { deadline: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const [projects, total] = await Promise.all([
      Project.find(query).populate('creator', 'name').sort(sortOption).skip(skip).limit(limit),
      Project.countDocuments(query)
    ]);

    const categories = ['Technology', 'Art', 'Music', 'Film', 'Games', 'Design', 'Food', 'Fashion', 'Publishing', 'Theater', 'Other'];

    res.render('projects/index', {
      title: 'Discover Projects',
      projects,
      categories,
      currentCategory: category || '',
      currentSort: sort || 'newest',
      searchQuery: search || '',
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load projects.');
    res.redirect('/');
  }
};

// GET /projects/new
exports.getCreate = (req, res) => {
  const categories = ['Technology', 'Art', 'Music', 'Film', 'Games', 'Design', 'Food', 'Fashion', 'Publishing', 'Theater', 'Other'];
  res.render('projects/new', { title: 'Start a Project', categories });
};

// POST /projects
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg));
    return res.redirect('/projects/new');
  }

  try {
    const { title, shortDescription, description, category, fundingGoal, deadline, videoUrl, tags } = req.body;

    const project = await Project.create({
      title,
      shortDescription,
      description,
      category,
      fundingGoal: Number(fundingGoal),
      deadline: new Date(deadline),
      videoUrl,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      creator: req.session.userId,
      image: req.file ? `/uploads/${req.file.filename}` : '/images/default-project.png',
      status: 'active'
    });

    req.flash('success', 'Project created successfully!');
    res.redirect(`/projects/${project.slug}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create project.');
    res.redirect('/projects/new');
  }
};

// GET /projects/:slug
exports.show = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).populate('creator', 'name bio avatar');

    if (!project) {
      req.flash('error', 'Project not found.');
      return res.redirect('/projects');
    }

    const recentBackers = await Pledge.find({ project: project._id, anonymous: false, status: 'confirmed' })
      .populate('backer', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    const isOwner = req.session.userId && project.creator._id.toString() === req.session.userId.toString();
    const hasBacked = req.session.userId
      ? await Pledge.exists({ project: project._id, backer: req.session.userId })
      : false;

    res.render('projects/show', {
      title: project.title,
      project,
      recentBackers,
      isOwner,
      hasBacked
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load project.');
    res.redirect('/projects');
  }
};

// GET /projects/:slug/edit
exports.getEdit = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project || project.creator.toString() !== req.session.userId.toString()) {
      req.flash('error', 'Access denied.');
      return res.redirect('/dashboard');
    }
    const categories = ['Technology', 'Art', 'Music', 'Film', 'Games', 'Design', 'Food', 'Fashion', 'Publishing', 'Theater', 'Other'];
    res.render('projects/edit', { title: 'Edit Project', project, categories });
  } catch (err) {
    req.flash('error', 'Could not load project.');
    res.redirect('/dashboard');
  }
};

// PUT /projects/:slug
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg));
    return res.redirect(`/projects/${req.params.slug}/edit`);
  }

  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project || project.creator.toString() !== req.session.userId.toString()) {
      req.flash('error', 'Access denied.');
      return res.redirect('/dashboard');
    }

    const { title, shortDescription, description, category, tags } = req.body;
    Object.assign(project, { title, shortDescription, description, category, tags: tags ? tags.split(',').map(t => t.trim()) : [] });
    if (req.file) project.image = `/uploads/${req.file.filename}`;
    await project.save();

    req.flash('success', 'Project updated!');
    res.redirect(`/projects/${project.slug}`);
  } catch (err) {
    req.flash('error', 'Update failed.');
    res.redirect(`/projects/${req.params.slug}/edit`);
  }
};

// DELETE /projects/:slug
exports.delete = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project || project.creator.toString() !== req.session.userId.toString()) {
      req.flash('error', 'Access denied.');
      return res.redirect('/dashboard');
    }
    await project.deleteOne();
    req.flash('success', 'Project deleted.');
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Could not delete project.');
    res.redirect('/dashboard');
  }
};

// POST /projects/:slug/updates
exports.postUpdate = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project || project.creator.toString() !== req.session.userId.toString()) {
      req.flash('error', 'Access denied.');
      return res.redirect('/projects/' + req.params.slug);
    }
    project.updates.push({ title: req.body.title, body: req.body.body });
    await project.save();
    req.flash('success', 'Update posted!');
    res.redirect(`/projects/${project.slug}`);
  } catch (err) {
    req.flash('error', 'Could not post update.');
    res.redirect('/projects/' + req.params.slug);
  }
};
