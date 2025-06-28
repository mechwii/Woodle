// user.controllers.js
const jwt = require('jsonwebtoken');
const UserServices = require('../services/user.services');
const logsDao = require('../Dao/LogsDao')
const ueDao = require('../Dao/UeDao')

exports.getAllUsers = async (req, res) => {
    try{
        const users = await UserServices.getAllUsers();
        if(!users){
            return res.status(404).json({ message : 'No users found' });
        }
        return res.status(200).json(users);

    } catch (e) {
        console.error(e);
        res.status(500).json({message: e});
    }
};

exports.getUserById = async (req, res) => {
    try{
        const user_id = req.params.user_id;
        const user = await UserServices.getUserById(user_id);
        
        if(!user){
            return res.status(404).json({ message : 'No user found' });
        }
        
        const roles = await UserServices.getUserRoles(user_id);
         const userWithRoles = {
            ...user,
            roles: roles || [] 
        };

        return res.status(200).json(userWithRoles);

    } catch (e) {
        console.error(e);
        res.status(500).json({message: e});
    }
}



exports.getRoles = async (req, res) => {
    try{
        const roles = await UserServices.getRoles();
        if(!roles){
            return res.status(404).json({ message : 'No roles found' });
        }
        return res.status(200).json(roles);
    } catch (e) {
        console.error(e);
        res.status(500).json({message: e});
    }
}

exports.getUsersByRole = async (req, res) => {
    try {
        const role_id = req.params.role_id;
        const users = await UserServices.getUsersByRole(role_id);
        if(!users){
            return res.status(404).json({ message : 'No users found' });
        }
        return res.status(200).json(users);
    } catch (e){
        console.error(e);
        res.status(500).json({message: e});
    }
}

exports.getStastiquesRoles = async(req, res) => {
    try{
        const allUsers = await UserServices.getAllUsers();
        const users = await UserServices.getUsersByRole(3);
        const professeurs = await UserServices.getUsersByRole(2);
        const ue = await ueDao.countUeNumber()

        if(!users || !professeurs|| !ue || !allUsers){
            return res.status(404).json({ message : 'No users found' });
        }
        return res.status(200).json({users : allUsers.length, eleves : users.length, professeurs : professeurs.length, ues : ue.ue_number});

    } catch (e){
        console.error(e);
        res.status(500).json({message: e});
    }
}

// getUserRoles(user_id)

exports.getUserRoles = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const roles = await UserServices.getUserRoles(user_id);
        if(!roles){
            return res.status(404).json({ message : 'No roles found' });
        }
        return res.status(200).json(roles);
    } catch (e){
        console.error(e);
        res.status(500).json({message: e});
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user = await UserServices.deleteUser(user_id);
        if(!user.success){
            return res.status(404).json({ success: false,message : 'Impossible to delete user' });
        }
        return res.status(200).json({success: true, message: 'User deleted'});
    } catch (e){
        console.error(e);
    }
}

exports.loginUser = async (req, res) => {
    console.log("reçu")
    try {
        const {email, password} = req.body;
        const user = await UserServices.loginUser(email, password);

        if(!user){
            return res.status(404).json({ success: false, message : 'No user found' });
        }

        const id_user = user.id_utilisateur;
        const roles = await UserServices.getUserRoles(id_user);
        await logsDao.addLog({
            utilisateur_id : id_user,
            action : 'connexion'
        })
        

        /// const token = jwt.sign({id_user : id_user, roles: roles}, process.env.JWT_SECRET, {expiresIn: '1h'}) // Maybe add role in the token
        // console.log(jwt.decode(token));
        // return res.status(200).json({token, data: {'id_utilisateur' : user.id_utilisateur,'roles' : roles} });

        return res.status(200).json({data: {'id_utilisateur' : user.id_utilisateur,'roles' : roles} });
    } catch (e){
        console.error(e);
    }
}

exports.createUser = async (req, res) => {
    try {
        const {nom, prenom, email, image ,password, roles, UE, emmeteur_id} = req.body;
        const result = await UserServices.createUser(nom, prenom, email, image, password, roles, UE, emmeteur_id);
        if(!result.success){
            return res.status(404).json({ message : result.message });
        }
        return res.status(200).json({message: result.message});
    } catch (e) {
        console.error(e);
        res.status(500).json({message: e});
    }
}

exports.editUser = async (req, res) => {
    try{
        const { mode = 'normal' } = req.query;

        const user_id = req.params.user_id;
        const {nom, prenom, email, image, password, roles, UE, emmeteur_id} = req.body;
        let result;
        if(mode === 'normal'){
                        console.log('basic')
            result = await UserServices.editUser(user_id, nom, prenom, email, image, password, roles, UE, emmeteur_id);
        } else {
            console.log('simple')
            result = await UserServices.simplifyEdit(user_id,nom,prenom,password)
        }

        if(!result.success){
            return res.status(404).json({  message : result.message });
        }
        return res.status(200).json({message: result.message});
    } catch (e) {
        console.error(e);
        res.status(500).json({message: e});
    }
}