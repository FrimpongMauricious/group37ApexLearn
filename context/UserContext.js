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
  const [userPoints, setUserPoints] = useState(0);
  const [badgeLevel, setBadgeLevel] = useState(null); // blue, green, gold

  useEffect(() => {
    const init = async () => {
      const email = await getCurrentUserEmail();
      if (email) {
        loadUserData(email);
        fetchUserPoints(email);
      }
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

  const fetchUserPoints = async (email) => {
    try {
      const key = `userPoints_${email}`;
      const stored = await AsyncStorage.getItem(key);
      const total = stored ? parseInt(stored) : 0;
      setUserPoints(total);

      if (total >= 5000) setBadgeLevel('gold');
      else if (total >= 3000) setBadgeLevel('green');
      else if (total >= 1000) setBadgeLevel('blue');
      else setBadgeLevel(null);
    } catch (err) {
      console.error('Error fetching user points:', err);
    }
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
        userPoints,
        badgeLevel,
        fetchUserPoints,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
