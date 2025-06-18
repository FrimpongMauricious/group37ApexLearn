import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUserEmail } from '../utils/storageUtils';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const email = await getCurrentUserEmail();
    try {
      const stored = await AsyncStorage.getItem(`notifications_${email}`);
      if (stored) setNotifications(JSON.parse(stored));
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
  };

  const saveNotifications = async (newNotifications) => {
    const email = await getCurrentUserEmail();
    try {
      await AsyncStorage.setItem(`notifications_${email}`, JSON.stringify(newNotifications));
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  };

  const addNotification = async (message) => {
    const newNote = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toISOString(),
    };
    const updated = [newNote, ...notifications];
    setNotifications(updated);
    await saveNotifications(updated);
  };

  const deleteNotification = async (id) => {
    const updated = notifications.filter((note) => note.id !== id);
    setNotifications(updated);
    await saveNotifications(updated);
  };

  const markAllAsRead = async () => {
    setNotifications([]);
    const email = await getCurrentUserEmail();
    await AsyncStorage.removeItem(`notifications_${email}`);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      deleteNotification,
      markAllAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
