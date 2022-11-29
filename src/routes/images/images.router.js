const express = require('express')
const multer = require('multer')
const { authenticate } = require('../../helpers/jwt_helper');
const { uploadImage, updateImages } = require('./images.controller')
const {v4: uuidv4} = require('uuid')

const imagesRouter = express.Router()

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        cb(null, uuidv4())
    }
})

const upload = multer({storage: storage}) 

imagesRouter.post('/', authenticate, upload.any('images'), uploadImage)
imagesRouter.put('/', authenticate, upload.any('images'), updateImages)

module.exports = imagesRouter