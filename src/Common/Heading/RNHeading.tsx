import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { scale } from 'react-native-size-matters';
import RNText from '../Text/Text';

type RNHeadingProps = {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
  textColor?: string;
  textStyle?: TextStyle;
  hidePaddingHorizontal?: boolean;
  onPress?: () => void;
  bold?: boolean;
  extraLarge?: boolean;
  large?: boolean;
};

const RNHeading: React.FC<RNHeadingProps> = ({
  title,
  leftComponent,
  rightComponent,
  style,
  textColor,
  textStyle,
  hidePaddingHorizontal,
  onPress,
  bold,
  extraLarge,
  large,
}) => {
  return (
    <View
      style={[
        styles.container,
        hidePaddingHorizontal ? null : { paddingHorizontal: scale(10) },
        style,
      ]}
    >
      {leftComponent}
      {title ? (
        <RNText
          onPress={onPress}
          bold={bold}
          large={large}
          extraLarge={extraLarge}
          textColor={textColor}
          style={textStyle}
        >
          {title}
        </RNText>
      ) : null}
      {rightComponent}
    </View>
  );
};

export default RNHeading;

const styles = StyleSheet.create({
  container: {
    minHeight: scale(40),
    flexDirection: 'row',
  },
});
