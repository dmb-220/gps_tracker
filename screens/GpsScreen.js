import React, {useState, useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar, Text, View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import axios from 'axios';
import moment from 'moment';

const LOCATION_TASK_NAME = 'background-location-task';

const getDataWithExpiration = async (key) => {
    try {
      const storedData = await AsyncStorage.getItem(key);

      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        const currentTimestamp = new Date().getTime();

        if (currentTimestamp < parsedData.expirationTime) {
          return {
			  data: parsedData.data,
			  userId: parsedData.data.id
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
	const mapRef = useRef(null);
	
	const [location, setLocation] = useState({
		coords: { latitude: 0, longitude: 0 }
	});
	const [locationStarted, setLocationStarted] = useState(false);
	const [ok, setOK] = useState(true);
	const [user, setUser] = useState([]);
	const [markers, setMarkers] = useState([]);
	
	const changeRegion = (latitude, longitude) => {
		if (mapRef.current) {
		  mapRef.current.animateToRegion({
			latitude,
			longitude,
			latitudeDelta: 0.009,
			longitudeDelta: 0.009,
		  });
		}
	};
	
	// Define the background location task
	TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
	  if (error) {
		console.error('Error in background location task:', error);
		return;
	  }
	  
	  if (data) {
		const { locations } = data;
		if(ok){
			changeRegion(locations[0].coords.latitude, locations[0].coords.longitude);
			setOK(false);
		}
		// Send the location data to your server using Axios
		sendLocationDataToServer(locations);
	  }
	});
	
	useEffect(() => {
		const config = async () => {
            let resf = await Location.requestForegroundPermissionsAsync();
            let resb = await Location.requestBackgroundPermissionsAsync();
            if (resf.status != 'granted' && resb.status !== 'granted') {
                console.log('Permission to access location was denied');
            } else {
                console.log('Permission to access location granted');
            }
        };

        config();

		Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
			accuracy: Location.Accuracy.High,
			timeInterval: 5000,
			distanceInterval: 0,
			showsBackgroundLocationIndicator: true,
			foregroundService: {
				notificationTitle: "Background Location",
				notificationBody: "Location updates are running in the background",
				notificationColor: "#ff0000",
			},
		});

		// Clean up the task when the component unmounts
		return () => {
			Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
		};
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
	<StatusBar barStyle="dark-content" />
      <MapView 
		provider={PROVIDER_GOOGLE}
		ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        mapType='hybrid'
        initialRegion={{
          latitude: location ? location.coords.latitude : 0,
          longitude: location ? location.coords.longitude : 0,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        }}
		loadingEnabled={true}
		showsCompass={true}
		showsUserLocation={true}
        showsMyLocationButton={true}
      >
		{markers.map((marker, index) => {
			const createdDate = new Date(marker.created_at);
			const timeElapsed = moment.duration(moment().diff(createdDate));
			const hours = Math.floor(timeElapsed.asHours());
			const minutes = Math.floor(timeElapsed.asMinutes()) % 60;
			const seconds = Math.floor(timeElapsed.asSeconds()) % 60;
			const formattedTimeElapsed = `Atnaujinta: ${hours} val., ${minutes} min., ${seconds} s.`;

			return (
			  <Marker
				key={index}
				coordinate={{
				  latitude: marker.latitude || 0,
				  longitude: marker.longitude || 0,
				}}
				title={marker.user.name}
				description={`${formattedTimeElapsed}`}
				onPress={() => {
				  changeRegion(marker.latitude || 0, marker.longitude || 0);
				}}
			  />
			);
		  })}

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
