const dotenv = require("dotenv");
dotenv.config();

const Update = require('../models/Update');

// Get all published updates
const getUpdates = async (req, res) => {
  try {
    const updates = await Update.find({ published: true }).sort({ date: -1 });
    res.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
};

// Create a new update (admin functionality)
const createUpdate = async (req, res) => {
  const { title, excerpt, content, date } = req.body;

  try {
    const update = new Update({
      title,
      excerpt,
      content,
      date: date || new Date(),
    });

    await update.save();
    res.json({ message: 'Update created successfully', update });
  } catch (error) {
    console.error('Error creating update:', error);
    res.status(500).json({ error: 'Failed to create update' });
  }
};

// Update an existing update
const updateUpdate = async (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, date, published } = req.body;

  try {
    const update = await Update.findByIdAndUpdate(
      id,
      { title, excerpt, content, date, published },
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
const deleteUpdate = async (req, res) => {
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

module.exports = { getUpdates, createUpdate, updateUpdate, deleteUpdate };
