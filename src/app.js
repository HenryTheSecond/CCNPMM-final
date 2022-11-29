const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require("./database/connection");

const api = require('./routes/api');

const app = express();

db.connectDB();
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(morgan('combined'));

app.use(express.json());

app.use('/v1', api);


module.exports = app;