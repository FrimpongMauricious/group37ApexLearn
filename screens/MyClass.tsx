import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { classes } from './AvailableCourses';
import { UserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const MyClass = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [badgeColor, setBadgeColor] = useState(null);
  const [points, setPoints] = useState(0);

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

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <LinearGradient
          colors={['#2c9da7', '#efd3f2','#e0a8e5','#d892df',]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.view1}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              style={[
                styles.dp,
                badgeColor ? { borderColor: badgeColor, borderWidth: 3 } : null
              ]}
              source={
                user.profilePicture
                  ? { uri: user.profilePicture }
                  : require('../assets/apexLearn2.png')
              }
            />
          </TouchableOpacity>

          <View style={{ marginRight: 26 }}>
            <View style={styles.usernameRow}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user.username || 'Hello User'}
              </Text>
              {badgeColor && (
                <Icon
                  name="check-circle"
                  size={18}
                  color={badgeColor}
                  style={{ marginLeft: 6 }}
                />
              )}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={{ color: 'blue', fontSize: 15, marginTop: 7 }}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <Icon name='bars' size={30} color='white' onPress={() => navigation.openDrawer()} />
        </LinearGradient>

        <View style={styles.view2}>
          <Text style={{ fontSize: 25, fontStyle: 'italic', fontWeight: 'bold', marginBottom: 50 }}>
            My Class
          </Text>
          <FlatList
            data={classes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.activities}
                onPress={() => navigation.navigate(`${item.id}`)}
              >
                <Icon name={item.icon} color='grey' size={27} style={{ marginRight: 40 }} />
                <Text style={{ fontWeight: '600', fontSize: 18, marginRight: 85 }}>{item.name}</Text>
                <Icon name={item.forward_icon} color='grey' size={27} />
              </TouchableOpacity>
            )}
          />
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MyClass;

const styles = StyleSheet.create({
  view1: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  dp: {
    height: 65,
    width: 65,
    borderRadius: 37,
    marginRight: 23,
  },
  view2: {
    marginTop: 35,
    paddingHorizontal: 40
  },
  activities: {
    flexDirection: 'row',
    marginBottom: 30,
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    elevation: 1
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
