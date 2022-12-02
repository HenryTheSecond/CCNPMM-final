const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Image = new Schema({
    id: Schema.ObjectId,
    user_id: Schema.Types.ObjectId,
    url: { type: String, require: true},
    file_name: {type: String, require: true},
    created_date: Date,
    updated_date: Date,
    description: String
})

module.exports = mongoose.model('Image', Image)
