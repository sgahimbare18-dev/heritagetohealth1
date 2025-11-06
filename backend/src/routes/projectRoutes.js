import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import * as projectController from '../controllers/projectController.js';

const router = express.Router();

// GET /api/projects - Get all projects (admin)
router.get('/', projectController.getAllProjects);

// GET /api/projects/published - Get published projects (public)
router.get('/published', projectController.getPublishedProjects);

// GET /api/projects/:id - Get project by ID
router.get('/:id', projectController.getProjectById);

// POST /api/projects - Create new project
router.post('/', projectController.createProject);

// PUT /api/projects/:id - Update project
router.put('/:id', projectController.updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', projectController.deleteProject);

export default router;
