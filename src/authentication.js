const bcrypt = require('bcrypt');
const basicAuth = require('express-basic-auth');
const db = require('./queries')

// Using the basic auth library to check the auth header and open up a password popup if no password
const authMiddleware = basicAuth({
    authorizer,
    authorizeAsync: true,
    challenge: true,
    realm: 'sandboxnu',
});

function hashAndStore(username, password) {
    const success = bcrypt.hash(password, 10)
      .then(hash => db.insertAuthInfo(username, hash));
    return success;
}

function hashAndUpdate(username, password) {
    const success = bcrypt.hash(password, 10)
      .then(hash => db.updatePasswordForUser(username, hash));
    return success;
}

function authorizer(username, password, cb) {
    verify(username.toLowerCase(), password)
      .then(authenticated => cb(null, authenticated))
      .catch(err => cb(err));
}


// Return Promise of boolean representing whether user is authorized
function verify(username, password) {
    return getHash(username)
      .then((hash) => {
        if (typeof password === 'undefined' || hash === '') {
          // Return not authenticated if no password given or no hash stored
          return false;
        }
        return bcrypt.compare(password, hash.toString());
        // return password == hash;
      });
}

// Returns a hash for a given user
function getHash(username) {
    const hash = db.getPasswordForUser(username)
    .then(data => {
        return data;
    }).catch(e => {
        return '';
    });

    return hash;
}

const createPassword = (req, res) => {
    if (!req.body) {
        res.status(400).send('Empty body');
    } else if (!req.body.username) {
        res.status(400).send('Must provide an username');
    } else if (!req.body.password) {
        res.status(400).send('Must provide a password');
    } else {
    hashAndStore(req.body.username, req.body.password)
        .then(() => res.status(200).send('New account created'));
    }
};

const changePassword = (req, res) => {
    if (!req.body) {
        res.status(400).send('Empty body');
    } else if (!req.body.username) {
        res.status(400).send('Must provide an username');
    } else if (!req.body.password) {
        res.status(400).send('Must provide a password');
    } else if (!req.body.newPassword) {
        res.status(400).send('Must provide a newPassword');
    } else {

    verify(req.body.username, req.body.password)
        .then(verified => {
            if (verified) {
                hashAndUpdate(req.body.username, req.body.newPassword)
                    .then(() => res.status(200).send('New password stored'));        
            } else {
                res.status(400).send("Incorrect account information")
            }
        });
    }
};


module.exports = {
    createPassword, changePassword, hashAndStore, verify, authMiddleware
};