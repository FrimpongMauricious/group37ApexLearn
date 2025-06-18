import {
  StyleSheet, Text, TextInput, View, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
  TouchableWithoutFeedback, Keyboard, Image
} from 'react-native';
import React, { useState, useContext } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { registerUser } from '../firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../context/UserContext';
import * as Animatable from 'react-native-animatable';
import { Animated, Easing } from 'react-native';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [shineAnim] = useState(new Animated.Value(0));

  const { setUser } = useContext(UserContext);

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      await registerUser(email, password);

      const userData = {
        username: name,
        email: email,
        contact: contact,
        password: password,
        profilePicture: null,
      };

      setUser(userData); // triggers context + save in UserContext

      Alert.alert(
        "Verification Sent",
        "Please check your email and verify before logging in."
      );

      navigation.navigate('Sign In');
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const login = () => navigation.navigate('Sign In');

  const startShine = () => {
    shineAnim.setValue(0);
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const translateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 300],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#ffffff', '#e0f7fa', '#cceeff']}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animatable.View style={styles.container} animation="fadeInUp" duration={800}>
              <View style={styles.header}>
                <Image source={require('../assets/apexLearn2.png')} style={{ height: 240, width: '100%', borderRadius: 12 }} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Full name'
                  placeholderTextColor='black'
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Enter your email'
                  placeholderTextColor='black'
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder='+233 enter your contact'
                  placeholderTextColor='black'
                  value={contact}
                  onChangeText={setContact}
                  keyboardType='phone-pad'
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder='Set your password'
                    placeholderTextColor='black'
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Icon
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={22}
                    color='black'
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.confirmLabel}>Confirm Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder='Confirm your password'
                    placeholderTextColor='black'
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <Icon
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={22}
                    color='black'
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.touch} onPress={handleSignUp} onLayout={startShine}>
                <Text style={styles.touchText}>Sign Up</Text>
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      transform: [{ translateX }],
                      width: 100,
                      height: '100%',
                      borderRadius: 10,
                      opacity: 0.7,
                    },
                  ]}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.touch2} onPress={login}>
                <Text style={styles.loginText}>Already have an account? Log in</Text>
              </TouchableOpacity>
            </Animatable.View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: 'grey',
    marginBottom: 5,
  },
  confirmLabel: {
    color: 'green',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 55,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    textAlign: 'center',
    color: 'black',
    backgroundColor: '#e9f5f9',
    fontSize: 18,
    fontWeight: '500',
  },
  passwordInput: {
    height: 55,
    borderRadius: 10,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: 'black',
    backgroundColor: '#e9f5f9',
    flex: 1,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#e9f5f9',
    paddingRight: 10,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  touch: {
    backgroundColor: '#1e7898',
    borderRadius: 10,
    width: '100%',
    height: 50,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  touchText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    zIndex: 1,
  },
  loginText: {
    marginTop: 10,
    color: '#1e7898',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  touch2: {
    marginTop: 10,
    borderRadius: 7,
  },
});