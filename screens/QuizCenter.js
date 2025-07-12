import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizBank } from '../screens/QuizBank'; // import the QuizBank
import { quizTitleMap } from '../utils/quizMap'; // import the map

const QuizCenterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { course } = route.params || {};
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) setUserEmail(email);
    };
    fetchEmail();
  }, []);

  const handleStartQuiz = async () => {
    if (!course || !course.id) {
      Alert.alert('Error', 'Course information is missing.');
      return;
    }

    const courseKey = quizTitleMap[course.id]; // Map ID to correct QuizBank key

    if (!courseKey || !QuizBank[courseKey]) {
      Alert.alert('Unavailable', 'No quiz available for this course.');
      return;
    }

    const questions = QuizBank[courseKey];
    const attemptKey = `quizScore_${userEmail}_${course.id}`;
    const attemptCountKey = `${userEmail}_${course.id}_attempts`;
    const attempts = parseInt(await AsyncStorage.getItem(attemptCountKey)) || 0;

    if (attempts >= 5) {
      Alert.alert('Limit Reached', 'You have reached the maximum of 5 attempts for this quiz.');
      return;
    }

    navigation.navigate('QuizScreen', {
      courseId: course.id,
      questions,
      attemptKey,
      attemptCountKey,
      attemptNumber: attempts + 1,
      courseName: course.name,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📘 {course?.name}</Text>
      <Text style={styles.info}>You're about to take a quiz for this course.</Text>

      <TouchableOpacity style={styles.button} onPress={handleStartQuiz}>
        <Text style={styles.buttonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizCenterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FF',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
