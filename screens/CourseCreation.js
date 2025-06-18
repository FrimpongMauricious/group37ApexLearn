import {
  StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Platform, ScrollView, Image
} from 'react-native';
import React, { useState, useContext } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TextInput } from 'react-native-gesture-handler';
import { CourseContext } from '../context/CourseContext';

const CourseCreation = ({ navigation }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [numLessons, setNumLessons] = useState('');
  const [videoInputs, setVideoInputs] = useState([]);

  const { addCourse } = useContext(CourseContext);

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

  const pickVideo = async (id) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled) {
      const updated = videoInputs.map((item) =>
        item.id === id ? { ...item, video: result.assets[0].uri } : item
      );
      setVideoInputs(updated);
    }
  };

  const handleLessonCountChange = (value) => {
    setNumLessons(value);
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const newInputs = Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        video: '',
      }));
      setVideoInputs(newInputs);
    } else {
      setVideoInputs([]);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
            >
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

                <TextInput style={styles.input} placeholder="Course name" maxLength={36} />
                <TextInput style={styles.input} placeholder="Field of study (e.g. Software engineering, AI, etc)" />
                <TextInput
                  style={styles.input}
                  placeholder="Number of lessons"
                  keyboardType="numeric"
                  value={numLessons}
                  onChangeText={handleLessonCountChange}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Bank Account number to receive Payment"
                  keyboardType="numeric"
                />

                {videoInputs.length > 0 && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Upload Videos</Text>
                    {videoInputs.map((input) => (
                      <TouchableOpacity
                        key={input.id}
                        style={styles.videoUploadBtn}
                        onPress={() => pickVideo(input.id)}
                      >
                        <Text style={{ color: input.video ? 'green' : 'black' }}>
                          {input.video
                            ? `✔️ Lesson ${input.id} uploaded`
                            : `Select Lesson ${input.id} video`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.touhcable}
                  onPress={() => {
                    if (!thumbnail || !numLessons) {
                      alert("Please upload a thumbnail and enter number of lessons.");
                      return;
                    }

                    const newCourse = {
                      id: Date.now().toString(),
                      name: 'Untitled Course',
                      amount: '$0.00',
                      time: `${numLessons} lessons`,
                      image: thumbnail,
                      institution: 'User Uploaded',
                      tutor: 'You',
                      about: 'This is a user-created course.',
                      tutorBio: require('../assets/apple.png'),
                    };

                    addCourse(newCourse); // ✅ SAVE SCOPED + TRIGGER NOTIFICATION
                    navigation.navigate('makePayment', { newCourse });
                  }}
                >
                  <Text style={styles.touchText}>Purchase creator power</Text>
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
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e9f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 3,
    elevation: 10,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#e9f5f9',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  videoUploadBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  touhcable: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    backgroundColor: 'green',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
  },
  touchText: {
    color: 'white',
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
