const express = require('express');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const routeContact = require('./routes/contact.routes')
const routeUser = require('./routes/user.routes')
require("dotenv").config();
const cors = require('cors');
const routeMessage = require('./routes/message.routes')

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://back-carnet-adress.onrender.com',
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

app.use('/contacts', routeContact);
app.use('/users', routeUser);
app.use('/messages', routeMessage)

app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND)
    res.send('Page non trouvé')
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Erreur interne serveur')
    
})

app.listen(port, ()=>{
    console.log("Server is running on port " + port)
})