import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Trash2, Check, CheckSquare } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { mockNotifications as initialNotifications } from '../../data/mockNotifications';
import { Notification } from '../../types';

export const NotificationPanel = () => {
  const { notificationsPanelOpen, closeNotificationsPanel } = useUIStore();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    // Fallback if future
    if (diffMins < 0) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  const typeIcons = {
    info: '🔵',
    success: '🟢',
    warning: '🟡',
    error: '🔴'
  };

  return (
    <AnimatePresence>
      {notificationsPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={closeNotificationsPanel}
            className="fixed inset-0 z-40 bg-black"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-brand-blue" />
                <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button 
                onClick={closeNotificationsPanel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex justify-between text-xs">
                <button 
                  onClick={markAllAsRead} 
                  className="flex items-center text-brand-blue hover:underline font-semibold"
                >
                  <CheckSquare className="h-3.5 w-3.5 mr-1" /> Mark all read
                </button>
                <button 
                  onClick={clearAll} 
                  className="flex items-center text-red-500 hover:underline font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear all
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-colors relative hover:bg-slate-50 dark:hover:bg-slate-800/30 ${
                      !notification.read ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
                    }`}
                  >
                    {!notification.read && (
                      <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-brand-blue" />
                    )}
                    <div className="flex items-start">
                      <span className="text-base mr-2 flex-shrink-0">
                        {typeIcons[notification.type]}
                      </span>
                      <div className="flex-1 min-w-0 pr-4">
                        <p className={`text-sm font-semibold text-primary dark:text-primary-dark ${
                          !notification.read ? 'text-blue-900 dark:text-blue-200' : ''
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                          {notification.message}
                        </p>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 block mt-2">
                          {timeAgo(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="absolute bottom-4 right-4 p-1 rounded-md text-gray-400 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-950 text-[10px] flex items-center border border-slate-200 dark:border-slate-800"
                      >
                        <Check className="h-3 w-3 mr-0.5" /> Mark read
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                  <Bell className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">All caught up!</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No new notifications at this time.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
