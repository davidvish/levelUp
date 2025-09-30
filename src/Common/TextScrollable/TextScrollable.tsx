import React from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import TextTicker from 'react-native-text-ticker';
import { COLORS, COMMON_SIZE, FONTS } from '../../constants';

interface RNTextScrollableProps {
  numberOfLines?: number;
  small?: boolean;
  medium?: boolean;
  large?: boolean;
  bold?: boolean;
  semiBold?: boolean;
  textColor?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: TextStyle;
  capitalize?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
  alignSelfCenter?: boolean;
  underline?: boolean;
  extraLarge?: boolean;
  TextAlignCenter?: boolean;
  duration?: number;
  bounce?: boolean;
  loop?: boolean;
  marqueeDelay?: number;
  repeatSpacer?: number;
}

const RNTextScrollable: React.FC<RNTextScrollableProps> = ({
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
  duration,
  bounce,
  loop,
  marqueeDelay,
  repeatSpacer,
  ...props
}) => {
  const fontSize = 0;
  const FontSize = small
    ? COMMON_SIZE.SMALL + fontSize
    : medium
    ? COMMON_SIZE.MEDIUM + fontSize
    : large
    ? COMMON_SIZE.LARGE + fontSize
    : extraLarge
    ? COMMON_SIZE.EXTRA_LARGE + fontSize
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

  return (
    <TextTicker
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
        } as TextStyle,
        alignSelfCenter && { alignSelf: 'center' } as ViewStyle,
        TextAlignCenter && { textAlign: 'center' } as TextStyle,
        style,
      ]}
      duration={duration}
      loop={loop ?? true}
      bounce={bounce ?? false}
      repeatSpacer={repeatSpacer}
      marqueeDelay={marqueeDelay}
      {...props}
    >
      {children}
    </TextTicker>
  );
};

export default RNTextScrollable;

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: FONTS.openSans_Regular,
  },
});