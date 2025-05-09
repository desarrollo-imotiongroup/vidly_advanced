const genres = require('../routes/genres');
const movies = require('../routes/movies');
const customer = require('../routes/customer');
const rental = require('../routes/rental');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const express = require('express');

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/genres', genres);
    app.use('/api/movies', movies);
    app.use('/api/customers', customer);
    app.use('/api/rentals', rental);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use(error);
}