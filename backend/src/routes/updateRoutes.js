import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import * as updateController from '../controllers/updateController.js';

const router = express.Router();

// GET /api/updates - Get all published updates
router.get('/', updateController.getUpdates);

// POST /api/updates - Create a new update (admin)
router.post('/', updateController.createUpdate);

// PUT /api/updates/:id - Update an existing update (admin)
router.put('/:id', updateController.updateUpdate);

// DELETE /api/updates/:id - Delete an update (admin)
router.delete('/:id', updateController.deleteUpdate);

export default router;
