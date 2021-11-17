const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  toTake: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
  ],
  toGive: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
  ],
  requestor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
