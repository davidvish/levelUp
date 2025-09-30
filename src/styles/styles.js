import {Dimensions, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS, COMMON_SIZE} from '../constants';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const commonStyle = StyleSheet.create({
  SHADOW: {
    // borderRadius: scale(8),
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: COLORS.ELEVATION
  },
  SHADOW_DARK: {
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: COLORS.ELEVATION
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowWithWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  paddingH: {
    paddingHorizontal: scale(15)
  },
  marginH: {
    marginHorizontal: scale(15)
  },
  marginV: {
    marginVertical: scale(15)
  },
  borderRadius: {
    borderRadius: scale(10)
  },

  rowC: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sepator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.PLACEHOLDER_COLOR
  }
});
