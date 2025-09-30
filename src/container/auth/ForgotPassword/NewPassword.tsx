// import {Keyboard, StyleSheet, Text, View} from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {
//   RNButton,
//   RNContainer,
//   RNImage,
//   RNText,
//   RNTextInput
// } from '../../../Common';
// import {COLORS, IMAGES, STRINGS} from '../../../constants';
// import Validations from './component/Validations';
// import {scale} from 'react-native-size-matters';
// import {_onPressNavigate} from '../../../utils/commonFunction';
// import {SCREEN_NAMES} from '../../../config';
// import {styles} from './styles';
// import {useDispatch} from 'react-redux';
// import {resetPasswordRequestAction} from './module/action';

// const NewPassword = props => {
//   const InputRef = useRef({
//     password: React.createRef(),
//     confirmPassword: React.createRef()
//   });
//   console.log('props?.route?.params?.data', props?.route?.params?.data);
//   let dispatch = useDispatch();
//   const [state, setState] = useState({
//     email: props?.route?.params?.data?.email || '',
//     mobileNumber: props?.route?.params?.data?.mobileNumber || '',
//     countryCode: props?.route?.params?.data?.countryCode || '',
//     otp: props?.route?.params?.data?.OTP || '',
//     password: '',
//     confirmPassword: '',
//     isCapital: false,
//     isContainsNumber: false,
//     isMinLength: false
//   });
//   const {
//     otp,
//     countryCode,
//     email,
//     mobileNumber,
//     isCapital,
//     isContainsNumber,
//     isMinLength,
//     confirmPassword,
//     password
//   } = state;
//   const [loading, setLoading] = useState(false);
//   const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
//     useState('');
//   const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

//   useEffect(() => {
//     checkValidation();
//   }, [password, confirmPassword, isCapital, isContainsNumber, isMinLength]);

//   const checkValidation = () => {
//     if (password?.length || confirmPassword?.length) {
//       if (
//         (!isCapital || !isContainsNumber || !isMinLength) &&
//         password?.length
//       ) {
//         setPasswordErrorMessage(STRINGS.validPasswordCondition);
//       } else if (password != confirmPassword && confirmPassword?.length) {
//         setConfirmPasswordErrorMessage(STRINGS.passwordValidation);
//         setPasswordErrorMessage('');
//       } else {
//         setConfirmPasswordErrorMessage('');
//         setPasswordErrorMessage('');
//       }
//     } else {
//       setConfirmPasswordErrorMessage('');
//       setPasswordErrorMessage('');
//     }
//   };
//   const handleOnSubmitEditing = next => {
//     if (next) {
//       InputRef?.current?.[next]?.current?.focus();
//     } else {
//       Keyboard.dismiss();
//     }
//   };

//   const _onPressSend = text => {
//     setLoading(true);
//     if (
//       isCapital &&
//       isContainsNumber &&
//       isMinLength &&
//       confirmPassword == password &&
//       !confirmPasswordErrorMessage
//     ) {
//       const body =
//         mobileNumber != ''
//           ? {
//               mobileNumber: mobileNumber,
//               countryCode: countryCode,
//               password: password,
//               confirmPassword: confirmPassword,
//               OTP: otp
//             }
//           : {
//               email: email,
//               password: password,
//               confirmPassword: confirmPassword,
//               OTP: otp
//             };
//       console.log('body', body);
//       let callback = res => {
//         setLoading(false);
//         if (res != 'error') {
//           _onPressNavigate(SCREEN_NAMES.Login);
//         }
//       };
//       dispatch(resetPasswordRequestAction({body, callback}));
//     }
//   };
//   const _onChangePassword = text => {
//     if (text.match(/[0-9]/)) {
//       setState(prev => ({
//         ...prev,
//         isContainsNumber: true
//       }));
//     } else {
//       setState(prev => ({
//         ...prev,
//         isContainsNumber: false
//       }));
//     }
//     if (/[A-Z]/.test(text)) {
//       setState(prev => ({
//         ...prev,
//         isCapital: true
//       }));
//     } else {
//       setState(prev => ({
//         ...prev,
//         isCapital: false
//       }));
//     }
//     if (text.length >= 8) {
//       setState(prev => ({
//         ...prev,
//         isMinLength: true
//       }));
//     } else {
//       setState(prev => ({
//         ...prev,
//         isMinLength: false
//       }));
//     }
//     setState(prev => ({
//       ...prev,
//       password: text
//     }));
//   };
//   const _onChangeConfirmPassword = text => {
//     setState(prev => ({
//       ...prev,
//       confirmPassword: text
//     }));
//   };
//   const SendButtonView = () => {
//     return (
//       <RNButton
//         disabled={
//           passwordErrorMessage != '' ||
//           confirmPasswordErrorMessage != '' ||
//           password.length == 0 ||
//           confirmPassword.length == 0
//         }
//         loading={loading}
//         style={{marginTop: scale(60)}}
//         onPress={_onPressSend}
//         title={STRINGS.save}
//       />
//     );
//   };
//   const ValidationsView = () => {
//     return (
//       <>
//         <RNText></RNText>
//         <Validations valid={isCapital} text={STRINGS.aCapitalletter} />
//         <Validations valid={isContainsNumber} text={STRINGS.containsAnumber} />
//         <Validations valid={isMinLength} text={STRINGS.atLeast6Characters} />
//       </>
//     );
//   };

//   const LogoView = () => {
//     return <RNImage source={IMAGES.logo} style={styles.logo} />;
//   };

//   const HeadingView = () => {
//     return (
//       <>
//         <RNText bold style={styles.heading}>
//           {STRINGS.resetYourPassword}
//         </RNText>
//         {/* <RNText
//           textColor={COLORS.GRAY}
//           style={{ marginVertical: scale(5) }}
//         >{STRINGS.dummyText}</RNText> */}
//       </>
//     );
//   };

//   const TextInputsView = () => {
//     return (
//       <>
//         <RNTextInput
//           inputRef={InputRef?.current['password']}
//           onSubmitEditing={() => handleOnSubmitEditing('confirmPassword')}
//           returnKeyType={'next'}
//           // autoFocus
//           textContentType="newPassword"
//           autoComplete="password-new"
//           placeholder={STRINGS.password}
//           value={password}
//           secureTextEntry
//           errorMessage={passwordErrorMessage}
//           onChangeText={value => _onChangePassword(value)}
//           onPressClearText={() => {
//             setPasswordErrorMessage('');
//             _onChangePassword('');
//           }}
//         />
//         <RNTextInput
//           inputRef={InputRef?.current['confirmPassword']}
//           placeholder={STRINGS.confirmPassword}
//           value={confirmPassword}
//           errorMessage={confirmPasswordErrorMessage}
//           secureTextEntry
//           textContentType="newPassword"
//           autoComplete="password-new"
//           onChangeText={value => _onChangeConfirmPassword(value)}
//           onPressClearText={() => {
//             setConfirmPasswordErrorMessage('');
//             _onChangeConfirmPassword('');
//           }}
//         />
//       </>
//     );
//   };

//   return (
//     <RNContainer
//       // style={{paddingTop: scale(10)}}
//       showsVerticalScrollIndicator={false}
//       style={{paddingHorizontal: scale(10)}}
//       title={STRINGS.createNewPassword}
//       scroll>
//       {LogoView()}
//       {HeadingView()}
//       {TextInputsView()}
//       {ValidationsView()}
//       {SendButtonView()}
//     </RNContainer>
//   );
// };

// export default NewPassword;



import React, {} from 'react';
import {
  RNButton,
  RNContainer,
  RNImage,
  RNText,
  RNTextInput} from '../../../Common';
import {_onPressGoBackNavigate, _onPressNavigate} from '../../../utils/commonFunction';
import {scale} from 'react-native-size-matters';
import { StyleSheet, View, ScrollView, Dimensions, Pressable, StatusBar } from 'react-native';
import { COLORS, COMMON_SIZE, IMAGES, STRINGS } from '../../../constants';
import { SCREEN_NAMES } from '../../../config';
import { navigationRef } from '../../../navigation/rootNavigation';

const screenWidth = Dimensions.get('window').width;
const NewPassword = (props : any) => {
 const mainView = () => {
 return(
  <View style={styles.secondContainerView}>
     <RNTextInput
        keyboardType={'email-address'}
        // autoFocus
        textContentType="emailAddress"
        autoComplete="email"
        placeholder={STRINGS.NewPassword}
        containerStyle={{marginTop:"3%", width: screenWidth / 1.1,
        borderBottomWidth: 0.5, alignSelf: 'center'}}
        //value={email}
        //errorMessage={errorMessage}
       // onChangeText={value => _onChangeText('email', value)}
       // onPressClearText={() => _onChangeText('email', '')}
        // errorData={error => {
        //   console.log('error', error);
        //   _onChangeText('errorMessage', error);
        // }}
      />

<RNTextInput
        keyboardType={'email-address'}
        // autoFocus
        textContentType="emailAddress"
        autoComplete="email"
        placeholder={STRINGS.ConfirmPassword}
        containerStyle={{marginTop:"3%", width: screenWidth / 1.1,
        borderBottomWidth: 0.5, alignSelf: 'center'}}
        //value={email}
        //errorMessage={errorMessage}
       // onChangeText={value => _onChangeText('email', value)}
       // onPressClearText={() => _onChangeText('email', '')}
        // errorData={error => {
        //   console.log('error', error);
        //   _onChangeText('errorMessage', error);
        // }}
      />

      <RNButton 
      onPress={() => _onPressNavigate(SCREEN_NAMES.Login)}
      title={STRINGS.submit} 
      style={styles.buttonStyle} 
      textColor={COLORS.WHITE} 
      backgroundColor={COLORS.SECONDARY}/>
  </View>
 )
 }

  return (
    <><StatusBar backgroundColor={COLORS.BG_COLOR} />
    <View style={styles.container}>
      <View style={{ backgroundColor: COLORS.PRIMARY, width: "100%", height: "17%" }}>
        <RNImage
          onPress={() => _onPressGoBackNavigate()}
          source={IMAGES.backArrowLeft}
          style={styles.soicalImageStyle} />
        <RNText style={styles.title} bold>
          {STRINGS.ResetPassword}
        </RNText>
      </View>
      {mainView()}
    </View></>
  );
};

export default NewPassword;
const imageSize = scale(18);
const styles = StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor:COLORS.PRIMARY
  },

  secondContainerView:{
    width:"100%", 
    height:"100%", 
    backgroundColor:COLORS.WHITE, 
    borderTopEndRadius:20, 
    borderTopStartRadius:30, 
    //marginTop:30
  },
  title: {
    fontSize: COMMON_SIZE.ICON,
    color:COLORS.WHITE,
    marginHorizontal: scale(20),
    marginTop:"12%"
  },
  buttonStyle:{
    marginTop:"17%", 
    width: screenWidth / 1.5
  },
  soicalImageStyle:{
    height: imageSize,
    width: imageSize, 
    marginHorizontal: scale(20),
    top:"17%"
  }
});