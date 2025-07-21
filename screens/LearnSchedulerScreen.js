import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import DateTimePicker from '@react-native-community/datetimepicker';
import ConfettiCannon from 'react-native-confetti-cannon';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const LearnSchedulerScreen = () => {
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [duration, setDuration] = useState(null);
  const [customDuration, setCustomDuration] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAlarmControls, setShowAlarmControls] = useState(false);
  const soundRef = useRef(null);
  const alarmTimeoutRef = useRef(null);

  useEffect(() => {
    initNotificationSettings();
    loadSavedTime();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setShowConfetti(true);
      playAlarmFrom45s();
      triggerEndOfSessionNotification();
      setTimeout(() => setShowConfetti(false), 4000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const initNotificationSettings = async () => {
    if (Device.isDevice) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }

    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
  };

  const loadSavedTime = async () => {
    const savedTime = await AsyncStorage.getItem('learnReminderTime');
    if (savedTime) {
      setNotificationTime(new Date(savedTime));
    }
  };

  const scheduleNotification = async () => {
    const learningDuration = duration || parseFloat(customDuration);
    if (!learningDuration || isNaN(learningDuration)) {
      Alert.alert('Invalid Duration', 'Please select or enter a valid learning time.');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    const hour = notificationTime.getHours();
    const minute = notificationTime.getMinutes();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'ApexLearn Reminder',
        body: "It's time to continue learning!",
        sound: 'default',
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    await AsyncStorage.setItem('learnReminderTime', notificationTime.toString());

    const totalSeconds = learningDuration * 3600;
    setCountdown(totalSeconds);
    Alert.alert('Scheduled!', `Reminder set at ${hour}:${minute < 10 ? '0' + minute : minute} for ${learningDuration} hour(s).`);
  };

  const formatCountdown = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const playAlarmFrom45s = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/alarm.mp3')
      );
      soundRef.current = sound;
      await sound.setPositionAsync(45000);
      await sound.playAsync();
      setShowAlarmControls(true);

      alarmTimeoutRef.current = setTimeout(() => {
        stopAlarm();
      }, 30000);
    } catch (error) {
      console.error('Error playing alarm:', error);
    }
  };

  const stopAlarm = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setShowAlarmControls(false);
    clearTimeout(alarmTimeoutRef.current);
  };

  const snoozeAlarm = () => {
    stopAlarm();
    setCountdown(300); // snooze 5 mins
    Alert.alert('Snoozed', 'Alarm will ring again in 5 minutes.');
  };

  const triggerEndOfSessionNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Learning Session Complete!',
        body: "Great job! You've completed your study session on ApexLearn.",
        sound: 'default',
      },
      trigger: { seconds: 1 }, // fire shortly to avoid null issue
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={['#9f66d2', '#2575fc', '#bec9ec']} style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}> Schedule Learning</Text>
            <Text style={styles.subtitle}>Set a time for your study session, and we'll remind you.</Text>

            <Text style={styles.label}>Time</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timeBox}>
              <Text style={styles.timeText}>
                {notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={notificationTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowPicker(false);
                  if (selectedTime) setNotificationTime(selectedTime);
                }}
              />
            )}

            <View style={styles.buttonRow}>
              {[1, 2, 3].map(val => (
                <TouchableOpacity
                  key={val}
                  onPress={() => {
                    setDuration(val);
                    setCustomDuration('');
                  }}
                  style={[styles.timeBtn, duration === val && styles.timeBtnActive]}
                >
                  <Text style={[styles.timeBtnText, { color: val === 1 ? '#ff4d4d' : val === 2 ? '#0d8a57' : '#4b0082' }]}>
                    For {val} hour{val > 1 && 's'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.customInput}
              placeholder="Or enter custom hours (e.g., 1.5)"
              placeholderTextColor="#eee"
              keyboardType="numeric"
              value={customDuration}
              onChangeText={text => {
                setCustomDuration(text);
                setDuration(null);
              }}
            />

            <TouchableOpacity style={styles.scheduleBtn} onPress={scheduleNotification}>
              <Text style={styles.scheduleText}>Set Schedule</Text>
            </TouchableOpacity>

            {countdown !== null && countdown > 0 && (
              <Text style={styles.countdownText}>
                Time remaining: {formatCountdown(countdown)}
              </Text>
            )}

            {showAlarmControls && (
              <View style={styles.alarmButtonsContainer}>
                <TouchableOpacity style={styles.alarmBtn} onPress={stopAlarm}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}> Stop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alarmBtn} onPress={snoozeAlarm}>
                  <Text style={styles.alarmBtnText}> Snooze</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {showConfetti && (
            <ConfettiCannon count={400} origin={{ x: 200, y: 300 }} fadeOut autoStart />
          )}
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LearnSchedulerScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingBottom: 50,
    justifyContent: 'center',
    marginTop: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#e0e0e0',
    marginBottom: 35,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
    marginLeft: 6,
  },
  timeBox: {
    backgroundColor: '#ffffff22',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  timeText: {
    fontSize: 45,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 48,
  },
  timeBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    color: '#fff',
    height: 50,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scheduleBtn: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  scheduleText: {
    color: '#2575fc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  countdownText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
  alarmButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  alarmBtn: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  alarmBtnText: {
    color: '#2575fc',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
