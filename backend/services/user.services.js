// user.services.js
const notificationDAO = require('../Dao/NotificationsDao')
const pool = require('../database/db')
const ueDao = require('../Dao/UeDao')

async function getAllUsers(){
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT 
                u.id_utilisateur,
                u.nom,
                u.prenom,
                u.image,
                r.id_role,
                r.nom AS role_name
            FROM Utilisateur u
            LEFT JOIN Possede p ON u.id_utilisateur = p.utilisateur_id
            LEFT JOIN Role r ON p.role_id = r.id_role
        `);

        const usersMap = new Map();

        for (const row of res.rows) {
            const userId = row.id_utilisateur;

            if (!usersMap.has(userId)) {
                usersMap.set(userId, {
                    id_utilisateur: userId,
                    nom: row.nom,
                    prenom: row.prenom,
                    image: row.image,
                    roles: []
                });
            }

            if (row.id_role) {
                usersMap.get(userId).roles.push({
                    id_role: row.id_role,
                    nom: row.role_name
                });
            }
        }

        return Array.from(usersMap.values());
    } catch (e){
        console.error('Impossible to get all users : ' + e);
    } finally {
        client.release();
    }
}


async function getUserById(id){
    const client = await pool.connect();
    try{
        const res = await client.query('SELECT * FROM Utilisateur WHERE id_utilisateur = $1', [id]);
        return res.rows[0];
    } catch (e) {
        console.error('Impossible to get user with id ' + id + ' : ' + e);
    } finally {
        client.release();
    }
}

async function getRoles(){
    const client = await pool.connect();
    try{
        const res = await client.query('SELECT * FROM Role');
        return res.rows;
    } catch (e){
        console.error('Impossible to get roles : ' + e);
    } finally {
        client.release();
    }
}

async function getUsersByRole(role_id){
    const client = await pool.connect();
    try{
        const res = await client.query('SELECT u.*\n' +
            'FROM Possede p\n' +
            'INNER JOIN Utilisateur u on u.id_utilisateur = p.utilisateur_id\n' +
            'WHERE role_id =$1', [role_id]);
        return res.rows;
    } catch (e) {
        console.error('Impossible to get users with role ' + role_id + ' : ' + e);

    } finally {
        client.release();
    }
}

async function getUserRoles(user_id){
    const client = await pool.connect();
    try{
        const res = await client.query('SELECT r.*\n' +
            'FROM Possede p\n' +
            'INNER JOIN Role r on r.id_role = p.role_id\n' +
            'WHERE p.utilisateur_id = $1', [user_id]);
        return res.rows;
    } catch (e) {
        console.error("Impossible to user's roles with id " + id + " : " + e);
    } finally {
        client.release();
    }
}

async function deleteUser(id){
    const client = await pool.connect();
    try{
        let user = await getUserById(id);
        if(!user){
            return {success: false};
        }
        await client.query('DELETE FROM Utilisateur WHERE id_utilisateur = $1', [id]);
        return {success: true};
    } catch (e) {
        console.error('Impossible to delete user with id ' + id + ' : ' + e);
        return {success: false};
    } finally {
        client.release();
    }
}

async function loginUser(email, password){
    const client = await pool.connect();
    try{
        const res = await client.query('SELECT id_utilisateur FROM Utilisateur WHERE email = $1 AND mot_de_passe = $2', [email, password]);
        return res.rows[0];
    } catch (e) {
        console.error('Impossible to login : ' + e);
    } finally {
        client.release();
    }
}


async function createUser(nom, prenom, email, image ,password, roles, UE, emmeteur_id){
    const client = await pool.connect();
    try{
        await client.query('BEGIN');

        const existing_user = await client.query('SELECT * FROM Utilisateur WHERE email = $1', [email]);
        if(existing_user.rows.length > 0){
            await client.query('ROLLBACK');
            return {success: false, message: 'User already exists'};
        }

        if(!roles || roles.length === 0){
            await client.query('ROLLBACK');
            return {success: false, message: 'No roles provided'};
        }

        await client.query('INSERT INTO Utilisateur (nom, prenom, email, image ,mot_de_passe) VALUES ($1, $2, $3, $4, $5)', [nom, prenom, email, image ,password]);

        const user = await client.query('SELECT id_utilisateur FROM Utilisateur WHERE email = $1', [email]);
        const user_id = user.rows[0].id_utilisateur;

        for (const role of roles) {
            await client.query('INSERT INTO Possede (utilisateur_id, role_id) VALUES ($1, $2)', [user_id, role]);
        }

        
        if(UE && UE.length > 0){
            for (const code_UE of UE) {
                const role_user = roles.includes(2) ? 2 : 1;
                await ueDao.AffecterAndDesaffecterUserToUe(code_UE, user_id, role_user, emmeteur_id)
             }
        }

        await client.query('COMMIT');
        return {success: true, message: 'User created', data: user_id};
    } catch (e){
        console.error('Impossible to create user : ' + e);
        await client.query('ROLLBACK');
        return {success: false, message: 'Impossible to create user'};
    } finally {
        client.release();
    }
}

async function compareAndChangeRole(client, user_id ,initial_roles, new_roles){
    try{
        for (const role of new_roles) {
            if(!initial_roles.includes(role)){
                await client.query('INSERT INTO Possede (utilisateur_id, role_id) VALUES ($1, $2)', [user_id, role]);
            }
        }

        for (const role of initial_roles) {
            if(!new_roles.includes(role)){
                await client.query('DELETE FROM Possede WHERE utilisateur_id = $1 AND role_id = $2', [user_id, role]);
            }
        }
    } catch (e){
        console.error("Impossible to change role when editing user : " + e);
        throw e;
    }

}


async function editUser(user_id, nom, prenom, email, image ,password, roles, UE, emmeteur_id){
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        const result_user = await client.query('SELECT * FROM Utilisateur WHERE id_utilisateur = $1', [user_id]);
        const user = result_user.rows[0];
        if(!user){
            await client.query('ROLLBACK');
            return {success: false, message: 'User not found'};
        }


        const result_roles_initial = await getUserRoles(user_id);
        const roles_initial = result_roles_initial.map(row => row.id_role);



        await compareAndChangeRole(client, user_id, roles_initial, roles);

        const role = roles.includes(2) ? 2 : 3;

        const result_UE_initial = await ueDao.getUesForUser(user_id, role);

            console.log(UE , result_UE_initial)


        await compareAndChangeUE( user_id, result_UE_initial, UE, role, emmeteur_id);


        if(user.nom !== nom || user.prenom !== prenom || user.image !==  image || user.mot_de_passe !== password){
            await client.query('UPDATE Utilisateur SET nom = $1, prenom = $2, image = $3, mot_de_passe = $4 WHERE id_utilisateur = $5', [nom, prenom, image ,password, user_id]);
        }

        await client.query('COMMIT');
        return {success: true, message: 'User edited'};
    } catch (e){
        console.error('Impossible to edit user : ' + e);
        await client.query('ROLLBACK');
        return {success: false, message: 'Impossible to edit user'};
    } finally {
        client.release();
    }

}

async function compareAndChangeUE(user_id ,initial_UE, new_UE, role, emmeteur_id){
    try{

        if (!Array.isArray(new_UE)) {
            throw new TypeError('new_UE must be an array');
        }

        for (const code_UE of new_UE) {
            if(!initial_UE.includes(code_UE)){
                await ueDao.AffecterAndDesaffecterUserToUe(code_UE,user_id,role, emmeteur_id)
            }
        }
        for (const code_UE of initial_UE) {
            if(!new_UE.includes(code_UE)){
                console.log('have to remove ' + code_UE)
                await ueDao.AffecterAndDesaffecterUserToUe(code_UE,user_id,role, emmeteur_id,'remove')
            }
        }
    } catch (e){
        console.log("Impossible to change UE when editing user : " + e);
        throw e;
    }

}

async function simplifyEdit(user_id, nom, prenom, password){
        const client = await pool.connect();
    try{
        const result_user = await client.query('SELECT * FROM Utilisateur WHERE id_utilisateur = $1', [user_id]);
        const user = result_user.rows[0];        
        if(!user){
            return {success: false, message: 'User not found'};
        }

        if(user.nom !== nom || user.prenom !== prenom || user.mot_de_passe !== password){
            await client.query('UPDATE Utilisateur SET nom = $1, prenom = $2, mot_de_passe = $3 WHERE id_utilisateur = $4', [nom, prenom ,password, user_id]);
        }
            return {success: true, message: 'User edited'}; 

    } catch(e){
        return {success: false, message: 'User not found'};
    } finally{
        client.release();
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getRoles,
    getUsersByRole,
    getUserRoles,
    deleteUser,
    loginUser,
    createUser,
    editUser,
    simplifyEdit
}