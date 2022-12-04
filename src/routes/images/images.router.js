const express = require('express')
const { authenticate } = require('../../helpers/jwt_helper');
const { uploadImage, updateImages, deleteImage, getImageById, getImage, getAllImage } = require('./images.controller')
const { upload } = require('../../helpers/upload_helper')

const imagesRouter = express.Router()

imagesRouter.get('/getAll', authenticate, getAllImage)
imagesRouter.get('/:id', authenticate, getImageById)
imagesRouter.get('/', authenticate, getImage)
imagesRouter.post('/', authenticate, upload.any('images'), uploadImage)
imagesRouter.put('/:id', authenticate, upload.single('image'), updateImages)
imagesRouter.delete('/:id', authenticate, deleteImage)

module.exports = imagesRouter