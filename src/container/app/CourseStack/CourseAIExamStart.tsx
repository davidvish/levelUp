import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, BackHandler } from 'react-native';
import { RNButton, RNContainer, RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import { _onPressNavigate } from '../../../utils/commonFunction';
import { SCREEN_NAMES } from '../../../config';
import { examAddUserAttemptRequestAction } from './module/action';
import { useDispatch } from 'react-redux';
import { homeScreenSelector } from '../Home/module/reducer';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

interface CourseAIExamStartProps {
  route: {
    params: {
      startExamData: {
        isPassingScoreReqd: React.JSX.Element;
        id: string;
        passingPercentage: number;
        isTimed: boolean;
        timeAllocated: number;
      };
      storeCourseItemData: {
        assignedDate: string;
      };
    };
  };
}

const CourseAIExamStart: React.FC<CourseAIExamStartProps> = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const startExamData = props.route.params.startExamData;
  const { storeCourseItemData } = homeScreenSelector();
  const [loading, setLoading] = useState(false);

  const startExamFunction = () => {
    addUserAttemptFunction();
  };

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

  //console.log(examResultData, "examResultDataexamResultData", leftTime, startExamData?.timeAllocated)

  const handleBackButtonClick = () => {
    _onPressNavigate(SCREEN_NAMES.CourseStack, {
      screen: SCREEN_NAMES.MainCourse
    })
    return true;
  };

  const addUserAttemptFunction = () => {
    _onPressNavigate(SCREEN_NAMES.CourseStack, {
      screen: SCREEN_NAMES.CourseAIExam,
      params: {
        startExamData: startExamData,
      }
    });
    // setLoading(true);
    // const body = {
    //   EntityId: startExamData?.id || "",
    //   assignedDate: storeCourseItemData?.assignedDate || "",
    //   EntityType: "EXAM"
    // };
    // const callback = (res: any) => {
    //   setLoading(false);
    //   if (res !== 'error') {
    //     _onPressNavigate(SCREEN_NAMES.CourseStack, {
    //       screen: SCREEN_NAMES.CourseAIExam,
    //       params: {
    //         startExamData: startExamData,
    //       }
    //     });
    //   }
    // };
    // dispatch(examAddUserAttemptRequestAction({ body, callback }));
  };

  const MainStartView = () => (
    <>
      <View style={styles.mainStartView}>
        <RNText TextAlignCenter semiBold textColor={COLORS.WHITE} style={styles.examTitle}>
          Exam
        </RNText>
        <RNImage source={IMAGES.dCheckList} style={styles.checklistImage} />
      </View>

      {startExamData?.isPassingScoreReqd && (
        <View style={styles.infoRow}>
          <RNText textColor={COLORS.WHITE} large>
            Exam Passing Percentage
          </RNText>
          <RNText textColor={COLORS.WHITE} style={styles.percentageText}>
            {startExamData?.passingPercentage || 0}%
          </RNText>
        </View>
      )}

      {startExamData?.isTimed && (
        <View style={[styles.infoRow, { marginTop: startExamData?.isPassingScoreReqd ? scale(10) : scale(50) }]}>
          <RNText textColor={COLORS.WHITE} large>
            Allocated Time
          </RNText>
          <RNText textColor={COLORS.WHITE} style={styles.timeText}>
            {startExamData?.timeAllocated || 0} min
          </RNText>
        </View>
      )}
    </>
  );

  const ButtonView = () => (
    <RNButton
      title={STRINGS.start}
      style={styles.startButton}
      minHeightButton={true}
      textColor={COLORS.PRIMARY}
      loading={loading}
      backgroundColor={COLORS.WHITE}
      onPress={startExamFunction}
    />
  );

  return (
    <RNContainer
      // onBack={() => _onPressNavigate(SCREEN_NAMES.CourseStack, {
      //   screen: SCREEN_NAMES.MainCourse,
      // })}
      style={styles.container}
      back={false}
      title=""
      hideBackgroundImage Points={undefined}>
      <MainStartView />
      <ButtonView />
    </RNContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  mainStartView: {
    marginTop: '20%',
  },
  examTitle: {
    fontSize: scale(30),
  },
  checklistImage: {
    height: 130,
    width: 130,
    alignSelf: 'center',
    marginTop: scale(40),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(50),
  },
  percentageText: {
    marginLeft: scale(10),
    fontSize: scale(20),
  },
  timeText: {
    marginLeft: scale(10),
    fontSize: scale(20),
  },
  startButton: {
    height: scale(20),
    marginTop: scale(65),
    width: '60%',
    borderRadius: 5,
  },
});

export default CourseAIExamStart;
