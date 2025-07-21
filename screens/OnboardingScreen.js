import React, { useRef, useEffect, useState } from 'react';
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
    key: '0',
    title: 'Discover New Skills',
    text: 'Sharpen your talents, learn new things and upgrade your life.',
    image: require('../assets/learnAvatar.png'),
  },
  {
    key: '1',
    title: 'Track Your Progress',
    text: 'Monitor your achievements and stay motivated every day.',
    image: require('../assets/progressAvatar.png'),
  },
  {
    key: '2',
    title: 'Welcome to ApexLearn',
    text: 'A smarter way to acquire knowledge and grow.',
    image: require('../assets/apexLearn2.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    shimmerAnim.setValue(0);
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 300],
  });

  return (
    <Swiper
    
      ref={swiperRef}
      loop={false}
      showsPagination={true}
      activeDotColor="#163d72"
      onIndexChanged={(index) => setCurrentIndex(index)}
    >
      {slides.map((slide, index) => {
        const SlideWrapper = index === 0|| index===1 || index===2 ? LinearGradient : View;
        const slideProps =
          index === 0|| index===1 || index === 2
            ? { colors: ['#92b2df', '#d3e0f2','#e9f0f9','#ffffff'], style: styles.slide }
            : { style: styles.slide };

        return (
          <SlideWrapper key={slide.key} {...slideProps}>
            <Animatable.View animation="fadeInDown" delay={300}>
              <Image source={slide.image} style={styles.image} resizeMode="contain" />
            </Animatable.View>

            <Animatable.Text animation="fadeInUp" delay={500} style={styles.title}>
              {slide.title}
            </Animatable.Text>

            <Animatable.Text animation="fadeIn" delay={700} style={styles.text}>
              {slide.text}
            </Animatable.Text>

            <View style={styles.navigationRow}>
              {index < slides.length - 1 && (
                <TouchableOpacity
                  onPress={() => navigation.replace('PreLogin')}
                  style={styles.skipButton}
                >
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              )}

              {index === slides.length - 1 ? (
                <TouchableOpacity
                  onPress={() => navigation.replace('PreLogin')}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                  <Animated.View
                    style={[styles.shimmer, { transform: [{ translateX }] }]}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => swiperRef.current?.scrollBy(1)}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          </SlideWrapper>
        );
      })}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  image: {
    width: width * 0.7,
    height: height * 0.4,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A2D5A',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 30,
  },
  skipButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    color: '#333',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#163d72',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    width:100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#163d72',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    zIndex: 1,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 30,
  },
});

export default OnboardingScreen;
 