const accounts = require('../../models/accounts.model')
const bcrypt = require('bcrypt');
const { hashPass, createToken } = require('../../helpers/jwt_helper')

async function register(req, res) {
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    }
    else {
        const doesExist = await accounts.findOne({ username: req.body.username, is_active: true })
        if (doesExist) {
            res.status(500).send({ message: "username already existed" });
        } else if (req.body.password != req.body.passwordRepeat) {
            res.status(500).send({ message: "confirm password might not right" });
        } else {
            password = await hashPass(req.body.password);
            const account = new accounts({
                username: req.body.username,
                password: password,
                user_id: null,
                is_active: true,
                google_id: null
            })
            account.save(account).then(data => {
                res.status(201).send({ message: `registered with username: ${data.username}` });
            }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
        }
    }
}

async function login(req, res) {
    let loginUser = await accounts.findOne({ username: req.body.username, is_active: true })
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else {
        if (!loginUser) {
            res.status(404).send({ message: "username might not correct!" });
        } else {
            let loginPassword = await hashPass(req.body.password);
            if (bcrypt.compare(loginUser.password, loginPassword)) {
                let token = await createToken(loginUser._id);
                res.status(200).send({ token: token, user: loginUser.user_id });
            } else {
                res.status(401).send({ message: "Wrong password!!" });
            }
        }
    }
}

module.exports = {
    register,
    login,
};