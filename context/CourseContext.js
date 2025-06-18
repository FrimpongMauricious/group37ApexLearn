import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUserEmail } from '../utils/storageUtils';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [userCourses, setUserCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const init = async () => {
      const userEmail = await getCurrentUserEmail();
      setEmail(userEmail);
      if (userEmail) loadCourses(userEmail);
    };
    init();
  }, []);

  const loadCourses = async (email) => {
    try {
      const userCoursesKey = `userCourses_${email}`;
      const enrolledKey = `enrolledCourses_${email}`;
      const wishlistKey = `wishlist_${email}`;

      const storedUserCourses = await AsyncStorage.getItem(userCoursesKey);
      const storedEnrolled = await AsyncStorage.getItem(enrolledKey);
      const storedWishlist = await AsyncStorage.getItem(wishlistKey);

      if (storedUserCourses) setUserCourses(JSON.parse(storedUserCourses));
      if (storedEnrolled) setEnrolledCourses(JSON.parse(storedEnrolled));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (err) {
      console.error('Error loading courses:', err);
    }
  };

  const saveToStorage = async (keyBase, data) => {
    if (!email) return;
    try {
      await AsyncStorage.setItem(`${keyBase}_${email}`, JSON.stringify(data));
    } catch (err) {
      console.error(`Error saving ${keyBase}:`, err);
    }
  };

  const addCourse = (newCourse) => {
    const updated = [newCourse, ...userCourses];
    setUserCourses(updated);
    saveToStorage('userCourses', updated);
  };

  const enrollInCourse = (course) => {
    const updated = [course, ...enrolledCourses];
    setEnrolledCourses(updated);
    saveToStorage('enrolledCourses', updated);
  };

  const addToWishlist = (course) => {
    const updated = [course, ...wishlist];
    setWishlist(updated);
    saveToStorage('wishlist', updated);
  };

  const removeFromWishlist = (courseId) => {
    const updated = wishlist.filter(item => item.id !== courseId);
    setWishlist(updated);
    saveToStorage('wishlist', updated);
  };

  return (
    <CourseContext.Provider
      value={{
        userCourses,
        enrolledCourses,
        wishlist,
        addCourse,
        enrollInCourse,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
