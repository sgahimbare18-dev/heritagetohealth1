import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import contactRoutes from './routes/contactRoutes.js';
import updateRoutes from './routes/updateRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import programRoutes from './routes/programRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import zohoCampaignsRoutes from './routes/zohoCampaignsRoutes.js';

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', contactRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/impacts', impactRoutes);
app.use('/api', zohoCampaignsRoutes);

export default app;
