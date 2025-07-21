import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Licencse = ({ navigation }) => {
  const orbitAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.timing(orbitAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  const radius = 20;

  const translateX = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, radius, 0, -radius, 0],
  });

  const translateY = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 0, radius, 0, -radius],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Gradient Header */}
      <LinearGradient
        colors={['#007AFF', '#00C6FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientHeader}
      >
        <Text style={styles.gradientText}>Terms and Conditions</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="fadeInDown" delay={100} duration={1000}>
          <Animated.Image
            source={require('../assets/apexLearn2.png')}
            style={[
              styles.image,
              {
                transform: [{ translateX }, { translateY }],
              },
            ]}
            resizeMode="contain"
          />
        </Animatable.View>

        <Animatable.Text
          animation="fadeInUp"
          delay={300}
          duration={1000}
          style={styles.headerText}
        >
          Terms & Conditions
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={500} duration={1000}>
          <Text style={styles.text}>
            Welcome to ApexLearn! By using our platform, you agree to the following terms:
          </Text>

          <Text style={styles.bullet}>• You are responsible for your account activity.</Text>
          <Text style={styles.bullet}>• Do not misuse the platform or engage in harmful activities.</Text>
          <Text style={styles.bullet}>• All courses are for personal learning only — redistribution is prohibited.</Text>
          <Text style={styles.bullet}>• Payments made are non-refundable once the course is accessed.</Text>
          <Text style={styles.bullet}>• We may update terms periodically; continued use means you accept the new terms.</Text>

          <Text style={styles.text}>
            If you have any questions, please reach out to our support team.
          </Text>

          <Text style={{ color: 'grey', fontSize: 17, fontWeight: 'bold', marginTop: 10 }}>
            contact:{' '}
            <TouchableOpacity onPress={() => Linking.openURL('tel:+233531850867')}>
              <Text style={{ color: '#007AFF', fontSize: 17, textDecorationLine: 'underline' }}>
                +233 531 850 867
              </Text>
            </TouchableOpacity>
          </Text>

          <Text style={{ color: 'grey', fontSize: 17, fontWeight: 'bold', marginTop: 10 }}>
            mail:{' '}
            <TouchableOpacity onPress={() => Linking.openURL('mailto:support@apexlearn.com')}>
              <Text style={{ color: '#007AFF', fontSize: 17, textDecorationLine: 'underline' }}>
                support@apexlearn.com
              </Text>
            </TouchableOpacity>
          </Text>
        </Animatable.View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Licencse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientHeader: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  gradientText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100,
  },
  image: {
    width: width * 0.6,
    height: 180,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#444',
    marginVertical: 10,
    textAlign: 'justify',
  },
  bullet: {
    fontSize: 15,
    color: '#333',
    marginVertical: 5,
    paddingLeft: 10,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
