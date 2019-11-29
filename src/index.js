const dotenv = require('dotenv');
const config = require('./config');
const data = require('./data');
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./queries');
const { createPassword, changePassword, authMiddleware } = require('./authentication');


const PORT = process.env.PORT || 3000;

// Configure environment variables
dotenv.config();
app.use(express.json());
app.use(cors());

// Authentication endpoints
app.post('/createaccount', createPassword);
app.post('/changepassword', changePassword);
app.post('/login', authMiddleware, (req, res) => { res.status(200).send('success'); });

// To get and post configuration files
app.use('/config', config());

// Get and Post data
app.use('/data', data());

app.listen(PORT, function () {
    console.log(`API running at http://localhost:${PORT}`);
});