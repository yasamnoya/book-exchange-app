const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('homepage');
});

module.exports = router;
