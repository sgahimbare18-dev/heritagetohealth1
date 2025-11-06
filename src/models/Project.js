import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // Keep summary for backward compatibility but prefer description
  summary: { type: String },
  description: { type: String },
  timeline: { type: String },
  status: { type: String, enum: ['completed', 'ongoing', 'upcoming', 'future'], default: 'completed' },
  published: { type: Boolean, default: true },
  reportUrl: { type: String },
  image: { type: String },
  video: { type: String },
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);