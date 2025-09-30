import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  UIManager,
  View,
  useColorScheme
} from 'react-native';
import {COLORS, IMAGES} from './constants';
import RootNavigation from './navigation/rootNavigation';
import Toast, {ToastProvider} from 'react-native-toast-notifications';
import {RNIcon, RNImage} from './Common';
//import SplashScreen from 'react-native-splash-screen';
import {persistor, store} from './redux/Store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {scale} from 'react-native-size-matters';
import { Settings } from 'react-native-fbsdk-next';

Settings.initializeSDK();
// Settings.setAppID('1144571979508085');
// Settings.setClientToken('80a8a7738c59741d15ece29cc19b296b');

const { width } = Dimensions.get('window');
const aspectRatio = 18 / 9;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App = () => {
  const [videoFinished, setVideoFinished] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';


  useEffect(() => {
    setTimeout(() => {
      setVideoFinished(true);
    }, 1500);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      {videoFinished ? (
        <><StatusBar
            backgroundColor={COLORS.BG_COLOR}
            barStyle={'dark-content'} />
            <RootNavigation />
            <ToastProvider>
              <CustomToast />
            </ToastProvider></>
                ) : (
                  <View style={styles.container}>
                     <Image
                        source={require('./assets/images/splashImage.gif')}
                        style={styles.gif}
                        resizeMode="cover"
                      />
                  </View>
                )}
      </PersistGate>
    </Provider>
  );
};

export default App;

const CustomToast = () => {
  return (
    <Toast
      //   duration={1500}
      //   animationDuration={200}
      ref={ref => ((global as any)['Toast'] = ref)}
      placement="top"
      animationType="zoom-in"
      successColor="#4CAF50"
      dangerColor="#FF5C60"
      style={{
        //    backgroundColor: COLORS.BG_COLOR,
        //backgroundColor: COLORS.CREAM_COLOR,
        minHeight: 50,
        //    position: "absolute",
        //    zIndex: 2,
        borderRadius: 20,
        maxWidth: '100%',
        justifyContent: 'center'
      }}
      textStyle={{
        //textTransform: 'capitalize',
        color: COLORS.WHITE,
        marginHorizontal: 10
      }}
      successIcon={
        <RNImage source={IMAGES.successFaceSmile} style={{width:25,height:25, marginLeft:10}}/>
      }
      dangerIcon={
        <RNImage source={IMAGES.failFaceSmile} style={{width:25,height:25, marginLeft:10}}/>
      }
      warningIcon={
        <RNIcon
          style={{marginLeft: 10}}
          type={'AntDesign'}
          name="infocirlce"
          color={'orange'}
          size={25}
        />
      }
      offset={Platform.OS == 'ios' ? scale(35) : scale(10)}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BG_COLOR, // Set background color to match your splash screen background
  },
  video: {
    aspectRatio: 17/9, // Adjust the aspect ratio as needed
    width: '100%',
    height: null, // Height will be calculated based on aspect ratio
  },
  gif: {
    aspectRatio: 17/9, // Adjust the aspect ratio as needed
    width: '110%',
    height: null,
    // width: width,
    // height: width / aspectRatio,
  },
});

