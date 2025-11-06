import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { uploadToB2 } from './b2.js';
import Update from './models/Update.js';
import Program from './models/Program.js';
import Testimonial from './models/Testimonial.js';
import Project from './models/Project.js';
import Upcoming from './models/Upcoming.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS: allow production frontends and localhost
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.gasipi.space',
  process.env.FRONTEND_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true); // fallback: allow others for now
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Mongo connection
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
if (!mongoUri) {
  console.warn('MONGODB_URI not set');
}
mongoose.connect(mongoUri, { dbName: process.env.MONGO_DB || 'heritage_to_health' })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

// Multer (memory) for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Generic upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const result = await uploadToB2({
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
      originalName: req.file.originalname,
    });
    return res.json({ success: true, file: result });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Helper to process optional file fields (image, video)
const optionalMediaUpload = async (req) => {
  const media = {};
  if (req.files?.image?.[0]) {
    media.image = await uploadToB2({
      buffer: req.files.image[0].buffer,
      contentType: req.files.image[0].mimetype,
      originalName: req.files.image[0].originalname,
      folder: 'images',
    });
  }
  if (req.files?.video?.[0]) {
    media.video = await uploadToB2({
      buffer: req.files.video[0].buffer,
      contentType: req.files.video[0].mimetype,
      originalName: req.files.video[0].originalname,
      folder: 'videos',
    });
  }
  return media;
};

const multiUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

// Updates
app.get('/api/updates', async (req, res) => {
  const items = await Update.find().sort({ createdAt: -1 });
  res.json(items);
});
app.post('/api/updates', multiUpload, async (req, res) => {
  try {
    const { title, content, author, status } = req.body;
    const media = await optionalMediaUpload(req);
    const doc = await Update.create({
      title,
      content,
      author,
      status: status || 'draft',
      image: media.image?.url || req.body.image,
      video: media.video?.url || req.body.video,
    });
    res.json(doc);
  } catch (err) {
    console.error('Create update error', err);
    res.status(500).json({ message: 'Failed to create update' });
  }
});

// Programs
app.get('/api/programs', async (req, res) => {
  const items = await Program.find().sort({ createdAt: -1 });
  res.json(items);
});
app.get('/api/programs/published', async (req, res) => {
  const items = await Program.find({ published: true }).sort({ createdAt: -1 });
  res.json(items);
});
app.post('/api/programs', multiUpload, async (req, res) => {
  try {
    const { title, description, timeline, status, published } = req.body;
    const media = await optionalMediaUpload(req);
    const doc = await Program.create({
      title,
      description,
      timeline,
      status: status || 'upcoming',
      published: published !== undefined ? published === 'true' || published === true : true,
      image: media.image?.url || req.body.image,
      video: media.video?.url || req.body.video,
    });
    res.json(doc);
  } catch (err) {
    console.error('Create program error', err);
    res.status(500).json({ message: 'Failed to create program' });
  }
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
  const items = await Testimonial.find().sort({ createdAt: -1 });
  res.json(items);
});
app.post('/api/testimonials', multiUpload, async (req, res) => {
  try {
    const { author, quote, published } = req.body;
    const media = await optionalMediaUpload(req);
    const doc = await Testimonial.create({
      author,
      quote,
      published: published !== undefined ? published === 'true' || published === true : true,
      image: media.image?.url || req.body.image,
      video: media.video?.url || req.body.video,
    });
    res.json(doc);
  } catch (err) {
    console.error('Create testimonial error', err);
    res.status(500).json({ message: 'Failed to create testimonial' });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  const items = await Project.find().sort({ createdAt: -1 });
  res.json(items);
});
app.post('/api/projects', multiUpload, async (req, res) => {
  try {
    const { title, summary, status, reportUrl } = req.body;
    const media = await optionalMediaUpload(req);
    const doc = await Project.create({
      title,
      summary,
      status: status || 'completed',
      reportUrl,
      image: media.image?.url || req.body.image,
      video: media.video?.url || req.body.video,
    });
    res.json(doc);
  } catch (err) {
    console.error('Create project error', err);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// Upcoming
app.get('/api/upcoming', async (req, res) => {
  const items = await Upcoming.find().sort({ createdAt: -1 });
  res.json(items);
});
app.post('/api/upcoming', multiUpload, async (req, res) => {
  try {
    const { title, info } = req.body;
    const media = await optionalMediaUpload(req);
    const doc = await Upcoming.create({
      title,
      info,
      promoImage: media.image?.url || req.body.image,
      promoVideo: media.video?.url || req.body.video,
    });
    res.json(doc);
  } catch (err) {
    console.error('Create upcoming error', err);
    res.status(500).json({ message: 'Failed to create upcoming item' });
  }
});

// Additional CRUD endpoints
// Programs: update and delete
app.put('/api/programs/:id', multiUpload, async (req, res) => {
  try {
    const { title, description, timeline, status, published } = req.body;
    const media = await optionalMediaUpload(req);
    const update = {
      title,
      description,
      timeline,
      status,
      published: published !== undefined ? published === 'true' || published === true : undefined,
    };
    if (media.image?.url || req.body.image) update.image = media.image?.url || req.body.image;
    if (media.video?.url || req.body.video) update.video = media.video?.url || req.body.video;
    const doc = await Program.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(doc);
  } catch (err) {
    console.error('Update program error', err);
    res.status(500).json({ message: 'Failed to update program' });
  }
});
app.delete('/api/programs/:id', async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete program error', err);
    res.status(500).json({ message: 'Failed to delete program' });
  }
});

// Testimonials: update and delete
app.put('/api/testimonials/:id', multiUpload, async (req, res) => {
  try {
    const { author, quote, published, showOnHome } = req.body;
    const media = await optionalMediaUpload(req);
    const update = {
      author,
      quote,
      published: published !== undefined ? published === 'true' || published === true : undefined,
      showOnHome: showOnHome !== undefined ? showOnHome === 'true' || showOnHome === true : undefined,
    };
    if (media.image?.url || req.body.image) update.image = media.image?.url || req.body.image;
    if (media.video?.url || req.body.video) update.video = media.video?.url || req.body.video;
    const doc = await Testimonial.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(doc);
  } catch (err) {
    console.error('Update testimonial error', err);
    res.status(500).json({ message: 'Failed to update testimonial' });
  }
});
app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete testimonial error', err);
    res.status(500).json({ message: 'Failed to delete testimonial' });
  }
});

// Projects: update and delete
app.put('/api/projects/:id', multiUpload, async (req, res) => {
  try {
    const { title, description, summary, status, reportUrl, timeline, published } = req.body;
    const media = await optionalMediaUpload(req);
    const update = {
      title,
      description,
      summary,
      status,
      reportUrl,
      timeline,
      published: published !== undefined ? published === 'true' || published === true : undefined,
    };
    if (media.image?.url || req.body.image) update.image = media.image?.url || req.body.image;
    if (media.video?.url || req.body.video) update.video = media.video?.url || req.body.video;
    const doc = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(doc);
  } catch (err) {
    console.error('Update project error', err);
    res.status(500).json({ message: 'Failed to update project' });
  }
});
app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete project error', err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// Upcoming: update and delete
app.put('/api/upcoming/:id', multiUpload, async (req, res) => {
  try {
    const { title, info } = req.body;
    const media = await optionalMediaUpload(req);
    const update = { title, info };
    if (media.image?.url || req.body.image) update.promoImage = media.image?.url || req.body.image;
    if (media.video?.url || req.body.video) update.promoVideo = media.video?.url || req.body.video;
    const doc = await Upcoming.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(doc);
  } catch (err) {
    console.error('Update upcoming error', err);
    res.status(500).json({ message: 'Failed to update upcoming item' });
  }
});
app.delete('/api/upcoming/:id', async (req, res) => {
  try {
    await Upcoming.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete upcoming error', err);
    res.status(500).json({ message: 'Failed to delete upcoming item' });
  }
});

// Updates: update and delete
app.put('/api/updates/:id', multiUpload, async (req, res) => {
  try {
    const { title, content, author, status } = req.body;
    const media = await optionalMediaUpload(req);
    const update = { title, content, author, status };
    if (media.image?.url || req.body.image) update.image = media.image?.url || req.body.image;
    if (media.video?.url || req.body.video) update.video = media.video?.url || req.body.video;
    const doc = await Update.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(doc);
  } catch (err) {
    console.error('Update update error', err);
    res.status(500).json({ message: 'Failed to update update' });
  }
});
app.delete('/api/updates/:id', async (req, res) => {
  try {
    await Update.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete update error', err);
    res.status(500).json({ message: 'Failed to delete update' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});