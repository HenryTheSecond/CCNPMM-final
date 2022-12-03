const cloudinary = require('cloudinary').v2

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

module.exports = {cloudinary, options}