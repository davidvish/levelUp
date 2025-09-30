import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';
import TextScrollable from '../TextScrollable/TextScrollable';
import RNIcon from '../Icon/Icon';
import RNImage from '../Image/Image';

const RNRowTextAndIcon = ({
  leftText,
  style,
  leftSourceType,
  rightSourceType,
  leftIconSize,
  rightIconSize,
  leftSourceIconstyle,
  textStyle,
  leftSource,
  rightSource,
  rightSourceIconstyle,
  resizeMode,
  onPress,
  onPressLeft,
  onPressRight,
  leftSourceColor,
  rightSourceColor,
  borderRadius,
  rightText,
  rightChildren,
  leftChildren,
  leftNumberOfLines,
  rightNumberOfLines,
  centerChildren
}) => {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={[styles.container, style]}>
      {leftChildren ? leftChildren : null}
      {leftSource ? (
        <RNImage
          onPress={onPressLeft}
          source={leftSource}
          borderRadius={borderRadius}
          style={[styles.image, leftSourceIconstyle]}
          resizeMode={resizeMode || 'contain'}
        />
      ) : leftSourceType ? (
        <RNIcon
          color={leftSourceColor}
          onPress={onPressLeft}
          name={leftSource}
          type={leftSourceType}
          size={leftIconSize}
          style={leftSourceIconstyle}
        />
      ) : null}

      {leftText ? (
        <TextScrollable
          numberOfLines={leftNumberOfLines}
          onPress={onPressLeft}
          style={textStyle}>
          {leftText}
        </TextScrollable>
      ) : null}
      {centerChildren ? centerChildren : null}
      {rightSource ? (
        <RNImage
          onPress={onPressRight}
          source={rightSource}
          borderRadius={borderRadius}
          style={[styles.image, rightSourceIconstyle]}
          resizeMode={resizeMode || 'contain'}
        />
      ) : rightSourceType ? (
        <RNIcon
          color={rightSourceColor}
          onPress={onPressRight}
          name={rightSource}
          type={rightSourceType}
          size={rightIconSize}
          style={rightSourceIconstyle}
        />
      ) : null}

      {rightText ? (
        <TextScrollable
          numberOfLines={rightNumberOfLines}
          onPress={onPressRight}
          style={textStyle}>
          {rightText}
        </TextScrollable>
      ) : null}
      {rightChildren ? rightChildren : null}
    </Pressable>
  );
};

export default RNRowTextAndIcon;
const IMAGE_SIZE = scale(25);
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },

  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE
  }
});
