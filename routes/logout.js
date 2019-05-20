const {logout} = require('../controllers/logout');
const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', logout);

module.exports = logoutRouter;