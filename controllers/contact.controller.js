const Contact = require('../models/contact')
const catchAsync = require('../helpers/watchAsync')
const { StatusCodes } = require('http-status-codes');
const user = require('../models/user');

const createContact = catchAsync(async (req, res)=>{
    const contact = await Contact.create(req.body);
    res.send(contact);
});

const getAllContacts = catchAsync(async (req, res) => {
    const allContacts = await Contact.find();
    res.send(allContacts);
})

const getContactById = catchAsync(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(StatusCodes.NOT_FOUND).send("Contact non trouvé")
        return;
    }
    res.send(contact);
})

const updateContact = catchAsync(async (req, res) => {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if(!contact){
        res.status(StatusCodes.NOT_FOUND).send("Contact non trouvé")
        return;
    }
    res.send(contact);
})

const deleteContact = catchAsync(async (req, res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if(!contact){
        res.status(StatusCodes.NOT_FOUND).send("Contact non trouvé")
        return;
    }
    res.send(contact);
})

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
}