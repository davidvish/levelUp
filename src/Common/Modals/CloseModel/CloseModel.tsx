import React from 'react';
import {View} from 'react-native';
import RNModal from '../../Modal/Modal';
import RNText from '../../Text/Text';
import RNButton from '../../Button/Button';
import LottieView from 'lottie-react-native';
import {scale} from 'react-native-size-matters';
import {COLORS, IMAGES} from '../../../constants';
import styles from './CloseModal.tsx.styles';

type CloseModelProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  startExamData?: any;
  examResultData?: any;
  CloseFinishFunction: () => void;
};

const CloseModel: React.FC<CloseModelProps> = ({
  visible,
  setVisible,
  startExamData,
  examResultData,
  CloseFinishFunction
}) => {
  return (
    <RNModal transparent visible={visible} onDismiss={() => setVisible(false)}>
      <View style={styles.container}>
        <RNText
          textColor={COLORS.TEXTCOLOR}
          TextAlignCenter
          extraLarge
          semiBold>
          {startExamData?.passingPercentage <= examResultData?.resultList
            ? 'Course Passed'
            : 'Course not Passed'}
        </RNText>
        {startExamData?.passingPercentage <= examResultData?.resultList ? (
          <LottieView
            source={IMAGES.CoursePassed}
            loop={true}
            autoPlay={true}
            style={styles.badgeAnimation}
          />
        ) : (
          <LottieView
            source={IMAGES.CourseNotPassed}
            loop={true}
            autoPlay={true}
            style={styles.badgeAnimation}
          />
        )}
        <RNText
          style={styles.congratsText}
          TextAlignCenter
          textColor="#A3C3F9"
          extraLarge
          semiBold>
          {startExamData?.passingPercentage <= examResultData?.resultList
            ? 'Congratulations!'
            : ''}
        </RNText>
        <RNText
          textColor={'#9398A4'}
          style={styles.resultText}
          TextAlignCenter
          large>
          {startExamData?.passingPercentage <= examResultData?.resultList
            ? "You've successfully passed the course. Well done on your hard work!"
            : "Don't worry, you can try again. Keep learning!"}
        </RNText>
        <RNButton
          onPress={CloseFinishFunction}
          textColor={COLORS.WHITE}
          title={'Close'}
          minHeightButton={true}
          style={styles.courseButtonStyle1}
          backgroundColor={COLORS.PRIMARY}
        />
      </View>
    </RNModal>

    //onDismiss={() => setModalVisible(!modalVisible)}
    //   <RNModal transparent visible={modalVisible}>
    //     <View
    //       style={{
    //         width: '90%',
    //         paddingHorizontal: 10,
    //         backgroundColor: COLORS.WHITE,
    //         paddingVertical: 20
    //       }}>
    //       <RNText
    //         textColor={COLORS.TEXTCOLOR}
    //         TextAlignCenter
    //         extraLarge
    //         semiBold>
    //         {startExamData?.passingPercentage <= examResultData?.resultList
    //           ? 'Course Passed'
    //           : 'Course not Passed'}
    //       </RNText>
    //       {startExamData?.passingPercentage <= examResultData?.resultList ? (
    //         <LottieView
    //           source={IMAGES.CoursePassed}
    //           loop={true}
    //           autoPlay={true}
    //           style={styles.badgeAnimation}
    //         />
    //       ) : (
    //         <LottieView
    //           source={IMAGES.CourseNotPassed}
    //           loop={true}
    //           autoPlay={true}
    //           style={styles.badgeAnimation}
    //         />
    //       )}
    //       {/* <RNText textColor={COLORS.TEXTCOLOR} style={{ marginTop: 15, paddingBottom: 0 }} small>{startExamData?.passingPercentage <= examResultData?.resultList ? "Congratulations! You have passed the course" : "Unfortunately, You did not pass the Course."}</RNText> */}
    //       <RNText
    //         style={{marginTop: scale(15)}}
    //         TextAlignCenter
    //         textColor="#A3C3F9"
    //         extraLarge
    //         semiBold>
    //         {startExamData?.passingPercentage <= examResultData?.resultList
    //           ? 'Congratulations!'
    //           : ''}
    //       </RNText>
    //       <RNText
    //         textColor={'#9398A4'}
    //         style={{
    //           marginTop:
    //             startExamData?.passingPercentage <= examResultData?.resultList
    //               ? 15
    //               : 0,
    //           paddingBottom: 0
    //         }}
    //         TextAlignCenter
    //         large>
    //         {startExamData?.passingPercentage <= examResultData?.resultList
    //           ? "You've successfully passed the course. Well done on your hard work!"
    //           : "Don't worry, you can try again. Keep learning!"}
    //       </RNText>
    //       {/* <RNText textColor={COLORS.GRAY} style={{ marginTop: 1, paddingBottom: 10 }} small>Please reach out to your instructor for the next steps.</RNText> */}

    //       <RNButton
    //         onPress={
    //           () => CloseFinishFunction()
    //           // if (coursePlayData?.attestationDetail?.isAttestationCompleted == false) {
    //           //     setModalVisible(false)
    //           //     setAttModalVisible(true);
    //           // }
    //           // else {
    //         }
    //         textColor={COLORS.WHITE}
    //         title={'Close'}
    //         minHeightButton={true}
    //         style={styles.courseButtonStyle1}
    //         backgroundColor={COLORS.PRIMARY}
    //       />
    //     </View>
    //   </RNModal>
  );
};

export default CloseModel;
