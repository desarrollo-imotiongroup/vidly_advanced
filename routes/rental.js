const express = require('express');
const mongoose = require('mongoose');
const { Genre } = require('../models/genres');
const { Movie } = require('../models/movies');
const { Customer } = require('../models/customer');
const { Rental, validate } = require('../models/rental');

const router = express.Router();

/// GET rental
router.get('/', async (req, res) => {
    const rental = await Rental.find().sort('-dateOut');
    res.send(rental);
});

/// POST rental
router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // checkObjectIDFormat(req.body.customerId, res, 'Invalid Customer ID');
        // checkObjectIDFormat(req.body.movieId, res, 'Invalid Movie ID');
        // checkObjectIDFormat(req.body.genreId, res, 'Invalid Genre ID');

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send('Customer not found');

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send('Movie not found');

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Genre not found');


        if (movie.numberInStock === 0) res.status(400).send('Movie not in stock');

        /// 20 percent discount if customer is Gold
        let dailyRentalRate = movie.dailyRentalRate;
        if (customer.isGold) {
            dailyRentalRate = Math.max(0, dailyRentalRate - 20); // Ensures it doesn't go negative
        }

        const rental = new Rental({
            customer: {
                _id: customer.id,
                name: customer.name,
                phone: customer.phone,
                isGold: customer.isGold
            },
            movie: {
                _id: movie.id,
                title: movie.title,
                dailyRentalRate: dailyRentalRate
            },
            genre: {
                _id: genre.id,
                name: genre.name
            },
            rentalFee: dailyRentalRate * 3
        });

        await rental.save();

        movie.numberInStock--;
        await movie.save();

        res.send(rental);
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ errors: messages });
        }
        console.error('Server Error:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

function checkObjectIDFormat(id, res, errorMsg) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error(`Invalid ID format: ${id}`);
        return res.status(400).send(errorMsg);
    }
}

module.exports = router;
