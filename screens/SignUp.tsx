// import {
//   StyleSheet, Text, TextInput, View, TouchableOpacity,
//   KeyboardAvoidingView, Platform, ScrollView, Alert,
//   TouchableWithoutFeedback, Keyboard, Image
// } from 'react-native';
// import React, { useState, useContext } from 'react';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { registerUser } from '../firebase/auth';
// import { LinearGradient } from 'expo-linear-gradient';
// import { UserContext } from '../context/UserContext';
// import * as Animatable from 'react-native-animatable';

// const SignUp = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [contact, setContact] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const { setUser } = useContext(UserContext);

//   const handleSignUp = async () => {
//     try {
//       await registerUser(email, password);

//       const userData = {
//         username: name,
//         email: email,
//         contact: contact,
//         password: password,
//         profilePicture: null,
//       };

//       setUser(userData);
//       Alert.alert("Verification Sent", "Please check your email and verify before logging in.");
//       navigation.navigate('Sign In');
//     } catch (err) {
//       Alert.alert("Error", err.message);
//     }
//   };

//   const login = () => navigation.navigate('Sign In');

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <LinearGradient
//           colors={['#e0f7fa', '#cceeff']}
//           style={styles.gradient}
//         >
//           <ScrollView
//             contentContainerStyle={{ flexGrow: 1 }}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//           >
//             <Animatable.View style={styles.container} animation="fadeInUp" duration={800}>

//               <View style={styles.header}>
//                 <Image
//                   source={require('../assets/apexLearn2.png')}
//                   style={styles.logo}
//                 />
//               </View>

//               <Text style={styles.title}>Create account</Text>

//               {/* Full Name */}
//               <View style={styles.inputContainer}>
//                 <Icon name="user" size={18} color="#999" style={styles.icon} />
//                 <TextInput
//                   placeholder="Username"
//                   placeholderTextColor="#999"
//                   style={styles.input}
//                   value={name}
//                   onChangeText={setName}
//                 />
//               </View>

//               {/* Password */}
//               <View style={styles.inputContainer}>
//                 <Icon name="lock" size={18} color="#999" style={styles.icon} />
//                 <TextInput
//                   placeholder="Password"
//                   placeholderTextColor="#999"
//                   secureTextEntry={!showPassword}
//                   style={styles.input}
//                   value={password}
//                   onChangeText={setPassword}
//                 />
//                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                   <Icon name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#999" />
//                 </TouchableOpacity>
//               </View>

//               {/* Email */}
//               <View style={styles.inputContainer}>
//                 <Icon name="envelope" size={18} color="#999" style={styles.icon} />
//                 <TextInput
//                   placeholder="E-mail"
//                   placeholderTextColor="#999"
//                   style={styles.input}
//                   value={email}
//                   onChangeText={setEmail}
//                   keyboardType="email-address"
//                 />
//               </View>

//               {/* Mobile */}
//               <View style={styles.inputContainer}>
//                 <Icon name="phone" size={18} color="#999" style={styles.icon} />
//                 <TextInput
//                   placeholder="Mobile"
//                   placeholderTextColor="#999"
//                   style={styles.input}
//                   value={contact}
//                   onChangeText={setContact}
//                   keyboardType="phone-pad"
//                 />
//               </View>

//               {/* Create Button */}
//               <TouchableOpacity style={styles.createButton} onPress={handleSignUp}>
//                 <Text style={styles.createButtonText}>Create</Text>
//                 <Icon name="arrow-right" size={16} color="white" style={{ marginLeft: 10 }} />
//               </TouchableOpacity>

//               {/* Already have account */}
//               <TouchableOpacity style={{ marginTop: 30 }} onPress={login}>
//                 <Text style={styles.loginText}>Already have an account? Log in</Text>
//               </TouchableOpacity>

//             </Animatable.View>
//           </ScrollView>
//         </LinearGradient>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// export default SignUp;

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     flexGrow: 1,
//     padding: 25,
//     justifyContent: 'flex-start',
//     paddingBottom: 0,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 20,
//     marginTop: 20,
//   },
//   logo: {
//     height: 180,
//     width: '100%',
//     resizeMode: 'contain',
//     borderRadius: 12,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#000',
//     alignSelf: 'center',
//     marginBottom: 30,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 17,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     marginBottom: 15,
//     elevation: 4,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     color: '#000',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   createButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1e7898',
//     paddingVertical: 15,
//     borderRadius: 18,
//     justifyContent: 'center',
//     marginTop: 30,
//     marginBottom: 0,
//   },
//   createButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   loginText: {
//     color: '#1e7898',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 16,
//     paddingBottom: 10,
//   },
// });
import {
  StyleSheet, Text, TextInput, View, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
  TouchableWithoutFeedback, Keyboard, Image, ActivityIndicator
} from 'react-native';
import React, { useState, useContext, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../context/UserContext';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const contactRef = useRef(null);

  const { setUser } = useContext(UserContext);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(value);
    const endsWithDotCom = value.endsWith(".com");
    const valid = isValidFormat && endsWithDotCom;
    setValidEmail(valid);
    return valid;
  };

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score);
    return score >= 2;
  };

  const handleSignUp = async () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!name || !email || !password || !contact) {
      setGeneralError("Please fill in all fields.");
      if (!name) nameRef.current.focus();
      else if (!email) emailRef.current.focus();
      else if (!password) passwordRef.current.focus();
      else contactRef.current.focus();
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Enter a valid email ending with .com");
      emailRef.current.focus();
      return;
    }

    if (!checkPasswordStrength(password)) {
      setPasswordError("Password must be stronger (8+ chars, numbers, symbols, capital letters).");
      passwordRef.current.focus();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://10.132.178.11:8080/register', {
        username: email,
        password: password,
      });

      if (response.status === 200) {
        const userData = {
          id: response.data.id,
          username: name,
          email: email,
          contact: contact,
          password: password,
          profilePicture: null,
        };
        setUser(userData);
        Alert.alert("Success", "Account created successfully via backend.");
        navigation.navigate('Sign In');
      } else {
        setGeneralError("Unexpected server response.");
      }

    } catch (err) {
      if (
        err.response &&
        typeof err.response.data === 'string' &&
        err.response.data.toLowerCase().includes("constraint")
      ) {
        setGeneralError("Email already exists. Please use a different one.");
      } else {
        setGeneralError(err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'red';
    if (passwordStrength === 2) return 'orange';
    return 'green';
  };

  const login = () => navigation.navigate('Sign In');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={['#6dd5ed', '#2193b0']} style={styles.gradient}>
            <View style={styles.waveTop} />
            <Animatable.View style={styles.container} animation="fadeInUp" duration={800}>
              <Image source={require('../assets/apexLearn2.png')} style={styles.logo} />
              <Text style={styles.title}>Create Account</Text>

              <View style={styles.inputContainer}>
                <Icon name="user" size={18} color="#999" style={styles.icon} />
                <TextInput
                  ref={nameRef}
                  placeholder="Username"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="envelope" size={18} color="#999" style={styles.icon} />
                <TextInput
                  ref={emailRef}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    validateEmail(val);
                  }}
                />
                {validEmail && <Icon name="check-circle" size={18} color="green" style={{ marginLeft: 8 }} />}
              </View>
              {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

              <View style={styles.inputContainer}>
                <Icon name="lock" size={18} color="#999" style={styles.icon} />
                <TextInput
                  ref={passwordRef}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    checkPasswordStrength(val);
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#999" />
                </TouchableOpacity>
              </View>
              <View style={styles.strengthBarContainer}>
                <View style={[styles.strengthBar, { width: `${(passwordStrength / 4) * 100}%`, backgroundColor: getStrengthColor() }]} />
              </View>
              {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

              <View style={styles.inputContainer}>
                <Icon name="phone" size={18} color="#999" style={styles.icon} />
                <TextInput
                  ref={contactRef}
                  placeholder="Contact"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="phone-pad"
                />
              </View>

              {generalError ? <Text style={styles.error}>{generalError}</Text> : null}

              <TouchableOpacity
                style={[styles.createButton, loading && { opacity: 0.7 }]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text style={styles.createButtonText}>Sign Up</Text>
                    <Icon name="arrow-right" size={16} color="white" style={{ marginLeft: 10 }} />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={{ marginTop: 30 }} onPress={login}>
                <Text style={styles.loginText}>Already have an account? Log in</Text>
              </TouchableOpacity>
            </Animatable.View>
            <View style={styles.waveBottom} />
          </LinearGradient>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    padding: 25,
    paddingTop: 10,
    justifyContent: 'center',
  },
  logo: {
    height: 100,
    width: 180,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    elevation: 3,
  },
  icon: { marginRight: 10 },
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
    marginTop: 15,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 20,
  },
  error: {
    color: 'red',
    marginLeft: 8,
    marginBottom: 8,
    fontSize: 13,
  },
  strengthBarContainer: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 5,
  },
  waveTop: {
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  waveBottom: {
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 20,
  },
});


