// ue.controllers.js

const ueDao = require('../Dao/UeDao');
const UserServices = require('../services/user.services')
const notifcationDao = require('../Dao/NotificationsDao')
const logsDao = require('../Dao/LogsDao')


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
          const { mode = 'normal', logs, id_user } = req.query;


            const code = req.params.code;
            const ues = await ueDao.getOneUe(code, mode);
              if(logs){
                await logsDao.addLog({
                    utilisateur_id : id_user,
                    action : 'acces_ue',
                    code_matiere : code
                })
              } 
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
            const { code, nom, image, responsable_id, utilisateurs_affectes, emmeteur_id } = req.body;

        const eleves_affectes = [];
        const professeurs_affectes = [];

        if (utilisateurs_affectes && Array.isArray(utilisateurs_affectes)) {
            for (const user_id of utilisateurs_affectes) {
                const roles = await UserServices.getUserRoles(user_id); // 
                const roleIds = roles.map(r => r.id_role);
                const role = roleIds.includes(2) ? 2 : 3;

                notifcationDao.addNotification({
                      code_matiere: code,
                      emetteur_id: Number(emmeteur_id),
                      type_notification: 'affectation',
                      type_destinataire:'individuelle',
                      destinataire_id: Number(user_id),
                      date_notif: new Date()
                    })
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

static async getAllPublicationsInSection(req, res) {
  try {
    const { code, secId } = req.params;
    const publications = await ueDao.getAllPublications(code, Number(secId));

    if (!publications) {
      return res.status(404).json({ success: false, message: 'Section non trouvée ou sans publications' });
    }

    return res.status(200).json( publications);
  } catch (e) {
    console.error('[getAllPublicationsInSection] Erreur :', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}


static async editUe(req, res) {
  try {
    const code = req.params.code
    const {
      nom, image, responsable_id, utilisateurs_affectes = [], emmeteur_id
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
      professeurs_affectes:  profs,
      emmeteur_id
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
        const logs = {
                      code_matiere: code,
                      emetteur_id: Number(payload.publicateur_id),
                      type_notification: 'publication',
                      type_destinataire:'groupe',
                      destinataire_groupe_id: 3,
                      date_notif: new Date()
        
                    }
        
        await notifcationDao.addNotification(logs)
        return res.status(result.success ? 201 : 400).json(result);
        
    } catch (e){
        console.error('[addPublication] Erreur :', e);
        return res.status(500).json({ success: false, message: "Impossible d'ajouter une publication" });
    }

}

static async editPublication(req, res) {
    try{
      console.log('ici')
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

static async getSection(req, res) {
  try {
    const { code, secId } = req.params;
    const section = await ueDao.getSection(code, Number(secId));

    if (!section) {
      return res.status(404).json({ success: false, message: 'Section non trouvée' });
    }

    return res.status(200).json(section);
  } catch (e) {
    console.error('[getSection] Erreur :', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getPublication(req, res) {
  try {
    const { code, secId, pubId } = req.params;
    const publication = await ueDao.getPublication(code, Number(secId), Number(pubId));

    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication non trouvée' });
    }

    return res.status(200).json(publication);
  } catch (e) {
    console.error('[getPublication] Erreur :', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}


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

static async getDevoir(req, res) {
  try {
    const { code, secId, devoirId } = req.params;
    const devoir = await ueDao.getDevoir(code, Number(secId), Number(devoirId));

    if (!devoir) {
      return res.status(404).json({ success: false, message: 'Devoir non trouvé' });
    }

    return res.status(200).json(devoir);
  } catch (e) {
    console.error('[getDevoir]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getAllDevoirs(req, res) {
  try {
    const { code, secId } = req.params;
    const result = await ueDao.getAllDevoirs(code, Number(secId));
    return res.status(200).json(result);
  } catch (e) {
    console.error('[getAllDevoirs]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}



static async addDevoir(req, res) {
  try {
    const { code, secId } = req.params;
    const payload = req.body;
    const result = await ueDao.addDevoir(code, Number(secId), payload);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (e) {
    console.error('[addDevoir]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async editDevoir(req, res) {
  try {
    const { code, secId, devoirId } = req.params;
    const result = await ueDao.editDevoir(code, Number(secId), Number(devoirId), req.body);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (e) {
    console.error('[editDevoir]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async deleteDevoir(req, res) {
  try {
    const { code, secId, devoirId } = req.params;
    const result = await ueDao.deleteDevoir(code, Number(secId), Number(devoirId));
    return res.status(result.success ? 200 : 404).json(result);
  } catch (e) {
    console.error('[deleteDevoir]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async addSoumission(req, res) {
  try {
    const { code, secId, devoirId } = req.params;
    const payload = req.body;

    const result = await ueDao.addSoumission(code, Number(secId), Number(devoirId), payload);

    const notif = {
                    code_matiere: code,
                    emetteur_id: Number(payload.etudiant_id),
                    type_notification: 'soumission_devoir',
                    type_destinataire:'groupe',
                    destinataire_groupe_id: 2,
                    date_notif: new Date()
                  }
        
      await notifcationDao.addNotification(notif)
    
    return res.status(result.success ? 201 : 400).json(result);
  } catch (e) {
    console.error('[addSoumission]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async editSoumission(req, res) {
  try {
    const { code, secId, devoirId, soumissionId } = req.params;
    const result = await ueDao.editSoumission(code, Number(secId), Number(devoirId), Number(soumissionId), req.body, false);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (e) {
    console.error('[editSoumission]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async deleteSoumission(req, res) {
  try {
    const { code, secId, devoirId, soumissionId } = req.params;
    const result = await ueDao.deleteSoumission(code, Number(secId), Number(devoirId), Number(soumissionId));
    return res.status(result.success ? 200 : 404).json(result);
  } catch (e) {
    console.error('[deleteSoumission]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getAllSoumissions(req, res) {
  try {
    const { code, secId, devoirId } = req.params;
    const result = await ueDao.getAllSoumissions(code, Number(secId), Number(devoirId));
    return res.status(200).json(result);
  } catch (e) {
    console.error('[getAllSoumissions]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getSoumission(req, res) {
  try {
    const { code, secId, devoirId, soumissionId } = req.params;
    const result = await ueDao.getOneSoumission(code, Number(secId), Number(devoirId), Number(soumissionId));

    if (!result)
      return res.status(404).json({ success: false, message: 'Soumission non trouvée' });

    return res.status(200).json(result);
  } catch (e) {
    console.error('[getSoumission]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async corrigerSoumission(req, res) {
  try {
    const { code, secId, devoirId, soumissionId } = req.params;
    const result = await ueDao.editSoumission(code, Number(secId), Number(devoirId), Number(soumissionId), req.body, true);
    const Soumision = await ueDao.getOneSoumission(code,Number(secId),Number(devoirId),Number(soumissionId))
      const notif = {
                    code_matiere: code,
                    emetteur_id: Number(req.body.correcteur_id),
                    type_notification: 'correction_devoir',
                    type_destinataire:'individuelle',
                    destinataire_id: Number(Soumision.etudiant_id),
                    date_notif: new Date()
                  }
        
      await notifcationDao.addNotification(notif)
    
    return res.status(result.success ? 200 : 404).json(result);
  } catch (e) {
    console.error('[corrigerSoumission]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async addForum(req, res) {
  try {
    const { code, secId } = req.params;
    const result = await ueDao.addForum(code, Number(secId), req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (e) {
    console.error('[addForum]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async deleteForum(req, res) {
  try {
    const { code, secId, forumId } = req.params;
    const result = await ueDao.deleteForum(code, Number(secId), Number(forumId));
    return res.status(result.success ? 200 : 404).json(result);
  } catch (e) {
    console.error('[deleteForum]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getAllForums(req, res) {
  try {
    const { code, secId } = req.params;
    const result = await ueDao.getAllForums(code, Number(secId));
    return res.status(200).json(result);
  } catch (e) {
    console.error('[getAllForums]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getOneForum(req, res) {
  try {
    const { code, secId, forumId } = req.params;
    const forum = await ueDao.getOneForum(code, Number(secId), Number(forumId));

    if (!forum)
      return res.status(404).json({ success: false, message: 'Forum non trouvé' });

    return res.status(200).json(forum);
  } catch (e) {
    console.error('[getOneForum]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async addSujet(req, res) {
  try {
    const { code, secId, forumId } = req.params;
    const result = await ueDao.addSujet(code, Number(secId), Number(forumId), req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (e) {
    console.error('[addSujet]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async deleteSujet(req, res) {
  try {
    const { code, secId, forumId, sujetId } = req.params;
    const result = await ueDao.deleteSujet(code, Number(secId), Number(forumId), Number(sujetId));
    return res.status(result.success ? 200 : 404).json(result);
  } catch (e) {
    console.error('[deleteSujet]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getAllSujets(req, res) {
  try {
    const { code, secId, forumId } = req.params;
    const result = await ueDao.getAllSujets(code, Number(secId), Number(forumId));
    return res.status(200).json(result);
  } catch (e) {
    console.error('[getAllSujets]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getOneSujet(req, res) {
  try {
    const { code, secId, forumId, sujetId } = req.params;
    const sujet = await ueDao.getOneSujet(code, Number(secId), Number(forumId), Number(sujetId));

    if (!sujet)
      return res.status(404).json({ success: false, message: 'Sujet non trouvé' });

    return res.status(200).json(sujet);
  } catch (e) {
    console.error('[getOneSujet]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async addMessage(req, res) {
  try {
    const { code, secId, forumId, sujetId } = req.params;
    const result = await ueDao.addMessage(code, Number(secId), Number(forumId), Number(sujetId), req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (e) {
    console.error('[addMessage]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async deleteMessage(req, res) {
  try {
    const { code, secId, forumId, sujetId, messageId } = req.params;
    const result = await ueDao.deleteMessage(code, Number(secId), Number(forumId), Number(sujetId), Number(messageId));
    return res.status(result.success ? 200 : 404).json(result);
  } catch (e) {
    console.error('[deleteMessage]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getAllMessages(req, res) {
  try {
    const { code, secId, forumId, sujetId } = req.params;
    const result = await ueDao.getAllMessages(code, Number(secId), Number(forumId), Number(sujetId));
    return res.status(200).json(result);
  } catch (e) {
    console.error('[getAllMessages]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

static async getOneMessage(req, res) {
  try {
    const { code, secId, forumId, sujetId, messageId } = req.params;
    const result = await ueDao.getOneMessage(code, Number(secId), Number(forumId), Number(sujetId), Number(messageId));

    if (!result)
      return res.status(404).json({ success: false, message: 'Message non trouvé' });

    return res.status(200).json(result);
  } catch (e) {
    console.error('[getOneMessage]', e);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}




}

module.exports = UeController;