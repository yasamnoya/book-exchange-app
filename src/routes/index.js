const router = require('express').Router();

router.use('/books', require('./book.route'));

router.get('/', (req, res) => {
  res.send('homepage');
});

module.exports = router;
