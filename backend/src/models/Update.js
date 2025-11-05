const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  published: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Update', updateSchema);
