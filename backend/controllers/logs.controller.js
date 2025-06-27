const LogDAO = require('../Dao/LogsDao');

class LogController {
  static async addLog(req, res) {
    try {
      const result = await LogDAO.addLog(req.body);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (e) {
      console.error('[addLog]', e);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async getAllLogs(req, res) {
    try {
      const result = await LogDAO.getAllLogs();
      return res.status(200).json(result);
    } catch (e) {
      console.error('[getAllLogs]', e);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async getLogsByUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await LogDAO.getLogsByUser(userId);
      return res.status(200).json(result);
    } catch (e) {
      console.error('[getLogsByUser]', e);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

}

module.exports = LogController;
