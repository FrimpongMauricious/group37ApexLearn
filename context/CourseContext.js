import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUserEmail } from '../utils/storageUtils';
import { courses, trending, Recommended } from '../screens/AvailableCourses';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [userCourses, setUserCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const init = async () => {
      const userEmail = await getCurrentUserEmail();
      if (userEmail) {
        setEmail(userEmail);
        await loadCourses(userEmail);
      }
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
      console.error('Error loading courses from storage:', err.message);
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
    const alreadyExists = userCourses.some(course => course.id === newCourse.id);
    if (alreadyExists) return;

    const updated = [newCourse, ...userCourses];
    setUserCourses(updated);
    saveToStorage('userCourses', updated);
  };

  const enrollInCourse = (course) => {
    const alreadyExists = enrolledCourses.some(c => c.id === course.id);
    if (alreadyExists) return;

    const allAvailable = [...courses, ...trending, ...Recommended, ...userCourses];
    const fullCourse = allAvailable.find(c => c.id === course.id);

    const courseWithProgress = {
      ...course,
      videoUrl: fullCourse?.videoUrl || course.videoUrl || '',
      progress: 0,
    };

    const updated = [courseWithProgress, ...enrolledCourses];
    setEnrolledCourses(updated);
    saveToStorage('enrolledCourses', updated);
  };

  const updateCourseProgress = (courseId, newProgress) => {
    const updated = enrolledCourses.map((course) =>
      course.id === courseId ? { ...course, progress: newProgress } : course
    );
    setEnrolledCourses(updated);
    saveToStorage('enrolledCourses', updated);
  };

  const addToWishlist = (course) => {
    const alreadyExists = wishlist.some(c => c.id === course.id);
    if (alreadyExists) return;

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
        updateCourseProgress,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
