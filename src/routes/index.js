const router = require('express').Router();
const { loggedIn } = require('../middlewares/auth');

router.use('/books', require('./book.route'));
router.use('/users', require('./user.route'));

router.get('/', (req, res) => {
  res.send('homepage');
});

router.get('/private', loggedIn, (req, res) => {
  res.send('private');
});

module.exports = router;
