import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import * as zohoCampaignsController from '../controllers/zohoCampaignsController.js';

const router = express.Router();

// Newsletter subscription routes
router.post('/newsletter/subscribe', zohoCampaignsController.subscribeToNewsletter);
router.post('/newsletter/unsubscribe', zohoCampaignsController.unsubscribeFromNewsletter);
router.get('/newsletter/status', zohoCampaignsController.getSubscriptionStatus);

export default router;
