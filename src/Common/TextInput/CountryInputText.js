import {
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  Alert
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {styles} from './styles';
import {RNActionSheet, RNAnimatableWrapper, RNButton, RNIcon, RNText} from '..';
import CountryPicker from 'react-native-country-picker-modal';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS, COMMON_SIZE, STRINGS} from '../../constants';
import {scale} from 'react-native-size-matters';
import * as yup from 'yup';
import {commonStyle} from '../../styles/styles';
//import {basicSettingsSelector} from '../../container/auth/OnBoardings/module/BasicSettings/reducer';

const countryDefault = {
  cca2: 'IN',
  code: '91'
};

const RNCountryInputText = ({
  title,
  style,
  code = countryDefault,
  onChangeText,
  placeholder,
  onFocus,
  value,
  inputRef,
  onChangeCode,
  disabled,
  onPressClearText,
  errorMessage,
  returnKeyType,
  onPressSendOtp,
  onSubmitOtp,
  onOtpFocus,
  showOtpVerifyOption,
  onOtpVerified,
  maxLength,
  errorData,
  ...props
}) => {
  const fontSize = 0;
  const [countryDetails, setCountryDetails] = useState(code);
  const [isTextInputActive, setIsTextInputActive] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sendOtp, setSendOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [countryPickerVisibility, setCountryPickerVisibility] = useState(false);
  const [error, setError] = useState(errorMessage || '');
  const [subCode, setSubCode] = useState('876');
  const [countryCode, setCountryCode] = useState('1');

  const animationForOtp = useRef(null);
  const ActionSheetRef = useRef(null);

  const onCountrySelect = country => {
    // console.log('country', country);
    setSubCode('876');
    setCountryDetails({
      cca2: country.cca2,
      code: country.callingCode[0] ? country.callingCode[0] : '1876'
    });

    onChangeCode &&
      onChangeCode({
        cca2: country.cca2,
        code: country.callingCode[0] ? '+' + country.callingCode[0] : '1876'
      });
  };
  const mobileScheme = yup
    .string()
    .required(STRINGS.mobileNumberIsRequired)
    .test('len', STRINGS.mobileValidation, val => val.length >= 6);
  useEffect(() => {
    if (value) {
      mobileScheme
        .validate(value)
        .then(res => {
          setError('');
          errorData && errorData('');
        })
        .catch(e => {
          // Toast.show(e.message, {
          //   type: 'warning',
          // });
          setError(e.message);
          errorData && errorData(e.message);
        });
    }
  }, [value]);

  useEffect(() => {
    if (errorMessage != '' && !disabled) {
      setError(errorMessage);
    }
  }, [errorMessage]);

  const _onPressClearText = () => {
    if (onPressClearText) {
      onPressClearText();
    }
    setError(errorMessage);
  };

  const _isTextInputActive = res => {
    setIsTextInputActive(res);
  };
  const _onOtpEnter = res => {
    // console.log('_onOtpEnter res', res);
    setOtp(res);
    if (onSubmitOtp) {
      onSubmitOtp(res);
    }
  };
  const _onPressSendOtp = () => {
    animationForOtp?.current?.fadeIn();
    if (sendOtp) {
      Toast.show(STRINGS.otpSent, {
        type: 'success'
      });
    } else {
      setSendOtp(true);
    }
    if (onPressSendOtp) {
      onPressSendOtp(true);
    }
  };
  const _onPressVerify = () => {
    if (otp.length == 6) {
      setOtpLoader(true);
      setTimeout(() => {
        Toast.show(STRINGS.otpVerified, {
          type: 'success'
        });
        setSendOtp(false);
        setOtpLoader(false);
        setVerified(true);
        if (onOtpVerified) {
          onOtpVerified(true);
        }
      }, 2000);
    } else {
      Toast.show(STRINGS.enterVerificationCode, {
        type: 'warning'
      });
    }
  };

  const _onPressSubCodeSelection = () => {
    ActionSheetRef?.current?.show();
  };

  const _onPressSubCode = text => {
    setSubCode(text);
    setCountryCode('1');
    setCountryDetails({
      cca2: countryDetails?.cca2,
      code: `1${text}`
    });
    onChangeCode &&
      onChangeCode({
        cca2: countryDetails?.cca2,
        code: `+1${text}`
      });
    ActionSheetRef?.current?.hide();
  };
  // console.log('countryDetails', countryDetails);
  return (
    <>
      <View>
        {value && placeholder ? (
          <RNAnimatableWrapper animation={'fadeIn'}>
            <RNText
              style={{marginVertical: scale(10)}}
              textColor={COLORS.GRAY}
              medium>
              {placeholder}
            </RNText>
          </RNAnimatableWrapper>
        ) : (
          <RNText
            style={{marginBottom: scale(10)}}
            textColor={COLORS.GRAY}
            medium></RNText>
        )}

        <View
          style={[
            styles.countryPikcerContainer,
            {borderColor: isTextInputActive ? COLORS.PRIMARY : COLORS.GRAY},
            style
          ]}>
          <View style={styles.countryMorph}>
            <TouchableOpacity
              disabled={disabled || verified}
              onPress={() =>
                setCountryPickerVisibility(!countryPickerVisibility)
              }
              style={[styles.countryContainer]}
              hitSlop={{top: 10, bottom: 10, left: 15, right: 5}}>
              <CountryPicker
                countryCode={countryDetails.cca2}
                withFilter
                modalProps={{
                  visible: countryPickerVisibility
                }}
                onOpen={() => {
                  !disabled && !verified
                    ? setCountryPickerVisibility(true)
                    : '';
                }}
                // withFlag
                onSelect={onCountrySelect}
                visible={countryPickerVisibility}
                onClose={() => setCountryPickerVisibility(false)}
              />
              {countryDetails.code.includes('+1876') ? null : (
                <Icon name="chevron-down" color={COLORS.PRIMARY} size={25} />
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.phoneNumberContainer]}>
            <View
              style={[
                styles.row,
                {
                  justifyContent: 'space-between'
                }
              ]}>
              {countryDetails.code.includes('1876') ||
              countryDetails.code.includes('1658') ||
              countryDetails.code.includes('+1876') ||
              countryDetails.code.includes('+1658') ? (
                <RNText
                  onPress={() =>
                    setCountryPickerVisibility(!countryPickerVisibility)
                  }
                  style={{
                    color:
                      verified || disabled
                        ? COLORS.PLACEHOLDER_COLOR
                        : COLORS.BLACK
                  }}>
                  {countryDetails.code.includes('+') ? '' : ''}
                  {'+1'}
                </RNText>
              ) : (
                <RNText
                  onPress={() =>
                    setCountryPickerVisibility(!countryPickerVisibility)
                  }
                  style={{
                    color:
                      verified || disabled
                        ? COLORS.PLACEHOLDER_COLOR
                        : COLORS.BLACK
                  }}>
                  {countryDetails.code.includes('+') ? '' : '+'}
                  {countryDetails.code}
                </RNText>
              )}

              {countryDetails.code.includes('1876') ||
              countryDetails.code.includes('1658') ||
              countryDetails.code.includes('+1876') ||
              countryDetails.code.includes('+1658') ? (
                <Pressable
                  onPress={_onPressSubCodeSelection}
                  style={{...commonStyle.row, marginLeft: scale(10)}}>
                  <Icon name="chevron-down" color={COLORS.PRIMARY} size={25} />
                  <RNText>{subCode}</RNText>
                </Pressable>
              ) : null}
              <TextInput
                {...props}
                ref={inputRef}
                editable={verified || sendOtp || disabled ? false : true}
                onChangeText={onChangeText}
                value={value}
                maxLength={maxLength || 16}
                placeholder={placeholder}
                placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
                style={[
                  styles.textInput,
                  {
                    color:
                      verified || sendOtp || disabled
                        ? COLORS.PLACEHOLDER_COLOR
                        : COLORS.PRIMARY,
                    fontSize: COMMON_SIZE.NORMAL + fontSize
                    // backgroundColor: 'red',
                  }
                ]}
                textContentType="telephoneNumber"
                autoComplete="tel"
                keyboardType="number-pad"
                returnKeyType={'done'}
                onFocus={() => {
                  onFocus && onFocus();
                  _isTextInputActive(true);
                }}
                onBlur={() => {
                  _isTextInputActive(false);
                }}
              />
              {value && !disabled && !verified && !sendOtp ? (
                <RNAnimatableWrapper animation={'fadeIn'}>
                  <RNIcon
                    name={'circle-with-cross'}
                    type={'Entypo'}
                    onPress={_onPressClearText}
                    size={COMMON_SIZE.MEDIUM_ICON}
                    color={
                      isTextInputActive
                        ? COLORS.PRIMARY
                        : COLORS.PLACEHOLDER_COLOR
                    }
                    style={{marginHorizontal: scale(10)}}
                  />
                </RNAnimatableWrapper>
              ) : verified ? null : (
                <RNIcon
                  name={'circle-with-cross'}
                  type={'Entypo'}
                  size={COMMON_SIZE.MEDIUM_ICON}
                  color={COLORS.TRANSPARENT}
                  style={{marginHorizontal: scale(10)}}
                />
              )}
              {verified ? (
                <RNIcon
                  name={'verified'}
                  type={'MaterialIcons'}
                  size={COMMON_SIZE.MEDIUM_ICON}
                  color={COLORS.GREEN}
                  style={{marginHorizontal: scale(10)}}
                />
              ) : null}
            </View>
          </View>
          <View style={{flex: 1}} />
        </View>
        {(errorMessage || error) && !disabled && (
          <RNAnimatableWrapper animation={'fadeIn'}>
            <RNText small textColor={COLORS.RED}>
              {errorMessage || error}
            </RNText>
          </RNAnimatableWrapper>
        )}
        {showOtpVerifyOption && value && !error ? (
          <RNAnimatableWrapper
            animationref={animationForOtp}
            onPress={_onPressSendOtp}
            style={{alignSelf: 'flex-end', margin: scale(5)}}
            animation={'fadeIn'}>
            <RNText small textColor={COLORS.PRIMARY}>
              {sendOtp ? STRINGS.resendOtp : STRINGS.sendOtp}
            </RNText>
          </RNAnimatableWrapper>
        ) : null}
        {sendOtp ? (
          <RNAnimatableWrapper animation={'fadeIn'}>
            <RNText style={{}} textColor={COLORS.GRAY} medium>
              {STRINGS.enterOtp}
              {' *'}
            </RNText>
          </RNAnimatableWrapper>
        ) : null}
        {sendOtp ? (
          <RNAnimatableWrapper animation={'fadeIn'}>
          
            <RNButton
              onPress={_onPressVerify}
              loading={otpLoader}
              disabled={otp.length != 6}
              style={{width: '85%', marginVertical: scale(10)}}
              title={STRINGS.verifyOtp}
            />
          </RNAnimatableWrapper>
        ) : null}
      </View>
      <RNActionSheet ActionSheetRef={ActionSheetRef}>
        <View style={styles.actionsheet}>
          <CodeView text={'876'} onPress={_onPressSubCode} />
          <CodeView text={'658'} onPress={_onPressSubCode} />
        </View>
      </RNActionSheet>
    </>
  );
};

export default RNCountryInputText;

const CodeView = ({text, onPress}) => {
  return (
    <Pressable
      style={{height: 40, justifyContent: 'center'}}
      onPress={() => onPress(text)}>
      <RNText bold large>
        {text}
      </RNText>
    </Pressable>
  );
};
