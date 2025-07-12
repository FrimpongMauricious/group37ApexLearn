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

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useContext(UserContext);

  const handleSignUp = async () => {
    try {
      await registerUser(email, password);

      const userData = {
        username: name,
        email: email,
        contact: contact,
        password: password,
        profilePicture: null,
      };

      setUser(userData);
      Alert.alert("Verification Sent", "Please check your email and verify before logging in.");
      navigation.navigate('Sign In');
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const login = () => navigation.navigate('Sign In');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#e0f7fa', '#cceeff']}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animatable.View style={styles.container} animation="fadeInUp" duration={800}>

              <View style={styles.header}>
                <Image
                  source={require('../assets/apexLearn2.png')}
                  style={styles.logo}
                />
              </View>

              <Text style={styles.title}>Create account</Text>

              {/* Full Name */}
              <View style={styles.inputContainer}>
                <Icon name="user" size={18} color="#999" style={styles.icon} />
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Icon name="lock" size={18} color="#999" style={styles.icon} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Icon name="envelope" size={18} color="#999" style={styles.icon} />
                <TextInput
                  placeholder="E-mail"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              {/* Mobile */}
              <View style={styles.inputContainer}>
                <Icon name="phone" size={18} color="#999" style={styles.icon} />
                <TextInput
                  placeholder="Mobile"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Create Button */}
              <TouchableOpacity style={styles.createButton} onPress={handleSignUp}>
                <Text style={styles.createButtonText}>Create</Text>
                <Icon name="arrow-right" size={16} color="white" style={{ marginLeft: 10 }} />
              </TouchableOpacity>

              {/* Already have account */}
              <TouchableOpacity style={{ marginTop: 30 }} onPress={login}>
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
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'flex-start',
    paddingBottom: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  logo: {
    height: 180,
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e7898',
    paddingVertical: 15,
    borderRadius: 18,
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 0,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginText: {
    color: '#1e7898',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 10,
  },
});
