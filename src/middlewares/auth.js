module.exports = {
  loggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).send();

    next();
  },
};
