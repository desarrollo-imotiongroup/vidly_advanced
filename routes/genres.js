const express = require('express');
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genres');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

///GET genres
router.get('/', auth, async (req, res, next) => {
    console.log(req.user);
    throw new Error('Could not get the genres.');
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

/// GET specific genre
router.get('/:id', async (req, res) => {
    checkObjectIDFormat(req.params.id, res);

    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send(`Genre with ID ${req.params.id} not found`);
    res.send(genre);
});

///POST genre
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = new Genre(req.body);
        await genre.save();

        res.send(genre);
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

/// UPDATE genre
router.put('/:id', async (req, res) => {
    checkObjectIDFormat(req.params.id, res);

    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    try {
        const genre = await Genre.findByIdAndUpdate(
            req.params.id, {
            $set: {
                name: req.body.name
            }
        },
            { new: true }
        );

        if (!genre) return res.status(404).send(`Genre with ID ${req.params.id} not found`);
        res.send(genre);
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

///DELETE genre
router.delete('/:id', [auth, admin], async (req, res) => {
    checkObjectIDFormat(req.params.id, res);

    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send(`Genre with ID ${req.params.id} not found`);
    res.send(`Genre with ID ${req.params.id} deleted`);
});

function checkObjectIDFormat(id, res) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error(`Invalid ID format: ${id}`);
        return res.status(400).send('Invalid genre ID format');
    }
}

module.exports = router;