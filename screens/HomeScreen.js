import React, { useState, useEffect } from 'react';
import { Alert, Button, Text,View, ScrollView, StyleSheet, Pressable, BackHandler, Vibration } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState([]);

  const getDataWithExpiration = async (key) => {
    try {
      const storedData = await AsyncStorage.getItem(key);

      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        const currentTimestamp = new Date().getTime();

        if (currentTimestamp < parsedData.expirationTime) {
          return parsedData.data;
        } else {
          await AsyncStorage.removeItem(key);
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error.message);
      return null;
    }
  };
  
	useEffect(() => {
	  const fetchData = async () => {
		try {
			const retrievedUser = await getDataWithExpiration('user');
			setUser(retrievedUser);
		} catch (error) {
			console.error('Error fetching user data:', error.message);
			}
		};

		fetchData();
	  
		const intervalId = setInterval(() => {
		  fetchData();
		}, 1000);
		return () => clearInterval(intervalId);
	}, [setUser]);
  
	function handleBackButton(){
        Alert.alert('UŽDARYTI', 'Ar tikrai uždaryti programą?',
		  [
			{text: 'NE', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'TAIP', onPress: () => BackHandler.exitApp()},
		  ], { cancelable: false })
				return true;
	}
	
	
	async function logout() {
	  Alert.alert('ATSIJUNGTI', 'Ar tikrai norite atsijungti?',
		[
		  {text: 'NE', onPress: () => console.log('Cancel Pressed'), style: 'cancel',},
		  {text: 'TAIP', onPress: async () => { await AsyncStorage.removeItem('user'); setUser([]); } },
		],
		{ cancelable: false }
	  );
	}
				
  return (
    <View style={{ flex: 1, margin: 10 }}>
		{!user ? (
		  <>
			<Pressable
			  style={({ pressed }) => [styles.button, pressed ? { backgroundColor: '#C4FAF8' } : {}]}
			  onPress={() => navigation.navigate('Login')}
			>
			  <FontAwesome name="user" size={36} style={styles.iconButton} />
			  <Text style={styles.text}>PRISIJUNGTI</Text>
			</Pressable>
			<Pressable
			  style={({ pressed }) => [styles.button, pressed ? { backgroundColor: '#C4FAF8' } : {}]}
			  onPress={() => navigation.navigate('Register')}
			>
			  <FontAwesome name="id-card" size={36} style={styles.iconButton} />
			  <Text style={styles.text}>SUKURTI PASKYRA</Text>
			</Pressable>
		  </>
		) : (
			<>
			<View style={styles.itemContainer}>
				<Text style={styles.text_2}>ID: {user.id}</Text>
				<Text style={styles.text}>{user.name}</Text>
				<Pressable
					style={({ pressed }) => [styles.logout, pressed ? { backgroundColor: '#C4FAF8' } : {}]}
					onPress={() => logout()}
				  >
				<FontAwesome name="sign-out" size={24} style={styles.iconButton} />
				<Text style={styles.text_2}>ATSIJUNGTI</Text>
			</Pressable>
			</View>
		  <Pressable
			style={({ pressed }) => [styles.button, pressed ? { backgroundColor: '#C4FAF8' } : {}]}
			onPress={() => navigation.navigate('Gps', {userData: user})}
		  >
			<FontAwesome name="map" size={36} style={styles.iconButton} />
			<Text style={styles.text}>ŽEMĖLAPIS</Text>
		  </Pressable>
		   </>
		)}

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
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: 5,
		borderColor: 'black',
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
	logout: {
		flexDirection: 'row', // Align icon and text in a row
		margin: 5,
		alignItems: 'center',
		justifyContent: 'left',
		padding: 2,
		backgroundColor: '#6Eb5FF',
	},
	iconButton: {
		color: 'white',
		padding: 2,
		margin: 2,
		borderRadius: 3,
	},
	text_2: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'black',
	},
	text: {
		fontSize: 28,
		fontWeight: 'bold',
		color: 'black',
	},
});