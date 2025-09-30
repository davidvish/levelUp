// GoogleSignInUtil.ts

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

interface SignInResult {
  success: boolean;
  userInfo?: any;
  error?: string;
}

GoogleSignin.configure();

const signInWithGoogle = async (): Promise<SignInResult> => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn();
    return { success: true, userInfo };
  }catch (error: any) {
    console.error('Google Sign-In Error:', error); // Log the error for debugging

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return { success: false, error: 'User cancelled the login flow' };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return { success: false, error: 'Operation is in progress already' };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return { success: false, error: 'Play services not available or outdated' };
    } else {
      return { success: false, error: 'Some other error happened' };
    }
  }
};

export { signInWithGoogle };
