
class NotificationDAO {
  static Notifications;

  static async injectDB(conn) {
    if (this.Notifications) return;
    try {
      this.Notifications = await conn.db(process.env.MONGODB_DB).collection('Notifications');
    } catch (e) {
      console.error('Erreur connexion à la collection notifications:', e);
    }
  }

  static async addNotification(payload) {
    try {
      const notif = {
        ...payload,
        date_notif: new Date(payload.date_notif || Date.now())
      };

      const result = await this.Notifications.insertOne(notif);
      return {
        success: true,
        message: 'Notification ajoutée',
        notification_id: result.insertedId
      };
    } catch (e) {
      console.error('[addNotification]', e);
      return { success: false, message: 'Erreur serveur' };
    }
  }

  static async getAllNotifications() {
    try {
      return await this.Notifications.find().sort({ date_notif: -1 }).toArray();
    } catch (e) {
      console.error('[getAllNotifications]', e);
      return [];
    }
  }

  static async getNotificationsForUser(userId, userRole) {
    try {
      const id = Number(userId);
      const query = {
        $or: [
          { type_destinataire: 'individuelle', destinataire_id: id },
          { type_destinataire: 'groupe', destinataire_groupe_id: userRole }
        ]
      };

      return await this.Notifications.find(query).sort({ date_notif: -1 }).toArray();
    } catch (e) {
      console.error('[getNotificationsForUser]', e);
      return [];
    }
  }
}

module.exports = NotificationDAO;
