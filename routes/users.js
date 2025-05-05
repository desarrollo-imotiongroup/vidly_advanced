const { required } = require('joi');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');
const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const router = express.Router();

/// GET users
router.get('/', async (req, res) => {
    const user = await User.find().sort('name');
    res.send(user);
});

/// GET current user
router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if(!user) return res.status(404).send('User not found');

    res.send(user);
});

/// POST users
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');

        user = new User(req.body);
        const salt = await bcrypt.genSalt(10);   
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        
        /// We can also do this using method
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(
            _.pick(user, '_id', 'name', 'email', 'isAdmin'));
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



module.exports = router;