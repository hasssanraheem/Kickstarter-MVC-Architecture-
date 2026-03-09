const Project = require('../models/Project');

exports.home = async (req, res) => {
  try {
    const [featuredProjects, newProjects, endingSoonProjects] = await Promise.all([
      Project.find({ status: 'active', featured: true }).populate('creator', 'name').limit(3),
      Project.find({ status: 'active' }).populate('creator', 'name').sort({ createdAt: -1 }).limit(8),
      Project.find({ status: 'active', deadline: { $gt: new Date() } })
        .populate('creator', 'name')
        .sort({ deadline: 1 })
        .limit(4)
    ]);

    res.render('index', {
      title: 'Kickstarter Clone — Fund What Matters',
      featuredProjects,
      newProjects,
      endingSoonProjects
    });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'Kickstarter Clone', featuredProjects: [], newProjects: [], endingSoonProjects: [] });
  }
};
