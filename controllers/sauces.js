const ModelsSauce = require('../models/ModelsSauce');

const fs = require('fs');

exports.postModelsSauce = (req, res, next)=>{

    const sauceObject = JSON.parse(req.body.sauce);  

    console.log(" sauceObject apres parsing ");
    console.log(sauceObject);
    //delete sauceObject._id; // peut-être pas nécessaire

    const modelsSauce = new ModelsSauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    modelsSauce.save()
        .then(()=>res.status(201).json({message: 'Objet enregistré!'}))
        .catch(error=> res.status(400).json({error}));
};

exports.postLikeModelsSauce = (req, res, next)=>{

    console.log(req.body.userId);

    console.log(req.body.like);

    switch(req.body.like){

        case 1: 
            ModelsSauce.updateOne({_id: req.params.id}, { 

                $inc : {'likes' : 1},
                $push: { usersLiked: req.body.userId } 
            })
    
            .then(()=>res.status(201).json({message: 'Like crée'}))
            .catch(error=> {
                console.log(error);   
                res.status(400).json({error})
            });

        break;

        case -1:
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
                console.log(object.userId);
                console.log(typeof object.usersDisliked);
                console.log(typeof object.usersLiked);

                let monTableauDisliked = object.usersDisliked;
                for (const i of monTableauDisliked){
                    console.log(i);
                }

                let monTableauLiked = object.usersLiked;
                for (const j of monTableauLiked){
                    console.log(j);
                }

                if(monTableauLiked.includes(req.body.userId) === true){
                    
                    ModelsSauce.updateOne({_id: req.params.id}, { 

                        $inc : {'likes' : -1},
                        $pull: { usersLiked: req.body.userId } 
                    })
                    .then(()=>res.status(201).json({message: 'Like crée puis retiré'}))
                    .catch(error=> {
                        console.log(error);   
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

                

                //res.status(201).json({message: "on n'est dans aucun cas de figure"});
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

    console.log(res.locals.auteurId);

    // vérifier que cet id ci-dessus est égal à l'id de l'auteur de la sauce

    const sauceObject = req.file ?
     { 
         ...JSON.parse(req.body.sauce),
         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

     } : { ...req.body};
     console.log(sauceObject);

     console.log(sauceObject.userId);

     // if sauceObject.userId === res.locals.auteurId{

        // tout le code ModelsSauce.updateOne()

     //}else{envoi d'une erreur 403}
    ModelsSauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Objet modifié'}))
    .catch(error => res.status(400).json({error}));
};

exports.deleteModelsSauce = (req, res, next) => {

    console.log(req.params.id);
    ModelsSauce.findOne({_id: req.params.id})
      .then(modelsSauce => {
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










