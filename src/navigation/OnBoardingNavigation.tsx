import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAMES} from '../config';
import {Language, OnBoardings} from '../container/auth';

const Stack = createNativeStackNavigator();
const defaultOptions : any = {
  headerShown: false,
  animation: 'slide_from_right',
};
const OnBoardingNavigation = () => {
  return (
    <Stack.Navigator screenOptions={defaultOptions}>
      {/* <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.Language}
        component={Language}
      /> */}
      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.OnBoarding}
        component={OnBoardings}
      />
    </Stack.Navigator>
  );
};
export default OnBoardingNavigation;
