import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS, COMMON_SIZE} from '../../../constants';
import {commonStyle} from '../../../styles/styles';

const LOGO_SIZE = scale(150);
export const styles = StyleSheet.create({
  validator: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectionStyle: {
    ...commonStyle.row,
    justifyContent: 'space-evenly',
    marginTop: scale(10)
  },
  validIcon: {
    height: 20,
    width: 20,
    borderRadius: 30,
    backgroundColor: COLORS.PLACEHOLDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginVertical: 5
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: scale(10)
  },
  heading: {
    marginBottom: scale(5),
    marginTop: scale(30)
  },
  alreadyRegisteredView: {
    marginTop: scale(10),
    marginBottom: scale(30)
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE
  },
  nameContainer: {...commonStyle.row, justifyContent: 'space-between'}
});
