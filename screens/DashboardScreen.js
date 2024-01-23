import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import UserLocation from '../screens/UserLocation';

export default function DashboardScreen() {
     return (
          <View style={styles.container}>
               <UserLocation />
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
     },
});