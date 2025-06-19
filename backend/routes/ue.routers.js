// ue.routers.js

const express = require('express');
const ueController = require('../controllers/ue.controllers');
const ueMiddleware = require('../middlewares/ue.middlewares');

const router = express.Router();

router.get('/all-ue', ueController.getAllUES);
router.get('/total-ues', ueController.getUeNumber);
router.get('/responsable/:code', ueController.getResponsableUE)

// add-ue
// edit-ue
// delete-ue
// get-responsable-ue


module.exports = router;