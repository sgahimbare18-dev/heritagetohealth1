const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  userId: { type: String, default: 'anonymous' },
  message: { type: String, required: true },
  reply: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
