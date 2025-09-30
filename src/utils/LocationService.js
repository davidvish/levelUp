import Geolocation from 'react-native-geolocation-service';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {ENV} from '../config';
import {STRINGS} from '../constants';
import {locationPermissionsGivenAction} from '../container/app/Home/module/action';
Geocoder.init(ENV.GOOGLE_MAPS_APIKEY);
const LocationService = {
  getLocation: async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          // Alert.alert(STRINGS.warning, error.message, [
          //     {
          //         text: STRINGS.cancel,
          //         onPress: () => console.log("Cancel Pressed"),
          //         style: "cancel",
          //     },
          //     {
          //         text: STRINGS.openSettings,
          //         onPress: () => {
          //             Linking.openSettings();
          //         },
          //     },
          // ])
        }
      } else {
        await Geolocation.requestAuthorization('always');
      }

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };

            // Use reverse geocoding to get the address
            Geocoder.from(position.coords.latitude, position.coords.longitude)
              .then(geocoderResult => {
                const locationInfo = {
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  address: geocoderResult.results[0].formatted_address
                };
                resolve(locationInfo);
              })
              .catch(error => {
                Alert.alert('Alert', error.message);
                reject(error.message);
              });
          },
          error => {
            // Alert.alert(STRINGS.warning, error.message, [
            //     {
            //         text: STRINGS.cancel,
            //         onPress: () => console.log("Cancel Pressed"),
            //         style: "cancel",
            //     },
            //     {
            //         text: STRINGS.openSettings,
            //         onPress: () => {
            //             if (Platform.OS === "android") {
            //                 Linking.openSettings();
            //             } else {
            //                 Linking.openURL("app-settings:");
            //             }
            //         },
            //     },
            // ])
            reject(error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
      });
    } catch (error) {
      Alert.alert('Location permission error');
    }
  }
};

export default LocationService;
