const ModelsSauce = require('../models/ModelsSauce');

const fs = require('fs');

/* function qui va être utiliser par le router: 
 router.post('/', auth, multer, saucesCtrl.postModelsSauce);  */


exports.postModelsSauce = (req, res, next)=>{

    const sauceObject = JSON.parse(req.body.sauce);  

// console.log(" sauceObject apres parsing ");
// console.log(sauceObject);
// en ajoutant multer, le format de la requête POST a changé
// JSON.parse permet de récupéré le contenu de body des requêtes
// lorsqu'un fichier est rajouté à la requête, les données de la requête sont 
// envoyées sous la forme form-data (et plus sous le format json), le corps de la
// requête contient dès lors une chaine thing, c'est JSON.parse qui nous permet
// un objet utilisable

    const modelsSauce = new ModelsSauce({
        ...sauceObject,
        // rajouter un UserId issue de l'authentification middleware/auth
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    modelsSauce.save()
        .then(()=>res.status(201).json({message: 'Objet enregistré!'}))
        .catch(error=> res.status(400).json({error}));
};

exports.postLikeModelsSauce = (req, res, next)=>{

    // console.log(req.body.userId);

    // console.log(req.body.like);

    switch(req.body.like){

        case 1: 

            ModelsSauce.findOne({_id: req.params.id})
            .then(object=> {
                
                let monTableauDisliked = object.usersDisliked;
                
                let monTableauLiked = object.usersLiked;

                if(monTableauLiked.includes(req.body.userId) === true){
                    
                    return res.status(403).json({message: 'Like unauthorized'})
                }

                if(monTableauDisliked.includes(req.body.userId) === true){

                    return res.status(403).json({message: 'Like unauthorized'})
                }

            })
            .catch(error=> {

                res.status(404).json({error})
            }); 

            // si on arrive jusqu'ici c'est que l'utilisateur ne vote pas une
            // seconde fois
            ModelsSauce.updateOne({_id: req.params.id}, { 

                $inc : {'likes' : 1},
                $push: { usersLiked: req.body.userId } 

                // ci-dessus le tableau des usersLiked est incrémenté
            })
    
            .then(()=>res.status(201).json({message: 'Like crée'}))
            .catch(error=> {
                console.log(error);   
                res.status(400).json({error})
            });

        break;

        case -1:

            ModelsSauce.findOne({_id: req.params.id})
            .then(object=> {
                
                let monTableauDisliked = object.usersDisliked;
                
                let monTableauLiked = object.usersLiked;

                if(monTableauLiked.includes(req.body.userId) === true){
                    
                    return res.status(403).json({message: 'Dislike unauthorized'})
                }

                if(monTableauDisliked.includes(req.body.userId) === true){

                    return res.status(403).json({message: 'Dislike unauthorized'})
                }

            })
            .catch(error=> {

                res.status(404).json({error})
            }); 

            // si on arrive jusqu'ici c'est que l'utilisateur ne vote pas une
            // seconde fois

            ModelsSauce.updateOne({_id: req.params.id}, { 

                $inc : {'dislikes' : 1},
                $push: { usersDisliked: req.body.userId } 
            })
                .then(()=>res.status(201).json({message: 'Like crée'}))
                .catch(error=> res.status(400).json({error}));

        break;


        case 0:
            
            ModelsSauce.findOne({_id: req.params.id})
            .then(object=> {
 
                let monTableauDisliked = object.usersDisliked;
                                
                let monTableauLiked = object.usersLiked;
                

                if(monTableauLiked.includes(req.body.userId) === true){
                    
                    ModelsSauce.updateOne({_id: req.params.id}, { 

                        $inc : {'likes' : -1},
                        $pull: { usersLiked: req.body.userId } 
                    })
                    .then(()=>res.status(201).json({message: 'Like crée puis retiré'}))
                    .catch(error=> {
                        //console.log(error);   
                        res.status(400).json({error})
                    });
                }

                if(monTableauDisliked.includes(req.body.userId) === true){

                    ModelsSauce.updateOne({_id: req.params.id}, { 

                        $inc : {'dislikes' : -1},
                        $pull: { usersDisliked: req.body.userId } 
                    })
                    .then(()=>res.status(201).json({message: 'dislike crée puis retiré'}))
                    .catch(error=> {
                        console.log(error);   
                        res.status(400).json({error})
                    });
                }

            })
            .catch(error=> {
                console.log(error);    
                res.status(404).json({error})
            });           

        break;

        default: 
            console.log('aucun cas de figure');

    }           
};


exports.putModelsSauce = (req, res, next)=> {

    var sauceObject = {};

    if(req.file){
        //console.log('quid du req.params.id');
        //console.log(req.params.id);

        ModelsSauce.findOne({_id: req.params.id})
            .then(modelsSauce => {
        
                if(modelsSauce.userId !== res.locals.auteurId){
                    res.status(403).json({
                        message: 'Unauthorized request!'
                    });
                }
        
                const fileexname = modelsSauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${fileexname}`, () => {
                    console.log("suppression de l'ancien fichier image");
                });
              })
            .catch(error => res.status(500).json({ error: error }));

        sauceObject ={
            ...JSON.parse(req.body.sauce),
        
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
    }else{
        sauceObject = { ...req.body}
    }

    /*
    const sauceObject = req.file ?
     { 
         ...JSON.parse(req.body.sauce),
        
         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

     } : { ...req.body};

    */ 

    if(sauceObject.userId !== res.locals.auteurId){
        res.status(403).json({
            message: 'Unauthorized request!'
        });
    }
    
  
    //console.log(res.locals.auteurId);
    //console.log ci-dessus pour vérifier que cet id ci-dessus 
    //est égal à l'id de l'auteur de la sauce

    

     //console.log(sauceObject);

     //console.log(sauceObject.userId);

    // tout le code ModelsSauce.updateOne()

    // res.locals.auteurId provient du middleware/auth.js
  

    ModelsSauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Objet modifié'}))
    .catch(error => res.status(400).json({error}));

   

};

exports.deleteModelsSauce = (req, res, next) => {
    //console.log('attention fonction delete check');
    //console.log(res.locals.auteurId);

    //console.log(req.params.id);

    ModelsSauce.findOne({_id: req.params.id})
      .then(modelsSauce => {

        //console.log(modelsSauce);
        //console.log(modelsSauce.userId);

        if(modelsSauce.userId !== res.locals.auteurId){
            res.status(403).json({
                message: 'Unauthorized request!'
            });
        }

        //console.log(modelsSauce.userId === res.locals.auteurId);

        const filename = modelsSauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          ModelsSauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error: error }));
};

exports.getModelsSauce = (req, res, next)=> {

    ModelsSauce.find()
        .then(modelsSauce => res.status(200).json(modelsSauce))
        .catch(error => res.status(400).json({error}));
};

exports.getOneModelsSauce = (req, res, next)=>{

    ModelsSauce.findOne({_id: req.params.id})
    .then(modelsSauce=> res.status(200).json(modelsSauce))
    .catch(error=> res.status(404).json({error}));
};










