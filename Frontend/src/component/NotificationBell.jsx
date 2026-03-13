import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineBell, HiOutlineCheck, HiOutlineEye, HiOutlineTrash, HiOutlineInbox } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../services/notificationAPI.js';

const formatNotificationTime = (timestamp) => {
  if (!timestamp) {
    return 'Just now';
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export default function NotificationBell({ mobile = false }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef(null);

  const fetchNotifications = async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      setError('');
    }

    try {
      const response = await notificationAPI.getNotifications(1, 6, false);
      const nextNotifications = response?.data || [];
      const nextUnreadCount = typeof response?.unreadCount === 'number'
        ? response.unreadCount
        : nextNotifications.filter((notification) => !notification.isRead).length;

      setNotifications(nextNotifications);
      setUnreadCount(nextUnreadCount);
    } catch (requestError) {
      if (!silent) {
        setError(requestError.message || 'Failed to load notifications');
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();

    const intervalId = window.setInterval(() => {
      fetchNotifications({ silent: true });
    }, 10000);

    const handleWindowFocus = () => {
      fetchNotifications({ silent: true });
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || mobile) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, mobile]);

  const handleToggle = async () => {
    const nextOpenState = !isOpen;
    setIsOpen(nextOpenState);

    if (nextOpenState) {
      await fetchNotifications({ silent: notifications.length > 0 });
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    const target = notifications.find((notification) => notification.id === notificationId);

    if (!target || target.isRead) {
      return;
    }

    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((current) => current.map((notification) => (
        notification.id === notificationId
          ? { ...notification, isRead: 1 }
          : notification
      )));
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (requestError) {
      setError(requestError.message || 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((current) => current.map((notification) => ({
        ...notification,
        isRead: 1
      })));
      setUnreadCount(0);
    } catch (requestError) {
      setError(requestError.message || 'Failed to mark notifications as read');
    }
  };

  const handleDeleteNotification = async (event, notificationId) => {
    event.stopPropagation();

    const target = notifications.find((notification) => notification.id === notificationId);

    try {
      await notificationAPI.deleteNotification(notificationId);
      setNotifications((current) => current.filter((notification) => notification.id !== notificationId));

      if (target && !target.isRead) {
        setUnreadCount((current) => Math.max(0, current - 1));
      }
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete notification');
    }
  };

  const handleOpenItem = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    if (notification.itemId) {
      navigate(`/item/${notification.itemId}`);
      setIsOpen(false);
    }
  };

  const panelClasses = mobile
    ? 'mt-3 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-lg'
    : 'absolute right-0 top-full mt-3 w-96 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-2xl';

  const buttonClasses = mobile
    ? 'relative flex w-full items-center justify-between rounded-lg px-4 py-2 font-semibold text-green-600 hover:bg-green-50 transition'
    : 'relative flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition';

  return (
    <div className={mobile ? 'w-full' : 'relative'} ref={containerRef}>
      <motion.button
        type="button"
        onClick={handleToggle}
        className={buttonClasses}
        whileHover={{ scale: 1.05 }}
      >
        <span className="relative flex items-center gap-2">
          <HiOutlineBell className="text-xl" />
          <span>{mobile ? 'Notifications' : 'Alerts'}</span>
          {unreadCount > 0 && (
            <span className="absolute -right-3 -top-2 min-w-5 rounded-full bg-red-500 px-1.5 text-center text-xs font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={panelClasses}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="flex items-center justify-between border-b border-green-100 px-4 py-3">
              <div>
                <p className="font-semibold text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Mark all read
                </button>
              )}
            </div>

            {loading ? (
              <div className="px-4 py-6 text-sm text-gray-500">Loading notifications...</div>
            ) : error ? (
              <div className="px-4 py-6 text-sm text-red-600">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-gray-500">
                <HiOutlineInbox className="text-3xl text-green-400" />
                <p>No notifications yet.</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-green-50 px-4 py-3 transition hover:bg-green-50/60 ${
                      notification.isRead ? 'bg-white' : 'bg-green-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenItem(notification)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                          )}
                          <p className="text-sm font-semibold text-gray-900">{notification.message}</p>
                        </div>
                        <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">{notification.type.replace('_', ' ')}</p>
                        <p className="mt-1 text-xs text-gray-500">{formatNotificationTime(notification.createdAt)}</p>
                      </button>

                      <button
                        type="button"
                        onClick={(event) => handleDeleteNotification(event, notification.id)}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete notification"
                      >
                        <HiOutlineTrash className="text-lg" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-200"
                        >
                          <HiOutlineCheck /> Mark read
                        </button>
                      )}

                      {notification.itemId && (
                        <button
                          type="button"
                          onClick={() => handleOpenItem(notification)}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                        >
                          <HiOutlineEye /> View item
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}