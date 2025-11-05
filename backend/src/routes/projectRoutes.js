const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const {
  getAllProjects,
  getPublishedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();

// GET /api/projects - Get all projects (admin)
router.get('/', getAllProjects);

// GET /api/projects/published - Get published projects (public)
router.get('/published', getPublishedProjects);

// GET /api/projects/:id - Get project by ID
router.get('/:id', getProjectById);

// POST /api/projects - Create new project
router.post('/', createProject);

// PUT /api/projects/:id - Update project
router.put('/:id', updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', deleteProject);

module.exports = router;
