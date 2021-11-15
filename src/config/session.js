const expressSession = require('express-session');
const Mongostore = require('connect-mongo');

const sessionStore = Mongostore.create({
  mongoUrl: process.env.MONGODB_URL,
  collection: 'sessions',
});

const session = expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 86400000,
  },
});

module.exports = session;
