var express = require('express');
var router = express.Router();
var sequenceGenerator = require('./sequenceGenerator');

const contact = require('../models/contact');

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

router.get('/:id', (req, res, next) => {
    contact.findOne({
        "id": req.params.id
    })
    .populate('group')
    .then(contact => {
        res
            .status(200)
            .json({
                message: 'Contact Fetched Successfully',
                contact: contact
            });
    })
    .catch(error => {
        res.status(500).json({
            message: 'an error occured',
            error: error
        });
    });
});

router.post('/', (req, res, next) => {
    const maxContactId = sequenceGenerator.nextId("contacts");

    const contact = new contact({
        id: maxContactId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        group: req.body.group
    });

    contact.save()
        .then(createdContact => {
            res
            .status(201)
            .json({
                message: 'Contact created successfully',
                contact: createdContact
            });
        })

    .catch(error => {
        res.status(500).json({
            message: 'an error occured',
            error: error
        });
    });
});

router.put('/:id', (req, res, next) => {
    contact.findOne({
        id: req.params.id
    })
    .then(contact => {
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        contact.imageUrl = req.body.imageUrl;
        contact.group = req.body.group;

        contact.updateOne({
            id: req.params.id
        }, contact)
        .then(result => {
            res
            .status(204)
            .json({
                message: 'Contact updated successfully'
            })
        })
        .catch(error => {
            res
            .status(500)
            .json({
                message: 'An error occured',
                error: error
            });
        });
    })
    .catch(error => {
        res 
        .status(500).json({
            message: 'Contact not found', 
            error: {
                contact: 'Contact not found'
            }
        });
    });
});

router.delete("/id", (req, res, next) => {
    contact.findOne({
        id: req.params.id
    })
    .then(contact => {
        contact.deleteOne({
            id: req.params.id
        })
        .then(result => {
            res.status(204)
            .json({
                message: 'Contact deleted successfully'
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error occured',
                error: error
            });
        })
    })
    .catch(error => {
        res.status(500).json({
            message: 'An error occured',
            error: error
        });
    })
})

module.exports = router; 