import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { classes } from './AvailableCourses';
import { UserContext } from '../context/UserContext'; // ✅ context

const MyClass = ({ navigation }) => {
  const { user } = useContext(UserContext); //  get user

  return (
    <SafeAreaProvider>
      <SafeAreaView>

        <View style={styles.view1}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              style={styles.dp}
              source={
                user.profilePicture
                  ? { uri: user.profilePicture }
                  : require('../assets/background2.jpg')
              }
            />
          </TouchableOpacity>

          <View style={{ marginRight: 26 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20,   } }  numberOfLines={1} ellipsizeMode="tail">
              {user.username || 'Hello User              '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={{ color: 'blue', fontSize: 15, marginTop: 7 }}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <Icon name='bars' size={30} color='white' onPress={() => navigation.openDrawer()} />
        </View>

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
    backgroundColor: '#1e7898',
    height: 160,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row'
  },
  dp: {
    height: 65,
    width: 65,
    borderRadius: 37,
    marginRight: 23
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
  }
});
