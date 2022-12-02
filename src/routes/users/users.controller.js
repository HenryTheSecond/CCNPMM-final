const users = require('../../models/users.model')
const accounts = require('../../models/accounts.model')
const mongoose = require('mongoose');
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

async function firstLogin(req, res) {
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (loginUser.user_id !== null) {
            res.status(500).send({ message: "User infomation alr registed" });
        } else {
            let id = new mongoose.Types.ObjectId();
            let avt = await cloudinary.uploader.upload(req.file.path, options)
            let avtUrl = await avt.secure_url;
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const opts = { session };
                const account = await accounts.findByIdAndUpdate(loginUser._id, { user_id: id }, opts);
                const user = await users({
                    _id: id,
                    name: req.body.name,
                    age: req.body.age,
                    gender: req.body.gender,
                    address: req.body.address,
                    phone: req.body.phone,
                    avatar: avtUrl
                }).save(opts);

                await session.commitTransaction();
                session.endSession();
                res.status(200).send({ user: user })
            } catch (error) {
                // If an error occurred, abort the whole transaction and
                // undo any changes that might have happened
                await session.abortTransaction();
                session.endSession();
                res.status(500).send(error);
            }
        }
    }
}

async function getUser(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user, is_active: true });
        let id = await loginUser.user_id;
        users.findById(id, function (err, users) {
            if (!err) {
                res.status(200).send({ user: users });
            } else {
                res.status(500).send(err);
            }
        })
    }
}

async function updateUser(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        if (!req.body) {
            res.status(500).send({ message: "Missing body!" });
            return;
        } else {
            let loginUser = await accounts.findOne({ _id: req.user, is_active: true });
            let id = await loginUser.user_id;
            cloudinary.uploader.upload(req.file.path, options)
                .then(result => {
                    users.findByIdAndUpdate(id, {
                        name: req.body.name,
                        age: req.body.age,
                        gender: req.body.gender,
                        address: req.body.address,
                        phone: req.body.phone,
                        avatar: result.secure_url
                    }).then(data => {
                        if (!data) {
                            res.status(404).send({ message: "Not found!!" });
                        } else {
                            res.status(200).send({ message: "Updated!!" });
                        }
                    }).catch(err => {
                        res.status(500).send(err);
                    })
                })
        }
    }
}

module.exports = {
    firstLogin,
    getUser,
    updateUser,
};