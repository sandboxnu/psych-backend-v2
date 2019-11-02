const db = require('./queries')
var express = require('express');
var app = express();
app.use(express.json());

app.get('/', function (req, res) {
    // db.getDataByUser("test").then(data => {
    //     res.send(data);
    // })
    // res.send("HELLO");
    // db.postData("test1", "{}");
    db.getTable().then(data => {
        res.send(data);
    })
});

app.get('/config', function (req, res) {
    res.send('Hello World TEST!');
});

app.post('/config', function (req, res) {
    res.send('Hello World TEST!');
});

app.get('/data', function (req, res) {
    res.send('Get all data');
});

app.get('/data/:userId', function (req, res) {
    var userId = req.params.userId;
    res.send('Get data from User:' + userId);
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

    db.postData(req.body.userId, req.body.data);
    // TODO: Error handling if db post fails
    res.status(200);
    res.send({participantId: req.body.userId});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});