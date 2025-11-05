import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  published: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
});

const Update = mongoose.model('Update', updateSchema);

export default Update;
