// screens/QuizScreen.js

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';

const QuizScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    courseId,
    questions = [],
    attemptKey,
    attemptCountKey,
    attemptNumber,
    courseName,
  } = route.params || {};

  const { user } = useContext(UserContext);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(30);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleNext();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }

    setSelectedOption(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const percentage = Math.round((score / questions.length) * 100);
    setQuizComplete(true);

    try {
      await AsyncStorage.setItem(attemptKey, percentage.toString());
      await AsyncStorage.setItem(attemptCountKey, attemptNumber.toString());
    } catch (err) {
      console.error('Error saving quiz score:', err);
    }

    Alert.alert(
      'Quiz Completed',
      `You scored ${percentage}%. ${percentage >= 80 ? '✅ You passed!' : '❌ Try again to score at least 80%.'}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (quizComplete) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.courseTitle}>{courseName}</Text>
      <Text style={styles.questionCount}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>
      <Text style={styles.timer}>⏳ {timer}s</Text>

      <Text style={styles.question}>{currentQuestion.question}</Text>

      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOption === option && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.nextButton, !selectedOption && { backgroundColor: '#ccc' }]}
        onPress={handleNext}
        disabled={!selectedOption}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    padding: 20,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionCount: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 6,
  },
  timer: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '600',
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 10,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#A5D6A7',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
