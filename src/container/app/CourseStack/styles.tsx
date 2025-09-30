import {Dimensions, Platform, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import { COLORS, COMMON_SIZE } from '../../../constants';
export const styles = StyleSheet.create({
        container: {
          // flex: 1,
          backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
        },
        dateText: {
          padding: 20,
        },
        badgeAnimation: {
          width: 80,
          height: 80,
          marginTop: 10,
          alignSelf:"center"
        },
        questionContainer: {
          paddingHorizontal: scale(5),
          paddingVertical: scale(10),
          marginTop: scale(20),
        },
        questionText: {
          //marginTop: scale(10),
          paddingHorizontal: scale(12),
          paddingVertical: scale(5),
          marginBottom: scale(10)
        },
        imageContainer: {
          width: 373,
          height: 200,
          alignSelf: 'center',
          marginBottom: 10,
        },
        borderLine: {
          marginTop: scale(20),
          marginBottom: scale(20),
          borderWidth: 0.3,
          borderColor: COLORS.GRAYTEXTCOLOR,
          width: "100%",
        },
        image: {
          width: '100%',
          height: '100%',
        },
        answerLabel: {
          paddingHorizontal: scale(10),
          marginTop: scale(40),
        },
        textInput: {
          height: scale(130),
          borderColor: COLORS.WHITE,
          borderWidth: 1,
          marginTop: scale(15),
          borderRadius: scale(5),
          padding: scale(10),
          width: '95%',
          alignSelf: 'center',
          backgroundColor: COLORS.WHITE,
          fontSize: scale(14),
          textAlignVertical: 'top', // for Android to align text to the top
        },
        incorrectAnswerContainer: {
          flexDirection: 'row',
          paddingHorizontal: scale(10),
          marginTop: scale(20),
          alignItems: 'center',
        },
        incorrectIcon: {
          width: 15,
          height: 15,
        },
        incorrectText: {
          marginLeft: scale(10),
        },
        seeCorrectAnswerText: {
          marginLeft: scale(10),
        },
        seeYourAnswerContainer: {
          paddingHorizontal: scale(10),
          marginTop: scale(20),
        },
        seeYourAnswerText: {
          marginLeft: scale(10),
        },
        button: {
          width: '95%',
        },
      
        optionContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          margin: 5,
          //padding: 10,
          borderWidth: 1,
          borderRadius: 5,
          //paddingVertical:scale()
        },
        checkBoxContainer: {
          margin: 0,
          padding: 0,
        },
        checkBoxIcon: {
          width: 20,
          height: 20,
        },
        submitButton: {
          marginTop: 20,
          padding: 15,
          backgroundColor: COLORS.PRIMARY,
          borderRadius: 5,
          alignItems: 'center',
        },
      
        optionButton: {
          backgroundColor: '#fff',
          padding: 15,
          paddingVertical: scale(25),
          borderRadius: 5,
          marginBottom: 10,
          elevation: 1,
          shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
          shadowOpacity: Platform.OS === "android" ? 0 : 0.25,
          shadowRadius: Platform.OS === "android" ? 0 : 3.84,
        },
        courseButtonStyle: {
          marginTop: scale(7),
          width: "87%"
        },
        courseButtonStyle1: {
          marginTop: scale(25),
          width: "87%",
          borderColor: COLORS.PRIMARY,
          borderWidth: 1,
        },
        optionText: {
          fontSize: 14,
          color: '#333',
        },
        dragHandle: {
          fontSize: 24,
          color: '#666',
        },
        optionsContainer: {
          padding: 15,
        },
        actionsheet: {
          //height: "0%",
          padding: 20,
          justifyContent: 'space-evenly',
          backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
          borderRadius: 20
        },

        checkboxConsdtions:{
            alignItems: "center",
            justifyContent: "center",
            width: 20, 
            height: 20,
            borderRadius: 10,
        }
});