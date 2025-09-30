import { SafeAreaView, StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { _onPressNavigate } from '../../utils/commonFunction';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../../constants';

type AppHeaderProps = {
  children?: ReactNode;
  contentContainerStyle?: ViewStyle;
};

const AppHeader: React.FC<AppHeaderProps> = ({ children, contentContainerStyle }) => {
  return (
    <View style={[styles.mainContainer, contentContainerStyle]}>
      <View style={styles.fillingView} />
      <View style={styles.container} />
      <StatusBar barStyle={'light-content'} />
      <SafeAreaView style={{ backgroundColor: COLORS.PRIMARY }} />
      {children}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: scale(150),
    backgroundColor: COLORS.TRANSPARENT,
  },
  fillingView: {
    width: '100%',
    position: 'absolute',
    height: 30,
    backgroundColor: COLORS.PRIMARY,
  },
  container: {
    width: '100%',
    height: scale(150),
    backgroundColor: COLORS.PRIMARY,
    borderBottomRightRadius: scale(125),
    position: 'absolute',
    transform: [{ rotate: '-2deg' }, { scale: 1.05 }],
  },
});
