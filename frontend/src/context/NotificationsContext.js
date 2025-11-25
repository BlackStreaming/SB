import React, { createContext, useContext, useState } from 'react';

const NotificationsContext = createContext([]);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const value = { notifications, setNotifications };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationsContext);
