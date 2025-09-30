import {View} from 'react-native';
import React from 'react';
import {styles} from '../styles';
import {RNIcon, RNText} from '../../../../Common';
import {COLORS} from '../../../../constants';

const Validations = ({valid, text}) => {
  return (
    <View style={styles.validator}>
      <View
        style={[
          styles.validIcon,
          {backgroundColor: valid ? COLORS.PRIMARY : COLORS.PLACEHOLDER_COLOR},
        ]}>
        <RNIcon
          name="check"
          type={'AntDesign'}
          size={14}
          color={COLORS.WHITE}
        />
      </View>
      <RNText medium textColor={valid ? 'black' : COLORS.PLACEHOLDER_COLOR}>
        {text}
      </RNText>
    </View>
  );
};
export default Validations;
