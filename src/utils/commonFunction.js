import { Platform, Share, Vibration } from 'react-native';
import { ENV, SCREEN_NAMES } from '../config';
import { navigationRef } from '../navigation/rootNavigation';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import {actionSheetRef} from '../Common/ActionSheet/ActionSheet';
import { clearAuthenticationToken, clearUserId, setAuthenticationToken } from './authentication';
import { STRINGS } from '../constants';
import moment from 'moment-timezone';
import { refreshTokenRequestAction } from '../container/auth/Login/module/action';
import { loginSelector } from '../container/auth/Login/module/reducer';

// Geocoder.init('AIzaSyCxT0bWYVtnIjEp6H1HKhKxMbNfFtwJJGI');
export const _onPressNavigate = (key, data = {}) => {
  navigationRef.navigate(key, data);
};

export const _onPressGoBackNavigate = () => {
  navigationRef.goBack();
};

export const googleAutocomplete = async (Location, curLat, curLong) => {
  const apiUrl =
    'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
    Location +
    '&key=' +
    ENV.GOOGLE_MAPS_APIKEY +
    //   '&components=country:in|country:us' +
    '&location=' +
    curLat +
    ',' +
    curLong +
    '&radius=' +
    1000;
  // console.log(apiUrl);
  const result = await fetch(apiUrl);
  const json = await result.json();
  return json;
};

// export const RNImagePicker = async type => {
//   if (type == 1) {
//     let image = await handleGallery();

//     return image;
//   } else {
//     let image = await handleCamera();

//     return image;
//   }
// };

// const handleCamera = async () => {
//   const options = {
//     mediaType: 'photo',
//     quality: 0.8,
//     saveToPhotos: true,
//     presentationStyle: Platform.OS == 'ios' ? 'popover' : 'currentContext',
//     //     width: 30,
//     //     height: 30,
//     //     quality: 0.1,
//   };
//   if (Platform.OS == 'android') {
//     try {
//       const image = await launchCamera(options);
//       if (image) {
//         actionSheetRef.current?.hide();
//         return image;
//       }
//     } catch (err) {
//       console.log(err);
//       alert(err);
//     }
//   } else {
//     try {
//       const image = await launchCamera(options);
//       if (image) {
//         actionSheetRef.current?.hide();
//         return image;
//       }
//     } catch (err) {
//       console.log(err);
//       alert(err);
//     }
//   }
// };

// const handleGallery = async () => {
//   const options = {
//     mediaType: 'photo',
//     quality: 0.8,
//     presentationStyle: Platform.OS == 'ios' ? 'popover' : 'currentContext',
//   };
//   if (Platform.OS == 'android') {
//     try {
//       const image = await launchImageLibrary(options);
//       if (image) {
//         actionSheetRef.current?.hide();
//         return image;
//       }
//     } catch (err) {
//       console.log(err);
//       alert(err);
//     }
//   } else {
//     try {
//       const image = await launchImageLibrary(options);
//       if (image) {
//         actionSheetRef.current?.hide();
//         return image;
//       }
//     } catch (err) {
//       console.log(err);
//       alert(err);
//     }
//   }
// };

export const getCoordsFromPlaceId = async place_id => {
  // this.areaTextInput.focus();
  try {
    let resp = await fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?place_id=' +
      place_id +
      '&key=' +
      ENV.GOOGLE_MAPS_APIKEY,
    );

    let respJson = await resp.json();

    let results = respJson.results[0];
    const coords = {
      lat: results.geometry.location.lat,
      lng: results.geometry.location.lng,
    };

    return coords;
  } catch (error) {
    return error;
  }
};

export const onLogout = async () => {
  //   console.log("hit logout function");
  vibrate();
  await clearAuthenticationToken();
  await clearUserId();
  navigationRef.reset({
    routes: [{ name: SCREEN_NAMES.AuthNavigation }],
  });
};

export const onShare = async message => {
  try {
    const result = await Share.share({
      message: message || '',
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

export const vibrate = (time, key) => {
  const PATTERN = [100, 200, 100, 200, 100, 200, 100];
  if ((key = 'pattern')) {
    Vibration.vibrate(PATTERN);
  } else {
    Vibration.vibrate(time || 250);
  }
};
// export const reducer = (state, action) => {
//   if (action.type) {
//     if (action.type == "multiple") return { ...state, ...action.value };
//     else return { ...state, [action.type]: action.value };
//   } else {
//     return { ...state };
//   }
// };

// export const toHoursAndMinutes = (totalMinutes) => {
//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;

//   return `${hours > 0 ? ` ${hours.toFixed(0)}h` : ""}${
//     minutes > 0 ? ` ${minutes.toFixed(0)}m` : ""
//   }`;
// };

// export const takeScreenShot = async () => {
//   // To capture Screenshot
//   return captureScreen({
//     // Either png or jpg (or webm Android Only), Defaults: png
//     format: "jpg",
//     // Quality 0.0 - 1.0 (only available for jpg)
//     quality: 0.9,
//   }).then(
//     //callback function to get the result URL of the screnshot
//     (uri) => {
//       return uri;
//     },
//     (error) => console.error("Oops, Something Went Wrong", error)
//   );
// };

// export const getDirections = async (startLoc, destinationLoc) => {
//   try {
//     //     const KEY = "AIzaSyDeShDuLeYGI_BB80LaHFxie6vmLQS7fwc"; //put your API key here.
//     const KEY = ENV.GOOGLE_MAPS_APIKEY; //put your API key here.
//     //otherwise, you'll have an 'unauthorized' error.
//     let resp = await fetch(
//       `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`
//     );
//     let respJson = await resp.json();
//     let points = decode(respJson.routes[0].overview_polyline.points);
//     //     console.log(points);
//     let coords = points.map((point, index) => {
//       return {
//         latitude: point[0],
//         longitude: point[1],
//       };
//     });
//     //     console.log("coords", coords);
//     return coords;
//   } catch (error) {
//     return error;
//   }
// };
// export const getAddressFromCoords = async (latitude, longitude) => {
//   try {
//     const KEY = ENV.GOOGLE_MAPS_APIKEY; //put your API key here.
//     //     const KEY = "AIzaSyDeShDuLeYGI_BB80LaHFxie6vmLQS7fwc"; //put your API key here.
//     //otherwise, you'll have an 'unauthorized' error.
//     let resp = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${KEY}`
//     );
//     let respJson = await resp.json();

//     let address = respJson.results[0];
//     return address;
//   } catch (error) {
//     return error;
//   }
// };

// export const uriGenrator = (uri, dispatch, callBack) => {
//   dispatch(loaderShowAction(STRINGS.imageLoadingNote));
//   let body = {
//     name: "image" + moment().format("hhmmss"),
//     uri: Platform.OS == "android" ? uri : uri.replace("file://", ""),
//     type: "image/jpg",
//   };
//   const callback = (res) => {
//     dispatch(loaderHideAction());
//     if (res && res.data) {
//       callBack(res.data);
//     } else {
//       callBack("error");
//     }
//   };
//   dispatch(profilePhotoUpdateRequestAction({ body, callback }));
// };

// export const dialCall = (number) => {
//   let phoneNumber = "";
//   if (Platform.OS === "android") {
//     phoneNumber = `tel:${number}`;
//   } else {
//     phoneNumber = `telprompt:${number}`;
//   }
//   Linking.openURL(phoneNumber);
// };

// export const LocationShare = (label, latitude, longitude) => {
//   console.log(
//     "🚀 ~ file: commonFunction.js:276 ~ LocationShare ~ longitude:",
//     longitude
//   );
//   console.log(
//     "🚀 ~ file: commonFunction.js:276 ~ LocationShare ~ latitude:",
//     latitude
//   );
//   console.log(
//     "🚀 ~ file: commonFunction.js:276 ~ LocationShare ~ label:",
//     label
//   );
//   const url = Platform.select({
//     ios: "maps:" + latitude + "," + longitude + "?q=" + label,
//     android: "geo:" + latitude + "," + longitude + "?q=" + label,
//   });

//   Linking.canOpenURL(url).then((supported) => {
//     if (supported) {
//       return Linking.openURL(url);
//     } else {
//       const browser_url =
//         "https://www.google.de/maps/@" +
//         latitude +
//         "," +
//         longitude +
//         "?q=" +
//         label;
//       return Linking.openURL(browser_url);
//     }
//   });
// };


export function convertDateIntoDay(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[monthIndex];
  const newConvertDate = `${monthName} ${day}, ${year}`
  return { day, monthName, year, newConvertDate };
}

export function convertIntoMonth(time, timeZone) {
  const timeInJapanTimezone = moment.tz(time, timeZone);
  const systemTimezone = moment.tz.guess();
  const timeInSystemTimezone = timeInJapanTimezone.clone().tz(systemTimezone);
  const formatedMonth = timeInSystemTimezone.format('MMM');
  return formatedMonth
}

export function convertIntoDate(time, timeZone) {
  const currentTimezone = moment.tz(time, 'YYYY-MM-DD HH:mm', timeZone).toDate()
  const formatedDate = this.datePipe.transform(currentTimezone, 'dd')
  return formatedDate
}

export function convertIntoTime(time, timeZone) {
  const timeInJapanTimezone = moment.tz(time, timeZone);
  const systemTimezone = moment.tz.guess();
  const timeInSystemTimezone = timeInJapanTimezone.clone().tz(systemTimezone);
  const formattedTime = timeInSystemTimezone.format('HH:mm');
  return formattedTime;
}
