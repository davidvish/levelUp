// import {Alert, StyleSheet, View} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {
//   RNButton,
//   RNCheckBox,
//   RNContainer,
//   RNCountryInputText,
//   RNImage,
//   RNRowTextAndIcon,
//   RNText,
//   RNTextInput
// } from '../../../Common';
// import {COLORS, COMMON_SIZE, IMAGES, STRINGS} from '../../../constants';
// import {
//   _onPressGoBackNavigate,
//   _onPressNavigate
// } from '../../../utils/commonFunction';
// import {SCREEN_NAMES} from '../../../config';
// import RNHeading from '../../../Common/Heading/RNHeading';
// import {scale} from 'react-native-size-matters';
// import {styles} from './styles';
// import {useDispatch} from 'react-redux';
// import {forgotPasswordRequestAction} from './module/action';
// import {commonStyle} from '../../../styles/styles';

// const ForgotPassword = () => {
//   const dispatch = useDispatch();
//   const [state, setState] = useState({
//     email: '',
//     errorMessage: '',
//     loginType: 'phone',
//     countryCode: {cca2: 'IN', code: '+91'}
//   });

//   const {loginType, email, errorMessage, countryCode} = state;
//   const [loading, setLoading] = useState(false);

//   const _onChangeText = (name, value) => {
//     setState(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const _onPressSendButton = () => {
//     setLoading(true);
//     let body =
//       loginType == 'phone'
//         ? {
//             mobileNumber: email,
//             countryCode: countryCode.code
//           }
//         : {
//             email: email
//           };

//     let callback = res => {
//       setLoading(false);
//       _onPressNavigate(SCREEN_NAMES.VerificationScreen, {
//         navigateTo: SCREEN_NAMES.NewPassword,
//         data: body
//       });
//       if (res != 'error') {
//       }
//     };
//     dispatch(forgotPasswordRequestAction({body, callback}));
//   };

//   const LogoView = () => {
//     return <RNImage source={IMAGES.logo} style={styles.logo} />;
//   };

//   const SelectionView = () => {
//     return (
//       <View style={styles.selectionStyle}>
//         <RNCheckBox
//           onPress={() => {
//             setState(prev => ({
//               ...prev,
//               loginType: 'phone'
//             }));
//           }}
//           title={STRINGS.mobile}
//           isChecked={loginType == 'phone' ? true : false}
//         />
//         <RNCheckBox
//           onPress={() => {
//             setState(prev => ({
//               ...prev,
//               loginType: 'email'
//             }));
//           }}
//           title={STRINGS.email}
//           isChecked={loginType == 'email' ? true : false}
//         />
//       </View>
//     );
//   };
//   const HeadingView = () => {
//     return (
//       <>
//         <RNText extraLarge bold style={styles.heading}>
//           {loginType == 'phone'
//             ? `${STRINGS.enterYourMobileNumber}`
//             : `${STRINGS.enterYourEmailAddress}`}
//         </RNText>
//       </>
//     );
//   };

//   const BackToLoginView = () => {
//     return (
//       <RNHeading
//         large
//         textStyle={{
//           color: COLORS.PRIMARY
//         }}
//         onPress={() => _onPressGoBackNavigate()}
//         style={{alignSelf: 'center'}}
//         title={STRINGS.backToLogin}
//       />
//     );
//   };

//   const _onChangeCode = res => {
//     setState(prev => ({
//       ...prev,
//       countryCode: res
//     }));
//   };

//   const TextInputView = () => {
//     return loginType == 'email' ? (
//       <RNTextInput
//         keyboardType={'email-address'}
//         // autoFocus
//         textContentType="emailAddress"
//         autoComplete="email"
//         placeholder={`${STRINGS.email}`}
//         value={email}
//         errorMessage={errorMessage}
//         onChangeText={value => _onChangeText('email', value)}
//         onPressClearText={() => _onChangeText('email', '')}
//         errorData={error => {
//           console.log('error', error);
//           _onChangeText('errorMessage', error);
//         }}
//       />
//     ) : (
//       <RNCountryInputText
//         code={countryCode}
//         onChangeCode={_onChangeCode}
//         placeholder={STRINGS.mobileNumber}
//         value={email}
//         returnKeyType={'next'}
//         onChangeText={value => _onChangeText('email', value)}
//         onPressClearText={() => _onChangeText('email', '')}
//         errorData={error => {
//           console.log('error', error);
//           _onChangeText('errorMessage', error);
//         }}
//       />
//     );
//   };
//   const SendButtonView = () => {
//     return (
//       <RNButton
//         disabled={errorMessage != '' || email == ''}
//         loading={loading}
//         onPress={_onPressSendButton}
//         title={STRINGS.next}
//         style={{marginVertical: scale(30)}}
//       />
//     );
//   };

//   return (
//     <RNContainer
//       // style={{paddingTop: scale(10)}}
//       showsVerticalScrollIndicator={false}
//       title={STRINGS.forgotPassword}
//       style={{paddingHorizontal: scale(10)}}
//       scroll>
//       {LogoView()}
//       {HeadingView()}
//       {/* {SelectionView()} */}
//       {TextInputView()}
//       {SendButtonView()}
//       {BackToLoginView()}
//     </RNContainer>
//   );
// };

// export default ForgotPassword;

import React, { useRef, useState } from 'react';
import {
  RNButton,
  RNContainer,
  RNImage,
  RNText,
  RNTextInput} from '../../../Common';
import {_onPressGoBackNavigate, _onPressNavigate, vibrate} from '../../../utils/commonFunction';
import {scale} from 'react-native-size-matters';
import { StyleSheet, View, ScrollView, Dimensions, Pressable, StatusBar, Keyboard, Platform } from 'react-native';
import { COLORS, COMMON_SIZE, IMAGES, STRINGS } from '../../../constants';
import { SCREEN_NAMES } from '../../../config';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from '../../../navigation/rootNavigation';
import { forgotPasswordRequestAction } from './module/action';

const screenWidth = Dimensions.get('window').width;
const ForgotPassword = (props : any) => {
  // console.log('🚀 ~ file: Login.js:26 ~ Login ~ loginDetails:', loginDetails);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const InputRef : any = useRef({
    email: React.createRef(),
  });
  const [state, setState] = useState({
    email: '',
    errorMessage: '',
  });
  const {email, errorMessage} = state;
  const [loading, setLoading] = useState(false);

  const handleOnSubmitEditing = (next : any) => {
    if (next) {
      InputRef?.current?.[next]?.current?.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const _onChangeText = (name : any, value : any) => {
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const _onPressSubmit = async () => {
    setLoading(true);
    let body = {
      email: email,
    };
    let callback = (res : any) => {
      setLoading(false);
      if (res != 'error') {
        _onPressNavigate(SCREEN_NAMES.Login);
      }
    };
    dispatch(forgotPasswordRequestAction({body, callback}));
  };

 const mainView = () => {
 return(
  <View style={styles.secondContainerView}>
    <View style={{height:"12%"}}>
     <RNTextInput
         inputRef={InputRef?.current['email']}
         onSubmitEditing={() => handleOnSubmitEditing('password')}
         returnKeyType={'next'}
         keyboardType={'email-address'}
         textContentType="emailAddress"
         autoComplete="email"
         placeholder={STRINGS.email}
         containerStyle={{marginTop:"3%", width: screenWidth / 1.1,
         borderBottomWidth: 0.5, alignSelf: 'center'}}
         errorStyle={{marginLeft:"4.5%"}}
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
</View>

      <RNButton 
      disabled={errorMessage != '' || !email}
      loading={loading}
      title={STRINGS.submit} 
      style={styles.buttonStyle} 
      textColor={COLORS.WHITE} 
      backgroundColor={COLORS.SECONDARY}
      onPress={_onPressSubmit}
      />
  </View>
 )
 }

  return (
    <><StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />
    <View style={styles.container}>
      <View style={{ backgroundColor: COLORS.PRIMARY, width: "100%", height: "17%", top: Platform.OS === "android" ? 0 :  scale(20) }}>
        <RNImage
          onPress={() => _onPressGoBackNavigate()}
          source={IMAGES.backArrowLeft}
          style={styles.soicalImageStyle} />
        <RNText style={styles.title} bold>
          {STRINGS.forgotPassword}
        </RNText>
      </View>
      {mainView()}
    </View></>
  );
};

export default ForgotPassword;
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

