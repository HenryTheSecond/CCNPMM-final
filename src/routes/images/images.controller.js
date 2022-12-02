const cloudinary = require('cloudinary').v2
const fs = require('fs')
const imagesModel = require('../../models/images.model')
const images = require('../../models/images.model')
const {ObjectId} = require('mongodb')


cloudinary.config({
    cloud_name: 'dihg72ez8',
    api_key: '778719834247269',
    api_secret: 'PDLuJVbklhnMWwR9p-GPo5gX2rA',
    secure: true
})

const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
}

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
    console.log(req.params.id, userPayload._id, imageDb)
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
    
}

module.exports = {
    uploadImage,
    updateImages
}