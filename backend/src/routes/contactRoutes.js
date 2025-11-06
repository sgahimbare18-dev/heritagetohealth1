import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { submitContact, submitPartnership } from '../controllers/contactController.js';

const router = express.Router();

router.post('/contact', submitContact);
router.post('/partnership', submitPartnership);

export default router;
