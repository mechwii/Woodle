const NotificationDAO = require('../Dao/NotificationsDao')

class NotificationController {
  static async addNotification(req, res) {
    try {
      const result = await NotificationDAO.addNotification(req.body);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (e) {
      console.error('[addNotification]', e);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async getAllNotifications(req, res) {
    try {
      const result = await NotificationDAO.getAllNotifications();
      return res.status(200).json(result);
    } catch (e) {
      console.error('[getAllNotifications]', e);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async getNotificationsForUser(req, res) {
    try {
      const { user_id, role } = req.params;
      const result = await NotificationDAO.getNotificationsForUser(user_id, role);
      return res.status(200).json(result);
    } catch (e) {
      console.error('[getNotificationsForUser]', e);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

module.exports = NotificationController;
