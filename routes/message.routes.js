const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authentification = require('../middleware/authentification');

router.post('/send', authentification, messageController.sendMessage);
router.get('/conversation/:email', authentification, messageController.getConversationWith);
router.patch('/read/:id', authentification, messageController.markAsRead);

module.exports = router;
