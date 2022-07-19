server.js   : "main file" appel http pour créer le serveur de base, va appeller app.js pour son fonctionnement

app.js  :  fait appel aux fichiers routes pour les routes user et sauces 
ainsi que la route pour la sauvegarde des fichiers photos

models/ModelsSauce.js :  pour le schéma de données de la ressource Sauces

models/User.js : pour le schéma de données de la ressource User

middleware/auth.js : pour le middleware d'authentification par token

middleware/multer-config.js : pour le middleware d'upload de fichier photos

routes/sauces.js : va relier les 6 fonctions aux verbs/URI/middleware 
correspondant. 

routes/user.js : va relier les 2 fonctions (signup et login) aux verbs/URI correspondant

controllers/sauces.js : comporte les 6 fonctions:
    1)postModelsSauce: mise en ligne d'une nouvelle sauce
    2)postLikeModelsSauce: post un pouce like, un pouce dislike ou annule le pouce favorable ou défavorable précédent 
    3)putModelsSauce: modification d'une sauce mise en ligne par son créateur 
    4) deleteModelsSauce: suppression d'une sauce mise en ligne par son créateur
    5) getModelsSauce: affichage des sauces mises en ligne
    6) getOneModelsSauce: affichage d'une sauce sélectionnée par le visiteur

controllers/user.js : comporte les 2 fonctions signup et login 