import React from 'react';
import { Platform } from 'react-native';
import { appleAuth, AppleRequestResponse } from '@invertase/react-native-apple-authentication';

interface AppleUserData {
  userId: string;
  email: string | null;
  emailVerified: boolean | null;
  fullName: {
    givenName: string | null;
    familyName: string | null;
    middleName: string | null;
    namePrefix: string | null;
    nameSuffix: string | null;
    nickname: string | null;
  } | null;
  identityToken: string | null;
  authorizationCode: string | null;
  realUserStatus: number | null;
  issuedAt: string | null;
  expiresAt: string | null;
}

interface AppleAuthResponse {
  success: boolean;
  data?: AppleUserData;
  error?: string;
  isSupported: boolean;
}

export const useAppleAuth = () => {
  // Check if Apple Auth is supported on this platform
  const isAppleAuthSupported = Platform.select({
    ios: true,
    android: false,
    default: false
  });

  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isAppleAuthSupported) {
      unsubscribe = appleAuth.onCredentialRevoked(async () => {
        console.warn('Apple credentials have been revoked');
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const extractAppleUserData = (response: AppleRequestResponse): AppleUserData => {
    let decodedToken = null;
    
    if (response.identityToken) {
      try {
        decodedToken = JSON.parse(atob(response.identityToken.split('.')[1]));
        console.log('Decoded token:', decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    return {
      userId: response.user,
      email: decodedToken?.email || null,
      emailVerified: decodedToken?.email_verified || null,
      fullName: response.fullName || null,
      identityToken: response.identityToken,
      authorizationCode: response.authorizationCode,
      realUserStatus: response.realUserStatus,
      issuedAt: decodedToken?.iat ? new Date(decodedToken.iat * 1000).toISOString() : null,
      expiresAt: decodedToken?.exp ? new Date(decodedToken.exp * 1000).toISOString() : null,
    };
  };

  const onAppleButtonPress = async (): Promise<AppleAuthResponse> => {
    // Early return if platform is not supported
    if (!isAppleAuthSupported) {
      return {
        success: false,
        error: 'Apple Authentication is not supported on this device',
        isSupported: false
      };
    }

    try {
      const appleAuthResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Log raw response for debugging
      console.log('Raw Apple Auth Response:', JSON.stringify(appleAuthResponse, null, 2));

      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthResponse.user);

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const userData = extractAppleUserData(appleAuthResponse);
        
        console.log('=== Processed Apple User Data ===');
        console.log(JSON.stringify(userData, null, 2));
        console.log('================================');

        return {
          success: true,
          data: userData,
          isSupported: true
        };
      }

      return {
        success: false,
        error: 'User not authorized',
        isSupported: true
      };

    } catch (error: unknown) {
      console.error('Apple Authentication Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isSupported: true
      };
    }
  };

  return {
    onAppleButtonPress,
    isAppleAuthSupported
  };
};