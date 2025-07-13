import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizBank } from '../screens/QuizBank';
import { quizTitleMap } from '../utils/quizMap';
import Icon from 'react-native-vector-icons/Feather';

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

    const courseKey = quizTitleMap[course.id];

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
    <ImageBackground
      source={require('../assets/wavy.png')} // add your wave image here
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image source={require('../assets/apexLearn2.png')} style={styles.logo} />
        <Text style={styles.title}>Start Quiz</Text>
        <Text style={styles.subtitle}> {course?.name}</Text>

        <TouchableOpacity style={styles.button} onPress={handleStartQuiz}>
          <Text style={styles.buttonText}>Start</Text>
          <Icon name="chevron-right" size={20} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default QuizCenterScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,10,0.1)',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  logo: {
    height: 120,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0b392c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
