// import React from 'react';
// import { Platform } from 'react-native';
// import {
//   LoginManager,
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
// } from 'react-native-fbsdk-next';

// interface FacebookLoginProps {
//   onLoginSuccess: (accessToken: string, userInfo: any) => void;
//   onLoginError: (error: string) => void;
// }

// const FacebookLogin: React.FC<FacebookLoginProps> = () => {
//   // No UI for this component
//   return null;
// };

// // This function can be imported and used anywhere
// const handleFacebookLogin = async (
//   onLoginSuccess: (accessToken: string, userInfo: any) => void,
//   onLoginError: (error: string) => void
// ): Promise<void> => {
//   try {
//     const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
//     if (result.isCancelled) {
//       throw new Error('User cancelled the login process');
//     }

//     const data = await AccessToken.getCurrentAccessToken();
//     if (!data) {
//       throw new Error('Something went wrong obtaining the access token');
//     }

//     const accessToken = data.accessToken.toString();

//     const request = new GraphRequest(
//       '/me',
//       {
//         accessToken,
//         parameters: {
//           fields: { string: 'id,name,email,picture.type(large)' },
//         },
//       },
//       (error, result) => {
//         if (error) {
//           console.log('GraphRequest error:', error);
//           onLoginError('Failed to fetch user info');
//         } else {
//           console.log('GraphRequest success:', result);
//           onLoginSuccess(accessToken, result); // ✅ pass both
//         }
//       }
//     );

//     new GraphRequestManager().addRequest(request).start();
//   } catch (error: any) {
//     onLoginError(error.message || 'Unexpected Facebook login error');
//   }
// };

// export { handleFacebookLogin };
// export default FacebookLogin;

// FacebookLogin.tsx
import React from 'react';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

interface FacebookLoginProps {
  onLoginSuccess: (accessToken: string) => void;
  onLoginError: (error: string) => void;
}

const handleFacebookLogin = async (onLoginSuccess: (accessToken: string) => void, onLoginError: (error: string) => void) => {
  try {
    const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ],
    )

    if (result.isCancelled) {
      throw new Error('User cancelled the login process');
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw new Error('Something went wrong obtaining the access token');
    }

    onLoginSuccess(data.accessToken.toString());
  } catch (error: any) {
    onLoginError(error.message);
  }
};

const FacebookLogin: React.FunctionComponent<FacebookLoginProps> = ({ onLoginSuccess, onLoginError }) => {
  // This component doesn't return any JSX
  return null;
};

export { handleFacebookLogin }; // Export the reusable function
export default FacebookLogin;
