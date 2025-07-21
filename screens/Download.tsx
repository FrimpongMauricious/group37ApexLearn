// Download.js
import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Image, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';

  import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const pdfIcon = require('../assets/pdf_icon.png'); // Add a small pdf icon image to your assets folder

const Download = () => {
  const { user } = useContext(UserContext);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      const key = `certificates_${user.email}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        setCertificates(JSON.parse(stored));
      }
    };
    fetchCertificates();
  }, []);


const openCertificate = async (uri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      Alert.alert("Error", "Certificate file not found.");
      return;
    }

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert("Error", "Sharing is not available on this device.");
      return;
    }

    await Sharing.shareAsync(uri); // Opens with WPS, Adobe, etc.
  } catch (error) {
    console.log("Error opening PDF:", error);
    Alert.alert("Error", "Could not open certificate.");
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Accomplishments</Text>

      {certificates.length === 0 ? (
        <Text style={styles.emptyText}>No certificates yet. Complete a course to earn one!</Text>
      ) : (
        certificates.map((cert, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={pdfIcon} style={styles.pdfIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.course}>{cert.courseName}</Text>
                <Text style={styles.username}>Earned by: {cert.username}</Text>
                <Text style={styles.date}>Date: {cert.date}</Text>
              </View>
            </View>
            {cert.pdfUri && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => openCertificate(cert.pdfUri)}
              >
                <Text style={styles.buttonText}>View Certificate</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Download;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    flexGrow: 1,
    marginTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pdfIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  course: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#555',
  },
  button: {
    backgroundColor: '#1e7898',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
