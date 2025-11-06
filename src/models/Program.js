import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeline: { type: String },
  status: { type: String, enum: ['completed', 'ongoing', 'upcoming', 'future'], default: 'upcoming' },
  published: { type: Boolean, default: true },
  image: { type: String },
  video: { type: String },
}, { timestamps: true });

export default mongoose.model('Program', ProgramSchema);