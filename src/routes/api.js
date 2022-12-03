const express = require('express');

const imagesRouter = require('./images/images.router')
const loginRouter = require('./login/login.router')
const userRouter = require('./users/users.router')
const videoRouter = require('./videos/video.router')

const api = express.Router();

api.use('/images', imagesRouter)
api.use('/login', loginRouter)
api.use('/user', userRouter)
api.use('/videos', videoRouter)

module.exports = api