const router = require('express').Router();
const { hasLoggedIn } = require('../middlewares/auth');

router.use('/books', require('./book.route'));
router.use('/users', require('./user.route'));
router.use('/requests', require('./requst.route'));
router.use('/trades', require('./trade.route'));

router.get('/', (req, res) => {
  res.send('homepage');
});

router.get('/private', hasLoggedIn, (req, res) => {
  res.send('private');
});

module.exports = router;
