const express = require('express')
const userMiddleware = require('../middlewares/user.middlewares');
const userController = require('../controllers/user.controllers');

const router = express.Router();

router.get('/all-users', userController.getAllUsers)

router.get('/get-user/:user_id', userController.getUserById);

router.get('/all-roles',userController.getRoles)

router.get('/users-by-role/:role_id', userController.getUsersByRole)
router.get('/roles-by-user/:user_id', userController.getUserRoles)

router.delete('/delete-user/:user_id', userController.deleteUser) // Middleware -> to not delete the person who is connected

router.post('/login', userMiddleware.validateLogin ,userController.loginUser )
/*
{
    "email" : "hugo.richard@example.com",
    "password" : "hugoRich456"
}
 */


router.post('/add-user', userController.createUser) // add a middleware here to check validity of entries, and also maybe for checking if a user already exists
/*
{
    "nom" : "Momo",
    "prenom" : "Mama",
    "email" : "Momo@Maaamaaaaaaaaaaaaa.com",
    "image" : "Apagnan.jpg",
    "password" : "Test1234",
    "roles" : [1, 2],
    "UE" : ["RS40"]
}
 */

router.put('/edit-user/:user_id', userController.editUser)
/*
{
    "nom" : "aMomo",
    "prenom" : "Mama",
    "email" : "Momo@Maaamaaaaaaaaaaaaa.com",
    "image" : "Apagnan.jpg",
    "password" : "Test1234",
    "roles" : [1, 2 , 3],
    "UE" : ["RS40", "IA41"]
}
 */




module.exports = router;