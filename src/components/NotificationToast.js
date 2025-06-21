// src/components/NotificationToast.js
import React from 'react';

export const NotificationToast = ({ notification }) => (
  <div className="fixed bottom-4 right-4 bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-lg animate-slide-up">
    <p className="text-white">{notification.message}</p>
  </div>
);
