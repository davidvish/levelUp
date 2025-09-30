/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

// import messaging from "@react-native-firebase/messaging";

// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log("Message handled in the background!", remoteMessage);
// });

// if (__DEV__) {
//   global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
//   global.fetch = global.originalFetch || global.fetch;
// }


LogBox.ignoreAllLogs()
AppRegistry.registerComponent(appName, () => App);
