import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useGoogleAuth } from '../firebase/useGoogleAuth';

WebBrowser.maybeCompleteAuthSession();

const SkillshareScreen1 = ({ navigation }) => {
  const signUp = () => {
    navigation.navigate('SignUp');
  };

  const emailLogIn = () => {
    navigation.navigate("SignInwithEmail");
  };

  const [request, response, promptAsync] = useGoogleAuth();

  useEffect(() => {
    if (response && response.type === 'success') {
      navigation.navigate('Courses'); 
    }
  }, [response]);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.view1}>
              <Icon
                name='bars'
                color='grey'
                size={35}
                style={styles.iconStyle}
                onPress={() => navigation.openDrawer()}
              />
              <Text style={styles.text}>ApexLearn</Text>
              <TouchableOpacity style={styles.touch} onPress={signUp}>
                <Text style={styles.touchText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.view2}>
              <Text numberOfLines={3} style={styles.text2}>
                Become a Pro with{"\n"}thousands of{"\n"}creative classes
              </Text>

              <Text style={styles.text3}>Get 7 free days of pixxxel</Text>

              {/* ✅ Google Sign-In Button (functioning, no style change) */}
              <TouchableOpacity
                style={styles.touch2}
                onPress={() => typeof promptAsync === 'function' && promptAsync()}
                disabled={!request}
              >
                <View style={styles.view3}>
                  <Image source={require('../assets/google.png')} style={styles.image} />
                  <Text style={styles.text4}>Continue with Google</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.touch2}>
                <View style={styles.view3}>
                  <Image style={styles.image} source={require('../assets/facebook.jpeg')} />
                  <Text style={styles.text4}>Continue with Facebook</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.touch2}>
                <View style={styles.view3}>
                  <Image style={styles.image} source={require('../assets/apple.png')} />
                  <Text style={styles.text4}>Continue with Apple</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.touch3} onPress={() => navigation.navigate('Sign In')}>
                <Text style={styles.touchText2}>Continue with Email</Text>
              </TouchableOpacity>

              <Text style={styles.text5}>
                By signing up, you agree to
                <Text style={styles.terms} onPress={()=>navigation.navigate('Terms')}> terms of service and privacy policy</Text> terms of services and privacy policy of pixxxel.
                Should you violate any of these terms and policies, you would be charged with the due penalties
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SkillshareScreen1;

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0b2d39',
    height: 100,
    borderRadius: 8,
    elevation: 10,
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 15,
    paddingLeft: 30,
    marginBottom: 65
  },
  view2: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 40
  },
  container: {
    padding: 2,
    marginTop: 10
  },
  iconStyle: {
    marginRight: 35
  },
  touch: {
    backgroundColor: '#1e7898',
    borderRadius: 8,
    width: 100,
    height: 40,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  touchText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 25
  },
  text2: {
    marginBottom: 50,
    fontWeight: 'bold',
    fontSize: 30
  },
  text3: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 25,
    color: '#041014'
  },
  touch2: {
    backgroundColor: 'grey',
    height: 50,
    width: 350,
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 12
  },
  image: {
    height: 30,
    width: 30,
    marginRight: 35,
    borderRadius: 30
  },
  view3: {
    flexDirection: 'row'
  },
  text4: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  touchText2: {
    color: '#1e7898',
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 20
  },
  touch3: {
    marginTop: 10
  },
  terms: {
    color: '#1e7898',
    fontWeight: '500',
    fontSize: 16
  },
  text5: {
    fontSize: 16,
    fontWeight: '400'
  }
});
