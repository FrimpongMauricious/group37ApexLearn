import React, { useContext } from 'react';
import { View, Button, Alert } from 'react-native';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import { CourseContext } from '../context/CourseContext';
import { NotificationContext } from '../context/NotificationContext'; 

const PaymentScreen = ({ route, navigation }) => {
  const newCourse =
    route.params?.newCourse || route.params?.params?.newCourse || null;

  const { addCourse, enrollInCourse } = useContext(CourseContext);
  const { addNotification } = useContext(NotificationContext); 

  const handleOnRedirect = (data) => {
    console.log('Payment response:', data);
    console.log('New course being added:', newCourse);

    if (data.status === 'successful') {
      Alert.alert('Success', 'Payment completed successfully!');

      if (newCourse) {
        const courseWithId = {
          id: newCourse.id || `course-${Date.now()}`,
          name: newCourse.name || 'Untitled Course',
          amount: newCourse.amount || '$0.00',
          time: newCourse.time || '0 hours - 0 lessons',
          image:
            typeof newCourse.image === 'string'
              ? { uri: newCourse.image }
              : require('../assets/apexLearn.jpg'),
          institution: newCourse.institution || 'User Uploaded',
          tutor: newCourse.tutor || 'You',
          about: newCourse.about || 'This is a user-created course.',
          tutorBio: newCourse.tutorBio || require('../assets/apexLearn.jpg'),
        };

        addCourse(courseWithId);       
        enrollInCourse(courseWithId);    

        
        addNotification(`You successfully enrolled in ${courseWithId.name}`);
      }

      navigation.navigate('Available Courses', { screen: 'AllCourses' });
    } else {
      Alert.alert('Failed', 'Payment was cancelled or failed.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
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
          amount: 250,
          currency: 'GHS',
          payment_options: 'mobilemoneyghana',
        }}
        customButton={(props) => (
          <Button title="Make Payment for this Service" onPress={props.onPress} />
        )}
      />
    </View>
  );
};

export default PaymentScreen;
