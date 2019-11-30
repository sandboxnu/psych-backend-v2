const { Router } = require('express');
const db = require('./queries')
const { authMiddleware } = require('./authentication');

module.exports = (router = new Router()) => {
    // Get config file
    router.get('/', function (req, res) {
        db.getConfig().then(data => {
            res.status(200);
            res.send(data.configjson)
        }).catch(e => {
            res.status(500);
            res.send("Internal server error. Pleae try again later.")
        });
    });
    
    // Post Config file
    router.post('/', authMiddleware);
    router.post('/', function (req, res) {
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
    return router;
};