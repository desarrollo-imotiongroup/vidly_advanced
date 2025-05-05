const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');
require('winston-mongodb');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const customer = require('./routes/customer');
const rental = require('./routes/rental');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const app = express();

winston.exceptions.handle(
    new winston.transports.File({ filename: 'exceptions.log' })
);

winston.rejections.handle(
    new winston.transports.File({ filename: 'rejections.log' })
);

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB ({ 
    db: 'mongodb://localhost/playground',
    level: 'info'
}));

process.on('uncaughtException', (ex) => {
    console.log('We have got an UNCAUGHT EXCEPTION');
    winston.error(ex.message, ex);    
    process.exit(1);
});

process.on('unhandledRejection', (ex) => {
    console.log('We have got an UNHANDLED REJECTION EXCEPTION');
    winston.error(ex.message, ex);  
    process.exit(1);
});

const p = Promise.reject(new Error('Something wrong miserably'));
p.then(() => console.log('Done'));

// throw new Error('Something went failed during startup ... ');

if(!config.get('jwtPrivateSecretKey')){
    console.log('Fatal error: rental_jwtPrivateKey not defind');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/playground')
.then(() => console.log('Connected to mongoDB ... '));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/customers', customer);
app.use('/api/rentals', rental);
app.use('/api/users', users);
app.use('/api/auth', auth);

/// Error handling middleware
app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Connecting to PORT:', PORT));