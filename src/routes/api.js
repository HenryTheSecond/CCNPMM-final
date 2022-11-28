const express = require('express');

const imagesRouter = require('./images/images.router')

const api = express.Router();

api.use('/images', imagesRouter)

module.exports = api