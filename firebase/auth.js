// firebase/auth.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCqcC7E90_wLQYH7e11Iua3kdiApgQnw9Y",
  authDomain: "tryingtheauthentication.firebaseapp.com",
  projectId: "tryingtheauthentication",
  storageBucket: "tryingtheauthentication.firebasestorage.app",
  messagingSenderId: "186616897804",
  appId: "1:186616897804:web:ee64b300f7dd1bfa12e929"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

//  Always initialize Auth manually with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 🔐 Register and send email verification
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential;
};

// Login
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// 🔓 Logout
export const logoutUser = async () => {
  await signOut(auth);
};

export { auth };
