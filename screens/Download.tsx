import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const Download = () => {
  return (
    <SafeAreaProvider>
        <SafeAreaView>

    <View style={styles.container}>
      <Text>Your downloads will appear here</Text>
    </View>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Download

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center'

    }
})