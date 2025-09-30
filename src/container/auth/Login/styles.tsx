import {Dimensions, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import { COLORS, COMMON_SIZE } from '../../../constants';

const LOGO_SIZE = scale(150);
const imageSize = scale(15);
const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor:COLORS.PRIMARY
  },

  secondContainerView:{
    width:"100%", 
    height:"100%", 
   // borderTopWidth:0.5, 
    backgroundColor:COLORS.WHITE, 
    borderTopEndRadius:20, 
    borderTopStartRadius:30, 
   // marginTop:30
  },
  title: {
    fontSize: COMMON_SIZE.ICON,
    color:COLORS.WHITE,
    marginHorizontal: scale(20),
    marginTop:"17%"
  },
  forgotPasswordStyle:{
   // textAlign:"right", 
    marginTop:15, 
   // width:screenWidth / 1.05, 
    color:COLORS.PRIMARY,
    marginRight:20
  },

  buttonStyle:{
    marginTop:"12%", 
    width: screenWidth / 1.5
  },
  orMainView:{
    flexDirection:"row", 
    marginTop:"10%", 
    width:screenWidth / 1.3, 
    alignSelf:"center", 
    justifyContent:"center"
  },
  LineView:{
    width:"43%", 
    borderWidth:0.2, 
    borderColor:COLORS.BORDER_COLOR, 
    height:0, 
    marginTop:12, 
    right:10
  },
  secondLineView:{
    width:"43%", 
    borderWidth:0.2, 
    borderColor:COLORS.BORDER_COLOR, 
    height:0, 
    marginTop:12, 
    left:10
  },
  soicalLoginViewStyle:{
    flexDirection:"row",
    justifyContent:"center",
    marginTop:"3%", 
    width:"90%", 
    alignSelf:"center", 
    alignItems:"center", 
    paddingVertical:15, 
    backgroundColor:COLORS.SOICALCOLOR
  },
  soicalImageStyle:{
    height: imageSize,
    width: imageSize, 
  },
});
