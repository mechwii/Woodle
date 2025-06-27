const express = require('express');
const router = express.Router();
const LogController = require('../controllers/logs.controller');

router.post('/add', LogController.addLog);
/*
{
  "utilisateur_id": 3,
  "action": "visite_ue", -> connexion, deconnexion, soumission de devoir etc
  "code_matiere": "WE4A"
}
*/

router.get('/all', LogController.getAllLogs);

router.get('/user/:userId', LogController.getLogsByUser);


module.exports = router;
