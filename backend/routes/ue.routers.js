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
router.delete('/delete-section/:code/:id', ueController.deleteSection )

router.post('/add-publication/:code/:secId', ueController.addPublication)
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



// Récupérer liste eleves et enseignants en tant que utilisateur




module.exports = router;