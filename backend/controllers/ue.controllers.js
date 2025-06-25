// ue.controllers.js

const ueDao = require('../Dao/UeDao');
const UserServices = require('../services/user.services')

class UeController {
    static async getAllUes(req, res) {
        try {
            const ues = await ueDao.getAllUE();
            res.status(200).json(ues);
        } catch (e){
            res.status(500).json({error : e.message});
        }
    }

        static async getOneUe(req, res) {
        try {
            const { mode = 'normal' } = req.query;
            const code = req.params.code;
            const ues = await ueDao.getOneUe(code, mode);
            res.status(200).json(ues);
        } catch (e){
            res.status(500).json({error : e.message});
        }
    }

    static async getUeNumber(req, res){
        try{
            const ue_number = await ueDao.countUeNumber();
            res.status(200).json(ue_number);
        } catch (e){
            res.status(500).json({error : e.message});
        }
    }

    static async getResponsableOfUe(req, res){
        try{
            const code = req.params.code;
            const responsable_id = await ueDao.getResponsableOfUE(code);
            if(!responsable_id){
                return res.status(404).json({ message : 'No responsable found for this UE' });
            }
            const users = await UserServices.getUserById(responsable_id.responsable_id);
            if(!users){
                return res.status(404).json({ message : 'No users found' });
            }
            return res.status(200).json(users);
        } catch(e){
            res.status(500).json({error : e.message});
        }
    }

    static async getUeForUser(req,res){
        try{
            const user_id = req.params.user_id;
            const roles = await UserServices.getUserRoles(user_id);
            const roleIds = roles.map(r => r.id_role);

            const { mode = 'normal' } = req.query;
            
            const role = roleIds.includes(2) ? 2 : 3;


            const result = await ueDao.getUesForUser(user_id, role, mode);
            return res.status(200).json(result)
        } catch (e){
            res.status(500).json({error : e.message});
        }
    }

    static async createUe(req, res){
        try{
            const { code, nom, image, responsable_id, utilisateurs_affectes } = req.body;

        const eleves_affectes = [];
        const professeurs_affectes = [];

        if (utilisateurs_affectes && Array.isArray(utilisateurs_affectes)) {
            for (const user_id of utilisateurs_affectes) {
                const roles = await UserServices.getUserRoles(user_id); // 
                const roleIds = roles.map(r => r.id_role);
                const role = roleIds.includes(2) ? 2 : 3;

                if (role === 2) {
                    professeurs_affectes.push(user_id);
                } else if (role === 3) {
                    eleves_affectes.push(user_id);
                }
            }
        }

        const result = await ueDao.createUE(code,nom, image, responsable_id, eleves_affectes, professeurs_affectes)

        if(!result.success){
            return res.status(404).json(result);
        }
        return res.status(201).json(result);

        } catch (e){
        console.error('[createUe] Erreur :', e);
            return res.status(500).json({success : false, message : 'Erreur serveur lors de la création de l’UE'})

        }
        
    }

    static async deleteUe(req, res) {
    try {
        const { code } = req.params;
        const result = await ueDao.deleteUE(code);
        const status = result.success ? 200 : 400;
    return res.status(status).json(result);
    } catch (e) {
        console.error('[deleteUe] Erreur :', e);
        return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

static async editUe(req, res) {
  try {
    const code = req.params.code
    const {
      nom, image, responsable_id, utilisateurs_affectes = []
    } = req.body;

    const eleves   = [];
    const profs    = [];

    for (const uid of utilisateurs_affectes) {
      const roles   = await UserServices.getUserRoles(uid);   
      const roleIds = roles.map(r => r.id_role);
      (roleIds.includes(2) ? profs : eleves).push(uid);
    }

    const result = await ueDao.editUE({
      code,
      nom,
      image,
      responsable_id,
      eleves_affectes:       eleves,
      professeurs_affectes:  profs
    });

    const status = result.success ? 200 : 400;
    return res.status(status).json(result);

  } catch (e) {
    console.error('[editUe] Erreur :', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async addSection(req, res) {
  try{
    const { code } = req.params;
    const { nom }  = req.body;
    const result   = await ueDao.addSectionToUE(code, nom);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (e){
    console.error('[addSection] Erreur :', e);
    return res.status(500).json({ success: false, message: 'Impossible de créer une section' });
  }
}

static async renameSection(req, res) {
  try {

      const { code, id } = req.params;
      const { nom }      = req.body;
      const result       = await ueDao.renameSection(code, id, nom);
      return res.status(result.success ? 200 : 404).json(result);
  } catch (e){
    console.error('[EditdSection] Erreur :', e);
    return res.status(500).json({ success: false, message: 'Impossible de modifier une section' });
  }

}

static async deleteSection(req, res) {
    try{
          const { code, id } = req.params;
          const result       = await ueDao.deleteSection(code, id);
          return res.status(result.success ? 200 : 404).json(result);
    } catch (e){
        console.error('[delteSection] Erreur :', e);
        return res.status(500).json({ success: false, message: 'Impossible de supprimer une section' });
    }

}

static async addPublication(req, res) {
    try{
        const { code, secId } = req.params;
        const payload = req.body;                // contient type, fichier ou annonce
        const result  = await ueDao.addPublication(code, secId, payload);
        return res.status(result.success ? 201 : 400).json(result);
        
    } catch (e){
        console.error('[addPublication] Erreur :', e);
        return res.status(500).json({ success: false, message: "Impossible d'ajouter une publication" });
    }

}

static async editPublication(req, res) {
    try{
        const { code, secId, pubId } = req.params;
        const result = await ueDao.updatePublication(code, secId, pubId, req.body);
        return res.status(result.success ? 200 : 404).json(result);
    } catch (e){
        console.error('[editPublication] Erreur :', e);
        return res.status(500).json({ success: false, message: "Impossible d'editer une publication" });
    }

}

static async deletePublication(req, res) {
    try{
        const { code, secId, pubId } = req.params;
        const result = await ueDao.deletePublication(code, secId, pubId);
        return res.status(result.success ? 200 : 404).json(result);
    } catch (e){
        console.error('[deletePublication] Erreur :', e);
        return res.status(500).json({ success: false, message: "Impossible de supprimer une publication" });
    }

}

static async countUsersInUe(req, res)  {
  const { code, role } = req.params;
  try {
    const count = await ueDao.countUsersByUeAndRole(code, Number(role));
    return res.status(200).json({ success: true, count });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ success: false, message: e.message });
  }
};

static async getAllUsersInUe (req, res) {
  const { code, role } = req.params;

  try {
    const users = await ueDao.getAllUsersInUeDetailed(code, Number(role));
    console.log(users)
    if(!users)
        return res.status(404).json({success: false, message : 'Nobody found'})

    const result= [];


  for (let id of users) {
    const user = await UserServices.getUserById(id);
    if (user) {
      result.push(user);
    }
  }
    
    return res.status(200).json({
      success: true,
      users: result
    });
  } catch (e) {
    console.error('[getAllUsersInUe] Erreur:', e);
    return res.status(400).json({
      success: false,
      message: e.message
    });
  }


}
}

module.exports = UeController;