const dotenv = require("dotenv");
dotenv.config();

const Impact = require('../models/Impact');

// Get all impacts
const getAllImpacts = async (req, res) => {
  try {
    const impacts = await Impact.find().sort({ createdAt: -1 });
    res.status(200).json(impacts);
  } catch (error) {
    console.error('Error fetching impacts:', error);
    res.status(500).json({ error: 'Failed to fetch impacts' });
  }
};

// Get published impacts
const getPublishedImpacts = async (req, res) => {
  try {
    const impacts = await Impact.find({ published: true }).sort({ createdAt: -1 });
    res.status(200).json(impacts);
  } catch (error) {
    console.error('Error fetching published impacts:', error);
    res.status(500).json({ error: 'Failed to fetch impacts' });
  }
};

// Get impact by ID
const getImpactById = async (req, res) => {
  try {
    const impact = await Impact.findById(req.params.id);
    if (!impact) {
      return res.status(404).json({ error: 'Impact not found' });
    }
    res.status(200).json(impact);
  } catch (error) {
    console.error('Error fetching impact:', error);
    res.status(500).json({ error: 'Failed to fetch impact' });
  }
};

// Create new impact
const createImpact = async (req, res) => {
  try {
    const { title, value, description, milestones, published } = req.body;

    if (!title || !value || !description) {
      return res.status(400).json({ error: 'Title, value, and description are required' });
    }

    const impact = new Impact({
      title,
      value,
      description,
      milestones: milestones || [],
      published: published !== undefined ? published : true
    });

    const savedImpact = await impact.save();
    res.status(201).json(savedImpact);
  } catch (error) {
    console.error('Error creating impact:', error);
    res.status(500).json({ error: 'Failed to create impact' });
  }
};

// Update impact
const updateImpact = async (req, res) => {
  try {
    const { title, value, description, milestones, published } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (value !== undefined) updateData.value = value;
    if (description !== undefined) updateData.description = description;
    if (milestones !== undefined) updateData.milestones = milestones;
    if (published !== undefined) updateData.published = published;
    updateData.updatedAt = new Date();

    const impact = await Impact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!impact) {
      return res.status(404).json({ error: 'Impact not found' });
    }

    res.status(200).json(impact);
  } catch (error) {
    console.error('Error updating impact:', error);
    res.status(500).json({ error: 'Failed to update impact' });
  }
};

// Delete impact
const deleteImpact = async (req, res) => {
  try {
    const impact = await Impact.findByIdAndDelete(req.params.id);

    if (!impact) {
      return res.status(404).json({ error: 'Impact not found' });
    }

    res.status(200).json({ message: 'Impact deleted successfully' });
  } catch (error) {
    console.error('Error deleting impact:', error);
    res.status(500).json({ error: 'Failed to delete impact' });
  }
};

module.exports = {
  getAllImpacts,
  getPublishedImpacts,
  getImpactById,
  createImpact,
  updateImpact,
  deleteImpact,
};
