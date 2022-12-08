const express = require('express');
const { register, login, loginGoogle } = require('./login.controller')

const loginRouter = express.Router();

loginRouter.post("/", login);
loginRouter.post("/register", register);
loginRouter.post("/google", loginGoogle);

module.exports = loginRouter;