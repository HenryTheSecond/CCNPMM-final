const {cloudinary, options} = require('../../helpers/cloudinary_helper')
const fs = require('fs')
const imagesModel = require('../../models/images.model')
const images = require('../../models/images.model')
const {ObjectId} = require('mongodb')

async function uploadImage(req, res){
    console.log(req.user)
    const promises = []
    const insertImagePromises = [] 
    const imagesDb = []
    const now = Date.now()
    const descriptions = req.body.description ? JSON.parse(req.body.descriptions) : []
    if(req.files){
        for(let i = 0; i < req.files.length; i++){
            promises.push(cloudinary.uploader.upload(req.files[i].path, options)
                .then(result => {
                    const newImage = new images({
                        user_id: req.user._id,
                        url: result.secure_url,
                        created_date: now,
                        file_name: req.files[i].path,
                        updated_date: null,
                        description: descriptions[i] ? descriptions[i] : '' 
                    })
                    insertImagePromises.push(newImage.save().then(result => imagesDb.push(result)))
                }))
        }   
        await Promise.all(promises)
        await Promise.all(insertImagePromises)
        return res.status(201).send(imagesDb)
    }
}

async function updateImages(req, res){
    const userPayload = req.user
    const imageDb = await imagesModel.findOne({
        _id: ObjectId(req.params.id),
        user_id: ObjectId(userPayload._id)
    })
    if(!imageDb){
        return res.status(404).send({
            message: 'NOT FOUND',
        })
    }
    if(req.file){
        await cloudinary.uploader.upload(req.file.path, {
            public_id: imageDb.file_name.substring(8),
            overwrite: true
        }).then(result => imageDb.url = result.secure_url)
    }
    imageDb.updated_date = Date.now()
    imageDb.description = req.body.description ? req.body.description : imageDb.description
    imageDb.save()
    return res.status(200).send(imageDb)
}

async function deleteImage(req, res){
    const userPayload = req.user
    const imageDb = await imagesModel.findOneAndDelete({
        _id: ObjectId(req.params.id),
        user_id: ObjectId(userPayload._id)
    })
    if(!imageDb){
        return res.status(404).send({
            message: 'NOT FOUND',
        })
    }
    var result = await cloudinary.uploader.destroy(imageDb.file_name.substring(8))
    if(result['result'] == 'ok'){
        return res.status(200).send({
            message: 'SUCCESSFUL'
        })
    }
    return res.status(400).send({
        message: 'FAILED',
    })
}

async function getImageById(req, res){
    const userPayload = req.user
    const imageDb = await imagesModel.findOne({
        _id: ObjectId(req.params.id),
        user_id: ObjectId(userPayload._id)
    })
    if(!imageDb){
        return res.status(404).send({
            message: 'NOT FOUND',
        })
    }
    return res.status(200).send(imageDb)
}

async function getImage(req, res){
    const userPayload = req.user
    var page = Number.parseInt(req.query.page)
    var pageSize = Number.parseInt(req.query.pageSize)
    page = page ? (page > 0 ? page : 1) : 1
    pageSize = pageSize ? (pageSize > 0 ? pageSize : 5) :5
    const imagesDb = await imagesModel.find({
        user_id: ObjectId(userPayload._id)
    }).skip((page - 1)*pageSize).limit(pageSize)
    return res.status(200).send(imagesDb)
}

module.exports = {
    uploadImage,
    updateImages,
    deleteImage,
    getImageById,
    getImage
}