import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';

const impactSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String, required: true },
  milestones: [{ type: String }],
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Impact', impactSchema);
