const router = require('express').Router();
const { Request, Book } = require('../models');
const { hasLoggedIn } = require('../middlewares/auth');

router.post('/', hasLoggedIn, async (req, res) => {
  const books = await Book.find({ _id: { $in: req.body.toTake } });
  const requestees = books.map((book) => book.owner);
  try {
    const request = new Request({
      ...req.body,
      requestor: req.user._id,
      requestees,
    });

    await Book.updateMany({ _id: { $in: req.body.toTake } }, { $push: { requests: request._id } });

    request.save();
    res.send(request);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get('/', async (req, res) => {
  try {
    const requests = await Request.find({});
    await Promise.all(
      requests.map(async (request) => {
        await request.populate(['toGive', 'toTake', 'requestor']);
      })
    );
    res.send(requests);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get('/incoming', hasLoggedIn, async (req, res) => {
  try {
    const requests = await Request.find({ requestees: req.user._id });
    await Promise.all(
      requests.map(async (request) => {
        await request.populate(['toGive', 'toTake', 'requestor']);
        return request.toTake.filter((book) => book.owner.toString() == req.user._id.toString());
      })
    );
    res.send(requests);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get('/:requestId', async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) res.status(404).send('Request not found');

    await request.populate(['toGive', 'toTake', 'requestor']);

    res.send(request);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.patch('/:requestId', hasLoggedIn, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) res.status(404).send('Request not found');

    if (request.requestor.toString() != req.user._id.toString()) return res.status(403).send();

    await Book.updateMany({ _id: { $in: request.toTake } }, { $pull: { requests: request._id } });

    const updates = Object.keys(req.body);
    updates.forEach((update) => {
      request[update] = req.body[update];
    });

    const books = await Book.find({ _id: { $in: req.body.toTake } });
    const requestees = books.map((book) => book.owner);
    request.requestees = requestees;

    await Book.updateMany({ _id: { $in: request.toTake } }, { $push: { requests: request._id } });

    await request.save();
    res.send(request);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.delete('/:requestId', hasLoggedIn, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) res.status(404).send('Request not found');

    if (request.requestor.toString() != req.user._id.toString()) return res.status(403).send();

    await Book.updateMany({ _id: { $in: request.toTake } }, { $pull: { requests: request._id } });

    await request.remove();
    res.send(request);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
