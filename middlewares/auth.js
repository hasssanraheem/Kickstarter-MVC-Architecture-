// Require user to be logged in
exports.requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in to do that.');
    return res.redirect('/auth/login');
  }
  next();
};

// Redirect already-logged-in users away from auth pages
exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session.userId) return res.redirect('/dashboard');
  next();
};
