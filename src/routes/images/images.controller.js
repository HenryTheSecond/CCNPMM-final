const cloudinary = require('cloudinary').v2

async function uploadImage(req, res){
    const formData = req.body
    console.log(formData == null)
    res.sendStatus(200)
}

module.exports = {
    uploadImage
}