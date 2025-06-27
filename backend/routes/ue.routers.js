// ue.routers.js

const express = require('express');
const ueController = require('../controllers/ue.controllers');


const router = express.Router();

// récupérer toutes les ue
router.get('/all-ue', ueController.getAllUes);

// Récupérer une ue
// Récupérer uniquement champs intéréssant (pour admin) -> /get-ue/:code?mode=simplify
// Récupérer uniquement champs intéréssant -> /get-ue/:code
router.get('/get-ue/:code', ueController.getOneUe);

// avoir le nombre total d'UE
router.get('/total-ues', ueController.getUeNumber);

// compter le nombre de prsn dans une UE par role
router.get('/count-user-by-roles/:code/:role', ueController.countUsersInUe)


// récup toutes les utilisateur d'une ue par groupe
router.get('/get-user-group/:code/:role', ueController.getAllUsersInUe);




// Avoir le responsable d'une UE
router.get('/get-responsable/:code', ueController.getResponsableOfUe)

// Avoir les gens inscrits à une UE (pour filtrer tu fais avec le groupe)

// Récupérer toutes les UE d'un user
// /get-ue-users/:user_id?mode=complet  
router.get('/get-ue-users/:user_id', ueController.getUeForUser)

router.post('/add-ue', ueController.createUe)
/*
{
    "code": "IA42",
    "nom": "Intelligence Artificielle Avancée",
    "image": {
        "nom_original": "ia-banner.jpg",
        "nom_stockage": "uploads/images/ues/ia-banner.jpg",
        "extension": "jpg"
    },
    "responsable_id": 13,
    "utilisateurs_affectes" : [1, 2, 3]
}
};*/

// delete-ue
router.delete("/delete/:code",ueController.deleteUe)

// edit-ue
router.put("/edit-ue/:code",ueController.editUe )
/*
{
    "code": "IA42",
    "nom": "Intelligence Artificielle Avancée",
    "image": {
        "nom_original": "ia-banner.jpg",
        "nom_stockage": "uploads/images/ues/ia-banner.jpg",
        "extension": "jpg"
    },
    "responsable_id": 13,
    "utilisateurs_affectes" : [1, 2, 3]
}
};*/


router.get('/get-section/:code/:secId', ueController.getSection);

router.post('/add-section/:code', ueController.addSection)
/*
{
    "nom" : "Cours magistral"
}
*/

router.put('/edit-section/:code/:id', ueController.renameSection )
/*
{
    "nom" : "Cours magistral"
}
*/


// localhost:3000/ue/delete-section/WE4A/2

router.get('/get-publications-by-section/:code/:secId', ueController.getAllPublicationsInSection);

router.delete('/delete-section/:code/:id', ueController.deleteSection )

router.post('/add-publication/:code/:secId', ueController.addPublication)

router.get('/get-publication/:code/:secId/:pubId', ueController.getPublication);



/*
{
  "type": "fichier",
  "publicateur_id": 3,
  "nom": "Cours 1 : Introduction à l’IA",
  "metadata": {
    "fichier": {
      "nom_original": "intro_ia.pdf",
      "nom_stockage": "files/IA42/intro_ia_202506.pdf",
      "extension": "pdf",
      "taille": 2048000
    }
  }
}

{
  "titre": "Changement d’horaire",
  "type": "annonce",
  "publicateur_id": 4,
  "contenu": "Le cours de jeudi est déplacé à vendredi 10h.",
  "importance": "élevée"
}

*/

// modifier une publication objet similaire à l'ajout
router.put('/edit-publication/:code/:secId/:pubId', ueController.editPublication)

router.delete('/delete-publication/:code/:secId/:pubId', ueController.deletePublication)

// SECTION DEVOIR
router.get('/get-all-devoirs/:code/:secId', ueController.getAllDevoirs);
/*
GET /ue/get-all-devoirs/WE4A/1
*/


router.get('/get-devoir/:code/:secId/:devoirId', ueController.getDevoir);


router.post('/add-devoir/:code/:secId', ueController.addDevoir);
/*
{
  "titre": "TP1 - Création d'une page web responsive",
  "description": "Créer une page web responsive en utilisant HTML5, CSS3 et JavaScript",
  "publicateur_id": 3,
  "date_limite": "2024-10-15T23:59:59Z",
  "instructions": {
    "taille_fichier" : 512000,
    "type_fichier" : "pdf" 
  }
}
*/

router.put('/edit-devoir/:code/:secId/:devoirId', ueController.editDevoir);
/*
{
  "titre": "TP1 corrigé",
  "date_limite": "2024-10-20T23:59:59Z",
  "visible": false
}
*/

router.delete('/delete-devoir/:code/:secId/:devoirId', ueController.deleteDevoir);

router.post('/add-soumission/:code/:secId/:devoirId', ueController.addSoumission);

/*
POST /ue/add-soumission/WE4A/1/1

{
  "etudiant_id": 122,
  "date_soumission": "2024-10-13T17:20:00Z",
  "fichiers": [
    {
      "nom_original": "tp1.zip",
      "nom_stockage": "files/we4a/soumissions/122_tp1.zip",
      "extension": "zip",
      "taille": 1024000
    }
  ]
}
*/


router.put('/edit-soumission/:code/:secId/:devoirId/:soumissionId', ueController.editSoumission);

/*
PUT /ue/edit-soumission/WE4A/1/1/1719492700000

{
  "fichiers": [
    {
      "nom_original": "tp1_final.zip",
      "nom_stockage": "files/we4a/soumissions/122_tp1_final.zip",
      "extension": "zip",
      "taille": 2048000
    }
  ]
}
*/

router.delete('/delete-soumission/:code/:secId/:devoirId/:soumissionId', ueController.deleteSoumission);

router.get('/get-all-soumissions/:code/:secId/:devoirId', ueController.getAllSoumissions);

/*
GET /ue/get-all-soumissions/WE4A/1/1
*/

router.get('/get-soumission/:code/:secId/:devoirId/:soumissionId', ueController.getSoumission);

/*
GET /ue/get-soumission/WE4A/1/1/1719492700000
*/

router.put('/corriger-soumission/:code/:secId/:devoirId/:soumissionId', ueController.corrigerSoumission);

/*
PUT /ue/corriger-soumission/WE4A/1/1/1719492700000

{
  "note": 17.5,
  "commentaire_prof": "Bon travail, bonne structure.",
  "correcteur_id": 4
}
*/

// FORUM

router.post('/add-forum/:code/:secId', ueController.addForum);

/*
POST /ue/add-forum/WE4A/1

{
  "titre": "Questions générales sur le cours",
  "description": "Forum pour poser vos questions sur les concepts du cours",
  "createur_id": 4
}
*/

router.delete('/delete-forum/:code/:secId/:forumId', ueController.deleteForum);

/*
DELETE /ue/delete-forum/WE4A/1/1
*/

router.get('/get-all-forums/:code/:secId', ueController.getAllForums);

/*
GET /ue/get-all-forums/WE4A/1
*/

router.get('/get-forum/:code/:secId/:forumId', ueController.getOneForum);

/*
GET /ue/get-forum/WE4A/1/1
*/


router.post('/add-sujet/:code/:secId/:forumId', ueController.addSujet);

/*
POST /ue/add-sujet/WE4A/1/1

{
  "titre": "Besoin d'aide pour l'exo 2",
  "auteur_id": 122
}
*/

router.delete('/delete-sujet/:code/:secId/:forumId/:sujetId', ueController.deleteSujet);

/*
DELETE /ue/delete-sujet/WE4A/1/1/1
*/


router.get('/get-all-sujets/:code/:secId/:forumId', ueController.getAllSujets);

/*
GET /ue/get-all-sujets/WE4A/1/1
*/

router.get('/get-sujet/:code/:secId/:forumId/:sujetId', ueController.getOneSujet);

/*
GET /ue/get-sujet/WE4A/1/1/1
*/

router.post('/add-message/:code/:secId/:forumId/:sujetId', ueController.addMessage);

/*
POST /ue/add-message/WE4A/1/1/1

{
  "auteur_id": 122,
  "contenu": "Bonjour, quelqu’un peut-il m’expliquer comment utiliser flex-grow ?"
}
*/


router.delete('/delete-message/:code/:secId/:forumId/:sujetId/:messageId', ueController.deleteMessage);

/*
DELETE /ue/delete-message/WE4A/1/1/1/2
*/

router.get('/get-all-messages/:code/:secId/:forumId/:sujetId', ueController.getAllMessages);

/*
GET /ue/get-all-messages/WE4A/1/1/1
*/

router.get('/get-message/:code/:secId/:forumId/:sujetId/:messageId', ueController.getOneMessage);

/*
GET /ue/get-message/WE4A/1/1/1/2
*/



module.exports = router;