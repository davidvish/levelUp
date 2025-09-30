import { StyleSheet, Text, TextProps, View } from 'react-native';
import React from 'react';
import { COLORS, COMMON_SIZE, FONTS } from '../../constants';
import { scale } from 'react-native-size-matters';
//import { basicSettingsSelector } from '../../container/auth/OnBoardings/module/BasicSettings/reducer';
import RNAnimatableWrapper from '../AnimatableWrapper/AnimatableWrapper';

interface RNTextProps extends TextProps {
  numberOfLines?: number;
  small?: boolean;
  medium?: boolean;
  large?: boolean;
  bold?: boolean;
  semiBold?: boolean;
  textColor?: string;
  capitalize?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
  alignSelfCenter?: boolean;
  underline?: boolean;
  extraLarge?: boolean;
  TextAlignCenter?: boolean;
  TextAlignJustify?: boolean;
  textAnimationRef?: any;
  animation?: string;
  textCustomSize?: number;
  marginVertical?: number;
  onPress?: () => void;
}

const RNText = ({
  numberOfLines,
  small,
  medium,
  large,
  bold,
  semiBold,
  textColor,
  children,
  onPress,
  style,
  capitalize,
  lowercase,
  uppercase,
  alignSelfCenter,
  underline,
  extraLarge,
  TextAlignCenter,
  TextAlignJustify,
  textAnimationRef,
  animation,
  textCustomSize,
  marginVertical = 0,
  ...props
}: RNTextProps) => {
  const fontSize = 0;

  const FontSize = small
    ? COMMON_SIZE.SMALL + fontSize
    : medium
    ? COMMON_SIZE.MEDIUM + fontSize
    : large
    ? COMMON_SIZE.LARGE + fontSize
    : extraLarge
    ? COMMON_SIZE.EXTRA_LARGE + fontSize
    : textCustomSize
    ? textCustomSize + fontSize
    : COMMON_SIZE.NORMAL + fontSize;

  const fontFamily = bold
    ? FONTS.openSans_Bold
    : semiBold
    ? FONTS.openSans_SemiBold
    : FONTS.openSans_Medium;

  const color = textColor ? textColor : COLORS.BLACK;
  const textDecorationLine = underline ? 'underline' : 'none';
  const textTransform = uppercase
    ? 'uppercase'
    : lowercase
    ? 'lowercase'
    : capitalize
    ? 'capitalize'
    : 'none';

  return textAnimationRef ? (
    <RNAnimatableWrapper animation={animation || 'fadeIn'} animationref={textAnimationRef}>
      <Text
        disabled={!onPress}
        onPress={onPress}
        numberOfLines={numberOfLines}
        style={[
          styles.textStyle,
          {
            fontSize: FontSize,
            fontFamily,
            color,
            textTransform,
            textDecorationLine,
            marginVertical,
          },
          alignSelfCenter && { alignSelf: 'center' },
          TextAlignCenter && { textAlign: 'center' },
          TextAlignJustify && { textAlign: 'justify' },
          style,
        ]}
        {...props}>
        {children}
      </Text>
    </RNAnimatableWrapper>
  ) : (
    <Text
      disabled={!onPress}
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={[
        styles.textStyle,
        {
          fontSize: FontSize,
          fontFamily,
          color,
          textTransform,
          textDecorationLine,
          marginVertical,
        },
        alignSelfCenter && { alignSelf: 'center' },
        TextAlignCenter && { textAlign: 'center' },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

export default RNText;

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: FONTS.openSans_Regular,
  },
});
