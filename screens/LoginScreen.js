import React, {useState} from 'react';
import { Alert, Button, Text, View, ScrollView, StyleSheet, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LoginScreen({ navigation }) {	
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	
	const storeDataWithExpiration = async (key, data, expirationInMinutes) => {
	  try {
		const timestamp = new Date().getTime();
		const expirationTime = timestamp + expirationInMinutes * 600 * 1000;

		const dataToStore = {
		  data,
		  expirationTime,
		};

		await AsyncStorage.setItem(key, JSON.stringify(dataToStore));
	  } catch (error) {
		console.error('Error saving to AsyncStorage:', error.message);
	  }
	};
	
	const handleLogin = async () => {		
		axios.post('https://gps.inte.lt/api/login', { 'email': email, 'password': password, })
			.then((response) => {
				console.log(response.data);
				//save vartotojo duomenis
				storeDataWithExpiration('user', response.data.data, 600);
				Alert.alert('Success', 'User login successfully!');
				navigation.navigate('Home');
			})
			.catch((error) => {
				console.error('Error:', error);
				Alert.alert('Error', 'Login failed. Please try again.');
			});
	};
	
	return (
		<View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
		  <Text style={{ fontSize: 24, marginBottom: 16 }}>PRISIJUNGIMAS</Text>
		  <TextInput
			placeholder="El. paštas"
			value={email}
			onChangeText={(text) => setEmail(text)}
			style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, padding: 8 }}
		  />
		  <TextInput
			placeholder="Slaptažodis"
			value={password}
			onChangeText={(text) => setPassword(text)}
			secureTextEntry
			style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, padding: 8 }}
		  />
		  <Button title="Prisijungti" onPress={handleLogin} />
		</View>
	);
}

const styles = StyleSheet.create({

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
	margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 4,
    elevation: 3,
	backgroundColor: '#6Eb5FF',
  },
  iconButton: {
    color: 'black',
    padding: 5,
    borderRadius: 3,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },

});