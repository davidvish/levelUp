import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const RNLinearGradientWrapper = ({
  children,
  style,
  colors,
  start,
  locations,
  end,
  angle,
  angleCenter,
  useAngle,
}) => {
  return (
    <LinearGradient
      // angle={angle}
      // useAngle={useAngle}
      // angleCenter={angleCenter}
      locations={locations}
      start={start}
      end={end}
      colors={colors}
      style={[styles.LinearGradientStyle, style]}>
      {children}
    </LinearGradient>
  );
};

export default RNLinearGradientWrapper;

const styles = StyleSheet.create({
  LinearGradientStyle: {},
  //  LinearGradientStyle: { width: '100%' }
});
