const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const passwordValidator = require('password-validator');

var schema = new passwordValidator();

// const dotenv =  require('dotenv').config();
// cette ligne de code ci-dessus est à rajouter dans le app.js

exports.signup = (req, res, next)=>{

    //console.log(req.body.email);

    var regexCourriel = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    //console.log(!regexCourriel.test(req.body.email));

    if(!regexCourriel.test(req.body.email)){
        return res.status(403).json({
            message: 'Unauthorized email!'
        });
    }
    /*
    //console.log(req.body.password.length);
    if(req.body.password.length<8){
        return res.status(403).json({
            message: 'the password should be at least of 8 characters or more'
        });
    }
    
    var regexMdpSC = /[!"#$%&'()*+,./:;<=>?@[^_`{|}~\-\]]/;
    if(!regexMdpSC.test(req.body.password)){

        return res.status(403).json({
            message: 'the password should contain at least one special character'
        });
    };

    var regexMdpUC = /[A-Z]/;

    if(!regexMdpUC.test(req.body.password)){
        return res.status(403).json({
            message: 'the password should contain at least one upper case letter'
        });
    };

    var regexMdpLC = /[a-z]/;

    if(!regexMdpLC.test(req.body.password)){
        return res.status(403).json({
            message: 'the password should contain at least one lower case letter'
        });
    };
    */

    schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().symbols()
    .has().not().spaces();

    if(!schema.validate(req.body.password)){
        return res.status(403).json({message: 'the password is invalid, the password should contain at least one lower case, one upper case and one special character'})
    }


    bcrypt.hash(req.body.password, 10)
        .then(hash=> {
                            const user = new User({
                                email: req.body.email,
                                password: hash
                                });
                            user.save()
                                .then(()=>res.status(201).json({message: 'Utilisateur crée'}))
                                .catch(error=> res.status(400).json({error}));
        })
        .catch(error=> res.status(500).json({error: error}));
};

exports.login = (req, res, next)=>{
    User.findOne({email: req.body.email})
        .then(user=>{
            if(!user){
                return res.status(401).json({error:'Utilisateur non trouvé'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid =>{
                    if(!valid){
                        return res.status(401).json({error: 'Mot de passe incorrect'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.motdepasse,
                            { expiresIn:'24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error: error}))
        })
        .catch(error => res.status(500).json({error}));
};