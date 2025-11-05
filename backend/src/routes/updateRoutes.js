const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const router = express.Router();
const { getUpdates, createUpdate, updateUpdate, deleteUpdate } = require('../controllers/updateController');

// GET /api/updates - Get all published updates
router.get('/', getUpdates);

// POST /api/updates - Create a new update (admin)
router.post('/', createUpdate);

// PUT /api/updates/:id - Update an existing update (admin)
router.put('/:id', updateUpdate);

// DELETE /api/updates/:id - Delete an update (admin)
router.delete('/:id', deleteUpdate);

module.exports = router;
