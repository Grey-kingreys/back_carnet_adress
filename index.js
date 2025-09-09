const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const route = require('./routes/contact.routes')

const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost/carnet-adress')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

app.use('/contacts', route);

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