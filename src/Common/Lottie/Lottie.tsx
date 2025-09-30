import React from 'react';
import Lottie, { AnimationObject } from 'lottie-react-native';
import { View, ViewStyle } from 'react-native';

interface RNLottieProps {
  source: AnimationObject | { uri: string } | string; // Updated source type
  style?: ViewStyle;
  resizeMode?: 'contain' | 'cover' | 'center';
  animationRef?: React.Ref<Lottie>;
  loop?: boolean;
  autoPlay?: boolean;
  duration?: number;
}

const RNLottie: React.FC<RNLottieProps> = ({
  source,
  style,
  resizeMode = 'contain',
  animationRef,
  loop = true,
  autoPlay = true,
  duration,
}) => {
  return (
    <View>
      <Lottie
        style={style}
        resizeMode={resizeMode}
        ref={animationRef}
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        duration={duration}
      />
    </View>
  );
};

export default RNLottie;
