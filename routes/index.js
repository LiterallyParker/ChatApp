const express = require("express");
const apiRoutes = express.Router();

const userRoutes = require('./user');
apiRoutes.use('/users', userRoutes);

module.exports = apiRoutes