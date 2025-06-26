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
            forums: [],
            devoirs: []
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

static async AffecterAndDesaffecterUserToUe(ueCode, userId, role, action = 'add') {
    try {
        const field = role === 2 ? 'professeurs_affectes' : 'eleves_affectes';
        if (!field) throw new Error('Rôle invalide');

        const numericUserId = Number(userId);
        if (isNaN(numericUserId)) throw new Error('userId non numérique');

        const operator = action === 'remove' ? '$pull' : '$addToSet';

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
  professeurs_affectes = []
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
        await this.AffecterAndDesaffecterUserToUe(code, id, role, 'add');
      }
      // remove
      for (const id of toRemove) {
        await this.AffecterAndDesaffecterUserToUe(code, id, role, 'remove');
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
            publication.metadata = {
                fichier: payload.metadata.fichier
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

    if (updates.type === 'annonce') {
      if (updates.titre)
        set['sections.$[sec].publications.$[pub].titre'] = updates.titre;
      if (updates.contenu)
        set['sections.$[sec].publications.$[pub].contenu'] = updates.contenu;
      if (updates.importance)
        set['sections.$[sec].publications.$[pub].importance'] = updates.importance;
    }

    if (updates.type === 'fichier' && updates.metadata?.fichier) {
      set['sections.$[sec].publications.$[pub].metadata.fichier'] =
        updates.metadata.fichier;
      if (updates.nom)
        set['sections.$[sec].publications.$[pub].nom'] = updates.nom;
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


}

module.exports = UeDAO;