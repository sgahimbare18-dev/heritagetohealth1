const dotenv = require("dotenv");
dotenv.config();

const Program = require('../models/Program');

// Get all programs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 });
    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

// Get published programs
const getPublishedPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ published: true }).sort({ createdAt: -1 });
    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching published programs:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

// Get program by ID
const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    res.status(200).json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
};

// Create new program
const createProgram = async (req, res) => {
  try {
    const { title, description, image, published } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const program = new Program({
      title,
      description,
      image,
      published: published !== undefined ? published : true
    });

    const savedProgram = await program.save();
    res.status(201).json(savedProgram);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ error: 'Failed to create program' });
  }
};

// Update program
const updateProgram = async (req, res) => {
  try {
    const { title, description, image, published } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (published !== undefined) updateData.published = published;
    updateData.updatedAt = new Date();

    const program = await Program.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.status(200).json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ error: 'Failed to update program' });
  }
};

// Delete program
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ error: 'Failed to delete program' });
  }
};

module.exports = {
  getAllPrograms,
  getPublishedPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
};
