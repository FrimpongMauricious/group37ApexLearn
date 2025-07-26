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
import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseCreation = ({ navigation }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [organization, setOrganization] = useState('');
  const [price, setPrice] = useState('');

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

  const handleProceedToPayment = async () => {
    if (!thumbnail || !courseName || !description || !tutorName || !organization || !price || !videoUrl) {
      Alert.alert('Incomplete', 'Please fill out all fields including price and video URL.');
      return;
    }

    const courseData = {
      title: courseName,
      tutorName,
      organizationName: organization,
      imageUrl: thumbnail,
      videoPath: videoUrl,
      description,
      price: parseFloat(price),
      uploadedBy: {
        id: user?.id || 1,
      },
    };

    console.log('📤 Sending to backend:', courseData);

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        'https://updatedapexlearnbackend-1.onrender.com/api/courses',
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('✅ Course posted successfully');
      navigation.navigate('makePayment', { type: 'upload', newCourse: courseData });

    } catch (error) {
      console.error('❌ Failed to post course:', error.response?.data || error.message);
      //  Alert.alert("Error", JSON.stringify(error.response?.data || error.message));
    }
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
                <TextInput style={styles.input} placeholder="Course price (e.g. 9.99)" keyboardType="numeric" value={price} onChangeText={setPrice} />
                <TextInput style={styles.input} placeholder="Course video URL" value={videoUrl} onChangeText={setVideoUrl} />

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
  touhcable: {
    width: '100%', height: 55, borderRadius: 12, backgroundColor: 'green',
    paddingHorizontal: 10, marginTop: 20, marginBottom: 20, borderWidth: 1,
    borderColor: '#ccc', justifyContent: 'center',
  },
  touchText: {
    color: 'white', fontSize: 20, fontStyle: 'italic', textAlign: 'center',
  },
});
