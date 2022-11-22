var express = require('express');
var router = express.Router();
var sequenceGenerator = require('./sequenceGenerator');

const contact = require('./models/contact');

router.get('/', (req, res, next) => {
    contact.find() 
    .populate('group')
    .then(contacts => {
        res
            .status(200)
            .json({
                message: 'Contacts Fetched Successfully',
                contacts: contacts
            });
    })
    .catch(error => {
        res.status(500).json({
            message: 'an error occured',
            error: error
        });
    });
});

module.exports = router; 