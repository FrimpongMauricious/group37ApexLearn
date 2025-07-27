import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import { CourseContext } from '../context/CourseContext';
import { NotificationContext } from '../context/NotificationContext';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const PaymentScreen = ({ route, navigation }) => {
  const [newCourse, setNewCourse] = useState(null);
  const { enrollInCourse, removeFromWishlist, addCourse } = useContext(CourseContext);
  const { addNotification } = useContext(NotificationContext);

  const type = route?.params?.type || 'enroll';

  useEffect(() => {
    if (route?.params?.newCourse) {
      setNewCourse(route.params.newCourse);
    } else if (route?.params?.params?.newCourse) {
      setNewCourse(route.params.params.newCourse);
    } else {
      console.warn('⚠️ No course data passed to PaymentScreen');
    }
  }, [route]);

  const extractAmount = (amountString) => {
    if (!amountString) return 0;
    const match = amountString.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const dynamicAmount = extractAmount(newCourse?.amount || '');

  const sendEnrollmentNotification = async (courseName) => {
    try {
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎓 Enrolled Successfully!',
          body: `You've enrolled in "${courseName}". Start learning now!`,
          sound: 'default',
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error('Error sending enrollment notification:', error);
    }
  };

  const sendUploadNotification = async (courseName) => {
    try {
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚀 Course Uploaded!',
          body: `Your course "${courseName}" is now live on ApexLearn.`,
          sound: 'default',
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error('Error sending upload notification:', error);
    }
  };

  const handleOnRedirect = async (data) => {
    console.log('Payment response:', data);
    console.log('Incoming data:', newCourse);

    if (data.status === 'successful') {
      Alert.alert('Success', 'Payment completed successfully!');

      if (newCourse && newCourse.id) {
        const courseWithId = {
          id: newCourse.id || `course-${Date.now()}`,
          name: newCourse.name || newCourse.CourseName || 'Untitled Course',
          amount: newCourse.amount || '$0.00',
          time: newCourse.time || '0 hours - 0 lessons',
          image:
            typeof newCourse.image === 'string'
              ? { uri: newCourse.image }
              : newCourse.image,
          institution: newCourse.institution || 'User Uploaded',
          tutor: newCourse.tutor || newCourse.tutorName || 'You',
          about: newCourse.about || newCourse.tutorDescription || 'This is a user-created course.',
          tutorBio: newCourse.tutorBio || newCourse.tutorImage,
          videoUrl: newCourse.videoUrl || null,
        };

        if (type === 'enroll') {
          await enrollInCourse(courseWithId);
          addNotification(`You successfully enrolled in ${courseWithId.name}`);
          sendEnrollmentNotification(courseWithId.name);
          removeFromWishlist(courseWithId.id);
        } else if (type === 'upload') {
          addCourse(courseWithId);
          addNotification(`You uploaded your course: ${courseWithId.name}`);
          sendUploadNotification(courseWithId.name);
        }

        navigation.navigate('Available Courses', { screen: 'AllCourses' });
      }
    } else {
      Alert.alert('Failed', 'Payment was cancelled or failed.');
    }
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#ffffff']}
      style={styles.background}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#e0f7fa" />

      <Animatable.Image
        animation="bounceInDown"
        duration={2500}
        source={require('../assets/apexLearn2.png')}
        resizeMode="contain"
        style={styles.logo}
      />

      <Animatable.View animation="fadeInUp" delay={350} style={styles.card}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Secure Payment
        </Animatable.Text>
        <Text style={styles.description}>
          You're about to make a secure payment via Flutterwave. Tap the button below to continue.
        </Text>

        {newCourse && (
          <View style={{ marginBottom: 20, alignItems: 'center' }}>
            <Image
              source={
                typeof newCourse.image === 'string'
                  ? { uri: newCourse.image }
                  : newCourse.image
              }
              style={{ width: 80, height: 80, borderRadius: 8, marginBottom: 10 }}
            />
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {newCourse.name || newCourse.CourseName}
            </Text>
            <Text style={{ color: '#666' }}>
              {newCourse.amount} • {newCourse.time}
            </Text>
          </View>
        )}

        <PayWithFlutterwave
          onRedirect={handleOnRedirect}
          options={{
            tx_ref: `txn-${Date.now()}`,
            authorization: 'FLWPUBK_TEST-3c7470da776181ab39a6cf7e35d1209a-X',
            customer: {
              email: 'mauriciousfrimpong@gmail.com',
              phonenumber: '0531850867',
              name: 'Mauricious Frimpong',
            },
            amount: dynamicAmount * 10.5 || 200.0,
            currency: 'GHS',
            payment_options: 'mobilemoneyghana',
          }}
          customButton={(props) => (
            <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={3000}>
              <TouchableOpacity style={styles.button} onPress={props.onPress}>
                <Text style={styles.buttonText}>Proceed to Payment</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        />
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffffee',
    borderRadius: 20,
    padding: 30,
    elevation: 8,
    shadowColor: '#00796b',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#455a64',
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default PaymentScreen;