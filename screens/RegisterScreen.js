import React, {useState} from 'react';
import { Alert, Button, Text, View, ScrollView, StyleSheet, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {	
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [TwoPassword, setTwoPassword] = useState('');
	
	const handleRegistration = async () => {
		try {
		  const response = await axios.post('https://gps.inte.lt/api/register', {
			'name': name,
			'email': email,
			'password': password,
			'c_password': TwoPassword
		  });

		  // Handle successful registration
		  Alert.alert('Success', 'User registered successfully!');
		  navigation.navigate('Login'); // Redirect to login screen
		} catch (error) {
		  // Handle registration error
		  Alert.alert('Error', 'Registration failed. Please try again.');
		  console.error('Registration error:', error);
		}
	};
	
	return (
		<View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
		  <Text style={{ fontSize: 24, marginBottom: 16 }}>REGISTRACIJA</Text>
		  <TextInput
			placeholder="Vartotojo vardas"
			value={name}
			onChangeText={(text) => setName(text)}
			style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, padding: 8 }}
		  />
		  <TextInput
			placeholder="El. paštas"
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
		  <TextInput
			placeholder="Pakartoti slaptažodį"
			value={TwoPassword}
			onChangeText={(text) => setTwoPassword(text)}
			secureTextEntry
			style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, padding: 8 }}
		  />
		  <Button title="Registruotis" onPress={handleRegistration} />
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