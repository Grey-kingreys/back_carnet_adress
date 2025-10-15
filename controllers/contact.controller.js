const Contact = require('../models/contact')
const catchAsync = require('../helpers/watchAsync')
const { StatusCodes } = require('http-status-codes');
const user = require('../models/user');

const createContact = catchAsync(async (req, res)=>{
    // Ajouter l'ID de l'utilisateur connecté au contact
    // const contactData = {
    //     ...req.body,
    //     user: req.user._id
    // };

    const contactData = req.body;
    const contact = await Contact.create(contactData);
    res.status(StatusCodes.CREATED).send(contact);
});

const getAllContacts = catchAsync(async (req, res) => {
    // Ne retourner que les contacts de l'utilisateur connecté
    // const allContacts = await Contact.find({ user: req.user._id });
    // res.send(allContacts);

    const allContacts = await Contact.find();
    res.send(allContacts);
})

const getContactById = catchAsync(async (req, res) => {
    // Vérifier que le contact appartient bien à l'utilisateur connecté
    const contact = await Contact.findOne({ _id: req.params.id });
    if(!contact){
        res.status(StatusCodes.NOT_FOUND).send("Contact non trouvé ou accès non autorisé");
        return;
    }
    res.send(contact);
})

const updateContact = catchAsync(async (req, res) => {
    // Mettre à jour uniquement si le contact appartient à l'utilisateur connecté
    const contact = await Contact.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
    );
    if(!contact){
        res.status(StatusCodes.NOT_FOUND).send("Contact non trouvé ou accès non autorisé");
        return;
    }
    res.send(contact);
})

const deleteContact = catchAsync(async (req, res) => {
    // Supprimer uniquement si le contact appartient à l'utilisateur connecté
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if(!contact){
        res.status(StatusCodes.NOT_FOUND).send("Contact non trouvé ou accès non autorisé");
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