const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller')
const authentification = require('../middleware/authentification')


router.post('/create',  contactController.createContact);
router.get('/all', contactController.getAllContacts);
router.get('/get/:id',  contactController.getContactById);
router.patch('/update/:id',  contactController.updateContact);
router.delete('/delete/:id', contactController.deleteContact);


module.exports = router
