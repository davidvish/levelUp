import React, {useEffect, useRef, useState} from 'react';
import {RNButton, RNImage, RNText, RNTextInput} from '../../../Common';
import {
  _onPressGoBackNavigate,
  _onPressNavigate,
  vibrate
} from '../../../utils/commonFunction';
import {scale} from 'react-native-size-matters';
import {
  View,
  ScrollView,
  Dimensions,
  Pressable,
  StatusBar,
  Keyboard,
  BackHandler,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import {COLORS, IMAGES, STRINGS} from '../../../constants';
import {SCREEN_NAMES} from '../../../config';
import {loginSelector} from './module/reducer';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {navigationRef} from '../../../navigation/rootNavigation';
import {
  loginRequestAction,
  loginSuccessAction,
  remberMeAction,
  socialAppleRequestAction,
  socialFacebookLoginRequestAction,
  socialGoogleLoginRequestAction,
  socialMicrosoftLoginRequestAction
} from './module/action';
import {styles} from './styles';
import {handleFacebookLogin} from './soicalLogin/faceBookLogin';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
//import { signInWithGoogle } from './soicalLogin/googleLogin';
import {
  setAuthenticationToken,
  setCompanyId,
  setUserId
} from '../../../utils/authentication';
import {
  initializePCA,
  acquireToken,
  getAccounts,
  acquireTokenSilent
} from './soicalLogin/azureLoginComponent';
import {CheckBox} from 'react-native-elements';
import {useAppleAuth} from './soicalLogin/AppleLogin';
import {ENV} from '../../../config';
//import { AccessToken, AuthenticationToken, LoginButton } from 'react-native-fbsdk-next';

const screenWidth = Dimensions.get('window').width;
const Login = (props: any) => {
  const {firstTimeLogin, islogin, loginDetails} = loginSelector();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  //const [check1, setCheck1] = useState(false);
  const InputRef: any = useRef({
    email: React.createRef(),
    password: React.createRef()
  });
  const [state, setState] = useState({
    email: '',
    password: '',
    errorMessage: '',
    rememberMe: false
  });
  const {email, password, errorMessage, rememberMe} = state;
  const [loading, setLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [AzureLoginLoading, setAzureLoginLoading] = useState(false);
  const [FaceLoginLoading, setFaceLoginLoading] = useState(false);

  const {onAppleButtonPress} = useAppleAuth();

  const handleAppleLogin = async () => {
    const response = await onAppleButtonPress();
    if (response.success && response.data) {
      console.log('Apple login successful:', response.data);
      setGoogleLoginLoading(true);
      let body = {
        identityToken: response?.data?.identityToken,
        type: 'User',
        action: 'SignIn',
        platform: 'MOBILE',
        authorizationCode: response?.data?.authorizationCode,
        fullName: response?.data?.fullName
      };
      let callback = (res: any) => {
        setGoogleLoginLoading(false);
        if (res != 'error') {
          userExistFunction(res);
        }
      };
      dispatch(socialAppleRequestAction({body, callback}));
    } else {
      console.error('Apple login failed:', response.error);
    }
  };

  useEffect(() => {
    navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      );
    });
    navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      );
      (navigation as any).removeListener('blur');
      (navigation as any).removeListener('focus');
    };
  }, []);

  const handleBackButtonClick = () => {
    Alert.alert(STRINGS.confirmation, STRINGS.appExitWarning, [
      {
        text: STRINGS.exit,
        onPress: () => {
          BackHandler.exitApp();
        }
      },
      {
        text: STRINGS.cancel,
        onPress: () => console.log('cancelled')
      }
    ]);
    return true;
  };

  const handleOnSubmitEditing = (next: any) => {
    if (next) {
      InputRef?.current?.[next]?.current?.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const _onChangeText = (name: any, value: any) => {
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (loginDetails?.rememberMe) {
      setState(prev => ({
        ...prev,
        email: loginDetails?.email,
        password: loginDetails?.password,
        rememberMe: loginDetails?.rememberMe
      }));
    }
  }, []);

  const _onPressLogin = async () => {
    try {
      // Set the loading state to true
      setLoading(true);

      // Handle the "Remember Me" functionality
      const rememberMeBody = rememberMe
        ? {email, password, rememberMe: true}
        : {};

      dispatch(remberMeAction({body: rememberMeBody}));

      // Prepare the login request body
      const loginBody = {
        email,
        password,
        provider: 'Manually'
      };

      // Callback to handle the response
      const callback = (res: any) => {
        setLoading(false);
        if (res !== 'error') {
          //  refreshTokenFunction(res);
          setTimeout(() => {
            userExistFunction(res?.data);
          }, 2000);
          let body = null;
          vibrate();
          navigationRef.reset({
            routes: [{name: SCREEN_NAMES.AppNavigation}]
          });
          LoggedTimeEntry(res?.data?.accessToken);
        }
      };

      // Dispatch the login request action
      dispatch(loginRequestAction({body: loginBody, callback}));
    } catch (error) {
      setLoading(false); // Ensure loading is stopped in case of an error
      console.error('Login failed:', error);
    }
  };

  const LoggedTimeEntry = async (token: string) => {
    try {
      const response = await fetch(
        'https://appdev.leveluplms.com/api/master/LoggedTimeEntry',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: null
        }
      );

      const data = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //// FaceBookLogin Function Start here ////

  // const handleLoginSuccess = (accessToken: string, userInfo: any) => {
  //   setFaceLoginLoading(false);
  //   console.log('✅ Facebook user info:', userInfo);

  //   if (userInfo?.id) {
  //     facebookLoginApiFunction(accessToken); // or pass userInfo too if needed
  //   } else {
  //     Toast.show("User information not found", { type: 'danger' });
  //   }
  // };

  const handleLoginSuccess = async (accessToken: string) => {
    setFaceLoginLoading(true);
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
      );
      if (response.ok) {
        setFaceLoginLoading(false);
        const userInfo = await response.json();
        console.log('Facebook user information:', userInfo, accessToken);
        if (userInfo || userInfo?.id) {
          facebookLoginApiFunction(accessToken || '');
        } else {
          Toast.show('User information not found', {type: 'danger'});
        }
      } else {
        setFaceLoginLoading(false);
        console.error('Error fetching user information:', response.statusText);
      }
    } catch (error) {
      setFaceLoginLoading(false);
      console.error('Error fetching user information:', error);
    }
  };

  const handleLoginError = (error: string) => {
    console.error('Facebook login error:', error);
    Toast.show(error, {type: 'danger'});
    //// showing error toast message here /////
  };

  const handleFacebookButtonClick = () => {
    handleFacebookLogin(handleLoginSuccess, handleLoginError);
  };

  const facebookLoginApiFunction = (idToken: string) => {
    setFaceLoginLoading(true);
    let body = {
      accessToken: idToken, //"eyJhbGciOiJSUzI1NiIsImtpZCI6ImJiNDM0Njk1OTQ0NTE4MjAxNDhiMzM5YzU4OGFlZGUzMDUxMDM5MTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTg2MjQxODI2NTIxLTA3bXRtazNkNWk1a2Q4NmZ2cWd2ZHJxY3BuMTlncGdlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTg2MjQxODI2NTIxLTA3bXRtazNkNWk1a2Q4NmZ2cWd2ZHJxY3BuMTlncGdlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEyOTUyNDUwOTc0NTUzOTkyNzA0IiwiZW1haWwiOiJtYW5vanNoYXJtYS51aWRldkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkdHLUtzaTBQX01kd3NlZWVKRTM3TUEiLCJuYmYiOjE3NDk0NTAwMjQsIm5hbWUiOiJNYW5vaiBTaGFybWEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSUJOUUdYUUo2aG1NZU5VNlc3Zk1JUTItTE5zaDhVZEFidUlfVzVZMllCSml2M2hBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik1hbm9qIiwiZmFtaWx5X25hbWUiOiJTaGFybWEiLCJpYXQiOjE3NDk0NTAzMjQsImV4cCI6MTc0OTQ1MzkyNCwianRpIjoiMzQzZGE3NWVmZGRlMjViM2QxMjE2ZDljYTJmZTgzMWI5MTU4MGZkYSJ9.mjdgSuDJ76j2xlzqKdFlN1fY9zTMk6klsDt7oZcUwsUDXkcsjNWY7ELps-SvuYjdq2O1yTumoei7PX5HjeklQRUpS6-cY4I8BIyAHeSPnTMeQyQybXTWuwQdgrSDyDS0JfsU-xL__QaKnbqQCdBLMpaoHqoS3ADOpFSWA6DoNUZOe3_zJjR5cD6QP2ka9hzgJ-HIkVvU3537ipCAziGZhLr9mVKiIvz7qnw3JxowiFqbYzKbBkKBCaWHsmLPL-_ca-bvlZkpTxpZt2GDG_HoxE0qjppq838bjxs5CcmHpSkrxLJdB9VhPate21RegqfOXgCicBecOmhsTg9iOCvhZQ",
      type: 'User',
      action: 'signin'
    };
    let callback = (res: any) => {
      setFaceLoginLoading(false);
      //console.log(res, "resssss")
      if (res != 'error') {
        userExistFunction(res);
      }
    };
    dispatch(socialFacebookLoginRequestAction({body, callback}));
  };

  //// FaceBookLogin Function End here ////

  //// Azure Function start here /////

  async function signIn() {
    await initializePCA();

    const tokenResult = await acquireToken();
    console.log('Token Result:', tokenResult);

    // ⛔ If tokenResult is undefined, stop
    if (tokenResult) {
      AzureLoginApiFunction(tokenResult);
      //onsole.error("Token acquisition failed. Aborting sign-in.");
      //return;
    } else {
      console.log('Azure token not found!!');
    }
    // const accounts: any = await getAccounts();
    // console.log('Accounts:', accounts);

    // if (accounts.length > 0) {
    //   AzureLoginApiFunction(tokenResult); // ✅ Safe now
    // } else {
    //   console.log("Azure token not found!!");
    // }
  }

  const AzureLoginApiFunction = (response: any) => {
    console.log(response, 'hello world');
    setAzureLoginLoading(true);
    let body = {
      // token_type: "Bearer",
      // scope: "",
      // expires_in: 0,
      // ext_expires_in: 0,
      // access_token: response?.accessToken,
      // refresh_token: "",
      // id_token: response?.idToken,
      // client_info: "",
      // type: "User",
      // action: "signin"
      token_type: 'Bearer',
      scope: '',
      expires_in: 0,
      ext_expires_in: 0,
      access_token: response?.accessToken, //"eyJ0eXAiOiJKV1QiLCJub25jZSI6InNuLXBkYVpWT3hZdi1iU2hfUm5XM1YxMjhFSmdwZkNTY1FpclVGSzBjY0kiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jMDYxZjE2MC01MWY5LTQ2OTMtOGYzYi00ZjE1MzIzN2U4ZjQvIiwiaWF0IjoxNzQ5NDQzOTM4LCJuYmYiOjE3NDk0NDM5MzgsImV4cCI6MTc0OTQ0ODU1MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsicDEiXSwiYWlvIjoiQVdRQW0vOFpBQUFBcWZuN3hJOXNjcnFvR0lGWEpGbHJxZzN2TXphOGRoTG90V1daNnFGK0xPWW9BbFYzeHlZeERvOXYyR25rVTFUYml6WDdydnQ4VGRJL0dPc0UrL0s4ZnJXU2plaWV2cHlFTENSSFVmN2RKQUVIUUVoTEc5Tjl2MmkyWVVDMEl3WnUiLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IkxldmVsdXAgTE1TIiwiYXBwaWQiOiIwMTkyMTgyNC0yYmUyLTQ3NzAtYTMxZS05OWRmNDg3ZGI4OTYiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlNoYXJtYSIsImdpdmVuX25hbWUiOiJNYW5vaiIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjI0MDk6NDBkMToxMTA0OjQ2OTplMGUwOjRiMTM6MWU0Nzo4NmFhIiwibmFtZSI6Ik1hbm9qIFNoYXJtYSIsIm9pZCI6IjFmMWY1MWUyLWMwNGMtNDliNS1iNWRjLTMyYWEwNDcwNjQ4OSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMzE5RUI4NDlGIiwicmgiOiIxLkFTZ0FZUEZod1BsUmswYVBPMDhWTWpmbzlBTUFBQUFBQUFBQXdBQUFBQUFBQUFBb0FEVW9BQS4iLCJzY3AiOiJDYWxlbmRhcnMuUmVhZFdyaXRlIENhbGVuZGFycy5SZWFkV3JpdGUuU2hhcmVkIERpcmVjdG9yeS5BY2Nlc3NBc1VzZXIuQWxsIERpcmVjdG9yeS5SZWFkV3JpdGUuQWxsIGVtYWlsIEZpbGVzLlJlYWQgR3JvdXAuUmVhZFdyaXRlLkFsbCBPbmxpbmVNZWV0aW5ncy5SZWFkV3JpdGUgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIiwic2lkIjoiMDA1Y2Y0ZjktYTk2Ny05MmY5LWUwNTgtNDE3MTQwZDAzYzY5Iiwic3ViIjoiMEJIUFV0Szc4UzdoR1VSa1loYWFCcDFfMDNxdmdVRUlmcl9QVFJKOUlKNCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6ImMwNjFmMTYwLTUxZjktNDY5My04ZjNiLTRmMTUzMjM3ZThmNCIsInVuaXF1ZV9uYW1lIjoibWFub2ouc2hhcm1hQGV2b2x2b3VzLmNvbSIsInVwbiI6Im1hbm9qLnNoYXJtYUBldm9sdm91cy5jb20iLCJ1dGkiOiI2QXdDTGZLdGlrZUZ4UU9BbTloLUFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2Z0ZCI6IkNlZlpKaHFLR3RLT1RMUDhCVzlhUDlKM2JGMUo5aEU1ZTFJOGhqcHdnZUVCZFhObFlYTjBMV1J6YlhNIiwieG1zX2lkcmVsIjoiMzAgMSIsInhtc19zdCI6eyJzdWIiOiJXMDlaNUs5ZGFXSkc4eEhzOTdNR3dOMjJoOUdmQkpqWUVtcHpvOHZYemowIn0sInhtc190Y2R0IjoxNTM4MTA2OTY0fQ.O_spXkiptxm45fU5U81uyZ9GSYkU7ydNxFVTDDmAYQ8QXN3NQ2nLKF7huM0kdAdYqfPnj_4yPK_eXyeRKbOQ-9tjoTvNJ-QGklOsL9kSi5J6_AwCo5usxxH7fT5nXpegTaMpEgNXpFB70IgoqqC0YfklS6gbKcWcq1AnWC2V7PAoPefbg6qZKveZsuyfne9RGy9dX-qmHC5RCRaZbzOn_e3yCBmgiWHZ17jlER0xZT-YQgFo7Yzwt3C8XMdgFqeVpyyjkZcYdWD6zIyeJBAsmHdBe5OS3XZa76mv78XZ5CsEF3IIuKwXS2oNokMG8r8recqg57SzYjQtniplaMMYZQ",
      refresh_token: '',
      id_token: response?.idToken, //"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiIwMTkyMTgyNC0yYmUyLTQ3NzAtYTMxZS05OWRmNDg3ZGI4OTYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vYzA2MWYxNjAtNTFmOS00NjkzLThmM2ItNGYxNTMyMzdlOGY0L3YyLjAiLCJpYXQiOjE3NDk0NDM5MzgsIm5iZiI6MTc0OTQ0MzkzOCwiZXhwIjoxNzQ5NDQ3ODM4LCJhaW8iOiJBWVFBZS84WkFBQUF3ekRJdi9uOFFkamFhQXQyblNsZmJCaWZJaUdzeDdJYzRiS1NVY01nOUlyNHMyNXNwaTQzRnFsQjdNNVoyeDBqcjF1dmd1ekZDeUNXU0RHZlhScEhoOEZwWHluMnM3LzcrdTFldE85dnBEM3p2c3h3U21rRjJhWmNnbDBLcUZZVXR0d09hNVFQdEVSTUZHS3RKWU5NSEM0WDRsR2pJMWpkYUxFbVVGTEl4alE9IiwibmFtZSI6Ik1hbm9qIFNoYXJtYSIsIm5vbmNlIjoiMGJiM2RjZGQtMjhmZS00OGUyLTg3NjEtMjczYTEzOTQ4MTE0Iiwib2lkIjoiMWYxZjUxZTItYzA0Yy00OWI1LWI1ZGMtMzJhYTA0NzA2NDg5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoibWFub2ouc2hhcm1hQGV2b2x2b3VzLmNvbSIsInJoIjoiMS5BU2dBWVBGaHdQbFJrMGFQTzA4Vk1qZm85Q1FZa2dIaUszQkhveDZaMzBoOXVKWW9BRFVvQUEuIiwic2lkIjoiMDA1Y2Y0ZjktYTk2Ny05MmY5LWUwNTgtNDE3MTQwZDAzYzY5Iiwic3ViIjoiVzA5WjVLOWRhV0pHOHhIczk3TUd3TjIyaDlHZkJKallFbXB6bzh2WHpqMCIsInRpZCI6ImMwNjFmMTYwLTUxZjktNDY5My04ZjNiLTRmMTUzMjM3ZThmNCIsInV0aSI6IjZBd0NMZkt0aWtlRnhRT0FtOWgtQUEiLCJ2ZXIiOiIyLjAifQ.Nx5ViBi1wUbpqBI0GXfaPbYiVXeDM4dphTLjJ3LLbeffwZob0fbXU7_bQZ53ACuWpL6-ZZbpBRQf8HL1FUjYyxBNZjo76u0xBgrHw_g_TiNb3T0hP5MGSe1XDZtXS3YFmR_vRkjwWgV4lZtgHOeL3O4TTH5GMlaBDUTGopDJSIZKSILMrqRy3ZM5CT3ZnFpcJAd8nBOQEupjqcQUMCtwAg6E4o7LAk5Meh7I_uCs3E71F3gW1rOHNWUJP5glNR1EGu8TfWVFwSX7lqKXxbwIQx4Sa5CsxyBpNEE3Pzb9gvbRrBqZlxsIvBBkGkxDzXSr3oPlc7FnrVPgl1M9Uc7d6Q",
      client_info: '',
      type: 'User',
      action: 'signin'
    };
    let callback = (res: any) => {
      setAzureLoginLoading(false);
      //console.log(res, "resssss")
      if (res != 'error') {
        userExistFunction(res);
      }
    };
    dispatch(socialMicrosoftLoginRequestAction({body, callback}));
  };

  ////// Azure function end here /////

  ///// Google Login start here /////

  const googleLoginApiFunction = (idToken: string) => {
    setGoogleLoginLoading(true);
    let body = {
      id_token: idToken, //"eyJhbGciOiJSUzI1NiIsImtpZCI6ImJiNDM0Njk1OTQ0NTE4MjAxNDhiMzM5YzU4OGFlZGUzMDUxMDM5MTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTg2MjQxODI2NTIxLTA3bXRtazNkNWk1a2Q4NmZ2cWd2ZHJxY3BuMTlncGdlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTg2MjQxODI2NTIxLTA3bXRtazNkNWk1a2Q4NmZ2cWd2ZHJxY3BuMTlncGdlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEyOTUyNDUwOTc0NTUzOTkyNzA0IiwiZW1haWwiOiJtYW5vanNoYXJtYS51aWRldkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkdHLUtzaTBQX01kd3NlZWVKRTM3TUEiLCJuYmYiOjE3NDk0NTAwMjQsIm5hbWUiOiJNYW5vaiBTaGFybWEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSUJOUUdYUUo2aG1NZU5VNlc3Zk1JUTItTE5zaDhVZEFidUlfVzVZMllCSml2M2hBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik1hbm9qIiwiZmFtaWx5X25hbWUiOiJTaGFybWEiLCJpYXQiOjE3NDk0NTAzMjQsImV4cCI6MTc0OTQ1MzkyNCwianRpIjoiMzQzZGE3NWVmZGRlMjViM2QxMjE2ZDljYTJmZTgzMWI5MTU4MGZkYSJ9.mjdgSuDJ76j2xlzqKdFlN1fY9zTMk6klsDt7oZcUwsUDXkcsjNWY7ELps-SvuYjdq2O1yTumoei7PX5HjeklQRUpS6-cY4I8BIyAHeSPnTMeQyQybXTWuwQdgrSDyDS0JfsU-xL__QaKnbqQCdBLMpaoHqoS3ADOpFSWA6DoNUZOe3_zJjR5cD6QP2ka9hzgJ-HIkVvU3537ipCAziGZhLr9mVKiIvz7qnw3JxowiFqbYzKbBkKBCaWHsmLPL-_ca-bvlZkpTxpZt2GDG_HoxE0qjppq838bjxs5CcmHpSkrxLJdB9VhPate21RegqfOXgCicBecOmhsTg9iOCvhZQ",
      type: 'User',
      action: 'signin'
    };
    let callback = (res: any) => {
      setGoogleLoginLoading(false);
      //console.log(res, "resssss")
      if (res != 'error') {
        userExistFunction(res);
      }
    };
    dispatch(socialGoogleLoginRequestAction({body, callback}));
  };

  const handleGoogleSignIn = async () => {
    (GoogleSignin as any).configure({
      androidClientId:
        '186241826521-sdmpir8m71t1m5m0eg8c25of94saso2u.apps.googleusercontent.com', // '646759103590-c31uhsid1cjl3u6044vjdarapo1qdon4.apps.googleusercontent.com',
      webClientId:
        '186241826521-07mtmk3d5i5kd86fvqgvdrqcpn19gpge.apps.googleusercontent.com', // '646759103590-1lpfj7mrt6301i73p3uqvd267eacrkbd.apps.googleusercontent.com',
      iosClientId:
        '186241826521-da0kdd3il2sifovob33jli0fbaluh5bt.apps.googleusercontent.com' //'646759103590-p206e09mr8ti33ipqlhr36t71gp1o5rf.apps.googleusercontent.com',
    });
    GoogleSignin.hasPlayServices()
      .then(hasPlayService => {
        if (hasPlayService) {
          GoogleSignin.signIn()
            .then((userInfo: any) => {
              console.log(userInfo);
              if (userInfo || userInfo?.idToken) {
                googleLoginApiFunction(userInfo?.idToken || '');
              } else {
                Toast.show('User information not found', {type: 'danger'});
              }
            })
            .catch(e => {
              console.log('ERROR IS: ' + JSON.stringify(e));
            });
        }
      })
      .catch(e => {
        console.log('ERROR IS: ' + JSON.stringify(e));
      });
  };

  ///// Google Login end here //////

  const userExistFunction = async (res: any) => {
    //setGoogleLoginLoading(true)
    try {
      const response = await fetch(
        `${ENV?.BASE_URL}api/Account/IsCompanyExists`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${res?.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const rawData = await response.json();

      await setCompanyId(rawData?.data?.company?.companyId);

      //setGoogleLoginLoading(false)
      if (rawData && rawData?.status === true) {
        if (rawData?.data?.isCompanyExists) {
          await setAuthenticationToken(res?.accessToken);
          await setUserId(res?.id);
          dispatch(loginSuccessAction(res));
          Toast.show('Login successful. Welcome!', {type: 'success'});
          vibrate();
          navigationRef.reset({
            routes: [{name: SCREEN_NAMES.AppNavigation}]
          });
        } else {
          Toast.show(
            'Please update your company information on the website before logging in from the mobile app.',
            {type: 'danger'}
          );
        }
      } else {
        Toast.show(
          rawData?.message || rawData?.error_description || STRINGS.apiError,
          {type: 'danger'}
        );
      }
      console.log(rawData, 'responseresponse');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    // let callback = (res: any) => {
    //   console.log(res, "resssss")
    //   if (res != 'error') {
    //     console.log(res, "resssss")
    //     if(res?.isCompanyExists){
    //       vibrate();
    //       navigationRef.reset({
    //         routes: [{ name: SCREEN_NAMES.AppNavigation }],
    //       });
    //     }
    //     else {
    //       Toast.show("User not exist", { type: 'danger' });
    //     }
    //   }
    // };
    // dispatch(userExistRequestAction({callback}));
  };

  const mainView = () => {
    return (
      <View style={styles.secondContainerView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <RNTextInput
            inputRef={InputRef?.current['email']}
            onSubmitEditing={() => handleOnSubmitEditing('password')}
            returnKeyType={'next'}
            keyboardType={'email-address'}
            textContentType="emailAddress"
            autoComplete="email"
            placeholder={STRINGS.email}
            containerStyle={{
              marginTop: '1%',
              width: screenWidth / 1.1,
              borderBottomWidth: 0.5,
              alignSelf: 'center'
            }}
            errorStyle={{marginLeft: '5%'}}
            value={email}
            errorMessage={errorMessage}
            // onChangeText={value => _onChangeText('email', value)}
            onChangeText={value => {
              if (!email && value.startsWith(' ')) {
                return;
              }
              _onChangeText('email', value);
            }}
            onPressClearText={() => _onChangeText('email', '')}
            errorData={error => {
              console.log('error', error);
              _onChangeText('errorMessage', error);
            }}
          />

          <RNTextInput
            textContentType={'oneTimeCode'}
            inputRef={InputRef?.current['password']}
            placeholder={STRINGS.password}
            errorStyle={{marginLeft: '5%'}}
            containerStyle={{
              marginTop: '1%',
              width: screenWidth / 1.1,
              borderBottomWidth: 0.5,
              alignSelf: 'center'
            }}
            value={password}
            secureTextEntry
            autoComplete="password"
            //onChangeText={value => _onChangeText('password', value)}
            onChangeText={value => {
              if (!password && value.startsWith(' ')) {
                return;
              }
              _onChangeText('password', value);
            }}
            onPressClearText={() => _onChangeText('password', '')}
          />

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignSelf: 'center'
            }}>
            <CheckBox
              center
              title={STRINGS.rememberMe}
              textStyle={{
                color: COLORS.PRIMARY,
                fontWeight: '200',
                fontSize: 14,
                right: 5
              }}
              containerStyle={{
                backgroundColor: COLORS.TRANSPARENT,
                marginRight: 50,
                borderColor: COLORS.TRANSPARENT
              }}
              checked={rememberMe}
              checkedColor={COLORS.PRIMARY}
              //onPress={() => setCheck1(!check1)}
              onPress={() => _onChangeText('rememberMe', !rememberMe)}
            />

            <Pressable
              disabled={loading}
              onPress={() =>
                props.navigation.navigate(SCREEN_NAMES.ForgotPassword)
              }>
              <RNText style={[styles.forgotPasswordStyle, {top: 3}]} medium>
                {STRINGS.forgotYourPassword}
              </RNText>
            </Pressable>
          </View>
          <RNButton
            title={STRINGS.signIn}
            style={styles.buttonStyle}
            textColor={COLORS.WHITE}
            backgroundColor={COLORS.SECONDARY}
            disabled={!email || !password || errorMessage != ''}
            loading={loading}
            onPress={_onPressLogin}
          />

          {/* <LoginButton
          onLoginFinished={(error:any, result:any) => {
            if (error) {
              console.log("login has error: " + result.error);
            } else if (result.isCancelled) {
              console.log("login is cancelled.");
            } else {
              if (Platform.OS === "ios") {
                AuthenticationToken.getAuthenticationTokenIOS().then((data) => {
                  console.log(data?.authenticationToken);
                });
              } else {
                AccessToken.getCurrentAccessToken().then((data) => {
                  console.log(data?.accessToken.toString());
                });
              }
            }
          }}
          onLogoutFinished={() => console.log("logout.")}
          loginTrackingIOS="limited"
          nonceIOS="my_nonce" // Optional
        /> */}

          <View style={styles.orMainView}>
            <View style={styles.LineView} />
            <RNText>{STRINGS.OR}</RNText>
            <View style={styles.secondLineView} />
          </View>

          <Pressable
            disabled={loading}
            onPress={signIn}
            style={[styles.soicalLoginViewStyle, {marginTop: '10%'}]}>
            {AzureLoginLoading ? (
              <ActivityIndicator size={'small'} color={COLORS.PRIMARY} />
            ) : (
              <>
                <RNImage
                  source={IMAGES.microsoftSoicalLogin}
                  style={styles.soicalImageStyle}
                />
                <RNText small style={{marginLeft: 10}}>
                  {STRINGS.microsoft}
                </RNText>
              </>
            )}
          </Pressable>

          {Platform?.OS === 'ios' ? (
            <Pressable
              disabled={loading}
              onPress={handleAppleLogin}
              style={styles.soicalLoginViewStyle}>
              <RNImage
                source={IMAGES.appleLogo}
                style={{height: scale(18), width: scale(17)}}
              />
              <RNText small style={{marginLeft: 10}}>
                {'Continue with Apple'}
              </RNText>
            </Pressable>
          ) : null}

          <Pressable
            disabled={loading}
            onPress={handleGoogleSignIn}
            style={styles.soicalLoginViewStyle}>
            {googleLoginLoading ? (
              <ActivityIndicator size={'small'} color={COLORS.PRIMARY} />
            ) : (
              <>
                <RNImage
                  source={IMAGES.googleSoicalLogin}
                  style={styles.soicalImageStyle}
                />
                <RNText small style={{marginLeft: 10}}>
                  {STRINGS.google}
                </RNText>
              </>
            )}
          </Pressable>

          <Pressable
            disabled={loading}
            onPress={handleFacebookButtonClick}
            style={styles.soicalLoginViewStyle}>
            {FaceLoginLoading ? (
              <ActivityIndicator size={'small'} color={COLORS.PRIMARY} />
            ) : (
              <>
                <RNImage
                  source={IMAGES.facebookSoicalLogin}
                  style={styles.soicalImageStyle}
                />
                <RNText small style={{marginLeft: 10}}>
                  {STRINGS.facebook}
                </RNText>
              </>
            )}
          </Pressable>
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: COLORS.PRIMARY,
            width: '100%',
            height: '17%',
            top: Platform.OS === 'android' ? 0 : scale(20)
          }}>
          <RNText style={styles.title} bold>
            {STRINGS.signIn}
          </RNText>
        </View>
        {mainView()}
      </View>
    </>
  );
};

export default Login;
