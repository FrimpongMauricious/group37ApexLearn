import { StyleSheet, Text, View, ScrollView,ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'

const Welcome = ({navigation}) => {
    const gotoLoginScreen=()=>{
         navigation.navigate('Sign In')
//                   navigation.reset({
//   index: 0,
//   routes: [{ name: 'Home' }],
// })
    }
  return (
    <ImageBackground source={require('../assets/background1.jpg')} style={styles.backImage}>
     <ScrollView >
       <View style={styles.view2}>
         <Text style={styles.text1}>
           Explore 
           your
           creativity
         </Text>
         <Text style={styles.text2}>
           Joing Pixxxel to watch, play,
           learn,make, and discover
         </Text>
         <TouchableOpacity style={styles.touch} onPress={gotoLoginScreen}>
           <Text style={styles.touchText}>
             Get Started With 1 Month Free
           </Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={()=>{
          return(
            // navigation.navigate('Home')
            //  navigation.replace('Home')
            navigation.navigate("PreLogin")


            
          )
         }}>
        <Text style={styles.text3}>
           Already have an account? sign in
         </Text>
         </TouchableOpacity>
         
   
       </View>
     </ScrollView>
    </ImageBackground>
  )
}

export default Welcome

const styles = StyleSheet.create({
 container:{
  justifyContent:'center',
  alignContent:'center',
  alignItems:'center', top:100
 },
//  touch:{
//   width:100,
//   height:50,
//   backgroundColor:'green'
//  },
 backImage:{
  flex:1,
  height:'100%'

 },
 view2:{
  justifyContent:'center',
  alignContent:'center',
  alignItems:'center',
  marginTop:250

 },
 text1:{
  fontSize:50,
  fontWeight:'500',
  color:'white',
  paddingHorizontal:20,
  marginBottom:25
 },
 text2:{
  color:'white',
  fontSize:27,
  fontWeight:'500',
  paddingHorizontal:20,
  marginBottom:235

 },
 touch:{
  backgroundColor:'#2fbe25',
  justifyContent:'center',
  textAlign:'center',
  alignItems:'center',
  marginBottom:30,
  paddingHorizontal:20,
  width:350,
  height:50,
  borderRadius:10,
  

 },
 touchText:{
  color:'black',
  fontWeight:'bold',
  fontSize:16

 },
 text3:{
  color:'white',
  fontSize:12,

 }
});
