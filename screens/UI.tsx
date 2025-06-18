import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { CourseContext } from '../context/CourseContext';
import { NotificationContext } from '../context/NotificationContext';

const UI = ({ navigation }) => {
  const { enrollInCourse, addToWishlist } = useContext(CourseContext);
  const { addNotification } = useContext(NotificationContext);

  const courseData = {
    id: 'UI',
    name: 'UI/UX Design Fundamentals',
    amount: '$30.30',
    time: '4.5 hours-22 lessons',
    image: require('../assets/ui.jpg'),
    institution: 'Amalitech',
    tutor: 'Prof. Acqua Hayfron',
    about: 'Learn the principles of software design and development to  increase productivity',
    tutorBio: require('../assets/amali.png')
  };

  const handleEnroll = () => {
    enrollInCourse(courseData);
    addNotification(`You enrolled in ${courseData.name}`);
    navigation.navigate('Progress');
  };

  const handleWish = () => {
    addToWishlist(courseData);
    addNotification(`You added ${courseData.name} to wishlist`);
    navigation.navigate('WishList');
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Image style={styles.courseImage} source={courseData.image} />
        <View style={styles.tutorBioView}>
          <Image source={courseData.tutorBio} style={styles.tutorView} />
          <View>
            <Text style={styles.tutorName}>{courseData.tutor}</Text>
            <Text>{courseData.institution}</Text>
          </View>
        </View>
        <Text style={styles.courseName}>{courseData.name}</Text>
        <Text style={styles.about}>{courseData.about}</Text>
        <View style={styles.amountView}>
          <Text style={styles.amount}>{courseData.amount}</Text>
          <Text style={styles.duration}>{courseData.time}</Text>
        </View>
        <TouchableOpacity style={styles.enroll} onPress={handleEnroll}>
          <Text style={styles.enrollText}>Enroll now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.wish} onPress={handleWish}>
          <Text style={styles.enrollText}>Add to Wish List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UI;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    padding: 5,
    flexGrow: 1
  },
  enroll: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'green',
    borderRadius: 11,
    marginBottom: 10
  },
  wish: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1e7898',
    borderRadius: 11,
    marginBottom: 20
  },
  enrollText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17
  },
  tutorName: {
    fontWeight: '600'
  },
  courseName: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    marginTop: 5
  },
  courseImage: {
    height: 250,
    width: '100%',
    borderRadius: 12,
    marginBottom: 30
  },
  tutorView: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10,
    marginTop: 2,
    marginBottom: 20
  },
  about: {
    color: 'grey',
    fontSize: 15,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10
  },
  amountView: {
    flexDirection: 'row',
    paddingRight: 10,
    paddingHorizontal: 10,
    marginTop: 10
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 130
  },
  duration: {
    color: 'grey'
  },
  tutorBioView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center'
  }
});
