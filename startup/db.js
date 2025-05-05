const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function(){
    mongoose.connect('mongodb://localhost/playground')
    .then(() => winston.info('Connected to mongoDB ... '));
}