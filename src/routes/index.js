const router = require('express').Router();

router.use('/books', require('./book.route'));
router.use('/users', require('./user.route'));

router.get('/', (req, res) => {
  res.send('homepage');
});

module.exports = router;
