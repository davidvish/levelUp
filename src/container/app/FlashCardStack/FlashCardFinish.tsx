import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { RNButton, RNContainer, RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import { _onPressNavigate } from '../../../utils/commonFunction';
import { SCREEN_NAMES } from '../../../config';
import { useDispatch } from 'react-redux';
import { playIncorrectRequestAction, practiceReportRequestAction } from './module/action';
import { flashcardPreviewSelector } from './module/reducer';
import { Home } from '../Home';

const screenWidth = Dimensions.get('window').width;

const FlashCardFinish: React.FC = (props: any) => {
    const hasParamData = props?.route?.params?.data || [];
    const gamificationData = props?.route?.params?.gamificationData || [];
    const dispatch = useDispatch();
    const { revisitData, practiceReportData, practiceReportLoading, addUserAttempData } = flashcardPreviewSelector();
    const [playIncorrectLoading, setPlayIncorrectLoading] = useState(false)
    useEffect(() => {
        practiceResultFunction();
        //addUserAtamFunction();
    }, [])

    const practiceResultFunction = () => {
        const body = {
            id: addUserAttempData?.id || "",
            assignedDate: hasParamData?.assignedDate || ""
        };
        dispatch(practiceReportRequestAction({ body }));
    }

    const getPlayIncorrect = () => {
        setPlayIncorrectLoading(true)
        const body = { id: addUserAttempData?.id || "" };
        const callback = (res: any) => {
            setPlayIncorrectLoading(false)
            if (res !== 'error') {
                // Re-render the CardMainView component
                _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
                    screen: SCREEN_NAMES.MainFlashCard,
                    params: {
                        playIncorrect: true,
                        data: hasParamData,
                        gamificationData:gamificationData
                    },
                })
                Toast.show("Let's countinue with Incorrect Question", {
                    type: 'success'
                });
            }
        };
        dispatch(playIncorrectRequestAction({ body, callback }));
    };


    const startOverFunction = () => {
        _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
            screen: SCREEN_NAMES.MainFlashCard,
            params: {
                playIncorrect: false,
                data: hasParamData,
                gamificationData:gamificationData
            },
        })
    }



    const MainView = () => {
        const totalPercent = practiceReportData?.rightAnswer / practiceReportData?.totalQuestions * 100;
        const formattedNumber = totalPercent.toFixed(0); // Rounds to one decimal place

        const incorectAns = practiceReportData?.totalQuestions - practiceReportData?.rightAnswer;
        return (
            <View style={{ marginTop: "17%" }}>
                <RNText style={[styles.textCenter, styles.whiteColor, styles.fontSize25, styles.horizontalPadding50]}>You Have Memorized</RNText>
                <View style={styles.centeredBox}>
                    <RNText style={[styles.whiteColor, { fontSize: scale(25) }]}>{formattedNumber ? formattedNumber : 0}%</RNText>
                </View>

                {formattedNumber !== "100" ?
                    <>
                <View style={[styles.inlineRow, {justifyContent:"space-between", width:"50%"}]}>
                        <View style={{alignItems:"center"}}>
                        <RNImage source={IMAGES.checkImage} style={{width:20, height:20}}/>
                        <RNText style={[styles.whiteColor, { marginTop: 8}]} large>Correct</RNText>
                        <RNText style={[styles.whiteColor, { fontSize: scale(18), marginTop: 8 }]}> {practiceReportData?.rightAnswer || 0}/{practiceReportData?.totalQuestions || 0}</RNText>
                        </View>
                        <View style={{borderWidth:0.5, borderColor:COLORS.WHITE, height:100, width:0}}/>
                        <View style={{alignItems:"center"}}>
                        <RNImage source={IMAGES.crossImage} style={{width:20, height:20}}/>
                        <RNText style={[styles.whiteColor, { marginTop: 8 }]} large>Incorrect</RNText>
                        <RNText style={[styles.whiteColor, { fontSize: scale(18), marginTop: 8}]}>{incorectAns ? incorectAns : 0}/{practiceReportData?.totalQuestions}</RNText>
                        </View>
                        {/* <RNText style={[styles.whiteColor, { marginRight: scale(15), top: 3 }]} large>Correct</RNText> */}
                    </View>
                    {/* <View style={[styles.inlineRow, { marginTop: scale(20) }]}>
                            <RNText style={[styles.whiteColor, { marginRight: scale(15), top: 3 }]} large>Incorrect</RNText>
                            <RNText style={[styles.whiteColor, { marginLeft: scale(15), fontSize: scale(18) }]}>{incorectAns ? incorectAns : 0}/{practiceReportData?.totalQuestions}</RNText>
                    </View> */}
                    </>
                    :
                    <RNText style={[styles.textCenter, styles.whiteColor, { marginTop: scale(40) }]} semiBold extraLarge>Congratulations!</RNText>
                }

                {/* <RNText style={[styles.textCenter, styles.whiteColor, {marginTop:scale(40)}]} semiBold extraLarge>Congratulations</RNText> */}
            </View>
        )
    }

    const ButtonView = () => {
        return (
            <View style={styles.buttonView}>
                <RNButton
                    title={practiceReportData?.totalQuestions == practiceReportData?.rightAnswer ? "End" : STRINGS.playIncorrect}
                    style={styles.button}
                    disabled={playIncorrectLoading}
                    loading={playIncorrectLoading}
                    textColor={COLORS.WHITE}
                    backgroundColor={COLORS.TRANSPARENT}
                    onPress={() => {
                        if (practiceReportData?.totalQuestions == practiceReportData?.rightAnswer) {
                            _onPressNavigate(SCREEN_NAMES.Home)
                        }
                        else {
                            getPlayIncorrect();
                        }
                    }}
                />

                <View style={{ marginTop: scale(20) }}>
                    <RNButton
                        title={STRINGS.startOver}
                        style={styles.button}
                        textColor={COLORS.PRIMARY}
                        backgroundColor={COLORS.WHITE}
                        onPress={startOverFunction}
                    />
                </View>

                <Pressable 
                onPress={() => 
                     _onPressNavigate(SCREEN_NAMES.Home, {
                    screen: SCREEN_NAMES.Home,
                })}
                style={{ marginTop: scale(20), width:screenWidth / 1.5, alignSelf:"center", flexDirection:"row", justifyContent:"center"}}>
                    <RNImage source={IMAGES.houseGoToHome} style={{height:22, width:20}}/>
                    <RNText style={{left:7}} textColor={COLORS.WHITE} large underline>Go to Home</RNText>
                </Pressable>
            </View>
        )
    } 

    return (
        <View style={styles.container}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                {practiceReportLoading == true ?
                    <ActivityIndicator style={{ padding: 20 }} size="small" color={COLORS.WHITE} />
                    :
                    <>
                    <MainView />
                    <ButtonView />
                    </>
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.PRIMARY,
    },
    textCenter: {
        textAlign: 'center',
    },
    whiteColor: {
        color: COLORS.WHITE,
    },
    fontSize25: {
        fontSize: scale(20),
    },
    horizontalPadding50: {
        paddingHorizontal: scale(50),
    },
    centeredBox: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
        alignSelf: "center",
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: COLORS.PRIMARY,
        shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
        shadowOpacity: Platform.OS === "android" ? 0 : 0.25,
        shadowRadius: Platform.OS === "android" ? 0 : 3.84,
        elevation: 30,
    },
    inlineRow: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: scale(40),
    },
    largeText: {
        fontSize: scale(18),
    },
    extraLargeText: {
        fontSize: scale(30),
    },
    buttonView: {
        marginTop: scale(60),
        marginBottom: scale(20)
    },
    button: {
        width: screenWidth / 1.5,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
    },
});

export default FlashCardFinish;
