const express = require('express')
const multer = require('multer')
const upload = multer()

const { uploadImage } = require('./images.controller')

const imagesRouter = express.Router()

imagesRouter.post('/', upload.single('file'), uploadImage)

module.exports = imagesRouter