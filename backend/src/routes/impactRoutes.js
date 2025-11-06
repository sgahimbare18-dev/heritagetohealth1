import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import * as impactController from '../controllers/impactController.js';

const router = express.Router();

// GET /api/impacts - Get all impacts (admin)
router.get('/', impactController.getAllImpacts);

// GET /api/impacts/published - Get published impacts (public)
router.get('/published', impactController.getPublishedImpacts);

// GET /api/impacts/:id - Get impact by ID
router.get('/:id', impactController.getImpactById);

// POST /api/impacts - Create new impact
router.post('/', impactController.createImpact);

// PUT /api/impacts/:id - Update impact
router.put('/:id', impactController.updateImpact);

// DELETE /api/impacts/:id - Delete impact
router.delete('/:id', impactController.deleteImpact);

// ✅ Must include this line for ES modules:
export default router;
