const {updateVideos, uploadVideo, deleteImage, getVideoById, getVideo} = require('./video.controller')
const express = require('express')
const { authenticate } = require('../../helpers/jwt_helper');
const { upload } = require('../../helpers/upload_helper')

const videosRouter = express.Router()


videosRouter.get('/', authenticate, getVideo)
videosRouter.get('/:id', authenticate, getVideoById)
videosRouter.post('/', authenticate, upload.any('videos'), uploadVideo)
videosRouter.put('/:id', authenticate, upload.single('video'), updateVideos)
videosRouter.delete('/:id', authenticate, deleteImage)

module.exports = videosRouter
