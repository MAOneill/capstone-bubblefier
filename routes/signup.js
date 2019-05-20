const {createNewUser, showSignUp} = require('../controllers/signup');
const express = require('express');
const signUpRouter = express.Router();

signUpRouter.post('/', createNewUser);
signUpRouter.get('/', showSignUp);

module.exports = signUpRouter;