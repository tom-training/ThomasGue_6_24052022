const jwt = require('jsonwebtoken');



module.exports = (req, res, next)=> {

    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'CHAINE_CARACTERES_LONGUE_ALEATOIRE');
        const userId = decodedToken.userId;

        if(req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        }else{

            res.locals.auteurId = userId;
            next();
        }
    }catch(error){
        res.status(401).json({error: error | 'Requête non identifiée!'})
    }

};


// attention une fois que la route sauces.js (les routes (stuff.js)) seront
// crées les routes devront contenir auth juste l'appel à la logique métier
// par son contrôlleur

/*
il faudra importer 

const auth = require('../middleware/auth');
*/