const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('./config/passport');
const session = require('./config/session');

const app = express();

console.log(process.env.FRONTEND_URL)
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session);

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('common'));
}

const router = require('./routes');
app.use(router);

module.exports = app;
