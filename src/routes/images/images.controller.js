const cloudinary = require('cloudinary').v2
const fs = require('fs')
const imagesModel = require('../../models/images.model')
const images = require('../../models/images.model')

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
    if(req.files){
        for(let i = 0; i < req.files.length; i++){
            promises.push(cloudinary.uploader.upload(req.files[i].path, options)
                .then(result => {
                    const newImage = new images({
                        user_id: req.user,
                        url: result.secure_url,
                        created_date: now,
                        file_name: req.files[i].path,
                        updated_date: null
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
    let indexStatus = 0
    let indexImage = 0
    const status = JSON.parse(req.body.status)
    const images = req.files
    const imagesDb = await imagesModel.find({user_id: req.user})
    const uploadPromises = []
    const insertPromise = []
    const now = Date.now()
    if(status.length != imagesDb.length){
        res.status(400).send({ message: "Image quantity is invalid" });
    }
    for(; indexStatus < status.length; indexStatus++){
        imagesDb[indexStatus].file_name.substring(8)
        if(status[indexStatus] === 'DELETE'){
            await cloudinary.uploader.destroy(imagesDb[indexStatus].file_name.substring(8))
            await imagesModel.deleteOne({id: imagesDb[indexStatus].id})
        } else if(status[indexStatus] === 'UPDATE'){
            try{
                await cloudinary.uploader.upload(req.files[indexImage].path, {
                    public_id: imagesDb[indexStatus].file_name.substring(8),
                    overwrite: true,
                })
                indexImage++
            }catch(err){
                console.log(err)
            }
        }
    }
    for(let i = indexImage; i < images.length; i++){
        uploadPromises.push(cloudinary.uploader.upload(req.files[i].path, options)
                        .then(result => {
                            const newImage = new images({
                                user_id: req.user,
                                url: result.secure_url,
                                created_date: now,
                                file_name: req.files[i].path,
                                updated_date: null
                            })
                            insertPromise.push(newImage.save())
                        }))
    }
    await Promise.all(uploadPromises)
    await Promise.all(insertPromise)
    return res.status(201).send(await imagesModel.find({user_id: req.user}))
}

module.exports = {
    uploadImage,
    updateImages
}