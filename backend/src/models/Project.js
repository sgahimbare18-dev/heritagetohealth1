import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeline: { type: String, required: true },
  status: { type: String, enum: ['completed', 'ongoing', 'upcoming', 'future'], required: true },
  image: { type: String }, // URL to uploaded image
  video: { type: String }, // URL to uploaded video
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
