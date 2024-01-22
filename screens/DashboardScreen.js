import React, {useState} from 'react';
import { Alert, Button, Text,View, ScrollView, StyleSheet, Pressable, BackHandler, Vibration } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function HDashboardScreen({ navigation }) {	
  
	function handleBackButton(){
        Alert.alert('UŽDARYTI', 'Ar tikrai uždaryti programą?',
		  [
			{text: 'NE', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'TAIP', onPress: () => BackHandler.exitApp()},
		  ], { cancelable: false })
				return true;
	}
	
			
  return (
    <View style={{ flex: 1, margin: 10 }}>
		<Pressable 
		  style={({ pressed }) => [ styles.button, pressed ? { backgroundColor: '#C4FAF8' } : {}, ]}
		  onPress={() => navigation.navigate('Gps')}>
		  <FontAwesome name="user" size={36} style={styles.iconButton}/>
		  <Text style={styles.text}>ŽEMĖLAPIS</Text>
		</Pressable>
		<Pressable 
			style={({ pressed }) => [ styles.exitButton, pressed ? { backgroundColor: 'silver' } : {}, ]} 
			onPress={() => handleBackButton() }>
			<Text style={styles.textBlack}>IŠEITI</Text>
		</Pressable>
		<Text style={styles.version}> v. 1.00</Text>
    </View>
  );
}

const styles = StyleSheet.create({
	exitButton: {
		position: 'absolute',
		bottom:0,
		left: 'center',
		margin: 10,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: '#FFABAB',
	},
	version: {
		fontSize: 10,
		color: 'black',
	},
	itemContainer: {
		width: "100%",
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: 5,
		borderColor: '#ccc',
	},
	button: {
		flexDirection: 'row', // Align icon and text in a row
		margin: 5,
		alignItems: 'center',
		justifyContent: 'left',
		paddingVertical: 6,
		paddingHorizontal: 6,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: '#6Eb5FF',
	},
	iconButton: {
		color: 'white',
		padding: 5,
		margin: 5,
		borderRadius: 3,
	},
	text: {
		fontSize: 28,
		fontWeight: 'bold',
		color: 'black',
	},
});