const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String,  required: false },
    imageUrl: { type: String, required: false },
    group: [{type: mongoose.Schema.Types.ObjectId, ref:'Contact'}]
});

module.exports = mongoose.model('Contact', contactSchema);