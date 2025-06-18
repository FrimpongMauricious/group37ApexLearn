import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to ApexLearn',
    text: 'Learn from the best tutors worldwide.',
    image: require('../assets/apexLearn2.png'),
    colors: ['#E0F2FF', '#FFFFFF'],
  },
  {
    key: '2',
    title: 'Flexible Learning',
    text: 'Access courses anywhere, anytime.',
    image: require('../assets/apexLearn2.png'),
    colors: ['#D1E9FF', '#FFFFFF'],
  },
  {
    key: '3',
    title: 'Practical Skills',
    text: 'Hands-on projects and real-world learning.',
    image: require('../assets/apexLearn2.png'),
    colors: ['#B3DFFF', '#FFFFFF'],
  },
];

const OnboardingScreen = ({ navigation }) => {
  const shimmerAnim = new Animated.Value(0);

  const startShimmer = () => {
    shimmerAnim.setValue(0);
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  startShimmer();

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 300],
  });

  return (
    <Swiper loop={false} showsPagination={true} activeDotColor="#007AFF">
      {slides.map((slide, index) => (
        <LinearGradient
          key={slide.key}
          colors={slide.colors}
          style={styles.slide}
        >
          <Animatable.View animation="bounceInDown" delay={100}>
            <Image
              source={slide.image}
              style={styles.image}
              resizeMode="contain"
            />
          </Animatable.View>

          <Animatable.Text
            animation="fadeInLeft"
            delay={400}
            style={styles.title}
          >
            {slide.title}
          </Animatable.Text>

          <Animatable.Text
            animation="fadeInRight"
            delay={700}
            style={styles.text}
          >
            {slide.text}
          </Animatable.Text>

          {index === slides.length - 1 && (
            <Animatable.View animation="zoomInUp" delay={900}>
              <TouchableOpacity
                onPress={() => navigation.replace('PreLogin')}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Continue →</Text>
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      transform: [{ translateX }],
                    },
                  ]}
                />
              </TouchableOpacity>
            </Animatable.View>
          )}
        </LinearGradient>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.65,
    height: height * 0.35,
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A2D5A',
    textAlign: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 17,
    color: '#2F3E63',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 24,
  },
  button: {
    marginTop: 35,
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 1,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 30,
  },
});

export default OnboardingScreen;
