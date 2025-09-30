import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';

interface RNAnimatableWrapperProps {
  children?: React.ReactNode;
  style?: any;
  animation?: string;
  animationref?: any;
  onPress?: () => void;
  disabled?: boolean;
  containerStyle?: any;
  duration?: number;
  delay?: number;
  iterationCount?: number;
  iterationDelay?: number;
}

const RNAnimatableWrapper = ({
  children,
  style,
  animation,
  animationref,
  onPress,
  disabled,
  containerStyle,
  duration,
  delay,
  iterationCount,
  iterationDelay,
}: RNAnimatableWrapperProps) => {
  return (
    <Animatable.View
      iterationDelay={iterationDelay}
      ref={animationref}
      delay={delay}
      style={containerStyle}
      duration={duration}
      direction="alternate"
      easing="ease-out"
      iterationCount={iterationCount}
      animation={animation || 'pulse'}>
      <Pressable
        style={[style]}
        disabled={disabled || !onPress}
        onPress={onPress}>
        {children}
      </Pressable>
    </Animatable.View>
  );
};

export default RNAnimatableWrapper;

const styles = StyleSheet.create({});
