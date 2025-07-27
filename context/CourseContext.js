import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getCurrentUserEmail } from '../utils/storageUtils';
import { courses, trending, Recommended } from '../screens/AvailableCourses';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [userCourses, setUserCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const userEmail = await getCurrentUserEmail();
      setEmail(userEmail);

      if (userEmail) {
        try {
          const res = await axios.get(`https://10.132.178.11:8080/api/users/email/${userEmail}`);
          const fetchedId = res.data.id;
          setUserId(fetchedId);

          loadCourses(userEmail, fetchedId);
        } catch (err) {
          console.error('Error fetching userId by email:', err.message);
        }
      }
    };
    init();
  }, []);

  const loadCourses = async (email, id) => {
    try {
      const userCoursesKey = `userCourses_${email}`;
      const enrolledKey = `enrolledCourses_${email}`;
      const wishlistKey = `wishlist_${email}`;

      const storedEnrolled = await AsyncStorage.getItem(enrolledKey);
      const storedWishlist = await AsyncStorage.getItem(wishlistKey);

      if (storedEnrolled) setEnrolledCourses(JSON.parse(storedEnrolled));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      // Fetch user's uploaded courses from backend
      const res = await axios.get(`https://updatedapexlearnbackend-1.onrender.com/api/courses/user/${id}`);
      const remoteUserCourses = res.data || [];
      setUserCourses(remoteUserCourses);
      await AsyncStorage.setItem(userCoursesKey, JSON.stringify(remoteUserCourses));
    } catch (err) {
      console.error('Error loading courses:', err.message);
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

    const allAvailable = [...courses, ...trending, ...Recommended];
    const fullCourse = allAvailable.find(c => c.id === course.id);

    const courseWithProgress = {
      ...course,
      videoUrl: fullCourse?.videoUrl || '',
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
