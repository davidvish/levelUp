import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS, IMAGES} from '../../constants';
import RNImage from '../Image/Image';
import RNText from '../Text/Text';

export const RNListView = ({
  listViewContainerStyle,
  source,
  title,
  subTitle,
  rightText,
  children,
  imageStyle,
  resizeMode,
  hideBorderLine,
  onPressRightText,
  rightTextColor,
  rightTextContainerStyle,
  rightSubText,
  rightSubTextColor,
  thirdLine,
  titleStyle,
  subTitleStyle,
  ThirdLineStyle,
  rightSubTextStyle,
  rightTextStyle,
  extraChildren,
  onPress,
  disabled,
  borderRadius,
  leftComponent,
  middleContainerStyle,
  rightSource
}) => {
  return (
    <Pressable
      disabled={disabled || !onPress}
      onPress={onPress}
      style={[
        styles.listViewContainerStyle,
        {
          borderBottomWidth: hideBorderLine ? 0 : 0.5
        },
        listViewContainerStyle
      ]}>
      {leftComponent ? leftComponent : null}
      {source ? (
        null
      ) : null}
      <View
        style={[
          styles.textContainer,
          {paddingHorizontal: source ? scale(10) : 0},
          middleContainerStyle
        ]}>
        {title ? (
          <RNText
            bold
            style={titleStyle}
            numberOfLines={2}
            textColor={COLORS.BLACK}>
            {title}
          </RNText>
        ) : null}
        {subTitle ? (
          <RNText
            style={subTitleStyle}
            numberOfLines={2}
            small
            textColor={COLORS.GRAY}>
            {subTitle}
          </RNText>
        ) : null}
        {thirdLine ? (
          <RNText
            style={ThirdLineStyle}
            numberOfLines={1}
            small
            textColor={COLORS.GRAY}>
            {thirdLine}
          </RNText>
        ) : null}
        {extraChildren ? extraChildren : null}
      </View>
      <View style={[styles.rightTextContainer, rightTextContainerStyle]}>
        {rightText ? (
          <RNText
            style={rightTextStyle}
            onPress={onPressRightText}
            numberOfLines={1}
            textColor={rightTextColor || COLORS.BLACK}>
            {rightText}
          </RNText>
        ) : null}
        {rightSubText ? (
          <RNText
            style={rightSubTextStyle}
            numberOfLines={1}
            textColor={rightSubTextColor || COLORS.BLACK}>
            {rightSubText}
          </RNText>
        ) : null}
        {rightSource ? (
          <RNImage
            source={rightSource || {uri: IMAGES.DEMO_PIC}}
            style={[styles.imageStyle, imageStyle]}
            imageStyle={imageStyle}
            resizeMode={resizeMode}
            borderRadius={borderRadius}
          />
        ) : null}
        {children ? children : null}
      </View>
    </Pressable>
  );
};
const imageSize = scale(40);
const styles = StyleSheet.create({
  imageStyle: {
    height: imageSize,
    width: imageSize
  },
  textContainer: {
    //     height: "100%",
    flex: 1,
    paddingHorizontal: scale(10),
    justifyContent: 'space-evenly'
  },
  listViewContainerStyle: {
    flexDirection: 'row',
    marginBottom: scale(5),
    borderBottomWidth: 0.5,
    borderBottomColor: 'silver',
    padding: scale(5)
  },
  rightTextContainer: {}
});
