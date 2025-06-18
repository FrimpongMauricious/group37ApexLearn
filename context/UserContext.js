import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUserEmail } from '../utils/storageUtils';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
    contact: '',
    profilePicture: null,
    email: '',
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const init = async () => {
      const email = await getCurrentUserEmail();
      if (email) loadUserData(email);
    };
    init();
  }, []);

  const loadUserData = async (email) => {
    try {
      const profileKey = `userProfile_${email}`;
      const notifyKey = `userNotifications_${email}`;

      const savedUser = await AsyncStorage.getItem(profileKey);
      const savedNotifs = await AsyncStorage.getItem(notifyKey);

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const saveUserData = async (data) => {
    try {
      const key = `userProfile_${data.email}`;
      await AsyncStorage.setItem(key, JSON.stringify(data));
      await AsyncStorage.setItem('lastLoggedInEmail', data.email);
    } catch (err) {
      console.error('Error saving user profile:', err);
    }
  };

  const saveNotifications = async (email, list) => {
    try {
      await AsyncStorage.setItem(`userNotifications_${email}`, JSON.stringify(list));
    } catch (err) {
      console.error('Error saving notifications:', err);
    }
  };

  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    saveUserData(updatedUser);
  };

  const addNotification = (message) => {
    const newNotifs = [...notifications, { id: Date.now(), message }];
    setNotifications(newNotifs);
    if (user?.email) saveNotifications(user.email, newNotifs);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        notifications,
        addNotification,
        loadUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
