const express = require("express");
const apiRoutes = express.Router();
const { requireUser } = require("../auth");

const userRoutes = require('./user');
apiRoutes.use('/users', userRoutes);

const accountRoutes = require('./account');
apiRoutes.use('/account', requireUser, accountRoutes);

module.exports = apiRoutes