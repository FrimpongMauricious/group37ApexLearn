import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext'; 
import { CourseContext } from '../context/CourseContext';

const AI = ({ navigation }) => {
  const { addNotification } = useContext(NotificationContext);
    const {enrollInCourse, addToWishlist} = useContext(CourseContext);
  
    // const handleEnroll = () => {
    //   addNotification("You successfully enrolled in Software Engineering.");
    //   navigation.navigate('Enroll');
    // };
  
    // const handleWish = () => {
    //   addNotification("Software Engineering was added to your wish list.");
    // };
  const courseData = {
      id: 'AI',
      name: 'Artificial Intelligence',
      amount: '$99.99',
      time: '10 hours-31 lessons',
      image: require('../assets/ai.webp'),
      institution: 'Google',
      tutor: 'Prof. Acqua Hayfron',
      about: 'Learn the principles of software design and development to increase productivity',
      tutorBio: require('../assets/google.png')
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
        <View>
          <Image style={styles.courseImage} source={require('../assets/ai.webp')} />
          <View style={styles.tutorBioView}>
            <Image source={require('../assets/google.png')} style={styles.tutorView} />
            <View>
              <Text style={styles.tutorName}>Prof. Acqua Hayfron</Text>
              <Text>Google</Text>
            </View>
          </View>
          <Text style={styles.courseName}>Artificial Intelligence</Text>
          <Text style={styles.about}>
            Learn the principles of software design and development to increase productivity
          </Text>
          <View style={styles.amountView}>
            <Text style={styles.amount}>$99.99</Text>
            <Text style={styles.duration}>10 hours-31 lessons</Text>
          </View>
          <TouchableOpacity style={styles.enroll} onPress={handleEnroll}>
            <Text style={styles.enrollText}>Enroll now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wish} onPress={handleWish}>
            <Text style={styles.enrollText}>Add to Wish List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}



export default AI;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    padding: 5,
    flexGrow: 1,
  },
  enroll: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'green',
    borderRadius: 11,
    marginBottom: 10,
  },
  wish: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1e7898',
    borderRadius: 11,
  },
  enrollText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  courseImage: {
    height: 250,
    width: '100%',
    borderRadius: 12,
    marginBottom: 30,
  },
  tutorView: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10,
    marginTop: 2,
    marginBottom: 20,
  },
  tutorBioView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tutorName: {
    fontWeight: '600',
  },
  courseName: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  about: {
    color: 'grey',
    fontSize: 15,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  amountView: {
    flexDirection: 'row',
    paddingRight: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 130,
  },
  duration: {
    color: 'grey',
  },
});