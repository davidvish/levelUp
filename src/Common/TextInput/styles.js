import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS, COMMON_SIZE, FONTS} from '../../constants';
import {commonStyle} from '../../styles/styles';
import {wp} from '../../config/constants';

const INPUT_SIZE = scale(40);
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PLACEHOLDER_COLOR,
  },
  actionsheet: {
    height: 150,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // justifyContent: 'center',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderColor: COLORS.PLACEHOLDER_COLOR,
  },
  countryPikcerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    minHeight: scale(46),
    borderRadius: scale(10),
    borderColor: COLORS.SECONDARY,
    backgroundColor: COLORS.WHITE,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    position: 'absolute',
    backgroundColor: 'white',
    left: scale(12),
    paddingHorizontal: 5,
    color: 'black',
  },
  icon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
  },
  textInput: {
    flex: 1,
    // backgroundColor: "red",
    fontFamily: FONTS.openSans_SemiBold,
    paddingVertical: scale(10),
    paddingLeft: scale(10),
    minHeight: scale(46),
    // width: '88%',
  },

  countryContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  seprator: {
    height: '50%',
    width: 2,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },

  addressPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_DARK,
    height: 50,
    paddingHorizontal: scale(10),
  },
  headerTitle: {
    fontSize: COMMON_SIZE.MEDIUM,
    marginLeft: 10,
    textTransform: 'uppercase',
  },

  addressItem: {
    marginVertical: 5,
    flexDirection: 'row',
    paddingHorizontal: scale(10),
    alignItems: 'center',
  },
  addressText: {
    flex: 1,
    padding: 5,
  },
  sepratorH: {
    marginHorizontal: scale(20),
    backgroundColor: COLORS.GRAY,
    height: 1,
  },
  countryMorph: {
    ...commonStyle.borderRadius,
    width: '20%',
  },
  phoneNumberContainer: {
    justifyContent: 'center',
    width: '80%',
  },
  customInputBox: {
    marginHorizontal: 5,
    height: INPUT_SIZE,
    width: INPUT_SIZE,
    borderRadius: 5,
    alignSelf: 'center',
    // backgroundColor: 'red',
    borderWidth: 1,
    borderColor: COLORS.PLACEHOLDER_COLOR,
  },
});
