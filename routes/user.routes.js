// user.routes.js - APRÈS (corrigé)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authentification = require('../middleware/authentification');

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', authentification, userController.logoutUser);
router.post('/logout/all', authentification, userController.logoutAllUser);
router.get('/all', authentification, userController.getAllUsers);
router.get('/me', authentification, userController.getUser);
router.get('/get/:id', authentification, userController.getUserById);
router.get('/check-email/:email', authentification, userController.checkEmailExists); // ✅ Ligne ajoutée
router.patch('/update/:id', authentification, userController.updateUser);
router.delete('/delete/:id', authentification, userController.deleteUser);

module.exports = router;