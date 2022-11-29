const express = require('express')
const multer = require('multer')

const { uploadImage } = require('./images.controller')

const imagesRouter = express.Router()

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({storage: storage}) 

imagesRouter.post('/', upload.any('image'), uploadImage)

module.exports = imagesRouter