import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import * as uploadController from '../controllers/uploadController.js';

const router = express.Router();

// POST /api/upload - Upload a file
router.post('/', uploadController.upload.single('file'), uploadController.uploadFile);

// GET /api/upload/:fileName - Get file URL
router.get('/:fileName', uploadController.getFileUrl);

// DELETE /api/upload - Delete a file
router.delete('/', uploadController.deleteFile);

export default router;
