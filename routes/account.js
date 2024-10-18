const { Router } = require('express');
const accountRoutes = Router();
const userController = require('../controllers/user');

accountRoutes.get('/', userController.fetchUser);
accountRoutes.put('/username', userController.updateUsername);
accountRoutes.put('/email', userController.updateEmail);
accountRoutes.put('/password', userController.updatePassword);
accountRoutes.put('/firstName', userController.updateFirstName);
accountRoutes.put('/lastName', userController.updateLastName);
accountRoutes.delete('/', userController.deleteUser);
module.exports = accountRoutes;