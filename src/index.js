const dotenv = require('dotenv');
const config = require('./config');
const data = require('./data');
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// Configure environment variables
dotenv.config();
app.use(express.json());
app.use(cors());

// To get and post configuration files
app.use('/config', config());

// Get and Post data
app.use('/data', data());

app.get('/', function (req, res) {
    res.status(200);
    res.send("Hello");
});

app.listen(PORT, function () {
    console.log(`API running at http://localhost:${PORT}`);
});