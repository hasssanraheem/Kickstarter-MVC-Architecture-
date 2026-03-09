const User = require('../models/User');
const Project = require('../models/Project');

// GET /users/:id
exports.show = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/');
    }

    const createdProjects = await Project.find({ creator: user._id, status: { $ne: 'draft' } })
      .sort({ createdAt: -1 })
      .limit(6);

    res.render('users/profile', { title: user.name, profileUser: user, createdProjects });
  } catch (err) {
    req.flash('error', 'Could not load profile.');
    res.redirect('/');
  }
};

// GET /users/settings
exports.getSettings = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('users/settings', { title: 'Account Settings', profileUser: user });
};

// PUT /users/settings
exports.updateSettings = async (req, res) => {
  try {
    const { name, bio, location, website } = req.body;
    const update = { name, bio, location, website };
    if (req.file) update.avatar = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.session.userId, update, { runValidators: true });
    req.flash('success', 'Profile updated!');
    res.redirect('/users/settings');
  } catch (err) {
    req.flash('error', 'Could not update profile.');
    res.redirect('/users/settings');
  }
};
