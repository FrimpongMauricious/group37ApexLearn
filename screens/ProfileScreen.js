import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, Image,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { UserContext } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Share } from 'react-native';


const ProfileScreen = () => {
  const { user, updateUser } = useContext(UserContext);
  const navigation = useNavigation();

  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.password);
  const [contact, setContact] = useState(user.contact);
  const [showPassword, setShowPassword] = useState(false);
  const [points, setPoints] = useState(0);
  const [badgeColor, setBadgeColor] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || supported.length === 0 || !enrolled) {
          Alert.alert('Biometric Auth Not Available', 'Your device does not support biometric authentication.');
          navigation.goBack();
          return;
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to view your profile',
          fallbackLabel: 'Use PIN',
        });

        if (result.success) {
          setAuthenticated(true);
        } else {
          Alert.alert('Authentication Failed', 'You cannot access this screen without verification.');
          navigation.goBack();
        }
      } catch (err) {
        console.error('Biometric error:', err);
        Alert.alert('Error', 'An error occurred during authentication.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, []);

  useEffect(() => {
    const loadPoints = async () => {
      const key = `userPoints_${user.email}`;
      const storedPoints = await AsyncStorage.getItem(key);
      const total = storedPoints ? parseInt(storedPoints) : 0;
      setPoints(total);

      if (total >= 5000) setBadgeColor('#FFD700'); // Gold
      else if (total >= 3000) setBadgeColor('#4CAF50'); // Green
      else if (total >= 1000) setBadgeColor('#2196F3'); // Blue
      else setBadgeColor(null);
    };
    loadPoints();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      updateUser({ profilePicture: result.assets[0].uri });
    }
  };
  const handleShare = async () => {
  try {
    await Share.share({
      message:
        `🚀 Check out ApexLearn — an interactive learning app built by Team 37!\n\n` +
        `💻 View source code on GitHub:\nhttps://github.com/FrimpongMauricious/group37ApexLearn.git\n\n` +
        `🔧 Clone, contribute, or try building it locally. Let's learn together!`,
    });
  } catch (error) {
    Alert.alert('Error', 'Something went wrong while sharing.');
  }
};



  const saveChanges = () => {
    updateUser({ username, password, contact });
    alert('Profile updated!');
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.navigate('Logout');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  if (!authenticated) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#ffffff', '#e0f7fa', '#cceeff']}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={pickImage} style={[
            styles.imagePicker,
            badgeColor ? { borderColor: badgeColor, borderWidth: 3 } : null
          ]}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.image} />
            ) : (
              <Text style={styles.pickText}>Pick Profile Picture</Text>
            )}
          </TouchableOpacity>

          <View style={styles.usernameRow}>
            <Text style={styles.usernameText}>{username}</Text>
            {badgeColor && (
              <Icon
                name="check-circle"
                size={20}
                color={badgeColor}
                style={{ marginLeft: 8 }}
              />
            )}
          </View>

          <Text style={styles.pointsText}>Points: {points}</Text>

          {points >= 5000 && (
            <Text style={styles.discountText}>
              🎉 You’ve unlocked a 20% discount on all purchases!
            </Text>
          )}

          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} maxLength={25} />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
              color="black"
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            />
          </View>

          <Text style={styles.label}>Contact</Text>
          <TextInput
            style={styles.input}
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
          />
          <View style={{ marginTop: 20, width: '100%' }}>
  <TouchableOpacity onPress={() => navigation.navigate('Help')} style={styles.rowItem}>
    <Icon name="file-alt" size={18} color="green" style={styles.icon} />
    <Text style={styles.rowText}>Terms and conditions</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => navigation.navigate('Bot')} style={styles.rowItem}>
    <Icon name="question-circle" size={18} color="green" style={styles.icon} />
    <Text style={styles.rowText}>Help Center</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.rowItem} onPress={handleShare}>
    <Icon name="share-alt" size={18} color="green" style={styles.icon} />
    <Text style={styles.rowText}>Share to friends</Text>
  </TouchableOpacity>
</View>

          

          <TouchableOpacity onPress={saveChanges} style={styles.button}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
    marginTop: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pickText: {
    color: '#333',
    textAlign: 'center',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  discountText: {
    backgroundColor: '#D4EDDA',
    padding: 8,
    borderRadius: 8,
    color: '#155724',
    fontWeight: '600',
    marginBottom: 10,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontWeight: 'bold',
    marginTop: 15,
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    marginTop: 5,
    height: 55,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'white',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: 'white',
    width: '100%',
    height: 55,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#1e7898',
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
    width: '100%',
    marginBottom: 20,
    elevation: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#e53935',
    padding: 14,
    borderRadius: 10,
    opacity: 0.9,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rowItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 10,
  alignSelf: 'flex-start',
  marginLeft: 10,
},
icon: {
  marginRight: 10,
},
rowText: {
  color: 'black',
  fontWeight: 'bold',
  fontSize: 18,
},

});
