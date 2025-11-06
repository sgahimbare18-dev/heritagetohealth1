import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import B2 from 'backblaze-b2';
import { uploadToB2 } from '../b2.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/avi',
      'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, PDFs, and documents are allowed.'), false);
    }
  },
});

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const folder = req.file.mimetype.startsWith('image/') ? 'images'
      : req.file.mimetype.startsWith('video/') ? 'videos' : 'uploads';
    const result = await uploadToB2({
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
      originalName: req.file.originalname,
      folder,
    });
    return res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        id: result.fileId,
        name: result.fileName,
        url: result.url,
        size: result.size,
        type: result.contentType,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file', details: error.message });
  }
};

export const getFileUrl = async (req, res) => {
  try {
    const { fileName } = req.params;
    if (!fileName) return res.status(400).json({ error: 'File name is required' });
    const publicBase = process.env.B2_PUBLIC_URL_BASE || 'https://f000.backblazeb2.com/file';
    const bucketName = process.env.B2_BUCKET_NAME;
    if (!bucketName) return res.status(500).json({ error: 'Bucket name not configured' });
    const url = `${publicBase}/${bucketName}/${fileName}`;
    return res.status(200).json({ url });
  } catch (error) {
    console.error('Get file URL error:', error);
    res.status(500).json({ error: 'Failed to get file URL', details: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { fileName, fileId } = req.body;
    if (!fileName || !fileId) {
      return res.status(400).json({ error: 'File name and file ID are required' });
    }
    const keyId = process.env.B2_KEY_ID;
    const appKey = process.env.B2_APP_KEY;
    const b2 = new B2({ applicationKeyId: keyId, applicationKey: appKey });
    await b2.authorize();
    await b2.deleteFileVersion({ fileName, fileId });
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file', details: error.message });
  }
};

export default { upload, uploadFile, getFileUrl, deleteFile };

