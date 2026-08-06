using System.Collections.Generic;
using Cabinet.Models;

namespace Cabinet.Core.Data.Interfaces
{
    public interface INotificationRepository
    {
        void InsertNotification(Core.Models.NotificationRecord n);
        List<Core.Models.NotificationRecord> GetNotifications(int userId, int limit = 50);
        void MarkNotificationAsRead(int id);
        void MarkAllNotificationsAsRead(int userId);
        
        List<PushSubscription> GetPushSubscriptions(int userId);
        void InsertPushSubscription(PushSubscription sub);
        void DeletePushSubscription(string endpoint);
    }
}
