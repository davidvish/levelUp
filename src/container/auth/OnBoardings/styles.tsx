import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { COLORS, COMMON_SIZE } from '../../../constants';
import { scale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: COLORS.PRIMARY,
    },
  
    banner: {
       width: 250,
       height: 250,
      // marginLeft: 53,
       marginTop: scale(90),
      // marginBottom: 70,
    },
  
    button: {
      width: screenWidth / 1.5,
      marginBottom: scale(75),
      borderRadius: 50,
      height: 10,
    },
    title: {
      fontSize: scale(20),
      marginBottom: 10,
      color: COLORS.WHITE,
    },
    text: {
      marginHorizontal: scale(20),
    },
  
    subTitletext: {
      marginHorizontal: scale(25),
    },
  });