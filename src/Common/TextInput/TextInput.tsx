import React, { useEffect, useState } from 'react';
import { TextInput, Pressable, StyleSheet, View, TextStyle, ViewStyle, TextInputProps, PressableProps } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS, COMMON_SIZE, FONTS, STRINGS } from '../../constants';
import { RNAnimatableWrapper, RNIcon, RNImage, RNText } from '..';
import * as yup from 'yup';
//import { basicSettingsSelector } from '../../container/auth/OnBoardings/module/BasicSettings/reducer';

interface RNTextInputProps {
  containerStyle?: any;
  leftIcon?: any;
  rightIcon?: any;
  onRightIconPress?: () => void;
  onChangeText?: (text: string) => void;
  errorMessage?: string;
  placeholder: string;
  keyboardType?: any;
  inputRef?: any;
  value?: string;
  autoCapitalize?: any;
  returnKeyType?: any;
  maxLength?: number;
  style?: any;
  autoFocus?: boolean;
  outer?: any;
  leftIconStyle?: any;
  type?: any;
  size?: number;
  color?: string;
  onFocusDisable?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  rightIconType?: any;
  rightIconStyle?: any;
  rightIconColor?: string;
  rightIconSize?: number;
  onPressClearText?: () => void;
  onSubmitEditing?: () => void;
  hideClearText?: boolean;
  blurOnSubmit?: boolean;
  hideHeader?: boolean;
  isTextInputActive?: (isActive: boolean) => void;
  onPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  stopShowError?: boolean;
  textContentType?: any;
  autoComplete?: string;
  errorData?: (error: string) => void;
  showEmptyLine?: string;
  children?: any;
  errorStyle?:any
}

const RNTextInput: React.FC<RNTextInputProps> = ({
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onChangeText,
  placeholder,
  keyboardType,
  inputRef,
  value,
  autoCapitalize,
  returnKeyType,
  maxLength,
  style,
  autoFocus,
  outer,
  leftIconStyle,
  type,
  size,
  color,
  onFocusDisable,
  children,
  disabled,
  onFocus,
  onBlur,
  secureTextEntry,
  rightIconType,
  rightIconStyle,
  rightIconColor,
  rightIconSize,
  onPressClearText,
  errorMessage,
  onSubmitEditing,
  hideClearText,
  blurOnSubmit,
  hideHeader,
  isTextInputActive,
  onPress,
  multiline,
  numberOfLines,
  stopShowError,
  textContentType,
  autoComplete,
  errorData,
  showEmptyLine,
  errorStyle,
  ...props
}) => {
  const fontSize = 0;
  const [secoreText, setSecoreText] = useState(secureTextEntry || false);
  const [error, setError] = useState<any>(errorMessage || '');
  const [state, setState] = useState({
    isActive: false,
  });
  const { isActive } = state;

  const emailSchema = yup
    .string()
    .email(STRINGS.validEmailValidation)
    .required(STRINGS.emailIsRequired);
  
  useEffect(() => {
    if (!stopShowError && keyboardType == 'email-address' && value) {
      emailSchema
        .validate(value)
        .then(res => {
          setError('');
          errorData && errorData('');
        })
        .catch(e => {
          setError(e.message);
          errorData && errorData(e.message);
        });
    }
  }, [keyboardType, value]);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  const _onPressClearText = () => {
    setError(errorMessage || '');
    if (onPressClearText) {
      onPressClearText();
    }
  };

  return (
    <Pressable disabled={!onPress} onPress={onPress}>
        <RNText style={{ marginBottom: scale(10) }} textColor={COLORS.GRAY} medium></RNText>
      <View style={[
        styles.container,
        {
          borderColor: isActive ? COLORS.PRIMARY_DARK : COLORS.GRAY,
          paddingHorizontal: leftIcon ? scale(10) : 0,
        },
        containerStyle,
      ]}>
        {leftIcon && (type ? (
          <RNIcon
            name={leftIcon}
            type={type}
            size={size}
            style={leftIconStyle}
            color={isActive ? COLORS.PRIMARY : color || color}
          />
        ) : (
          <RNImage
            source={leftIcon}
            tintColor={isActive ? COLORS.PRIMARY : COLORS.PLACEHOLDER_COLOR}
            style={styles.icon}
          />
        ))}
        <TextInput
          textContentType={textContentType || 'none'}
          onTouchEnd={onPress}
          {...props}
          multiline={multiline}
          numberOfLines={numberOfLines}
          ref={inputRef}
          blurOnSubmit={returnKeyType ? false : blurOnSubmit || true}
          autoFocus={autoFocus || false}
          cursorColor={COLORS.PRIMARY_DARK}
          onFocus={() => {
            if (onFocus) onFocus();
            if (isTextInputActive) isTextInputActive(true);
            if (!onFocusDisable) setState(prev => ({ ...prev, isActive: true }));
          }}
          onBlur={() => {
            if (onBlur) onBlur();
            if (isTextInputActive) isTextInputActive(false);
            if (!onFocusDisable) setState(prev => ({ ...prev, isActive: false }));
          }}
          editable={disabled || onPress ? false : true}
          maxLength={maxLength}
          style={[
            styles.textInput,
            {
              color: disabled ? COLORS.DISABLED : COLORS.PRIMARY,
              fontSize: COMMON_SIZE.NORMAL + fontSize,
            },
            style,
          ]}
          autoCapitalize={autoCapitalize || 'none'}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          value={value}
          placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
          keyboardType={keyboardType || 'default'}
          returnKeyType={returnKeyType || 'done'}
          secureTextEntry={secoreText}
        />
        {secureTextEntry && value && (
          <RNAnimatableWrapper animation={'fadeIn'}>
            <RNIcon
              name={secoreText ? 'eye-with-line' : 'eye'}
              type={'Entypo'}
              onPress={() => { setSecoreText(!secoreText); }}
              size={COMMON_SIZE.MEDIUM_ICON}
              color={isActive ? COLORS.PRIMARY : COLORS.PLACEHOLDER_COLOR}
              style={{ marginHorizontal: scale(10) }}
            />
          </RNAnimatableWrapper>
        )}
        {value && !hideClearText && !disabled && (
          <RNAnimatableWrapper animation={'fadeIn'}>
            <RNIcon
              name={'circle-with-cross'}
              type={'Entypo'}
              onPress={_onPressClearText}
              size={COMMON_SIZE.MEDIUM_ICON}
              color={isActive ? COLORS.PRIMARY : COLORS.PLACEHOLDER_COLOR}
              style={{ marginHorizontal: scale(10) }}
            />
          </RNAnimatableWrapper>
        )}
        {rightIcon && (rightIconType ? (
          <RNIcon
            name={rightIcon}
            type={rightIconType}
            size={rightIconSize || size}
            color={isActive ? COLORS.PRIMARY : rightIconColor || color}
            style={rightIconStyle}
          />
        ) : (
          <RNImage
            source={rightIcon}
            tintColor={isActive ? COLORS.PRIMARY : COLORS.PLACEHOLDER_COLOR}
            style={[rightIconStyle || styles.icon]}
          />
        ))}
        {children && children}
      </View>
      {(errorMessage || error) && (
        <RNAnimatableWrapper animation={'fadeIn'}>
          <RNText style={errorStyle} small textColor={COLORS.RED}>
            {errorMessage || error}
          </RNText>
        </RNAnimatableWrapper>
      )}
    </Pressable>
  );
};

export default RNTextInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    minHeight: scale(46),
    backgroundColor: COLORS.WHITE,
  },
  icon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
  },
  textInput: {
    flex: 1,
    color: COLORS.PRIMARY,
    fontSize: COMMON_SIZE.LARGE,
    fontFamily: FONTS.openSans_SemiBold,
    paddingVertical: scale(10),
    paddingLeft: scale(10),
  },
});
