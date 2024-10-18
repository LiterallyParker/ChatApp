const { Router } = require('express');
const accountRoutes = Router();
const accountController = require('../controllers/account');

accountRoutes.get('/', accountController.fetchUser);
accountRoutes.put('/name', accountController.updateName);
accountRoutes.put('/username', accountController.updateUsername);
accountRoutes.put('/email', accountController.updateEmail);
accountRoutes.put('/password', accountController.updatePassword);
accountRoutes.delete('/', accountController.deleteUser);

module.exports = accountRoutes;