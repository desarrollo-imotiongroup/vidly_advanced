const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('../models/genres');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
              },
              isGold: {
                type: Boolean,
                default: false
              },
              phone: {
                type: Number,
                required: true,
                minlength: 5,
                maxlength: 50
              }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                minlength: 5,
                maxlength: 255,
                trim: true,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
        genreId: Joi.objectId().required()
    });

    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;