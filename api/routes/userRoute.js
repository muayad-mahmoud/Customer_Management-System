const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router
    .get('/getData', userController.getAllData)
    .get('/getuser', userController.getUser)
    .post('/dataRegister', userController.dataRegister)
    .put('/editUser', userController.editUser)
    .delete('/deleteUser', userController.deleteUser);

module.exports = router;