// SignInWithEmail.js
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useContext } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import { loginUser } from '../firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../context/UserContext';

const SignInWithEmail = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loadUserData } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert("Email Not Verified", "Please verify your email before logging in.");
        return;
      }

      await loadUserData(user.email);
      Alert.alert("Success", "Logged in successfully");
      navigation.navigate('LoggedIn');
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const signUp = () => navigation.navigate("SignUp");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ImageBackground style={styles.backgroundImage} source={require('../assets/background3.jpg')}>
            <View style={styles.container}>
              <Animatable.View animation="fadeInUp" duration={800} delay={200}>
                <TextInput
                  style={styles.input}
                  placeholder='Email'
                  placeholderTextColor='black'
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                />
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.passwordInput, { flex: 1 }]}
                    placeholder='Input Password'
                    placeholderTextColor='black'
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    keyboardType='default'
                  />
                  <Icon
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={22}
                    color='black'
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ paddingHorizontal: 10 }}
                  />
                </View>
              </Animatable.View>
            </View>

            <View style={styles.bottomContainer}>
              <TouchableOpacity style={styles.touch} onPress={handleLogin}>
                <Text style={styles.tuchText}>Log in</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.touch2} onPress={signUp}>
                <Text style={styles.tuchText2}>Don't have an account? Create one</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignInWithEmail;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  passwordInput: {
    height: 55,
    borderRadius: 10,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: 'black',
    backgroundColor: '#e9f5f9',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#e9f5f9',
    width: '100%',
    marginBottom: 30,
  },
  input: {
    borderRadius: 10,
    borderWidth: 2,
    width: '100%',
    height: 50,
    marginBottom: 30,
    textAlign: 'center',
    borderColor: 'white',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
    backgroundColor: '#e9f5f9',
  },
  touch: {
    backgroundColor: '#1e7898',
    borderRadius: 8,
    width: '100%',
    height: 50,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tuchText: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  tuchText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  touch2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
});
