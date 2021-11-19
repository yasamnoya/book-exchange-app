const router = require('express').Router();
const { Trade } = require('../models');

router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find({});
    await Promise.all(trades.map(async (trade) => {
      await trade.getOne.populate(['user', 'books']);
      await trade.getTwo.populate(['user', 'books']);
    }));
    res.send(trades);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
