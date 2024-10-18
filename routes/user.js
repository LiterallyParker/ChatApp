const { Router } = require('express');
const usersRoutes = Router();
const userController = require('../controllers/user');
const { errorResponse, ERROR_MESSAGES } = require('../util');
const { requireUser } = require('../auth');

// Route to get all users
usersRoutes.get('/', userController.getUsersByPagination);
usersRoutes.get('/:userId', userController.getUserById);
usersRoutes.post('/register', userController.registerUser);
usersRoutes.post('/login', userController.loginUser);

const accountRoutes = require('./account')
usersRoutes.use('/account', requireUser, accountRoutes);

module.exports = usersRoutes;
