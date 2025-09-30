import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../../../constants';

const styles = StyleSheet.create({
 container:{
    paddingHorizontal: 10,
    backgroundColor: COLORS.WHITE,
    paddingVertical: 20,
    width: '90%'
  },
  courseButtonStyle: {
    marginTop: scale(7),
    width: "100%",
  },
});

export default styles;
