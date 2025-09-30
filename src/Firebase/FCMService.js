import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';

const getToken = async () => {
  try {
    const token = await messaging().getToken();
    if (token) return token;
  } catch (error) {
    console.log(error);
  }
};

async function getFirebaseToken() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // if (Platform.OS === 'ios') {
      //     // await messaging().registerDeviceForRemoteMessages();
      //     await messaging().setAutoInitEnabled(true);
      //     await messaging().registerDeviceForRemoteMessages()
      // }
      // console.log('Authorization status:', authStatus);
      const fcmToken = await getToken();
      if (enabled) return fcmToken;
    } else {
      const fcmToken = await getToken();
      return fcmToken;
    }
  } catch (error) {
    Alert.alert(error);
  }
}

export {getFirebaseToken};
