const jwt = require('jsonwebtoken');

//require('dotenv').config();



module.exports = (req, res, next)=> {

    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.motdepasse);
        const userId = decodedToken.userId;

        if(req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        }else{

            console.log(userId);
            res.locals.auteurId = userId;
            next();
        }
    }catch(error){
        res.status(401).json({error: error | 'Requête non identifiée!'})
    }

};


// attention une fois que la route sauces.js seront
// crées les routes devront contenir auth juste avant l'appel à la logique métier
// par son contrôlleur

/*
il faudra importer 

const auth = require('../middleware/auth');
*/