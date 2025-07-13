import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Video } from 'expo-av';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import { CourseContext } from '../context/CourseContext';
import { UserContext } from '../context/UserContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Image as RNImage } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const CourseVideoScreen = () => {
  const route = useRoute();
  const { course = {}, videoUrl = '' } = route.params || {};
  const {
    id,
    name,
    about,
    tutor,
    tutorBio,
    lessons = ['Introduction', 'Module 1', 'Module 2', 'Final Project'],
  } = course;

  const { updateCourseProgress } = useContext(CourseContext);
  const { user } = useContext(UserContext);
  const [videoId, setVideoId] = useState(null);
  const playerRef = useRef();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigation = useNavigation();
  const key = `lessonStatus_${id}`;
  const progress = completedLessons.length / lessons.length;

  useEffect(() => {
    const extractVideoId = (url) => {
      if (!url) return null;

      const finalUrl = typeof url === 'object' && url?.uri ? url.uri : url;

      const shortRegex = /shorts\/([a-zA-Z0-9_-]+)/;
      const regularRegex = /(?:v=|\/)([a-zA-Z0-9_-]{11})/;

      const matchShort = finalUrl.match(shortRegex);
      if (matchShort) return matchShort[1];

      const matchRegular = finalUrl.match(regularRegex);
      if (matchRegular) return matchRegular[1];

      return null;
    };

    setVideoId(extractVideoId(videoUrl));
  }, [videoUrl]);

  useEffect(() => {
    const loadCompleted = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        const parsed = stored ? JSON.parse(stored) : [];
        setCompletedLessons(parsed);
        updateCourseProgress(id, Math.floor((parsed.length / lessons.length) * 100));
      } catch (err) {
        console.error('Error loading lesson status:', err);
      }
    };
    loadCompleted();
  }, []);

  const toggleLesson = async (lesson) => {
    let updated = [...completedLessons];
    if (updated.includes(lesson)) {
      updated = updated.filter(l => l !== lesson);
    } else {
      updated.push(lesson);
    }
    setCompletedLessons(updated);
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    updateCourseProgress(id, Math.floor((updated.length / lessons.length) * 100));
  };

  const handleDownloadCertificate = async () => {
    try {
      setShowConfetti(true); // trigger confetti

      setTimeout(async () => {
        const logoUrl = RNImage.resolveAssetSource(require('../assets/apexLearn2.png')).uri;
        const html = `
          <html><head><style>body{text-align:center;padding:40px;font-family:Arial;color:#222}
          .cert{border:6px double #4CAF50;padding:40px;border-radius:12px;max-width:700px;margin:auto}
          .cert h1{color:#4CAF50}.name{font-size:22px;font-weight:bold}.footer{margin-top:30px;color:#777}
          </style></head><body><div class="cert">
          <img src="${logoUrl}" width="120"/><h1>Certificate of Completion</h1>
          <p>This certifies that</p><div class="name">${user.username || 'Learner'}</div>
          <p>has successfully completed the course</p><div class="course">${name}</div>
          <p>on ${new Date().toDateString()}</p><div class="footer">Issued by ApexLearn</div>
          </div></body></html>`;
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri);
        setShowConfetti(false);
      }, 4000); // 4 seconds delay to let confetti finish
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not generate certificate.");
      setShowConfetti(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {showConfetti && <ConfettiCannon count={120} origin={{ x: 200, y: -20 }} fadeOut />}

      <Text style={styles.courseName}>{name}</Text>

      {videoId ? (
        <YoutubePlayer ref={playerRef} height={230} play={true} videoId={videoId} />
      ) : (
        <Video
          source={{ uri: typeof videoUrl === 'object' && videoUrl?.uri ? videoUrl.uri : videoUrl }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          shouldPlay
        />
      )}

      <View style={styles.details}>
        <Image source={typeof tutorBio === 'string' ? { uri: tutorBio } : tutorBio} style={styles.tutorImage} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.tutorName}>{tutor}</Text>
          <Text style={styles.about}>{about}</Text>
        </View>
      </View>

      <Text style={styles.lessonTitle}>Course Lessons</Text>
      <Progress.Bar
        progress={progress}
        width={null}
        height={10}
        borderRadius={4}
        color="#4CAF50"
        unfilledColor="#E0E0E0"
        style={{ marginBottom: 16 }}
      />

      {lessons.map((lesson, index) => (
        <TouchableOpacity
          key={index}
          style={styles.lessonItem}
          onPress={() => toggleLesson(lesson)}
        >
          <Text style={{ flex: 1 }}>{lesson}</Text>
          <Text style={{ color: completedLessons.includes(lesson) ? '#4CAF50' : '#ccc' }}>
            {completedLessons.includes(lesson) ? '✔ Done' : 'Mark as done'}
          </Text>
        </TouchableOpacity>
      ))}

      {progress === 1 && (
        <>
          <TouchableOpacity style={styles.claimButton} onPress={handleDownloadCertificate}>
            <Text style={styles.buttonText}> Claim Certificate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.claimButton, { backgroundColor: '#0b392c', marginTop: 12 }]}
            onPress={() => navigation.navigate('QuizCenter', { course })}
          >
            <Text style={styles.buttonText}> Take Quiz</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default CourseVideoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', marginTop: 30 },
  video: { width: '100%', height: 250, borderRadius: 10, marginBottom: 16 },
  courseName: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  details: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  tutorImage: { width: 60, height: 60, borderRadius: 30 },
  tutorName: { fontSize: 16, fontWeight: '600' },
  about: { fontSize: 13, color: '#555', marginTop: 4, maxWidth: '90%' },
  lessonTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  claimButton: {
    backgroundColor: '#167258',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    height: 55,
    borderRadius: 17
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
