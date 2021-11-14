const mongoose = require('mongoose');
const { Book } = require('../../src/models');

const bookOne = {
  _id: mongoose.Types.ObjectId(),
  title: 'book1',
  description: 'description1',
};

const bookTwo = {
  _id: mongoose.Types.ObjectId(),
  title: 'book2',
  description: 'description2',
};

const insertBooks = async (books) => {
  await Book.insertMany(books);
};

module.exports = {
  bookOne,
  bookTwo,
  insertBooks,
};
