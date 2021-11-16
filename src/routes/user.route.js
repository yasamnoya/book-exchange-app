const router = require('express').Router();
const passport = require('passport');
const { User } = require('../models');
const { hasLoggedIn } = require('../middlewares/auth');

router.get('/login', passport.authenticate('github'));

router.get('/callback', passport.authenticate('github'), (req, res) => {
  req.session.save();
  res.send(req.user);
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get('/:userId/books', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    await user.populate('books');
    res.send(user.books);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.patch('/:userId', hasLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    if (user._id.toString() != req.user._id.toString()) return res.status(403).send();

    const updates = Object.keys(req.body);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.delete('/:userId', hasLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send();

    if (user._id.toString() != req.user._id.toString()) return res.status(403).send();
    await user.remove();

    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
