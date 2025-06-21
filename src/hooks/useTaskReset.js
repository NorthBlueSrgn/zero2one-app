// src/hooks/useTaskReset.js
import { useEffect } from 'react';

export const useTaskReset = (setPaths) => {
  useEffect(() => {
    const getWeekStart = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      return d.toISOString().split('T')[0];
    };

    const checkResets = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentWeekStart = getWeekStart(now);

      setPaths(prevPaths => prevPaths.map(path => {
        let updated = { ...path };

        // Daily reset
        if (path.lastDailyReset !== today) {
          updated.dailyTasks = updated.dailyTasks.map(task => ({
            ...task,
            completed: false
          }));
          updated.lastDailyReset = today;
        }

        // Weekly reset
        if (path.lastWeeklyReset !== currentWeekStart) {
          updated.weeklyTasks = updated.weeklyTasks.map(task => ({
            ...task,
            completedCount: 0
          }));
          updated.lastWeeklyReset = currentWeekStart;
        }

        return updated;
      }));
    };

    const interval = setInterval(checkResets, 60000); // Check every minute
    checkResets(); // Initial check

    return () => clearInterval(interval);
  }, [setPaths]);
};

// src/hooks/useNotifications.js
import { useState, useCallback } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  return { notifications, addNotification };
};
