import mongoose from 'mongoose';

const UpcomingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  info: { type: String, required: true },
  promoImage: { type: String },
  promoVideo: { type: String },
}, { timestamps: true });

export default mongoose.model('Upcoming', UpcomingSchema);