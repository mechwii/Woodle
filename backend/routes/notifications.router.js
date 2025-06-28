const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notifications.controller');

router.post('/add', NotificationController.addNotification);
/*
{
  "code_matiere": "WE4A",
  "emetteur_id": 2,
  "type_notification": "publication",
  "type_destinataire": "groupe",
  "destinataire_groupe_id": "eleves"
}
*/

router.get('/all', NotificationController.getAllNotifications);

router.get('/user/:user_id', NotificationController.getNotificationsForUser);
/*
GET /notification/user/3/eleves
*/
module.exports = router;
