// import {
//   StyleSheet, Text, TextInput, TouchableOpacity, View,
//   Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
//   Keyboard, SafeAreaView
// } from 'react-native';
// import React, { useState, useContext } from 'react';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { loginUser } from '../firebase/auth';
// import { UserContext } from '../context/UserContext';
// import * as Animatable from 'react-native-animatable';

// const SignInWithEmail = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [activeTab, setActiveTab] = useState('login');
//   const [rememberMe, setRememberMe] = useState(false);

//   const { loadUserData } = useContext(UserContext);

//   const handleLogin = async () => {
//     try {
//       const userCredential = await loginUser(email, password);
//       const user = userCredential.user;

//       if (!user.emailVerified) {
//         Alert.alert("Email Not Verified", "Please verify your email before logging in.");
//         return;
//       }

//       await loadUserData(user.email);
//       Alert.alert("Success", "Logged in successfully");
//       navigation.navigate('LoggedIn');
//     } catch (err) {
//       Alert.alert("Error", err.message);
//     }
//   };

//   const signUp = () => navigation.navigate("SignUp");

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 30}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <Animatable.View
//             animation="fadeInUp"
//             duration={700}
//             style={styles.container}
//           >
//             {/* Top Section */}
//             <View style={styles.topSection}>
//               <Text style={styles.welcome}>Welcome to</Text>
//               <Text style={styles.appName}>ApexLearn 👋</Text>
//               <Text style={styles.welcomeText}>Sign in to continue your learning journey</Text>
//             </View>

//             {/* Bottom Section */}
//             <View style={styles.formSection}>
//               {/* Tabs */}
//               <View style={styles.tabContainer}>
//                 <TouchableOpacity
//                   style={[styles.tab, activeTab === 'login' && styles.activeTab]}
//                   onPress={() => setActiveTab('login')}
//                 >
//                   <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.tab, activeTab === 'register' && styles.activeTab]}
//                   onPress={signUp}
//                 >
//                   <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Register</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Inputs */}
//               <View style={styles.inputWrapper}>
//                 <View style={styles.inputContainer}>
//                   <Icon name="envelope" size={18} color="#888" style={styles.inputIcon} />
//                   <TextInput
//                     style={styles.input}
//                     placeholder='Email Address'
//                     placeholderTextColor="#999"
//                     value={email}
//                     onChangeText={setEmail}
//                     keyboardType='email-address'
//                   />
//                 </View>

//                 <View style={styles.inputContainer}>
//                   <Icon name="lock" size={18} color="#888" style={styles.inputIcon} />
//                   <TextInput
//                     style={styles.input}
//                     placeholder='Password'
//                     placeholderTextColor="#999"
//                     secureTextEntry={!showPassword}
//                     value={password}
//                     onChangeText={setPassword}
//                   />
//                   <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                     <Icon name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#888" />
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* Remember Me & Forgot Password */}
//               <View style={styles.rememberRow}>
//                 <TouchableOpacity
//                   onPress={() => setRememberMe(!rememberMe)}
//                   style={[
//                     styles.checkboxPlaceholder,
//                     rememberMe && { backgroundColor: '#5c8d73', borderColor: '#5c8d73' },
//                   ]}
//                 />
//                 <Text style={styles.rememberText}>Remember me</Text>
//                 <TouchableOpacity style={{ marginLeft: 'auto' }}>
//                   <Text style={styles.forgotText}>Forgot Password?</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Login Button */}
//               <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//                 <Text style={styles.loginButtonText}>Login</Text>
//               </TouchableOpacity>
//             </View>
//           </Animatable.View>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default SignInWithEmail;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   topSection: {
//     flex: 1,
//     backgroundColor: '#000',
//     paddingHorizontal: 25,
//     paddingTop: 60,
//     justifyContent: 'center',
//   },
//   welcome: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '500',
//   },
//   appName: {
//     color: '#fff',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   welcomeText: {
//     color: '#aaa',
//     fontSize: 14,
//     marginTop: 8,
//   },
//   formSection: {
//     flex: 2,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 120, // ⬅ this creates the scoop!
//     paddingHorizontal: 25,
//     paddingTop: 30,
//     marginTop: -25, // ⬆ pull white section into the black
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#eee',
//     borderRadius: 30,
//     marginBottom: 30,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 30,
//     alignItems: 'center',
//   },
//   activeTab: {
//     backgroundColor: '#000',
//   },
//   tabText: {
//     color: '#999',
//     fontWeight: 'bold',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   inputWrapper: {
//     gap: 15,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f1f1f1',
//     borderRadius: 14,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#000',
//     marginLeft: 10,
//   },
//   inputIcon: {
//     marginRight: 5,
//   },
//   rememberRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   checkboxPlaceholder: {
//     width: 18,
//     height: 18,
//     borderRadius: 3,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginRight: 8,
//   },
//   rememberText: {
//     color: '#555',
//     fontSize: 13,
//   },
//   forgotText: {
//     color: '#1e7898',
//     fontSize: 13,
//   },
//   loginButton: {
//     backgroundColor: '#5c8d73',
//     borderRadius: 18,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 20,
//     elevation: 3,
//   },
//   loginButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
import {
  StyleSheet, Text, TextInput, TouchableOpacity, View,
  Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
  Keyboard, SafeAreaView
} from 'react-native';
import React, { useState, useContext } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { UserContext } from '../context/UserContext';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import * as LocalAuthentication from 'expo-local-authentication';

const SignInWithEmail = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricPassed, setBiometricPassed] = useState(false);

  const { loadUserData, updateUser } = useContext(UserContext);

  const triggerBiometricAuth = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!compatible || !enrolled) return;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Verify your identity',
      fallbackLabel: 'Enter Passcode',
    });

    setBiometricPassed(result.success);
    if (!result.success) {
      Alert.alert("Biometric Failed", "Authentication did not pass.");
    }
  };

  const handleLogin = async () => {
    if (!biometricPassed) {
      Alert.alert("Biometric Required", "Please verify your fingerprint or face to proceed.");
      return;
    }

    try {
      const response = await axios.post('https://updatedapexlearnbackend-1.onrender.com/login', {
        username: email.toLowerCase(),
        password: password,
      });

      console.log("Login response:", response.data);

      const data = response.data;
      const token = typeof data === 'string' ? data : data.token || data.message || JSON.stringify(data);

      if (
        !token ||
        typeof token !== 'string' ||
        token.toLowerCase().includes('invalid') ||
        token.toLowerCase().includes('fail')
      ) {
        Alert.alert("Login Failed", token);
        return;
      }

      await loadUserData(email);

      // 🔁 Fetch and update user ID into context
      try {
        const idResponse = await axios.get(`https://updatedapexlearnbackend-1.onrender.com/users/email/${email}`);
        if (idResponse?.data?.id) {
          updateUser({ id: idResponse.data.id });
        }
      } catch (error) {
        console.warn("⚠️ Could not fetch user ID after login", error);
      }

      Alert.alert("Success", "Logged successfully");
      navigation.navigate('LoggedIn');
    } catch (err) {
      let alertMessage = "An unexpected error occurred.";
      try {
        const raw = err?.response?.data ?? err?.message ?? err;
        if (typeof raw === 'string') {
          alertMessage = raw;
        } else if (typeof raw === 'object' && raw !== null) {
          alertMessage = raw.message || JSON.stringify(raw);
        } else {
          alertMessage = String(raw);
        }
      } catch (parseError) {
        alertMessage = "Error parsing error response.";
      }

      Alert.alert("Error", alertMessage);
    }
  };

  const signUp = () => navigation.navigate("SignUp");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 30}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animatable.View animation="fadeInUp" duration={700} style={styles.container}>
            <View style={styles.topSection}>
              <Text style={styles.welcome}>Welcome to</Text>
              <Text style={styles.appName}>ApexLearn 👋</Text>
              <Text style={styles.welcomeText}>Sign in to continue your learning journey</Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                  onPress={() => setActiveTab('login')}
                >
                  <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                  onPress={signUp}
                >
                  <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Register</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <Icon name="envelope" size={18} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder='Email Address'
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock" size={18} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#888" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rememberRow}>
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  style={[
                    styles.checkboxPlaceholder,
                    rememberMe && { backgroundColor: '#5c8d73', borderColor: '#5c8d73' },
                  ]}
                />
                <Text style={styles.rememberText}>Remember me</Text>
                <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => Alert.alert("Feature Coming Soon", "Forgot Password feature is under development.")}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {email && password && (
                <TouchableOpacity
                  style={styles.biometricRow}
                  onPress={triggerBiometricAuth}
                >
                  <Icon
                    name={biometricPassed ? "check-circle" : "fingerprint"}
                    size={24}
                    color={biometricPassed ? "green" : "gray"}
                    solid
                  />
                  <Text style={[
                    styles.biometricLabel,
                    { color: biometricPassed ? 'green' : 'gray' }
                  ]}>
                    {biometricPassed ? "Verified" : "Tap to verify identity"}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInWithEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 25,
    paddingTop: 60,
    justifyContent: 'center',
  },
  welcome: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  appName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },
  welcomeText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
  },
  formSection: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 120,
    paddingHorizontal: 25,
    paddingTop: 30,
    marginTop: -25,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 30,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    color: '#999',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  inputWrapper: {
    gap: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  inputIcon: {
    marginRight: 5,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkboxPlaceholder: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  rememberText: {
    color: '#555',
    fontSize: 13,
  },
  forgotText: {
    color: '#1e7898',
    fontSize: 13,
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 10,
  },
  biometricLabel: {
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: "#0b1e39",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
