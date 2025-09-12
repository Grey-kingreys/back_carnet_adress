const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller')
const authentification = require('../middleware/authentification')


router.post('/create', authentification, contactController.createContact);
router.get('/all', authentification, contactController.getAllContacts);
router.get('/get/:id', authentification, contactController.getContactById);
router.patch('/update/:id', authentification, contactController.updateContact);
router.delete('/delete/:id', authentification, contactController.deleteContact);


module.exports = router
