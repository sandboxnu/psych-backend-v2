const { Router } = require('express');
const db = require('./queries');
const { authMiddleware } = require('./authentication');

module.exports = (router = new Router()) => {
    router.get('/', authMiddleware);
    router.get('/', function (req, res) {
        // TODO: Add function to analyze data -> convert to CSV files per user -> then return zipped package with all files.
        db.getTable().then(data => {
            res.status(200);
            res.send(data);
        }).catch(e => {
            res.status(500);
            res.send("Internal server error. Pleae try again later.")
        });
    });
    
    router.get('/:userId', function (req, res) {
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
    
    router.post('/', function (req, res) {
        console.log("TEST");
        console.log(req.body);
        if (req.body == null) {
            res.status(400);
            res.send('Incorrect request body format');
        }
    
        if (req.body.participantId == null) {
            res.status(400);
            res.send('No participantId present');
        }
    
        if (req.body.data == null) {
            res.status(400);
            res.send('No data present in body')
        }
    
        db.postData(req.body.participantId, req.body.data)
            .then(result => {
                res.status(200);
                res.send({participantId: req.body.participantId});
            }).catch(e => {
                res.status(500);
                res.send("Internal server error. Pleae try again later.")
            });
    });
    
    return router;
};