const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Account = new Schema({
    id: ObjectId,
    user_id: Schema.Types.ObjectId,
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    is_active: Boolean
});

module.exports = mongoose.model('Account', Account);