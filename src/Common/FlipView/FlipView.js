// import Animated, {
//   Easing,
//   useAnimatedStyle,
//   useDerivedValue,
//   withTiming,
//   interpolate,
// } from 'react-native-reanimated';
// import {StyleSheet, ViewStyle} from 'react-native';
// import React from 'react';

// const RNFlipView = ({side, front, back, style}) => {
//   const rotatePosition = interpolate(side, [0, 1], [180, 360]);

//   const rotateValue = useDerivedValue(() => {
//     return withTiming(rotatePosition, {
//       duration: 500,
//       easing: Easing.inOut(Easing.ease),
//     });
//   });

//   const rotationFlip = useDerivedValue(() => {
//     return {
//       rotateX: `${rotateValue.value}deg`,
//     };
//   }, [rotateValue]);

//   const rotationFlipBack = useDerivedValue(() => {
//     return {
//       rotateX: '180deg',
//     };
//   });

//   const opacityFront = useDerivedValue(() => {
//     return withTiming(side, {
//       duration: 500,
//       easing: Easing.inOut(Easing.ease),
//     });
//   }, [side]);

//   const opacityBack = useDerivedValue(() => {
//     return withTiming(side === 0 ? 1 : 0, {
//       duration: 500,
//       easing: Easing.inOut(Easing.ease),
//     });
//   }, [side]);

//   const widthFront = useDerivedValue(() => {
//     return withTiming(side === 1 ? 100 : 0, {
//       duration: 500,
//       easing: Easing.inOut(Easing.ease),
//     });
//   });
//   const widthBack = useDerivedValue(() => {
//     return withTiming(side === 0 ? 100 : 0, {
//       duration: 500,
//       easing: Easing.inOut(Easing.ease),
//     });
//   });

//   const animatedStyleFront = useAnimatedStyle(() => {
//     return {
//       opacity: opacityFront.value,
//       width: `${widthFront.value}%`,
//       transform: [{...rotationFlip.value}],
//     };
//   }, [side, rotationFlip]);

//   const animatedStyleBack = useAnimatedStyle(() => {
//     return {
//       opacity: opacityBack.value,
//       width: `${widthBack.value}%`,
//       transform: [{...rotationFlipBack.value}, {...rotationFlip.value}],
//     };
//   }, [side]);

//   return (
//     <Animated.View style={[style, styles.container]}>
//       <Animated.View style={[styles.card, animatedStyleFront]}>
//         {front}
//       </Animated.View>
//       <Animated.View style={[styles.card, animatedStyleBack]}>
//         {back}
//       </Animated.View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//   },
//   card: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//   },
// });

// export default RNFlipView;

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FlipView = () => {
  return (
    <View>
      <Text>FlipView</Text>
    </View>
  )
}

export default FlipView

const styles = StyleSheet.create({})