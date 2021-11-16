const { User } = require('../models');

module.exports = {
  hasLoggedIn: async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    req.user = await User.findById(req.session.passport.user);
    next();
  },
};
