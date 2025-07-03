import React, { useContext, useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, Image,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { UserContext } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5'; 

const ProfileScreen = () => {
  const { user, updateUser } = useContext(UserContext);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.password);
  const [contact, setContact] = useState(user.contact);
  const [showPassword, setShowPassword] = useState(false); 

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

  const saveChanges = () => {
    updateUser({ username, password, contact });
    alert('Profile updated!');
  };

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
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.image} />
            ) : (
              <Text style={styles.pickText}>Pick Profile Picture</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} maxLength={25}/>

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

          <TouchableOpacity onPress={saveChanges} style={styles.button}>
            <Text style={styles.buttonText}>Save Changes</Text>
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
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
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
    marginTop: 70,
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
});
