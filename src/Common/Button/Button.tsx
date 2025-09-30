import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import RNText from '../Text/Text';
import { COLORS } from '../../constants';
import { scale } from 'react-native-size-matters';
import RNAnimatableWrapper from '../AnimatableWrapper/AnimatableWrapper';

interface RNButtonProps {
  title?: string;
  onPress?: () => void;
  textColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  loading?: boolean;
  ButtonRef?: any;
  animation?: any;
  delay?: number;
  duration?: number;
  round?: boolean;
  textStyle?: TextStyle;
  minHeightButton?:any
}

const RNButton: React.FC<RNButtonProps> = ({
  title,
  onPress,
  textColor,
  disabled,
  style,
  backgroundColor,
  loading,
  ButtonRef,
  animation,
  delay,
  duration,
  round,
  textStyle,
  minHeightButton
}) => {
  let BackgroundColor = disabled
    ? COLORS.DISABLED
    : backgroundColor || COLORS.PRIMARY;

  let TextColor = disabled ? COLORS.DISABLEDTEXT : textColor || COLORS.WHITE;

  const loaderRef = useRef<any>(null);
  const textRef = useRef<any>(null);
  const buttonRef = useRef<any>(null);
  useEffect(() => {
    if (loading) {
      buttonRef?.current?.pulse();
      loaderRef?.current?.zoomIn(400);
    } else {
      buttonRef?.current?.pulse();
      textRef?.current?.zoomIn(400);
    }
  }, [loading, disabled]);

  return (
    <RNAnimatableWrapper
      duration={duration}
      delay={delay}
      animationref={ButtonRef || buttonRef}
      animation={'pulse'}
      disabled={disabled}
      style={[
        styles.container,
        style,
        { backgroundColor: BackgroundColor, minHeight: minHeightButton ? scale(35) : scale(45), },
        round && { borderRadius: scale(30) },
      ]}
      onPress={onPress}>
      {loading ? (
        <RNAnimatableWrapper animationref={loaderRef}>
          <ActivityIndicator color={COLORS.WHITE} />
        </RNAnimatableWrapper>
      ) : title ? (
        <RNAnimatableWrapper animationref={textRef}>
          <RNText
            bold
            medium
            style={[{ textTransform: 'capitalize' }, textStyle]}
            textColor={TextColor}>
            {title}
          </RNText>
        </RNAnimatableWrapper>
      ) : null}
    </RNAnimatableWrapper>
  );
};

export default RNButton;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
