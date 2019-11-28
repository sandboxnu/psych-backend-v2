const dotenv = require('dotenv');
const db = require('./queries')
var express = require('express');
var cors = require('cors');
var app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
    res.status(200);
    res.send("Hello");
});

app.get('/config', function (req, res) {
    db.getConfig().then(data => {
        res.status(200);
        res.send(data)
    }).catch(e => {
        res.status(500);
        res.send("Internal server error. Pleae try again later.")
    });
});

app.post('/config', function (req, res) {
    if (req.body == null) {
        res.status(400);
        res.send('Incorrect request body format');
    }
    db.updateConfig(req.body)
        .then(result => {
            res.status(200);
            res.send("Updated successfully");
        }).catch(e => {
            res.status(500);
            res.send("Internal server error. Pleae try again later.")
        });
});

app.get('/data', function (req, res) {
    // TODO: Add function to analyze data -> convert to CSV files per user -> then return zipped package with all files.
    db.getTable().then(data => {
        res.status(200);
        res.send(data);
    }).catch(e => {
        res.status(500);
        res.send("Internal server error. Pleae try again later.")
    });
});

app.get('/data/:userId', function (req, res) {
    var userId = req.params.userId;
    // TODO: Add function to analyze data and convert to CSV file.
    db.getDataByUser(userId).then(data => {
        res.status(200);
        res.send(data);
    }).catch(e => {
        res.status(500);
        res.send("Internal server error. Pleae try again later.")
    });
});

app.post('/data', function (req, res) {
    if (req.body == null) {
        res.status(400);
        res.send('Incorrect request body format');
    }

    if (req.body.userId == null) {
        res.status(400);
        res.send('No participantId present');
    }

    if (req.body.data == null) {
        res.status(400);
        res.send('No data present in body')
    }

    db.postData(req.body.userId, req.body.data)
        .then(result => {
            res.status(200);
            res.send({participantId: req.body.userId});
        }).catch(e => {
            res.status(500);
            res.send("Internal server error. Pleae try again later.")
        });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});