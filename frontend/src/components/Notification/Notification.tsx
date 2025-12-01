import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationItem = ({ notification, onClose }: NotificationItemProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onClose]);

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-[#1F7D53]',
          border: 'border-[#1F7D53]',
          text: 'text-white',
          icon: '✓'
        };
      case 'error':
        return {
          bg: 'bg-[#8B2E2E]',
          border: 'border-[#8B2E2E]',
          text: 'text-white',
          icon: '✕'
        };
      case 'warning':
        return {
          bg: 'bg-[#8B6F2E]',
          border: 'border-[#8B6F2E]',
          text: 'text-white',
          icon: '⚠'
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#2C3930]',
          border: 'border-[#181C14]',
          text: 'text-white',
          icon: 'ℹ'
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} ${styles.text}
        border rounded-lg px-4 py-3 mb-3
        shadow-lg min-w-[300px] max-w-[500px]
        flex items-center gap-3
        animate-slide-in-right
        font-mono
      `}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg font-bold">
        {styles.icon}
      </div>
      <div className="flex-1 text-sm">{notification.message}</div>
      <button
        onClick={() => onClose(notification.id)}
        className="flex-shrink-0 text-white/70 hover:text-white transition-colors text-lg font-bold"
      >
        ×
      </button>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

const NotificationContainer = ({ notifications, onClose }: NotificationContainerProps) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col-reverse">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;

