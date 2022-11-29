const express = require('express');

const imagesRouter = require('./images/images.router')
const loginRouter = require('./login/login.router')
const userRouter = require('./users/users.router')

const api = express.Router();

api.use('/images', imagesRouter)
api.use('/login', loginRouter)
api.use('/user', userRouter)

module.exports = api