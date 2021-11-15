const router = require('express').Router();
const passport = require('passport');
const { User } = require('../models');

router.get('/login', passport.authenticate('github'), async (req, res) => {
  res.send(req.user);
});

router.get('/callback', passport.authenticate('github'), (req, res) => {
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

router.patch('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    const updates = Object.keys(req.body);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).send();

    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
