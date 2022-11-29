const express = require('express');
const { authenticate } = require('../../helpers/jwt_helper');
const { firstLogin, getUser, updateUser, deleteUser } = require('./users.controller')

const userRouter = express.Router();

userRouter.post("/", authenticate, firstLogin);
userRouter.get("/:id", authenticate, getUser);
userRouter.put("/:id", authenticate, updateUser);

module.exports = userRouter;