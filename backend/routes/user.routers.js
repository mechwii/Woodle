const express = require('express')
const userMiddleware = require('../middlewares/user.middlewares');
const userController = require('../controllers/user.controllers');

const router = express.Router();

module.exports = router;