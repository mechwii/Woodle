const notificationDAO = require('../Dao/NotificationsDao')

class UeDAO {
    static UE;

    static async injectDB(conn){
        if(this.UE)
            return;
        try{
            this.UE = await conn.db(process.env.MONGODB_DB).collection('UE');
        } catch (e) {
            console.error('Impossible de se connecter à la base de donnée UE');
        }
    }

    static async getAllUE(){
        try{
            return await this.UE.find().toArray();
        } catch(e){
            console.error('Impossible de récuperer toutes les UEs')
            return {error : e};
        }
    }

        static async getOneUe(code, mode = 'normal'){
        try{
          console.log(code)
            if(mode === 'normal'){
                return await this.UE.findOne({code});
            } else {
                return await this.UE.findOne({code}, {projection : {code : 1, nom : 1, images : 1,responsable_id : 1, eleves_affectes : 1, professeurs_affectes:1 }});
            }
        } catch(e){
            console.error("Impossible de récuperer l'UE")
            return {error : e};
        }
    }

    static async createUE(code, nom, image, responsable_id, eleves_affectes, professeurs_affectes ) {
    try {
        const existing = await this.UE.findOne({ code });
        if (existing) {
            return { success: false, message: 'UE avec ce code existe déjà' };
        }

        const numericResponsableId = Number(responsable_id);
        if (isNaN(numericResponsableId)) {
            return { success: false, message: 'ID responsable non valide' };
        }

        const newUE = {
            code,
            nom,
            images: image || null, // { nom_original, nom_stockage, extension }
            responsable_id: numericResponsableId,
            eleves_affectes: eleves_affectes,
            professeurs_affectes: professeurs_affectes,
            sections: [],
        };

        const result = await this.UE.insertOne(newUE);

        return {
            success: true,
            message: 'UE créée avec succès',
            ue_code: result.insertedId
        };
    } catch (e) {
        console.error('[createUE] Erreur lors de la création de l’UE:', e);
        return { success: false, message: 'Erreur interne lors de la création de l’UE' };
    }
}

    static async countUeNumber(){
        try{
             const number =  await this.UE.countDocuments();
             return {ue_number : number}
        } catch (e){
            console.error("Impossible de récuperer le nombre d'UE")
            return {error : e};
        }
    }

    static async getResponsableOfUE(code){
        try{
        const result = await this.UE.findOne({ code: code }, { projection: { responsable_id: 1, _id: 0 } });
            return result;
        } catch (e){
            console.error("Impossible de récuperer le responsable de l'UE")
            return {error : e};
        }
    }

static async AffecterAndDesaffecterUserToUe(ueCode, userId, role, emmeteur_id , action = 'add') {
    try {
        const field = role === 2 ? 'professeurs_affectes' : 'eleves_affectes';
        if (!field) throw new Error('Rôle invalide');

        const numericUserId = Number(userId);
        if (isNaN(numericUserId)) throw new Error('userId non numérique');

        const operator = action === 'remove' ? '$pull' : '$addToSet';

        if(action === 'add'){
        await notificationDAO.addNotification({
          code_matiere: ueCode,
          emetteur_id: Number(emmeteur_id),
          type_notification: 'affectation',
          type_destinataire:'individuelle',
          destinataire_id: Number(userId),
          date_notif: new Date()
        });        
        }

        const update = { [operator]: { [field]: numericUserId } };

        const result = await this.UE.updateOne({ code: ueCode }, update);

        console.log(`[UE:${ueCode}] Action: ${action}, Champ: ${field}, User: ${numericUserId}, Modifié: ${result.modifiedCount}`);

        return result.modifiedCount === 1;
    } catch (e) {
        console.error('[AffecterAndDesaffecterUserToUe] Erreur:', e);
        return false;
    }
}


static async getUesForUser(userId, role, mode = 'normal') {
    try {

        const numericRole = Number(role);
        const numericUserId = Number(userId); 

        const field = numericRole === 2 ? 'professeurs_affectes' : 'eleves_affectes';
        let projection;

        switch (mode) {
            case 'normal' :
                projection ={ projection: { code: 1, _id: 0 } }
                break;
            case 'admin_data' :
                projection = { projection: { nom : 1, code: 1, nom : 1, images : 1, responsable_id: 1, _id: 0 } }
                break;
            case 'complet' :
                projection = { }
                break;
            default:
                projection = { projection: { code: 1, _id: 0 } };
        }

        const cursor = await this.UE.find(
            { [field]: numericUserId },
            projection
        );

        const result = await cursor.toArray();
        let codes;

        codes = mode === 'normal' ? result.map(doc => doc.code) : result; 

        return codes;
    } catch (e) {
        console.error('[getUesForUser] Erreur:', e);
        return { error: e };
    }
}

static async deleteUE(code) {
    try {
        if (!code) {
            return { success: false, message: 'Code UE manquant' };
        }

        const result = await this.UE.deleteOne({ code });

        if (result.deletedCount === 0) {
            return { success: false, message: 'Aucune UE trouvée avec ce code' };
        }

        return { success: true, message: 'UE supprimée avec succès' };
    } catch (e) {
        console.error('[deleteUE] Erreur lors de la suppression de l’UE :', e);
        return { success: false, message: 'Erreur serveur lors de la suppression de l’UE' };
    }
}

static async editUE({
  code,
  nom,
  image,
  responsable_id,
  eleves_affectes = [],
  professeurs_affectes = [],
  emmeteur_id
}) {
  try {
    const ue = await this.UE.findOne({ code });
    if (!ue) {
      return { success: false, message: 'UE non trouvée' };
    }

    const set = {};
    if (nom && nom !== ue.nom)                           set.nom = nom;
    if (image && JSON.stringify(image) !== JSON.stringify(ue.images))
                                                         set.images = image;
    const respIdNum = Number(responsable_id);
    if (!Number.isNaN(respIdNum) && respIdNum !== ue.responsable_id)
                                                         set.responsable_id = respIdNum;

    if (Object.keys(set).length) {
      await this.UE.updateOne({ code }, { $set: set });
    }

    const syncArray = async (field, finalList, role) => {
      const initial = ue[field] || [];

      const toAdd    = finalList.filter(id => !initial.includes(id));
      const toRemove = initial.filter(id => !finalList.includes(id));

      // add
      for (const id of toAdd) {
        await this.AffecterAndDesaffecterUserToUe(code, id, role,emmeteur_id, 'add');
      }
      // remove
      for (const id of toRemove) {
        await this.AffecterAndDesaffecterUserToUe(code, id, role,emmeteur_id ,'remove');
      }
    };

    await syncArray('professeurs_affectes', professeurs_affectes.map(Number), 2);
    await syncArray('eleves_affectes',      eleves_affectes.map(Number),      3);

    return { success: true, message: 'UE mise à jour avec succès' };

  } catch (e) {
    console.error('[editUE] Erreur :', e);
    return { success: false, message: 'Erreur serveur lors de la mise à jour' };
  }
}


static async addSectionToUE(ueCode, nomSection) {
  try {
    const ue = await this.UE.findOne(
      { code: ueCode },
      { projection: { sections: { _id: 1 } } }
    );
    if (!ue) return { success: false, message: 'UE non trouvée' };

    const nextId =
      (ue.sections?.reduce((max, s) => Math.max(max, s._id), 0) || 0) + 1;

    const result = await this.UE.updateOne(
      { code: ueCode },
      { $push: { sections: { _id: nextId, nom : nomSection ,publications: []}} } 
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Section ajoutée', section_id: nextId }
      : { success: false, message: 'Échec de l’ajout de la section' };
  } catch (e) {
    console.error('[addSectionToUE]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async renameSection(ueCode, sectionId, newName) {
  try {
    const result = await this.UE.updateOne(
      { code: ueCode, 'sections._id': Number(sectionId) },
      { $set: { 'sections.$.nom': newName } }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Section renommée' }
      : { success: false, message: 'Section introuvable' };
  } catch (e) {
    console.error('[renameSection]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async deleteSection(ueCode, sectionId) {
  try {
    const result = await this.UE.updateOne(
      { code: ueCode },
      { $pull: { sections: { _id: Number(sectionId) } } }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Section supprimée' }
      : { success: false, message: 'Section introuvable' };
  } catch (e) {
    console.error('[deleteSection]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async addPublication(ueCode, sectionId, payload) {
    try {
        const ue = await this.UE.findOne(
            { code: ueCode, 'sections._id': Number(sectionId) },
            { projection: { 'sections.$': 1 } }
        );

        if (!ue || !ue.sections || ue.sections.length === 0) {
            return { success: false, message: 'UE ou section introuvable' };
        }

        var section = ue.sections[0];
        var publications = section.publications || [];

        var nextId = 1;
        for (var i = 0; i < publications.length; i++) {
            if (publications[i]._id >= nextId) {
                nextId = publications[i]._id + 1;
            }
        }

        var publication = {
            _id: nextId,
            publicateur_id: Number(payload.publicateur_id),
            date_publication: new Date(),
            nom : payload.nom || '',
            visible: payload.visible,
            eleves_consulte: []
        };

        if (payload.type === 'fichier') {
            publication.type = 'fichier';
            console.log(payload)
            console.log(payload.metadata.fichier)
            publication.metadata = {
                  nom_original : payload.metadata.nom_original,
                  nom_stockage : payload.metadata.nom_stockage,
                  extension:payload.metadata.extension,
                  taille:payload.metadata.taille
                
            };
        } else if (payload.type === 'annonce') {
            publication.type = 'annonce';
            publication.contenu = payload.contenu || '';
            publication.importance = payload.importance || 'faible';
        } else {
            return { success: false, message: 'Type de publication invalide' };
        }

        var result = await this.UE.updateOne(
            { code: ueCode, 'sections._id': Number(sectionId) },
            { $push: { 'sections.$.publications': publication } }
        );

        return result.modifiedCount === 1
            ? { success: true, message: 'Publication ajoutée', publication_id: nextId }
            : { success: false, message: 'Échec de l’ajout' };

    } catch (e) {
        console.error('[addPublication]', e);
        return { success: false, message: 'Erreur serveur' };
    }
}


static async deletePublication(ueCode, sectionId, publicationId) {
  try {
    const result = await this.UE.updateOne(
      { code: ueCode },
      {
        $pull: {
          'sections.$[sec].publications': { _id: Number(publicationId) }
        }
      },
      { arrayFilters: [{ 'sec._id': Number(sectionId) }] }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Publication supprimée' }
      : { success: false, message: 'Publication introuvable' };

  } catch (e) {
    console.error('[deletePublication]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async updatePublication(ueCode, sectionId, publicationId, updates) {
  try {
    // Construction de l'objet $set autorisé

    const set = {};
    if (typeof updates.visible === 'boolean')
      set['sections.$[sec].publications.$[pub].visible'] = updates.visible;
    if (updates.nom)
        set['sections.$[sec].publications.$[pub].nom'] = updates.nom;

    if (updates.type === 'annonce') {
      if (updates.contenu)
        set['sections.$[sec].publications.$[pub].contenu'] = updates.contenu;
      if (updates.importance)
        set['sections.$[sec].publications.$[pub].importance'] = updates.importance;
    }

    if (updates.type === 'fichier' && updates.metadata) {
      set['sections.$[sec].publications.$[pub].metadata'] =
        updates.metadata;
    }

    if (!Object.keys(set).length)
      return { success: false, message: 'Aucune donnée à mettre à jour' };

    const result = await this.UE.updateOne(
      { code: ueCode },
      { $set: set },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'pub._id': Number(publicationId) }
        ]
      }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Publication mise à jour' }
      : { success: false, message: 'Publication introuvable' };

  } catch (e) {
    console.error('[updatePublication]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async countUsersByUeAndRole(ueCode, role) {
    const cursor = await this.UE.find({ code: ueCode });
    const docs = await cursor.toArray();

    if (!docs.length) throw new Error('UE non trouvée');

    const ue = docs[0];
    const field = role === 2 ? 'professeurs_affectes' : 'eleves_affectes';
    return Array.isArray(ue[field]) ? ue[field].length : 0;
}

static async getAllUsersInUeDetailed(ueCode, role) {
  const cursor = await this.UE.find({ code: ueCode });
  const docs = await cursor.toArray();

  if (!docs.length) throw new Error('UE non trouvée');

  const ue = docs[0];
  const field = role === 2 ? 'professeurs_affectes' : 'eleves_affectes';
  const userIds = Array.isArray(ue[field]) ? ue[field] : [];



  return userIds;
}

static async getSection(ueCode, sectionId) {
  try {
    const ue = await this.UE.findOne(
      { code: ueCode, 'sections._id': sectionId },
      { projection: { sections: { $elemMatch: { _id: sectionId } } } }
    );

    if (!ue || !ue.sections || ue.sections.length === 0) {
      return null;
    }

    return ue.sections[0];
  } catch (e) {
    console.error('[getSection]', e);
    return null;
  }
}

static async getPublication(ueCode, sectionId, publicationId) {
  try {
    const ue = await this.UE.findOne(
      { code: ueCode, 'sections._id': sectionId },
      { projection: { sections: { $elemMatch: { _id: sectionId } } } }
    );

    if (!ue || !ue.sections || ue.sections.length === 0) {
      return null;
    }

    const section = ue.sections[0];
    const publication = section.publications?.find(pub => pub._id === publicationId);

    return publication || null;
  } catch (e) {
    console.error('[getPublication]', e);
    return null;
  }
}

static async getAllPublications(ueCode, sectionId) {
  try {
    const ue = await this.UE.findOne(
      { code: ueCode, 'sections._id': sectionId },
      { projection: { sections: { $elemMatch: { _id: sectionId } } } }
    );

    if (!ue || !ue.sections || ue.sections.length === 0) {
      return null;
    }

    return ue.sections[0].publications || [];
  } catch (e) {
    console.error('[getAllPublications]', e);
    return null;
  }
}

static async markPublicationAsSeen(code, sectionId, publicationId, eleveId) {
  try {
    const result = await this.UE.updateOne(
      { code },
      {
        $addToSet: {
          'sections.$[sec].publications.$[pub].eleves_consulte': Number(eleveId)
        }
      },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'pub._id': Number(publicationId) }
        ]
      }
    );

    return result.modifiedCount > 0;
  } catch (e) {
    console.error('[markPublicationAsSeen]', e);
    return false;
  }
}

static async getEleveStatGlobal(code, eleveId) {
  try {
    const ue = await this.UE.findOne({ code }, { projection: { sections: 1 } });
    if (!ue || !ue.sections) return null;

    let totalActions = 0;
    let actionsRealisees = 0;

    ue.sections.forEach(section => {
      // Publications
      (section.publications || []).forEach(pub => {
        if(pub.type !== 'annonce' && pub.visible === true){
          totalActions++;
        if ((pub.eleves_consulte || []).includes(Number(eleveId))) {
          actionsRealisees++;
        }
        }

      });

      // Devoirs
      (section.devoirs || []).forEach(dev => {
        totalActions++;
        if ((dev.soumissions || []).some(s => s.etudiant_id === Number(eleveId))) {
          actionsRealisees++;
        }
      });
    });

    const pourcentage = totalActions > 0 ? (actionsRealisees / totalActions) * 100 : 0;
    return { pourcentage: Number(pourcentage.toFixed(2)) };
  } catch (e) {
    console.error('[getEleveStatGlobal]', e);
    return null;
  }
}


static async getDevoir(code, sectionId, devoirId) {
  try {
    const ue = await this.UE.findOne(
      { code, 'sections._id': Number(sectionId) },
      { projection: { sections: { $elemMatch: { _id: Number(sectionId) } } } }
    );

    if (!ue || !ue.sections || ue.sections.length === 0) {
      return null;
    }

    const section = ue.sections[0];
    const devoir = section.devoirs?.find(d => d._id === Number(devoirId));

    return devoir || null;
  } catch (e) {
    console.error('[getDevoir]', e);
    return null;
  }
}
static async getAllDevoirs(code, sectionId) {
  try {
    const ue = await this.UE.findOne(
      { code, 'sections._id': Number(sectionId) },
      { projection: { sections: { $elemMatch: { _id: Number(sectionId) } } } }
    );

    if (!ue || !ue.sections?.length) return [];

    return ue.sections[0].devoirs || [];
  } catch (e) {
    console.error('[getAllDevoirs]', e);
    return [];
  }
}


static async addDevoir(code, sectionId, payload) {
  try {
    const nextId = Date.now(); // ou un autre générateur d’ID

    const devoir = {
      _id: nextId,
      titre: payload.titre,
      description: payload.description,
      publicateur_id: Number(payload.publicateur_id),
      date_creation: new Date(),
      date_limite: payload.date_limite,
      instructions: {
        taille_fichier: payload.instructions?.taille_fichier || 0,
        type_fichier: payload.instructions?.type_fichier || ''
      },
      soumissions: []
    };

    const result = await this.UE.updateOne(
      { code, 'sections._id': Number(sectionId) },
      { $push: { 'sections.$.devoirs': devoir } }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Devoir ajouté', devoir_id: nextId }
      : { success: false, message: 'Échec de l’ajout du devoir' };
  } catch (e) {
    console.error('[addDevoir]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}


static async editDevoir(code, sectionId, devoirId, updates) {
  try {
    const set = {};
    if (updates.titre)        set['sections.$[sec].devoirs.$[dev].titre'] = updates.titre;
    if (updates.description)  set['sections.$[sec].devoirs.$[dev].description'] = updates.description;
    if (updates.date_limite)  set['sections.$[sec].devoirs.$[dev].date_limite'] = updates.date_limite;
    if (updates.instructions) set['sections.$[sec].devoirs.$[dev].instructions'] = updates.instructions;

    if (!Object.keys(set).length)
      return { success: false, message: 'Aucune donnée à mettre à jour' };

    const result = await this.UE.updateOne(
      { code },
      { $set: set },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'dev._id': Number(devoirId) }
        ]
      }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Devoir modifié' }
      : { success: false, message: 'Devoir non trouvé' };
  } catch (e) {
    console.error('[editDevoir]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async deleteDevoir(code, sectionId, devoirId) {
  try {
    const result = await this.UE.updateOne(
      { code },
      {
        $pull: {
          'sections.$[sec].devoirs': { _id: Number(devoirId) }
        }
      },
      { arrayFilters: [{ 'sec._id': Number(sectionId) }] }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Devoir supprimé' }
      : { success: false, message: 'Devoir introuvable' };
  } catch (e) {
    console.error('[deleteDevoir]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}
static async _getDateLimiteDevoir(code, sectionId, devoirId) {
  const ue = await this.UE.findOne(
    { code, 'sections._id': Number(sectionId) },
    { projection: { sections: { $elemMatch: { _id: Number(sectionId) } } } }
  );

  if (!ue || !ue.sections?.length) return null;

  const devoir = ue.sections[0].devoirs?.find(d => d._id === Number(devoirId));
  return devoir?.date_limite || null;
}

static async getSoumissionForUser(ueCode, sectionId, devoirId, userId) {
  try {
    const ue = await this.UE.findOne(
      { code: ueCode },
      { projection: { sections: 1 } }
    );

    if (!ue || !ue.sections) return null;

    const section = ue.sections.find(sec => sec._id === Number(sectionId));
    if (!section || !section.devoirs) return null;

    const devoir = section.devoirs.find(d => d._id === Number(devoirId));
    if (!devoir || !devoir.soumissions) return null;

    const soumission = devoir.soumissions.find(s => s.etudiant_id === Number(userId));

    return soumission || null;
  } catch (e) {
    console.error('[getSoumissionForUser]', e);
    return null;
  }
}



static async addSoumission(code, sectionId, devoirId, payload) {
  try {
    const dateSoumission = new Date(payload.date_soumission);
    const dateLimite = await this._getDateLimiteDevoir(code, sectionId, devoirId);

    const statut = dateSoumission > new Date(dateLimite)
      ? 'en retard'
      : 'soumis';

    const nextId = Date.now(); 

    const soumission = {
      _id: nextId,
      etudiant_id: Number(payload.etudiant_id),
      date_soumission: dateSoumission,
      fichiers: payload.fichiers || [],
      statut,
      note: null,
      commentaire_prof: null,
      correcteur_id: null,
      date_correction: null
    };

    const result = await this.UE.updateOne(
      { code },
      {
        $push: {
          'sections.$[sec].devoirs.$[dev].soumissions': soumission
        }
      },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'dev._id': Number(devoirId) }
        ]
      }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Soumission ajoutée', soumission_id: nextId }
      : { success: false, message: 'Échec de la soumission' };

  } catch (e) {
    console.error('[addSoumission]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async editSoumission(code, sectionId, devoirId, soumissionId, updates, isProf = false) {
  try {
    const set = {};

    if (isProf) {
      if (updates.note !== undefined)
        set['sections.$[sec].devoirs.$[dev].soumissions.$[sou].note'] = updates.note;
      if (updates.commentaire_prof)
        set['sections.$[sec].devoirs.$[dev].soumissions.$[sou].commentaire_prof'] = updates.commentaire_prof;
      if (updates.correcteur_id)
        set['sections.$[sec].devoirs.$[dev].soumissions.$[sou].correcteur_id'] = Number(updates.correcteur_id);
      set['sections.$[sec].devoirs.$[dev].soumissions.$[sou].date_correction'] = new Date();
      set['sections.$[sec].devoirs.$[dev].soumissions.$[sou].statut'] = 'corrige';
    } else {
      // étudiant ne peut modifier que les fichiers
      if (updates.fichiers)
        set['sections.$[sec].devoirs.$[dev].soumissions.$[sou].fichiers'] = updates.fichiers;
    }

    if (!Object.keys(set).length)
      return { success: false, message: 'Aucune mise à jour' };

    const result = await this.UE.updateOne(
      { code },
      { $set: set },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'dev._id': Number(devoirId) },
          { 'sou._id': Number(soumissionId) }
        ]
      }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Soumission mise à jour' }
      : { success: false, message: 'Soumission introuvable' };
  } catch (e) {
    console.error('[editSoumission]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async deleteSoumission(code, sectionId, devoirId, soumissionId) {
  try {
    const result = await this.UE.updateOne(
      { code },
      {
        $pull: {
          'sections.$[sec].devoirs.$[dev].soumissions': { _id: Number(soumissionId) }
        }
      },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'dev._id': Number(devoirId) }
        ]
      }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Soumission supprimée' }
      : { success: false, message: 'Soumission non trouvée' };
  } catch (e) {
    console.error('[deleteSoumission]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async getAllSoumissions(code, sectionId, devoirId) {
  try {
    const ue = await this.UE.findOne(
      { code, 'sections._id': Number(sectionId) },
      { projection: { sections: { $elemMatch: { _id: Number(sectionId) } } } }
    );

    if (!ue || !ue.sections?.length) return [];

    const devoir = ue.sections[0].devoirs?.find(d => d._id === Number(devoirId));
    return devoir?.soumissions || [];
  } catch (e) {
    console.error('[getAllSoumissions]', e);
    return [];
  }
}

static async getOneSoumission(code, sectionId, devoirId, soumissionId) {
  try {
    const soums = await this.getAllSoumissions(code, sectionId, devoirId);
    return soums.find(s => s._id === Number(soumissionId)) || null;
  } catch (e) {
    console.error('[getOneSoumission]', e);
    return null;
  }
}

static async addForum(code, sectionId, forumData) {
  try {
    const ue = await this.UE.findOne(
      { code, 'sections._id': Number(sectionId) },
      { projection: { 'sections.$': 1 } }
    );

    if (!ue || !ue.sections?.length) {
      return { success: false, message: 'Section introuvable' };
    }

    const section = ue.sections[0];
    const nextId = (section.forums || []).reduce((max, f) => Math.max(max, f._id), 0) + 1;

    const newForum = {
      _id: nextId,
      titre: forumData.titre,
      description: forumData.description,
      createur_id: Number(forumData.createur_id),
      date_creation: new Date(),
      sujets: []
    };

    const result = await this.UE.updateOne(
      { code, 'sections._id': Number(sectionId) },
      { $push: { 'sections.$.forums': newForum } }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Forum créé', forum_id: nextId }
      : { success: false, message: 'Erreur à la création du forum' };

  } catch (e) {
    console.error('[addForum]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}


static async deleteForum(code, sectionId, forumId) {
  try {
    const result = await this.UE.updateOne(
      { code },
      {
        $pull: {
          'sections.$[sec].forums': { _id: Number(forumId) }
        }
      },
      { arrayFilters: [{ 'sec._id': Number(sectionId) }] }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Forum supprimé' }
      : { success: false, message: 'Forum non trouvé' };

  } catch (e) {
    console.error('[deleteForum]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async getAllForums(code, sectionId) {
  try {
    const ue = await this.UE.findOne(
      { code, 'sections._id': Number(sectionId) },
      { projection: { sections: { $elemMatch: { _id: Number(sectionId) } } } }
    );

    if (!ue || !ue.sections?.length) return [];

    return ue.sections[0].forums || [];
  } catch (e) {
    console.error('[getAllForums]', e);
    return [];
  }
}

static async getOneForum(code, sectionId, forumId) {
  try {
    const forums = await this.getAllForums(code, sectionId);
    return forums.find(f => f._id === Number(forumId)) || null;
  } catch (e) {
    console.error('[getOneForum]', e);
    return null;
  }
}

static async addSujet(code, sectionId, forumId, payload) {
  try {
    const forums = await this.getAllForums(code, sectionId);
    const forum = forums.find(f => f._id === Number(forumId));
    if (!forum) return { success: false, message: 'Forum introuvable' };

    const nextId = (forum.sujets || []).reduce((max, s) => Math.max(max, s._id), 0) + 1;

    const newSujet = {
      _id: nextId,
      titre: payload.titre,
      auteur_id: Number(payload.auteur_id),
      date_creation: new Date(),
      messages: []
    };

    const result = await this.UE.updateOne(
      { code },
      {
        $push: {
          'sections.$[sec].forums.$[forum].sujets': newSujet
        }
      },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'forum._id': Number(forumId) }
        ]
      }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Sujet créé', sujet_id: nextId }
      : { success: false, message: 'Erreur à la création du sujet' };

  } catch (e) {
    console.error('[addSujet]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}


static async deleteSujet(code, sectionId, forumId, sujetId) {
  try {
    const result = await this.UE.updateOne(
      { code },
      {
        $pull: {
          'sections.$[sec].forums.$[forum].sujets': { _id: Number(sujetId) }
        }
      },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'forum._id': Number(forumId) }
        ]
      }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Sujet supprimé' }
      : { success: false, message: 'Sujet introuvable' };

  } catch (e) {
    console.error('[deleteSujet]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async getAllSujets(code, sectionId, forumId) {
  try {
    const forum = await this.getOneForum(code, sectionId, forumId);
    return forum?.sujets || [];
  } catch (e) {
    console.error('[getAllSujets]', e);
    return [];
  }
}

static async getOneSujet(code, sectionId, forumId, sujetId) {
  try {
    const sujets = await this.getAllSujets(code, sectionId, forumId);
    return sujets.find(s => s._id === Number(sujetId)) || null;
  } catch (e) {
    console.error('[getOneSujet]', e);
    return null;
  }
}

static async addMessage(code, sectionId, forumId, sujetId, payload) {
  try {
    const sujets = await this.getAllSujets(code, sectionId, forumId);
    const sujet = sujets.find(s => s._id === Number(sujetId));
    if (!sujet) return { success: false, message: 'Sujet introuvable' };

    const nextId = (sujet.messages || []).reduce((max, m) => Math.max(max, m._id), 0) + 1;

    const message = {
      _id: nextId,
      auteur_id: Number(payload.auteur_id),
      contenu: payload.contenu,
      date_message: new Date()
    };

    const result = await this.UE.updateOne(
      { code },
      {
        $push: {
          'sections.$[sec].forums.$[forum].sujets.$[sujet].messages': message
        }
      },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'forum._id': Number(forumId) },
          { 'sujet._id': Number(sujetId) }
        ]
      }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Message ajouté', message_id: nextId }
      : { success: false, message: 'Erreur à l’ajout du message' };

  } catch (e) {
    console.error('[addMessage]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async deleteMessage(code, sectionId, forumId, sujetId, messageId) {
  try {
    const result = await this.UE.updateOne(
      { code },
      {
        $pull: {
          'sections.$[sec].forums.$[forum].sujets.$[sujet].messages': { _id: Number(messageId) }
        }
      },
      {
        arrayFilters: [
          { 'sec._id': Number(sectionId) },
          { 'forum._id': Number(forumId) },
          { 'sujet._id': Number(sujetId) }
        ]
      }
    );

    return result.modifiedCount === 1
      ? { success: true, message: 'Message supprimé' }
      : { success: false, message: 'Message non trouvé' };

  } catch (e) {
    console.error('[deleteMessage]', e);
    return { success: false, message: 'Erreur serveur' };
  }
}

static async getAllMessages(code, sectionId, forumId, sujetId) {
  try {
    const sujet = await this.getOneSujet(code, sectionId, forumId, sujetId);
    return sujet?.messages || [];
  } catch (e) {
    console.error('[getAllMessages]', e);
    return [];
  }
}

static async getOneMessage(code, sectionId, forumId, sujetId, messageId) {
  try {
    const messages = await this.getAllMessages(code, sectionId, forumId, sujetId);
    return messages.find(m => m._id === Number(messageId)) || null;
  } catch (e) {
    console.error('[getOneMessage]', e);
    return null;
  }
}




}


module.exports = UeDAO;