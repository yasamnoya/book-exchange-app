const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('common'));
}

const router = require('./routes');
app.use(router);

module.exports = app;
