import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CourseContext } from '../context/CourseContext';
import * as Progress from 'react-native-progress';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const defaultImage = require('../assets/apexLearn2.png');

const ProgressScreen = () => {
  const { enrolledCourses } = useContext(CourseContext);
  const navigation = useNavigation();

  const introCourse = {
    id: 'intro-course',
    name: 'Introduction to ApexLearn',
    about: 'Get started with ApexLearn and learn how to use our app effectively.',
    image: defaultImage,
    progress: 74,
    videoUrl: 'https://www.youtube.com/shorts/QrEe2CUj1lA',
  };

  const filteredEnrolled = enrolledCourses?.filter(course => course?.id !== 'intro-course') || [];

  const allCoursesToShow = [introCourse, ...filteredEnrolled];

  const renderCourseItem = ({ item }) => {
    const source =
      typeof item.image === 'string' || item.image?.uri
        ? { uri: item.image.uri || item.image }
        : item.image || defaultImage;

    return (
      <TouchableOpacity
        style={styles.courseItem}
        onPress={() => {
          navigation.navigate('CourseVideoStack', {
            screen: 'CourseVideo',
            params: {
              course: item,
              videoUrl: item?.videoUrl || introCourse.videoUrl,
            },
          });
        }}
      >
        <Image source={source} style={styles.courseImage} />
        <View style={styles.courseInfo}>
          <Text style={styles.courseName}>{item.name}</Text>
          <Text style={styles.courseAbout} numberOfLines={2}>
            {item.about || 'No description.'}
          </Text>
          <Progress.Bar
            progress={(item.progress || 0) / 100}
            width={null}
            height={8}
            borderRadius={4}
            color="#4CAF50"
            unfilledColor="#E0E0E0"
          />
          <Text style={styles.progressText}>
            {item.progress || 0}% complete
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={allCoursesToShow}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : `fallback-${index}`
          }
          renderItem={renderCourseItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                You haven't enrolled in any course yet.
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('LearnSchedulerScreen')}
        >
          <Text style={styles.floatingButtonText}>Schedule Learning</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f8fc' },
  list: { padding: 16 },
  courseItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginTop: 30,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  courseName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  courseAbout: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
    color: '#4CAF50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
