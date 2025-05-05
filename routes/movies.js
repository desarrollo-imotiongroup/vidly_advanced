const express = require('express');
const mongoose = require('mongoose');
const { Movie, validate } = require('../models/movies');
const { Genre } = require('../models/genres');
const auth = require('../middleware/auth');

const router = express.Router();

/// GET movies
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

/// POST movie
router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(404).send('Invalid genre.');

        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre.id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        await movie.save();
        res.send(movie);
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

/// UPDATE movie
router.put('/:id', async (req, res) => {
    checkObjectIDFormat(req.params.id, res);
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(404).send('Invalid genre.');

        const movie = await Movie.findByIdAndUpdate(
            req.params.id, {
            $set: {
                title: req.body.title,
                genre: {
                    _id: genre.id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }}, {new: true}
        );

        await movie.save();
        res.send(movie);
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

///DELETE movie
router.delete('/:id', async(req, res) => {
    checkObjectIDFormat(req.params.id, res);

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send(`movie with ID ${req.params.id} not found`);
    res.send(`movie with ID ${req.params.id} deleted`);    
});


function checkObjectIDFormat(id, res) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error(`Invalid ID format: ${id}`);
        return res.status(400).send('Invalid genre ID format');
    }
}

module.exports = router;