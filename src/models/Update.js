import mongoose from 'mongoose';

const UpdateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  image: { type: String },
  video: { type: String },
}, { timestamps: true });

export default mongoose.model('Update', UpdateSchema);