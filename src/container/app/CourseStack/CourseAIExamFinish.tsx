import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  BackHandler,
  Alert,
  ActivityIndicator
} from 'react-native';
import {RNButton, RNContainer, RNImage, RNText} from '../../../Common';
import {COLORS, IMAGES, STRINGS} from '../../../constants';
import {scale} from 'react-native-size-matters';
import {_onPressNavigate} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../config';
import {useDispatch} from 'react-redux';
import {scromChapterSelector} from './module/reducer';
import {
  examAddUserAttemptFailAction,
  gamificationBooleanSuccessAction,
  getExamResultRequestAction
} from './module/action';
import {useNavigation} from '@react-navigation/native';
import {homeScreenSelector} from '../Home/module/reducer';
import RNModal from '../../../Common/Modal/Modal';
import {pathSelector} from '../PathStack/module/reducer';
import {
  CondtionClearAction,
  CondtionExamClearAction
} from '../PathStack/module/action';
import LottieView from 'lottie-react-native';
import {AssignmentnModal} from '../../../Common/Modals/AssignmentModel/AssignmentnModal';
import CloseModel from '../../../Common/Modals/CloseModel/CloseModel';
import {formatTime} from '../../../helper/helper';

const screenWidth = Dimensions.get('window').width;

const CourseAIExamFinish: React.FC = (props: any) => {
  const navigation = useNavigation();
  const {condtionExamString, condtionCourseString} = pathSelector();
  const {coursePlayData} = scromChapterSelector();
  const dispatch = useDispatch();
  const examResultData = props?.route?.params?.examResultData || {};
  const leftTime = props?.route?.params?.leftTime || '';
  const startExamData = props?.route?.params?.startExamData || {};
  const condtion = props.route.params.condtion;
  const [remainingAtteptsBoolean, setRemainingAtteptsBoolean] = useState(false);
  const [completionTime, setCompletionTime] = useState<any>('');
  const [assTimeDuration, setAssTimeDuration] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [attModalVisible, setAttModalVisible] = useState(false);
  const [assModalVisible, setAssModalVisible] = useState(false);
  useEffect(() => {
    navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      );
    });
    navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      );
      (navigation as any).removeListener('blur');
      (navigation as any).removeListener('focus');
    };
  }, []);

  const handleBackButtonClick = () => {
    Alert.alert(STRINGS.confirmation, STRINGS.appExitWarning, [
      {
        text: STRINGS.exit,
        onPress: () => {
          dispatch(CondtionExamClearAction());
          dispatch(examAddUserAttemptFailAction());
          BackHandler.exitApp();
        }
      },
      {
        text: STRINGS.cancel,
        onPress: () => console.log('cancelled')
      }
    ]);
    return true;
  };

  useEffect(() => {
    ExamResultFunction();
  }, []);

  const ExamResultFunction = () => {
    // let body = {
    //   attemptId: examAddUserAttemptData?.attemptId || "",
    //   assignedDate: storeCourseItemData?.assignedDate || ""
    // }
    // const callback = (res: any) => {
    //   if (res !== 'error') {
    //     setAlert20to30Shown(false);
    //     setAlert10Shown(false);
    //     _onPressNavigate(SCREEN_NAMES.CourseStack, {
    //       screen: SCREEN_NAMES.CourseAIExamFinish,
    //       params: {
    //         examResultData: res,
    //         leftTime: timeLeft,
    //         startExamData: startExamData
    //       },
    //     })
    //   }
    // }
    // dispatch(getExamResultRequestAction({ body, callback }))
  };

  useEffect(() => {
    timeFunction();
  }, []);

  const timeFunction = () => {
    const fullTimeInSeconds = startExamData?.timeAllocated * 60;
    const hasLeftTime = leftTime === 1 ? 0 : leftTime;
    const differenceTimeInSeconds = fullTimeInSeconds - hasLeftTime;
    const differenceTimeInMinutes: any = differenceTimeInSeconds;
    setCompletionTime(differenceTimeInMinutes);
  };

  const retryButtonFunction = () => {
    dispatch(examAddUserAttemptFailAction());
    if (remainingAtteptsBoolean) {
      _onPressNavigate(SCREEN_NAMES.CourseStack, {
        screen: SCREEN_NAMES.CourseAIExam,
        params: {
          startExamData: startExamData
        }
      });
    } else {
      setRemainingAtteptsBoolean(true);
    }
  };

  const MainView = () => {
    return (
      <View>
        <RNText
          style={[
            styles.textCenter,
            styles.whiteColor,
            styles.fontSize25,
            styles.horizontalPadding50
          ]}>
          Result
        </RNText>
        <View style={styles.centeredBox}>
          <RNText style={[styles.whiteColor, {fontSize: scale(25)}]}>
            {examResultData?.resultList || 0}%
          </RNText>
        </View>

        {startExamData?.isTimed ? (
          <View style={styles.infoRow}>
            <RNText textColor={COLORS.WHITE} large>
              Completion Time
            </RNText>
            <RNText textColor={COLORS.WHITE} style={styles.percentageText}>
              {formatTime(completionTime)}
            </RNText>
          </View>
        ) : null}

        {remainingAtteptsBoolean ? (
          <RNText
            TextAlignCenter
            style={{marginTop: scale(30)}}
            textColor={'#0326AA'}
            small>
            {examResultData?.remainingAttepts === 1
              ? '1 attempt left'
              : `${examResultData?.remainingAttepts || 0} attempts left`}
          </RNText>
        ) : null}
        {/* <RNText style={[styles.textCenter, styles.whiteColor, {marginTop:scale(40)}]} semiBold extraLarge>Congratulations</RNText> */}
      </View>
    );
  };

  const ButtonView = () => {
    return (
      <View style={styles.buttonView}>
        {examResultData?.remainingAttepts === 0 ? null : (
          <RNButton
            title={STRINGS.retry}
            style={styles.button}
            minHeightButton={true}
            textColor={COLORS.WHITE}
            backgroundColor={COLORS.TRANSPARENT}
            onPress={retryButtonFunction}
          />
        )}

        {/* <View style={{ marginTop: scale(20) }}> */}
        <RNButton
          title={STRINGS.finish}
          style={styles.button}
          minHeightButton={true}
          textColor={COLORS.PRIMARY}
          backgroundColor={COLORS.WHITE}
          onPress={() => setAssModalVisible(true)}
        />
        {/* </View> */}
      </View>
    );
  };

  const AttestationModal = () => {
    return (
      <RNModal
        transparent
        visible={attModalVisible}
        onDismiss={() => setAttModalVisible(false)}>
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: COLORS.WHITE,
            paddingVertical: 20,
            width: '90%'
          }}>
          <RNText large bold>
            Attestation
          </RNText>
          <RNText style={{marginTop: 20}} large>
            Please complete this one-question quiz to confirm your acceptance of
            the training materials. Click the Start button below, answer the
            question, and then click Submit.
          </RNText>

          {/* <RNButton
            onPress={sendRequestFunction}
            textColor={COLORS.SECONDARY}
            title={STRINGS.yes}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.WHITE}
          /> */}

          <RNButton
            onPress={() => {
              setAttModalVisible(false);
              _onPressNavigate(SCREEN_NAMES.CourseStack, {
                screen: SCREEN_NAMES.AttestationExam,
                params: {
                  startAttestionData: coursePlayData
                }
              });
            }}
            textColor={COLORS.WHITE}
            title={STRINGS.start}
            minHeightButton={true}
            style={[styles.courseButtonStyle, {marginTop: scale(30)}]}
            backgroundColor={COLORS.SECONDARY}
          />
        </View>
      </RNModal>
    );
  };

  const FinshKnowledgeModalSecond = () => {
    const CloseFinishFunction = () => {
      if (condtionExamString == 'Exam') {
        dispatch(CondtionExamClearAction());
        dispatch(examAddUserAttemptFailAction());
        _onPressNavigate(SCREEN_NAMES.PathStack, {
          screen: SCREEN_NAMES.MainPath
        });
      } else if (condtionCourseString == 'coursePath') {
        dispatch(CondtionClearAction());
        dispatch(examAddUserAttemptFailAction());
        _onPressNavigate(SCREEN_NAMES.PathStack, {
          screen: SCREEN_NAMES.MainPath
        });
      } else {
        dispatch(CondtionExamClearAction());
        dispatch(CondtionClearAction());
        dispatch(examAddUserAttemptFailAction());
        if (coursePlayData?.userProgress?.status !== 'COMPLETED') {
          dispatch(gamificationBooleanSuccessAction('check'));
          setTimeout(() => {
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CoursePreview
            });
          }, 1000);
        } else {
          _onPressNavigate(SCREEN_NAMES.CourseStack, {
            screen: SCREEN_NAMES.CoursePreview
          });
        }
        setModalVisible(false);
      }
      // }
    };

    return (
      <CloseModel
        visible={modalVisible}
        setVisible={() => setModalVisible(false)}
        startExamData={startExamData}
        examResultData={examResultData}
        CloseFinishFunction={() => CloseFinishFunction()}
      />
    );
  };

  return (
    <RNContainer
      style={styles.container}
      back={false}
      title={''}
      //bottomChildren={ButtonView()}
      hideBackgroundImage
      Points={undefined}>
      {!examResultData ? (
        <ActivityIndicator
          style={{padding: 20}}
          size="small"
          color={COLORS.WHITE}
        />
      ) : (
        <>
          <MainView />
          <ButtonView />
          <FinshKnowledgeModalSecond />
          <AssignmentnModal
            visible={assModalVisible}
            onDoItLater={() => {
              setAssModalVisible(false);
              _onPressNavigate(SCREEN_NAMES.CourseStack, {
                screen: SCREEN_NAMES.CourseAssignment
              });
            }}
            isTimeLimit={coursePlayData?.assignmentDetail?.isTimeLimit}
            percentage={coursePlayData?.assignmentDetail?.passingGrade}
            setVisible={() => setAssModalVisible(false)}
            onStartAssignment={() => {
              setAssModalVisible(false);
              _onPressNavigate(SCREEN_NAMES.CourseStack, {
                screen: SCREEN_NAMES.CourseAssignment
              });
            }}
            time={formatTime(coursePlayData?.assignmentDetail?.timeDuration)}
          />
          <AttestationModal />
        </>
      )}
    </RNContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY
  },
  textCenter: {
    textAlign: 'center',
    marginTop: scale(30)
  },
  whiteColor: {
    color: COLORS.WHITE
  },
  fontSize25: {
    fontSize: scale(25)
  },
  horizontalPadding50: {
    paddingHorizontal: scale(50)
  },
  centeredBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    alignSelf: 'center',
    width: 130,
    height: 130,
    borderRadius: 100,
    backgroundColor: COLORS.PRIMARY,
    elevation: 20,
    shadowColor: COLORS.WHITE,
    zIndex: 900000,
    shadowOffset:
      Platform.OS === 'android' ? {width: 0, height: 0} : {width: 0, height: 2},
    shadowOpacity: Platform.OS === 'android' ? 5.75 : 0.75,
    shadowRadius: Platform.OS === 'android' ? 3.75 : 3.84
    // shadowColor: COLORS.WHITE,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  inlineRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: scale(40)
  },
  largeText: {
    fontSize: scale(18)
  },
  extraLargeText: {
    fontSize: scale(30)
  },
  buttonView: {
    marginTop: scale(50)
  },
  button: {
    width: screenWidth / 1.5,
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    height: scale(30),
    borderRadius: 5,
    marginTop: scale(20),
    paddingHorizontal: 5
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(80)
  },
  percentageText: {
    marginLeft: scale(10),
    fontSize: scale(20)
  },
  courseButtonStyle1: {
    marginTop: scale(25),
    width: '87%',
    fontWeight: '300'
  },
  badgeAnimation: {
    width: 80,
    height: 80,
    marginTop: 10,
    alignSelf: 'center'
  },
  courseButtonStyle: {
    //marginTop: scale(7),
    width: '87%'
  }
});

export default CourseAIExamFinish;
