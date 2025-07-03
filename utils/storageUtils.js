import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Get last logged-in user's email from AsyncStorage
export const getCurrentUserEmail = async () => {
  try {
    const email = await AsyncStorage.getItem('lastLoggedInEmail');
    return email;
  } catch (error) {
    console.error('Error retrieving current user email:', error);
    return null;
  }
};

// ✅ You can add more utilities here later if needed
