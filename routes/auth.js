const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        const user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(404).send('Invalid email');
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send('Invalid password');

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin },
             config.get('jwtPrivateSecretKey'));
        res.send(token);
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

function validate(auth){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(auth);
}

module.exports = router;
