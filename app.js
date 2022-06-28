const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const path = require('path');

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

app.use(cors());

app.use((req, res, next) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
/*
app.post('/api/auth/login', (req, res, next)=>{
    
    console.log(req.body);
    res.status(201).json({message: "requête de création réussie!"});
});
*/

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);

app.use('/api/sauces', saucesRoutes);

module.exports = app;

