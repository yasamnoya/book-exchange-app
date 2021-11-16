const router = require('express').Router();
const { Book } = require('../models');
const { hasLoggedIn } = require('../middlewares/auth');

router.post('/', hasLoggedIn, async (req, res) => {
  const book = new Book({
    ...req.body,
    owner: req.user._id,
  });

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

router.patch('/:bookId', hasLoggedIn, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).send('Book not found');

    if (book.owner.toString() != req.user._id.toString()) return res.status(403).send();

    const updates = Object.keys(req.body);
    updates.forEach((update) => (book[update] = req.body[update]));
    await book.save();
    res.send(book);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.delete('/:bookId', hasLoggedIn, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).send();

    if (book.owner.toString() != req.user._id.toString()) return res.status(403).send();

    await book.remove();
    res.send(book);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
