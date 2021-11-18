const router = require('express').Router();
const { Request, Book, Trade } = require('../models');
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

router.patch('/:requestId/accept', async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) res.status(404).send('Request not found');

    if (!request.requestees.includes(req.user._id.toString())) return res.status(403).send();

    // create trade
    const trade = new Trade({
      getOne: {
        user: req.user._id,
        books: [req.body.toGive],
      },
      getTwo: {
        user: request.requestor._id,
        books: [req.body.toTake],
      },
    });
    await trade.save();

    // update books
    await Book.updateMany(
      { $in: { _id: [...req.body.toTake, ...req.body.toGive] } },
      { available: false }
    );

    // update request
    request.toTake = request.toTake.filter((book) => !req.body.toTake.includes(book.toString()));
    request.toGive = request.toGive.filter((book) => !req.body.toGive.includes(book.toString()));

    if (request.toTake.length == 0 || request.toGive.length == 0) {
      await request.remove();
    } else {
      request.save();
    }

    await Book.updateMany(
      { $in: { _id: req.body.toTake } },
      { $pull: { requests: req.params.requestId } }
    );

    res.send(trade);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.patch('/:requestId/reject', async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) res.status(404).send('Request not found');

    if (!request.requestees.includes(req.user._id.toString())) return res.status(403).send();

    await request.populate('toTake');

    // update request
    request.toTake = request.toTake.filter(
      (book) => book.owner._id.toString() !== req.user._id.toString()
    );

    if (request.toTake.length == 0) {
      await request.remove();
    } else {
      request.save();
    }

    // update books
    await Book.updateMany(
      { owner: req.user._id, $in: { requests: req.params.reqeustId } },
      { $pull: { requests: req.params.requestId } }
    );

    res.send();
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
