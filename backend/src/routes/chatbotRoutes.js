const express = require('express');
const { chatWithAmani } = require('../controllers/chatbotController');

const router = express.Router();

router.post('/chat', chatWithAmani);

module.exports = router;
