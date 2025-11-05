const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // URL to uploaded image
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Program', programSchema);
