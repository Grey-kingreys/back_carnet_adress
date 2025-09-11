const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const authentification = require('../middleware/authentification')



router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', authentification, userController.logoutUser);
router.get('/all', authentification, userController.getAllUsers);
router.get('/me', authentification, userController.getUser);
router.get('/get/:id', userController.getUserById);
router.patch('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);


module.exports = router