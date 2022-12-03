const {cloudinary, options} = require('../../helpers/cloudinary_helper')
const fs = require('fs')
const {ObjectId} = require('mongodb')
const videoModel = require('../../models/videos.model')
const { model } = require('mongoose')

options['resource_type'] = 'video'

async function uploadVideo(req, res){
    const promises = []
    const insertVideoPromises = [] 
    const videosDb = []
    const now = Date.now()
    const descriptions = req.body.description ? JSON.parse(req.body.description) : []
    if(req.files){
        try{
            for(let i = 0; i < req.files.length; i++){
                promises.push(cloudinary.uploader.upload(req.files[i].path, options)
                    .then(result => {
                        const newVideo = new videoModel({
                            user_id: req.user._id,
                            url: result.secure_url,
                            created_date: now,
                            file_name: req.files[i].path,
                            updated_date: null,
                            description: descriptions[i] ? descriptions[i] : '' 
                        })
                        insertVideoPromises.push(newVideo.save().then(result => videosDb.push(result)))
                    }))
            }   
            await Promise.all(promises)
            await Promise.all(insertVideoPromises)
            return res.status(201).send(videosDb)
        }catch(err){
            console.log(err)
        }
    }
}

async function updateVideos(req, res){
    const userPayload = req.user
    const videoDb = await videoModel.findOne({
        _id: ObjectId(req.params.id),
        user_id: ObjectId(userPayload._id)
    })
    if(!videoDb){
        return res.status(404).send({
            message: 'NOT FOUND',
        })
    }
    if(req.file){
        await cloudinary.uploader.upload(req.file.path, {
            public_id: videoDb.file_name.substring(8),
            overwrite: true,
            resource_type: 'video'
        }).then(result => videoDb.url = result.secure_url)
    }
    videoDb.updated_date = Date.now()
    videoDb.description = req.body.description ? req.body.description : videoDb.description
    videoDb.save()
    return res.status(200).send(videoDb)
}

async function deleteImage(req, res){
    const userPayload = req.user
    const videoDb = await videoModel.findOneAndDelete({
        _id: ObjectId(req.params.id),
        user_id: ObjectId(userPayload._id)
    })
    if(!videoDb){
        return res.status(404).send({
            message: 'NOT FOUND',
        })
    }
    var result = await cloudinary.uploader.destroy(videoDb.file_name.substring(8), {resource_type: 'video'})
    if(result['result'] == 'ok'){
        return res.status(200).send({
            message: 'SUCCESSFUL'
        })
    }
    return res.status(400).send({
        message: 'FAILED',
    })
}

async function getVideoById(req, res){
    const userPayload = req.user
    const videoDb = await videoModel.findOne({
        _id: ObjectId(req.params.id),
        user_id: ObjectId(userPayload._id)
    })
    if(!videoDb){
        return res.status(404).send({
            message: 'NOT FOUND',
        })
    }
    return res.status(200).send(videoDb)
}

async function getVideo(req, res){
    const userPayload = req.user
    var page = Number.parseInt(req.query.page)
    var pageSize = Number.parseInt(req.query.pageSize)
    page = page ? (page > 0 ? page : 1) : 1
    pageSize = pageSize ? (pageSize > 0 ? pageSize : 5) :5
    const videosDb = await videoModel.find({
        user_id: ObjectId(userPayload._id)
    }).skip((page - 1)*pageSize).limit(pageSize)
    return res.status(200).send(videosDb)
}

module.exports = {uploadVideo, updateVideos, deleteImage, getVideoById, getVideo}