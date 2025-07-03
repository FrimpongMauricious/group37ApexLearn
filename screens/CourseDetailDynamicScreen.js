import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CourseContext } from '../context/CourseContext';
import { FontAwesome5 } from '@expo/vector-icons';

const CourseDetailDynamicScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addToWishlist, enrollInCourse } = useContext(CourseContext);
  const course = route.params?.course;

  if (!course) {
    return (
      <View style={styles.centered}> <Text>No course data found.</Text> </View>
    );
  }

  return (
    <LinearGradient colors={["#e0f7fa", "#ffffff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={course.image} style={styles.image} />

        <Text style={styles.name}>{course.name || course.CourseName}</Text>
        <Text style={styles.meta}>{course.amount || 'Free'} • {course.time || 'No time data'}</Text>

        <View style={styles.tutorContainer}>
          <Image source={course.tutorImage || course.tutorBio} style={styles.tutorImage} />
          <View>
            <Text style={styles.tutorName}>{course.tutorName || course.tutor}</Text>
            <Text style={styles.tutorDesc}>{course.tutorDescription || 'Tutor information'}</Text>
          </View>
        </View>

        <Text style={styles.about}>{course.about || 'No description available.'}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.enrollButton]}
            onPress={() => navigation.navigate('Payment', { newCourse: course })}
          >
            <FontAwesome5 name="money-check-alt" size={16} color="white" />
            <Text style={styles.buttonText}>Enroll Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.wishButton]}
            onPress={() => addToWishlist(course)}
          >
            <FontAwesome5 name="heart" size={16} color="white" />
            <Text style={styles.buttonText}>Add to Wishlist</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default CourseDetailDynamicScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 5,
  },
  meta: {
    color: '#555',
    marginBottom: 20,
  },
  tutorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tutorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  tutorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  tutorDesc: {
    color: '#666',
  },
  about: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#00796b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  enrollButton: {
    backgroundColor: '#00796b',
  },
  wishButton: {
    backgroundColor: '#26a69a',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
