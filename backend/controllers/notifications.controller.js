const NotificationDAO = require('../Dao/NotificationsDao')
const UserServices = require('../services/user.services')

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
      const { user_id } = req.params;
      const roles = await UserServices.getUserRoles(user_id)
      const realRoles = roles.map(r => r.id_role)
      if(!realRoles) res.status(404).json({success : false, message : 'Erreur lors de la récupération des roles pour notifications'})
      const result = await NotificationDAO.getNotificationsForUser(user_id, realRoles);
      return res.status(200).json(result);
    } catch (e) {
      console.error('[getNotificationsForUser]', e);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

module.exports = NotificationController;
