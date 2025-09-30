import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAMES } from '../config';
import { loginSelector } from '../container/auth/Login/module/reducer';
import { ForgotPassword, NewPassword } from '../container/auth';
import { Login } from '../container/auth/Login';

const Stack = createNativeStackNavigator();

const modalType : any = {
  animation: 'slide_from_bottom',
  headerShown: false,
};

const defaultOptions : any = {
  headerShown: false,
  animation: 'slide_from_right',
};

const modalOptions = {
  animation: 'slide_from_bottom',
  headerShown: false,
  presentation: 'modal',
};


const AuthNavigation = () => {
  const { firstTimeLogin, islogin } = loginSelector();
  return (
    <Stack.Navigator
      screenOptions={defaultOptions}>
      <Stack.Screen
        options={firstTimeLogin ? modalType : defaultOptions}
        name={SCREEN_NAMES.Login}
        component={Login}
      />
      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.ForgotPassword}
        component={ForgotPassword}
      />

      <Stack.Screen
         options={defaultOptions}
        name={SCREEN_NAMES.NewPassword}
        component={NewPassword}
      />
    </Stack.Navigator>
  );
};
export default AuthNavigation;
