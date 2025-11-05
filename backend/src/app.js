const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const updateRoutes = require('./routes/updateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const projectRoutes = require('./routes/projectRoutes');
const programRoutes = require('./routes/programRoutes');
const impactRoutes = require('./routes/impactRoutes');
const zohoCampaignsRoutes = require('./routes/zohoCampaignsRoutes');

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

module.exports = app;
