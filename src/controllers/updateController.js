import dotenv from 'dotenv';
dotenv.config();

import Update from '../models/Update.js';

// Get all updates (sorted by createdAt desc)
export const getUpdates = async (req, res) => {
  try {
    const updates = await Update.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
};

// Create a new update (supports text and optional media URLs)
export const createUpdate = async (req, res) => {
  const { title, content, author, status, image, video } = req.body;
  try {
    const update = new Update({
      title,
      content,
      author,
      status: status || 'draft',
      image,
      video,
    });
    await update.save();
    res.json({ message: 'Update created successfully', update });
  } catch (error) {
    console.error('Error creating update:', error);
    res.status(500).json({ error: 'Failed to create update' });
  }
};

// Update an existing update
export const updateUpdate = async (req, res) => {
  const { id } = req.params;
  const { title, content, author, status, image, video } = req.body;
  try {
    const update = await Update.findByIdAndUpdate(
      id,
      { title, content, author, status, image, video },
      { new: true }
    );
    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }
    res.json({ message: 'Update updated successfully', update });
  } catch (error) {
    console.error('Error updating update:', error);
    res.status(500).json({ error: 'Failed to update update' });
  }
};

// Delete an update
export const deleteUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const update = await Update.findByIdAndDelete(id);
    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }
    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Error deleting update:', error);
    res.status(500).json({ error: 'Failed to delete update' });
  }
};
