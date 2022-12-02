const express = require('express')
const { authenticate } = require('../../helpers/jwt_helper');
const { uploadImage, updateImages } = require('./images.controller')
const { upload } = require('../../helpers/upload_helper')

const imagesRouter = express.Router()

imagesRouter.post('/', authenticate, upload.any('images'), uploadImage)
imagesRouter.put('/:id', authenticate, upload.single('image'), updateImages)

module.exports = imagesRouter