const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstname : {type: String},
    lastname : {type: String},
    email : {type: String},
    phone : {type: String},
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
}, {timestamps: true});

module.exports = mongoose.model('Contact', contactSchema);