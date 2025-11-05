const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

// GET /api/programs - Get all programs (admin)
router.get('/', programController.getAllPrograms);

// GET /api/programs/published - Get published programs (public)
router.get('/published', programController.getPublishedPrograms);

// GET /api/programs/:id - Get program by ID
router.get('/:id', programController.getProgramById);

// POST /api/programs - Create new program
router.post('/', programController.createProgram);

// PUT /api/programs/:id - Update program
router.put('/:id', programController.updateProgram);

// DELETE /api/programs/:id - Delete program
router.delete('/:id', programController.deleteProgram);

module.exports = router;
