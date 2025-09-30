import React, {useCallback, useEffect, useState} from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAMES} from '../config';
import {Linking, Platform, useColorScheme} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {scale} from 'react-native-size-matters';
import AppNavigation from './appNavigation';
import {STRINGS} from '../constants';
import {RNNotificationAlert} from '../Common';
import AuthNavigation from './authNavigation';
import {useDispatch} from 'react-redux';
import OnBoardingNavigation from './OnBoardingNavigation';
import {loginSelector} from '../container/auth/Login/module/reducer';
import {getAuthenticationToken, setAuthenticationToken, setFcmToken} from '../utils/authentication';
import {getFirebaseToken} from '../Firebase/FCMService';
import { refreshTokenRequestAction } from '../container/auth/Login/module/action';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

const RootNavigation = () => {
  const {firstTimeLogin, islogin, userData} = loginSelector();
  const dispatch = useDispatch();
  const isDarkMode = useColorScheme() === 'dark';
  const [state, setState] = useState({
    showNetworkAlert: false
  });
  const {showNetworkAlert} = state;

  const [initialRoute, setinitialRoute] = useState<any>(null);

  useEffect(() => {
    getAuthState();
  }, [initialRoute]);

 const refreshTokenFunction = () => {
    let body = {
      token: userData?.accessToken || "",
      refreshToken: userData?.refreshToken || ""
    }
    const callback = async (res: any) => {
      if (res !== 'error') {
        await setAuthenticationToken(res?.data?.token);
      }
    }
    dispatch(refreshTokenRequestAction({ body, callback }))
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          showNetworkAlert:
            !state?.isConnected && !state?.isInternetReachable ? true : false
        }));
      }, 2000);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  

  const getAuthState = async () => {
    const Token = await getAuthenticationToken();
    //const FCMToken = await getFirebaseToken();
    if (firstTimeLogin) {
       setinitialRoute(SCREEN_NAMES.OnBoardingNavigation);
       //setinitialRoute(SCREEN_NAMES.AppNavigation);
      // console.log('firstTimeLogin');
    } else {
      if (Token) {
        // console.log('token access');
        refreshTokenFunction();
        setinitialRoute(SCREEN_NAMES.AppNavigation);
      } else {
        setinitialRoute(SCREEN_NAMES.AuthNavigation);
        // console.log('token not access');
      }
    }
  };

  const NetInformationComponent = () => {
    return <NetworkChecker showNetworkAlert={showNetworkAlert} />;
  };
  return (
    <NavigationContainer ref={navigationRef}>
      {initialRoute ? (
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen
            name={SCREEN_NAMES.OnBoardingNavigation}
            component={OnBoardingNavigation}
          />
          <Stack.Screen
            name={SCREEN_NAMES.AuthNavigation}
            component={AuthNavigation}
          />
          <Stack.Screen
            name={SCREEN_NAMES.AppNavigation}
            component={AppNavigation}
          />
        </Stack.Navigator>
      ) : null}

      {NetInformationComponent()}
    </NavigationContainer>
  );
};

export default RootNavigation;

const NetworkChecker = ({ showNetworkAlert }: { showNetworkAlert: boolean }) => {
  const _onPressInternetRetry = useCallback(async () => {
    if (Platform.OS === 'android') {
      await Linking.openSettings();
    } else {
      await Linking.openURL('app-settings:');
    }
  }, []);
  return showNetworkAlert ? (
    <RNNotificationAlert
      container={{
        width: '97%',
        alignSelf: 'center',
        borderRadius: 7,
        position: 'absolute',
        zIndex: 30,
        bottom: scale(30),
        // alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 5,
        paddingVertical: 10
      }}
      title={STRINGS.needAttention}
      onPress={_onPressInternetRetry}
      body={STRINGS.networkIssueMessage}
      rightButtonTitle={STRINGS.openSettings}
    />
  ) : null;
};
