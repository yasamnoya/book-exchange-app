const router = require('express').Router();
const { Book } = require('../models');

router.post('/', async (req, res) => {
  const book = new Book(req.body);

  try {
    await book.save();
    res.status(201).send(book);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get('/', async (req, res) => {
  try {
    const books = await Book.find({});
    res.send(books);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get('/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).send('Book not found');

    res.send(book);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.patch('/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).send('Book not found');

    const updates = Object.keys(req.body);
    updates.forEach((update) => (book[update] = req.body[update]));
    await book.save();
    res.send(book);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.delete('/:bookId', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) return res.status(404).send();

    res.send(book);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
