0- git clone https://github.com/nom-du-compte-github/nom-de-l-api.git backend 

1- créer le fichier .env avec les clés/valeurs listés dans .env-sample
    les valeurs seront communiqués séparément pour raisons de sécurité

2- Avec la commande "npm install" procéder à l'installation des packages suivants:
    "bcrypt"
    "cors"
    "dotenv"
    "express"
    "jsonwebtoken"
    "mongoose"
    "mongoose-unique-validator"
    "multer"
    "nodemon"
    "password-validator"
    "path"
pour référence consulter package.json ligne 11 "dependencies"

3- Installer nodemon avec la commande "npm install -g nodemon"

4- Pour démarrer le serveur côté backend: dans votre terminal rooter sur le répertoire ("backend" dans le cas présent) contenant les fichiers de backend issue de votre git clone effectué à l'étape 0- et effectuer la commande
"nodemon server"

5- Pour démarrer le serveur côté frontend: dans votre terminal rooter sur le répertoire des fichiers de frontend et lancer la commande "npm run start"



---------------------------Autres informations------------------------------------

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