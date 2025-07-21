import {
  StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Platform, ScrollView, Image, Alert
} from 'react-native';
import React, { useState, useContext } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TextInput } from 'react-native-gesture-handler';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const CourseCreation = ({ navigation }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [numLessons, setNumLessons] = useState('');
  const [videoInputs, setVideoInputs] = useState([]);

  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [organization, setOrganization] = useState('');

  const { user } = useContext(UserContext);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  const handleLessonCountChange = (value) => {
    setNumLessons(value);
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const newInputs = Array.from({ length: count }, (_, index) => ({ id: index + 1, url: '' }));
      setVideoInputs(newInputs);
    } else {
      setVideoInputs([]);
    }
  };

  const handleLessonUrlChange = (id, text) => {
    const updated = videoInputs.map((item) => item.id === id ? { ...item, url: text } : item);
    setVideoInputs(updated);
  };

  const handleProceedToPayment = async () => {
    if (!thumbnail || !courseName || !description || !tutorName || !organization || !numLessons || videoInputs.some(v => !v.url)) {
      Alert.alert('Incomplete', 'Please fill out all fields and provide video URLs for all lessons.');
      return;
    }

    const courseData = {
      title: courseName,
      tutorName,
      organizationName: organization,
      imageUrl: thumbnail,
      videoPath: videoInputs[0].url,
      description,
      uploadedBy: {
        id: user?.id || 1,
      },
    };

    console.log('📤 Sending to backend:', courseData);

    try {
      await axios.post('http://10.149.20.213:8080/api/courses', courseData);
      console.log('✅ Course posted successfully');
    } catch (error) {
      console.error('❌ Failed to post course:', error.response?.data || error.message);
    }

    navigation.navigate('makePayment', { type: 'upload', newCourse: courseData });
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#fff" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
              <View style={{ flex: 1 }}>
                <View style={styles.courseImageView}>
                  {thumbnail ? (
                    <Image source={{ uri: thumbnail }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
                  ) : (
                    <>
                      <Text style={{ color: 'grey', fontSize: 20, textAlign: 'center' }}>
                        Upload a catchy thumbnail to attract more students to pursue your course
                      </Text>
                      <TouchableOpacity style={{ marginTop: 40 }} onPress={pickImage}>
                        <Text style={{ color: 'blue', fontWeight: 'bold' }}>Select from device</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                <TextInput style={styles.input} placeholder="Course name" value={courseName} onChangeText={setCourseName} />
                <TextInput style={styles.input} placeholder="Tutor name" value={tutorName} onChangeText={setTutorName} />
                <TextInput style={styles.input} placeholder="Organization name" value={organization} onChangeText={setOrganization} />
                <TextInput style={styles.input} placeholder="Course description" value={description} onChangeText={setDescription} />
                <TextInput style={styles.input} placeholder="Number of lessons" keyboardType="numeric" value={numLessons} onChangeText={handleLessonCountChange} />

                {videoInputs.length > 0 && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Paste Lesson Video URLs</Text>
                    {videoInputs.map((input) => (
                      <TextInput
                        key={input.id}
                        placeholder={`Lesson ${input.id} Video URL`}
                        style={styles.videoInput}
                        value={input.url}
                        onChangeText={(text) => handleLessonUrlChange(input.id, text)}
                      />
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.touhcable} onPress={handleProceedToPayment}>
                  <Text style={styles.touchText}>Proceed to Payment</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default CourseCreation;

const styles = StyleSheet.create({
  courseImageView: {
    width: '100%', height: 200, borderRadius: 12, backgroundColor: '#e9f5f9',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10,
    marginTop: 20, marginBottom: 40, borderWidth: 3, elevation: 10,
    borderStyle: 'dashed', overflow: 'hidden',
  },
  input: {
    width: '100%', height: 50, borderRadius: 12, backgroundColor: '#e9f5f9',
    paddingHorizontal: 10, marginTop: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#ccc',
  },
  videoInput: {
    width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 10, borderWidth: 1, borderColor: '#aaa', marginBottom: 15,
  },
  touhcable: {
    width: '100%', height: 55, borderRadius: 12, backgroundColor: 'green',
    paddingHorizontal: 10, marginTop: 20, marginBottom: 20, borderWidth: 1,
    borderColor: '#ccc', justifyContent: 'center',
  },
  touchText: {
    color: 'white', fontSize: 20, fontStyle: 'italic', textAlign: 'center',
  },
});
