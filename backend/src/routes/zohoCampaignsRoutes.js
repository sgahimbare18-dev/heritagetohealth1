const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const { 
  subscribeToNewsletter, 
  unsubscribeFromNewsletter, 
  getSubscriptionStatus 
} = require('../controllers/zohoCampaignsController');

const router = express.Router();

// Newsletter subscription routes
router.post('/newsletter/subscribe', subscribeToNewsletter);
router.post('/newsletter/unsubscribe', unsubscribeFromNewsletter);
router.get('/newsletter/status', getSubscriptionStatus);

module.exports = router;