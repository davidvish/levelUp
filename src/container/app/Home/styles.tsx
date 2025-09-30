import {Dimensions, Platform, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import { COLORS, COMMON_SIZE } from '../../../constants';

const LOGO_SIZE = scale(150);
const imageSize = scale(15);
const screenWidth = Dimensions.get('window').width;
const { width, height } = Dimensions.get('window');

const IMAGES_SIZE = scale(40);
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_COLOR
  },
  imageimage:{
    width: width * 0.8,
    height: height * 0.4,
  },
  cardMainView: {
    width: "98%",
    marginTop: "7%",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    //shadowOpacity: 1,
    elevation: COLORS.ELEVATION,
    shadowColor: COLORS.SHADOW_COLOR,
    position: "relative",
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 :1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },
  upcomingLeftImage: {
    height: 115,
    width: 120,
  },
  textContainer: {
    position: 'absolute',
    alignItems:"center",
    alignSelf:"center",
    marginLeft: 20, // Adjust as needed for spacing between image and text
  },
  upcomingLeftMonthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXTCOLORBG,
    bottom:10
  },
  upcomingLeftDateText: {
    fontSize: 18,
    color: COLORS.TEXTCOLORBG,
    bottom:6
  },
  secondRowView : {
    justifyContent:"space-between", 
    //alignItems:"center",
  },
  upcomingEventText : {
    right:25, 
    padding:5, 
    top:5
  },
  eventNameText:{
    right:15, 
    padding:5, 
    bottom:10
  },
  calendarInviteText : {
    right:15, 
    top:10, 
    backgroundColor:COLORS.LIGHTBG
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 6,
  },
  image: {
    height: 130,
    width: 120,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  contentContainer: {
    width: "60%",
    justifyContent:"space-between"
  },
  labelText: {
    padding: 6,
  },
  titleText: {
    padding: 6,
    width:"120%"
  },
  icon: {
    height: 17,
    width: 17,
  },
  dateText: {
    paddingHorizontal: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  progressText: {
    marginLeft: 10,
    bottom:1
  },
  closeIcon: {
    height: 17,
    width: 17,
    marginTop: 7,
    right: 18,
  },
  seeAllView:{
    alignSelf: "center", 
    width: "98%", 
    marginTop: "15%", 
    flexDirection: "row", 
    justifyContent: "space-between",
  },
  seeSecondView:{
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 5
  },
  horizontalMainCardView:{
     marginTop:"7%",
     width: 270,
     backgroundColor: COLORS.WHITE,
     shadowColor: COLORS.SHADOW_COLOR,
     borderRadius: 10,
     elevation: COLORS.ELEVATION,
     paddingBottom:20,
     shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 :1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },
  courseButtonStyle1:{
    marginTop:scale(25),
    width:"87%",
    borderColor:COLORS.PRIMARY,
    borderWidth:1,
  },
  courseDummyImageStyle:{
    height: 150,
    width: 270,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  courseViewText:{
  marginTop:7, 
  paddingLeft:scale(20), 
  paddingRight: scale(20)
},
courseViewSmallText:{
  width:250,
  alignItems:"center", 
  flexDirection:"row",
  alignSelf:"center",
  //justifyContent:"space-around",
  paddingLeft:scale(20),
  marginTop:scale(7), 
},
courseViewSmallText1:{
  width:250,
  paddingLeft:scale(20),
  marginTop:scale(7), 
},
courseViewSmallCircle:{
  width:5, 
  height:5, 
  borderRadius:10, 
  marginLeft:10, 
  backgroundColor: 
  COLORS.GRAYTEXTCOLOR
},
courseButtonStyle:{
  marginTop:scale(7),
  width:"87%",
 },
 courseFlashcardButtonStyle:{
  marginTop:scale(7),
  width:"86%",
 },
pathSmallTextView:{
  flexDirection:"row", 
  alignItems:"center"
},
courseLabelContainer: {
  alignSelf: 'flex-start',
  padding: scale(3),
  backgroundColor: '#E1E7FB',
  maxWidth: '90%',
  borderRadius: 5,
  marginTop: scale(5),
},
lineView:{
  borderWidth:0.7, 
  height:13, 
  marginLeft:10, 
  borderColor:COLORS.GRAYTEXTCOLOR
},
courseViewSmallViewSecond : {
  flexDirection:"row", 
  alignItems:"center", 
  width:100
},
piaChartResultBox:{
  borderRadius:2, 
  width:12, 
  height:12, 
  backgroundColor:"#63FFEC"
},
piaChartResultBox1: {
  borderRadius:2, 
  width:12, 
  height:12, 
  backgroundColor:"#4647C6"
},
piaChartFlexDirection:{
  flexDirection:"row", 
  marginTop:10, 
  alignItems:"center"
},
circleCardMainView: {
  width: "98%",
  height:scale(260),
  paddingHorizontal:20,
  paddingVertical:20,
  marginTop: "15%",
  alignSelf: "center",
  justifyContent:"space-between",
  backgroundColor: COLORS.WHITE,
  shadowColor: COLORS.SHADOW_COLOR,
  borderRadius: 10,
  zIndex:999
},
shimmerItem: {
  width: 200,
  height: 200,
  borderRadius: 10,
},
menuContainer: {
  position: "absolute",
  zIndex: 100000,
  width: scale(100), // Increased width to make it look more like a menu
  backgroundColor: COLORS.WHITE,
  right: 0,
  top: scale(30),
  elevation: 5, // Adjusted elevation to a more reasonable value
  borderRadius: 8, // Added border radius for a rounded corner look
  padding: scale(10), // Added padding inside the menu
  shadowColor: "#000", // Added shadow for iOS
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
},
menuItem: {
  paddingVertical: scale(10),
  paddingHorizontal: scale(15),
},

barChartMainView :{
  width: "98%",
  paddingHorizontal: 20,
  paddingVertical: 20,
  marginTop: "15%",
  alignSelf: "center",
  justifyContent: "space-between",
  backgroundColor: COLORS.WHITE,
  shadowColor: COLORS.SHADOW_COLOR,
  borderRadius: 10,
  zIndex: 999,
},
graphSmallLine : {
   borderWidth:0.7,
   height:15, 
   borderColor:"#D7D7D7"
  },
  graphSmallTextView:{
    flexDirection:"row", 
    alignItems:"center",
    marginTop:15, 
    marginBottom:5, 
    justifyContent:"space-between"
  },
  smallBoxRow :{
    flexDirection:"row", 
    alignItems:"center"
  },

  mainBoxStyleRow:{ 
    width: "47%", 
    padding: 10, 
    backgroundColor: "#F1F8FF", 
    borderRadius: 5 
  },
  label: {
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  labelContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -scale(50) }, { translateY: -scale(10) }],
  },
});
