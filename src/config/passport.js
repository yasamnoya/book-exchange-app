const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const { User } = require('../models');

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/users/callback',
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = new User({
          githubId: profile.id,
          fullName: profile.displayName,
          username: profile.username,
        });
        await user.save();
      }
      return done(null, user);
    } catch (e) {
      return done(e, null);
    }
  }
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({ _id: id }, function (err, user) {
    done(err, user);
  });
});

passport.use('github', githubStrategy);

module.exports = passport;
