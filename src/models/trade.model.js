const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  getOne: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
    ],
  },
  getTwo: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
    ],
  },
});

const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;
