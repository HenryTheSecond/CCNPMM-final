const cloudinary = require('cloudinary').v2
const fs = require('fs')

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
    const promises = [] 
    if(req.files){
        for(let i = 0; i < req.files.length; i++){
            promises.push(cloudinary.uploader.upload(req.files[i].path, options))
        }   
        const result = await Promise.all(promises)
        console.log(result.map(item => item['secure_url']))
    }
}

module.exports = {
    uploadImage
}