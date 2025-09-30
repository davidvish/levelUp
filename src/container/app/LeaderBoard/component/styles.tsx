import {Dimensions, Platform, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import { COLORS } from '../../../../constants';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
    },
    actionsheet: {
        padding: 20,
        justifyContent: 'space-evenly',
        width: scale(345),
        backgroundColor: COLORS.WHITE,
        marginTop: "10%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: "100%",
    },
    FirstContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginTop: "15%"
    },
    thirdStyle: {
        width: "28%",
        //paddingVertical: scale(50),
        height: scale(123),
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        borderRadius: 7,
        marginTop: "10%"
    },
    thirdStyleCircle: {
        position: "relative",
        alignItems: "center",
        bottom: scale(16),
        justifyContent: "center",
    },
    thirdStyleText: {
        position: "absolute",
        color: COLORS.WHITE,
        fontSize: 19, // Adjust size as needed
    },
    sameViewContainer: {
        alignItems: 'center',
        marginTop: scale(10),
    },
    sameViewName: {
        bottom: scale(20),
    },
    sameViewRow: {
        bottom: scale(15),
        flexDirection: 'row',
        alignItems: 'center',
    },
    sameViewIcon: {
        width: 12,
        height: 12,
        marginRight: 2, // Replacing "right" inline styling with more appropriate external styling
    },
    circleWithTextView: {
        width: scale(30),
        height: scale(30),
        alignSelf: "center",
        borderRadius: scale(15), // Fixed borderRadius for a perfect circle
        backgroundColor: COLORS.LIGHTBG,
        justifyContent: "center",
        alignItems: "center", // Center text horizontally
    },
    flatListMainStyle: {
        flexDirection: "row",
        width: "99%",
        paddingHorizontal: scale(10),
        paddingVertical: scale(10),
        backgroundColor: "#F8F8F8",
        marginTop: scale(7),
        alignSelf: "center",
        borderRadius: 10,
    }
})