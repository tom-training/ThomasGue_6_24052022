const express = require('express');

// importation d'express permet d'exploiter:
//  express()
// express.json()


const bodyParser = require('body-parser');
//pour exploiter bodyParser.json()

const mongoose = require('mongoose');
// va permettre de faciliter l'appel de fonctions pour coder les relations 
// avec la base de données hébergée sur mongodb

require('dotenv').config();

const path = require('path');
// va permettre la gestion des fichiers photos: leur enregistrement dans l'API


const app = express();

const cors = require('cors');

const saucesRoutes = require('./routes/sauces');

const userRoutes = require('./routes/user');


mongoose.connect(process.env.mongoaccess,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
//la requête POST issue du fontend contient dans son body des données saisies
// par le visiteur du site
// express.json() est un middleware qui permet l'extraction de ce corps
// en format json


app.use(cors());


// code pour éviter les erreurs de CORS (Cross Origin Resource Sharing)
app.use((req, res, next) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
// va permettre d'utiliser JSON.parse dans le controllers/sauces.js


// la route qui permet la sauvegarde des images sur le serveur
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);

app.use('/api/sauces', saucesRoutes);

module.exports = app;

