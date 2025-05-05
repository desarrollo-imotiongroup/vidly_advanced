const express = require('express');
const mongoose = require('mongoose');
const { Customer, validate } = require('../models/customer');

const router = express.Router();

/// GET customer
router.get('/', async(req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

/// GET specific customer
router.get('/:id', async(req, res) => {
    checkObjectIDFormat(req.params.id, res);

    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send(`Customer with ID ${req.params.id} not found`);

   res.send(customer);
});

/// POST customer 
router.post('/', async(req, res) => {
    try{
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const customer = new Customer(req.body);
        await customer.save();
        res.send(customer);
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            console.log('MONGOOSE');
            
          const messages = Object.values(err.errors).map(e => e.message);
          return res.status(400).json({ errors: messages });
        }
        console.error('Server Error:', err.message);
        res.status(500).send('Internal Server Error');
      }
});

/// UPDATE customer
router.put('/:id', async(req, res) => {
    checkObjectIDFormat(req.params.id, res);

    try{
        const result = validate(req.body);
        if(result.error) return res.status(400).send(result.error.details[0].message);

        const customer = await Customer.findByIdAndUpdate(
            req.params.id, {
                $set: {
                    name: req.body.name,
                    phone: req.body.phone,
                    isGold: req.body.isGold
                }
            }, { new: true }
        );

        if(!customer) res.status(404).send('Customer not found');
        await customer.save();
        res.send(customer);
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

/// DELETE customer
router.delete('/:id', async(req, res) => {
    checkObjectIDFormat(req.params.id, res);

    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) return res.status(404).send(`Customer with ID ${req.params.id} not found`);

    res.send(`customer with ID ${req.params.id} deleted`);    
});



function checkObjectIDFormat(id, res){
       if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error(`Invalid ID format: ${id}`);
        return res.status(400).send('Invalid genre ID format');
    }
}

module.exports = router;