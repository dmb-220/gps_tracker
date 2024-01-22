import React, {useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar, Text, View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import axios from 'axios';

const LOCATION_TASK_NAME = 'background-location-task';

// Define the background location task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Error in background location task:', error);
    return;
  }
  
  if (data) {
    const { locations } = data;
    // Send the location data to your server using Axios
    sendLocationDataToServer(locations);
  }
});

const getDataWithExpiration = async (key) => {
    try {
      const storedData = await AsyncStorage.getItem(key);

      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        const currentTimestamp = new Date().getTime();

        if (currentTimestamp < parsedData.expirationTime) {
          return {
			  data: parsedData.data,
			  userId: parsedData.data.id, // Assuming user ID is stored in data.id
			};
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

const sendLocationDataToServer = async (locations) => {
  try {
	  const userDataWithId = await getDataWithExpiration('user');
	  if (userDataWithId) {
		  const { userId } = userDataWithId;
		  axios.post('https://gps.inte.lt/api/gps_store', { 
			'user_id': userId, 
			'latitude': locations[0].coords.latitude,
			'longitude': locations[0].coords.longitude,
			'speed': locations[0].coords.speed,
			'altitude': locations[0].coords.altitude,
			})
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error('Error:', error);
				//Alert.alert('Error', 'GPS failed. Please try again.');
			});
	  } else {
      console.error('User data not available');
      // Handle the case when user data is not available
      Alert.alert('Error', 'User data not available. Please log in.');
    }
  } catch (error) {
    console.error('Error sending location data to server:', error);
  }
};

export default function GpsScreen({ route, navigation }) {
	let { userData } = route.params;
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [user, setUser] = useState([]);
	const [markers, setMarkers] = useState([]);
	
	useEffect(() => {
		(async () => {
		  let { status } = await Location.requestForegroundPermissionsAsync();
		  if (status !== 'granted') {
			console.error('Permission to access location was denied');
			return;
		  }

		  Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
			accuracy: Location.Accuracy.High,
			timeInterval: 10000, // Update every 60 seconds
			distanceInterval: 0, // Update every 100 meters
			showsBackgroundLocationIndicator: true,
		  });

		  // Clean up the task when the component unmounts
		  return () => {
			Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
		  };
		})();
	  }, []);
	
	//gaunami kitu zmoniu koordinates
	useEffect(() => {
	  const fetchData = async () => {
		await axios.post('https://gps.inte.lt/api/gps_get', { 'user_id': userData.id, })
				.then((response) => {
					setMarkers(response.data.data);
					console.log('MARKER:', response.data.data);
				})
				.catch((error) => {
					console.error('GET Error:', error);
					//Alert.alert('Error', 'GPS failed. Please try again.');
				});
		};

		fetchData();
	  
		const intervalId = setInterval(() => {
		  fetchData();
		}, 5000);
		return () => clearInterval(intervalId);
	}, []);

  return (
    <View style={styles.container}>
	<StatusBar barStyle="light-content" />
      <MapView 
		provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        mapType='hybrid'
        region={{
          latitude: location ? location.coords.latitude : 0,
          longitude: location ? location.coords.longitude : 0,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        }}
		showsCompass={true}
		showsUserLocation={true}
        showsMyLocationButton={true}
      >
		{markers.map((marker, index) => (
		  <Marker
			key={index}
			coordinate={{
			  latitude: marker.latitude ? marker.latitude : 0,
			  longitude: marker.longitude ? marker.longitude : 0,
			}}
			title={JSON.stringify(marker.user.name)} // Convert user_id to string
		  />
		))}

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
