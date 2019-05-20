const express = require('express');

const loginRouter =  express.Router();

const {showLoginPage, verifyUser} = require('../controllers/login');

loginRouter.get('/',showLoginPage);

loginRouter.post('/',verifyUser);


module.exports = loginRouter;