class LogDAO {
  static LOGS;

  static async injectDB(conn) {
    if (this.LOGS) return;
    try {
      this.LOGS = await conn.db(process.env.MONGODB_DB).collection('Logs');
    } catch (e) {
      console.error('Erreur connexion à la collection logs:', e);
    }
  }

  static async addLog({ utilisateur_id, action, code_matiere = null, date_action = new Date() }) {
    try {
      const log = {
        utilisateur_id: Number(utilisateur_id),
        action,
        date_action: new Date(date_action),
      };

      if (code_matiere) log.code_matiere = code_matiere;

      const result = await this.LOGS.insertOne(log);
      return {
        success: true,
        message: 'Log ajouté',
        log_id: result.insertedId
      };
    } catch (e) {
      console.error('[addLog]', e);
      return { success: false, message: 'Erreur serveur' };
    }
  }

  static async getAllLogs() {
    try {
      return await this.LOGS.find().sort({ date_action: -1 }).toArray();
    } catch (e) {
      console.error('[getAllLogs]', e);
      return [];
    }
  }

  static async getLogsByUser(userId) {
    try {
      return await this.LOGS.find({ utilisateur_id: Number(userId) })
        .sort({ date_action: -1 })
        .toArray();
    } catch (e) {
      console.error('[getLogsByUser]', e);
      return [];
    }
  }
}

module.exports = LogDAO;
