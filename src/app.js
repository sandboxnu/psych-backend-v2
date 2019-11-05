const db = require('./queries')
var express = require('express');
var app = express();
app.use(express.json());

app.get('/', function (req, res) {
    db.getTable().then(data => {
        res.status(200)
        res.send("Hello!");
    })
});

app.get('/config', function (req, res) {
    res.send('Hello World TEST!');
});

app.post('/config', function (req, res) {
    res.send('Hello World TEST!');
});

app.get('/data', function (req, res) {
    // TODO: Add error handling
    // TODO: Add function to analyze data -> convert to CSV files per user -> then return zipped package with all files.
    db.getTable().then(data => {
        res.status(200);
        res.send(data);
    })
});

app.get('/data/:userId', function (req, res) {
    var userId = req.params.userId;
    // TODO: Add error handling
    // TODO: Add function to analyze data and convert to CSV file.
    db.getDataByUser(userId).then(data => {
        res.status(200);
        res.send(data);
    })
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
            res.send("We dun goofed. Plz try AgAiN ltr.")
        });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});