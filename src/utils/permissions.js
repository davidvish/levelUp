// // import { PermissionsAndroid, Platform } from "react-native";
// // import { check, PERMISSIONS, request } from "react-native-permissions";

// import Contacts from 'react-native-contacts';
// import {PermissionsAndroid, Platform} from 'react-native';
// import React from 'react';

// // const requestCameraPermission = async () => {
// //   let data = { isGraned: false, Message: "message" };

// //   if (Platform.OS == "android") {
// //     try {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.CAMERA,
// //         {
// //           title: "App Camera Permission",
// //           message: "Allow camera permission to upload profile picture.",
// //           buttonNegative: "Cancel",
// //           buttonPositive: "OK",
// //         }
// //       );
// //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //         data = { isGraned: true, Message: "Camera permission given" };
// //         return data;
// //       } else {
// //         data = { isGraned: false, Message: "Camera permission denied" };
// //         console.log("Camera permission denied");
// //         return data;
// //       }
// //     } catch (err) {
// //       console.warn(err);
// //       data = { isGraned: false, Message: "Error with camera" };

// //       return data;
// //     }
// //   } else {
// //     data = { isGraned: true, Message: "ios" };
// //     return data;
// //   }
// // };

// // const requestLocationPermission = async () => {
// //   let data = { isGraned: false, Message: "message" };

// //   if (Platform.OS == "android") {
// //     try {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //         {
// //           title: "Location Permission",
// //           message: "Allow Location permission to show Near by driver.",
// //           buttonNegative: "Cancel",
// //           buttonPositive: "OK",
// //         }
// //       );
// //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //         data = { isGraned: true, Message: "Camera permission given" };
// //         return data;
// //       } else {
// //         data = { isGraned: false, Message: "Camera permission denied" };
// //         console.log("Camera permission denied");
// //         return data;
// //       }
// //     } catch (err) {
// //       console.warn(err);
// //       data = { isGraned: false, Message: "Error with camera" };

// //       return data;
// //     }
// //   } else {
// //     data = { isGraned: true, Message: "ios" };
// //     return data;
// //   }
// // };

// const requestContactPermission = async () => {
//   let data = {isGraned: false, Message: 'message'};

//   if (Platform.OS == 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
//         {
//           title: 'contacts Permission',
//           message: 'Please grant permission to access contacts.',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         data = {isGraned: true, Message: 'permission given'};
//         return data;
//       } else {
//         data = {isGraned: false, Message: 'permission denied'};
//         console.log('contacts permission denied');
//         return data;
//       }
//     } catch (err) {
//       console.log(err);
//       data = {isGraned: false, Message: err || 'Error with contacts'};

//       return data;
//     }
//   } else {
//     return Contacts.checkPermission().then(permission => {
//       if (permission === 'authorized') {
//         data = {isGraned: true, Message: 'Permission given'};
//         return data;
//       } else if (permission === 'denied') {
//         data = {
//           isGraned: false,
//           Message: 'Permission denied please enable manually from app settings',
//         };
//         return data;
//       } else {
//         data = {
//           isGraned: undefined,
//           Message: 'Permission not given ',
//         };
//         return data;
//       }
//     });
//   }
// };
// // const requestContactPermission = async () => {
// //   let data = { isGranted: false, Message: "message" };

// //   if (Platform.OS == "android") {
// //     try {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
// //         {
// //           title: "Contacts Permission",
// //           message: "Please grant permission to access contacts.",
// //           buttonNegative: "Cancel",
// //           buttonPositive: "OK",
// //         }
// //       );
// //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //         data = { isGranted: true, Message: "Permission given" };
// //         return data;
// //       } else {
// //         data = { isGranted: false, Message: "Permission denied" };
// //         console.log("contacts permission denied");

// //         return data;
// //       }
// //     } catch (err) {
// //       console.warn(err);
// //       data = { isGranted: false, Message: "Error with contacts" };

// //       return data;
// //     }
// //   } else {
// //     const granted = await request(PERMISSIONS.IOS.CONTACTS);

// //     if (granted == "granted") {
// //       data = { isGranted: true, Message: "ios" };
// //       return data;
// //     } else {
// //       data = { isGranted: false, Message: "Permission denied" };
// //       console.log(
// //         "🚀 ~ file: Permissions.js:94 ~ requestContactPermission ~ data",
// //         data
// //       );

// //       return data;
// //     }
// //   }
// // };

// export {
//   //   requestCameraPermission,
//   //   requestLocationPermission,
//   requestContactPermission,
// };
import { PermissionsAndroid, Platform } from 'react-native';

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to your files to upload documents',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else if (Platform.OS === 'android' && Platform.Version >= 33) {
    // Android 13+ media permissions
    const images = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
    );
    const videos = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
    );
    return images === PermissionsAndroid.RESULTS.GRANTED && videos === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};
