const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require("./database/connection");
const passport = require('passport');
const accounts = require('./models/accounts.model')
const { createToken } = require('./helpers/jwt_helper')
const cookieSession = require('cookie-session')

const api = require('./routes/api');

const app = express();

db.connectDB();
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(morgan('combined'));

//app.use(fileUpload({useTempFiles: true}))

app.use(express.json());
app.use(cookieSession({
  name: 'session',
  maxAge: 24 * 60 * 60 * 1000,
  keys: ["secret key", "another secret key"]
}))
app.use(passport.initialize());
app.use(passport.session());

const { Strategy } = require('passport-google-oauth20')

const config = {
  CLIENT_ID: "1088807457031-5md48gqoogfvv9khttne71mgppc2lk68.apps.googleusercontent.com",
  CLIENT_SECRET: "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",
}

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
}

function verifyCallback(accessToken, refreshToken, profile, done) {
  // console.log("Google profile", profile);
  done(null, profile)
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  done(null, id);
})

app.get('/v1/auth/google',
  passport.authenticate('google', {
    scope: ['email'],
  }))

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/success',
    session: true,
  }),
  (req, res) => {
    console.log('Google called us back');
  }
)

app.use('/success', async (req, res) => {
  let isLoginBefore = await accounts.findOne({ google_id: req.user });
  if (!isLoginBefore) {
    const account = new accounts({
      username: null,
      password: null,
      user_id: null,
      is_active: true,
      google_id: req.user
    })
    account.save(account).then(async data => {
      let token = await createToken(data._id);
      res.status(200).send({ message: "Login google success", token: token })
    })
  } else {
    let token = await createToken(isLoginBefore._id);
    res.status(200).send({ token: token });
  }
})

app.get('failure', (req, res) => {
  return res.send({ message: 'Login fail' })
})

app.use('/v1', api);


module.exports = app;