import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  quote: { type: String, required: true },
  published: { type: Boolean, default: true },
  showOnHome: { type: Boolean, default: false },
  image: { type: String },
  video: { type: String },
}, { timestamps: true });

export default mongoose.model('Testimonial', TestimonialSchema);