const winston = require('winston');

module.exports = function error(err, req, res, next) {
    res.status(500).send({ error: 'Something failed', message: err.message });

    // winston.log('error', err.message);
    winston.error(err.message, err);
    // error
    // warn
    // info
    // verbose
    // debug
    // silly
}