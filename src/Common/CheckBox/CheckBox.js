import {StyleSheet} from 'react-native';
import React from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {COLORS, COMMON_SIZE} from '../../constants';
import {scale} from 'react-native-size-matters';
//import {basicSettingsSelector} from '../../container/auth/OnBoardings/module/BasicSettings/reducer';

const RNCheckBox = ({
  checkBoxStyle,
  isChecked,
  style,
  title,
  textStyle,
  onPress,
  unfillColor,
  textComponent,
  hitSlop,
}) => {
  const fontSize = 0;
  return (
    <BouncyCheckbox
      hitSlop={hitSlop}
      style={[styles.boxStyle, checkBoxStyle]}
      iconStyle={[styles.iconStyle, style]}
      innerIconStyle={[styles.innerIconStyle, style]}
      textStyle={[
        {textDecorationLine: 'none'},
        textStyle,
        {fontSize: COMMON_SIZE.NORMAL + fontSize},
      ]}
      onPress={onPress}
      disableText={title ? false : true}
      disableBuiltInState={true}
      isChecked={isChecked}
      fillColor={COLORS.PRIMARY}
      unfillColor={unfillColor || 'transparent'}
      text={title}
      textComponent={textComponent}
    />
  );
};

export default RNCheckBox;
const CHECKBOX_SIZE = scale(15);
const RADIUS = scale(4);
const styles = StyleSheet.create({
  boxStyle: {
    borderRadius: RADIUS,
  },
  iconStyle: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderRadius: RADIUS,
  },
  innerIconStyle: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderRadius: RADIUS,
    borderWidth: 1,
  },
});
