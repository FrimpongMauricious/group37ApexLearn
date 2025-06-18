// utils/storageUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentUserEmail = async () => {
  try {
    const email = await AsyncStorage.getItem('lastLoggedInEmail');
    return email || '';
  } catch (err) {
    console.error('Error getting current user email:', err);
    return '';
  }
};
