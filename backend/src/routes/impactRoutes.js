const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const router = express.Router();
const impactController = require('../controllers/impactController');

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

module.exports = router;
