import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, FlatList, Image, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { RNActionSheet, RNButton, RNContainer, RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import * as Progress from 'react-native-progress';
import { SCREEN_NAMES } from '../../../config';
import { _onPressNavigate, convertDateIntoDay } from '../../../utils/commonFunction';
import { useDispatch } from 'react-redux';
import { flashcardPreviewSelector } from '../FlashCardStack/module/reducer';
import { flashcardPreviewDetailsFailAction, flashcardPreviewDetailsRequestAction } from '../FlashCardStack/module/action';
import { createEnrollmentRequestAction, gamificationBooleanFailAction, getScormChaptersByCourseFailAction, getScormChaptersByCourseRequestAction, getUserGamificationPopUpAndTotalPointsRequestAction } from './module/action';
import { scromChapterSelector } from './module/reducer';
import { homeScreenSelector } from '../Home/module/reducer';
import { storeCourseItemDataOnNavigationAction } from '../Home/module/action';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import RenderHTML from 'react-native-render-html';
import { LevelUpGamificationModal } from './GamificationModal';
import { loginSelector } from '../../auth/Login/module/reducer';
import RNModal from '../../../Common/Modal/Modal';

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const secondFormatDuration = (seconds: number | undefined | null): string => {
  if (seconds == null) return '0m';
  const totalSeconds = Math.floor(Number(seconds));
  if (totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  const adjustedMinutes = remainingSeconds >= 30 ? minutes + 1 : minutes;
  if (hours > 0) {
    return `${hours}h ${adjustedMinutes}m`;
  } else if (totalSeconds < 60) {
    return `0m ${totalSeconds}s`;
  } else {
    return `0h ${adjustedMinutes}m`;
  }
}

// const secondFormatDuration = (totalSeconds: number) => {
//   // Ensure totalSeconds is a number and handle potential undefined/null
//   const seconds = Math.floor(Number(totalSeconds) || 0);

//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = seconds % 60;

//   // Conditional rendering based on duration
//   if (hours > 0) {
//     return `${hours}h ${minutes}m ${remainingSeconds}s`;
//   } else if (minutes > 0) {
//     return `${minutes}m ${remainingSeconds}s`;
//   } else {
//     return `${remainingSeconds}s`;
//   }
// };

interface ChapterItemProps {
  chapter: {
    title: string;
    materials: {
      sequenceNumber: number;
      title: string;
      duration: number;
    }[];
    kcExam: any[];
    duration: number
  };
  storeCourseItemData: {
    resourceType: string;
    duration: number;
  };
  indexNumber: number
}
//const { width } = useWindowDimensions();

function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const CoursePreview: React.FC = (props: any) => {
  const navigation = useNavigation();
  const { userData } = loginSelector();

  // const gamificationCondtion = props?.route?.params?.gamification == "check" ? true : false;
  const { storeCourseItemData } = homeScreenSelector();
  const { flashcardPreviewDetailsData, previewisLoading } = flashcardPreviewSelector();
  const { gamificationBooleanData, scromChapterByData, scromChapterLoading, gamificationPopUpAndTotalPointsData } = scromChapterSelector();
  const [sendRequestLoading, setSendRequestLoading] = useState(false)
  const dispatch = useDispatch();
  const [gamificationModal, setGamificationModal] = useState(false);
  const scrollViewRef: any = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [attModalVisible, setAttModalVisible] = useState(false)
  const [assModalVisible, setAssModalVisible] = useState(false)

  console.log('====================================');
  console.log(flashcardPreviewDetailsData);
  console.log('====================================');


  const ActionSheetRef: any = useRef(null);

  const _onPressChangeProfileName = () => {
    ActionSheetRef?.current?.show();
  };

  // useEffect(() => {
  //   storeCourseItemData?.resourceType === "COURSE" ?
  //     getFlashCardPreviewDetailsFunction() :
  //     scromChapterFunction();
  // }, []) 


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
    dispatch(getUserGamificationPopUpAndTotalPointsRequestAction())
    let hasData = gamificationBooleanData == "check" ? true : false;
    setTimeout(() => {
    setGamificationModal(hasData);
    },5000)
  }, [gamificationBooleanData])


  const totalGamificationPoint = () => {
    const totalPoints = flashcardPreviewDetailsData?.chapters?.reduce((acc: any, chapter: any) => {
      const materialsLength = chapter?.materials?.length || 0;
      const chapterPoints = materialsLength * (flashcardPreviewDetailsData?.gamificationPoints || 0);
      return acc + chapterPoints;
    }, 0);
    return totalPoints;
  }

  //totalGamificationPoint();


  useFocusEffect(
    useCallback(() => {
      dispatch(flashcardPreviewDetailsFailAction())
      if (storeCourseItemData?.resourceType === "COURSE") {
        getFlashCardPreviewDetailsFunction();
      }
      else {
        getFlashCardPreviewDetailsFunction();
        scromChapterFunction();
      }
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
      return () => {
        dispatch(getScormChaptersByCourseFailAction())
        // Cleanup logic here, if any
      };
    }, [storeCourseItemData])
  );

  const sendRequestFunction = () => {
    setModalVisible(false)
    setSendRequestLoading(true);
    let body = {
      Id: userData?.id || "",
      ResourceType: "COURSE",
      ResourcesId: storeCourseItemData?.id || ""
    }
    const callback = (res: any) => {
      setSendRequestLoading(false)
      if (res !== 'error') {
        getFlashCardPreviewDetailsFunction();
      }
    }
    dispatch(createEnrollmentRequestAction({ body, callback }));
  }


  const getFlashCardPreviewDetailsFunction = () => {
    let body = {
      id: storeCourseItemData?.id || "",
      assignedDate: storeCourseItemData?.assignedDate || ""
    }
    dispatch(flashcardPreviewDetailsRequestAction({ body }));
  }

  const scromChapterFunction = () => {
    let body = {
      id: storeCourseItemData?.id || "",
      assignedDate: storeCourseItemData?.assignedDate || ""
    }
    dispatch(getScormChaptersByCourseRequestAction({ body }));
  }

  const PreviewMainView = () => {
    const playedTime = flashcardPreviewDetailsData?.userProgress?.playedTime ?? 0;
    const duration = flashcardPreviewDetailsData?.userProgress?.duration ?? 0;

    let courseProgressData = flashcardPreviewDetailsData?.userProgress?.status === "COMPLETED" ? 1 : playedTime / duration;
    courseProgressData = flashcardPreviewDetailsData?.userProgress?.status === "IN_PROGRESS" && courseProgressData === 1 ? 0.99 : courseProgressData;
    let courseProgressPercentage = flashcardPreviewDetailsData?.userProgress?.status === "COMPLETED" ? 100 : (playedTime / duration) * 100;
    courseProgressPercentage = flashcardPreviewDetailsData?.userProgress?.status === "IN_PROGRESS" && courseProgressPercentage >= 100 ? 99 : courseProgressPercentage;
    const roundedPercentage = Math.round(courseProgressPercentage * 10) / 10; // This gives 65.6
    const courseFinalPercentage = roundedPercentage % 1 >= 0.5 ? Math.ceil(roundedPercentage) : Math.floor(roundedPercentage);

    const formattedDuration = formatDuration(flashcardPreviewDetailsData?.userProgress?.duration);
    const secondFormattedDuration = secondFormatDuration(flashcardPreviewDetailsData?.userProgress?.duration);

    const today = formatDate();

    return (
      <>
        <View style={styles.imageContainer}>
          {flashcardPreviewDetailsData?.bannerImageUrl ?
            <RNImage resizeMode="Cover" source={{ uri: flashcardPreviewDetailsData?.bannerImageUrl }} style={styles.image} />
            :
            <RNText style={{ top: 140 }} TextAlignCenter large textColor={COLORS.BORDER_COLOR}>No Image URL Found</RNText>}
        </View>

        <View style={styles.cardMainView}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <RNText textColor={COLORS.TEXTCOLOR} style={[styles.cardTitle, { maxWidth: "70%" }]} bold large>{flashcardPreviewDetailsData?.title || ""}</RNText>
            {
              flashcardPreviewDetailsData?.userProgress?.dueDate.split('T')[0] < today && flashcardPreviewDetailsData?.userProgress?.status?.toLowerCase() !== 'completed' ?
                <View style={{ backgroundColor: COLORS.RED, padding: 3, paddingHorizontal: 10, borderRadius: 5, marginRight: 10 }}>
                  <RNText TextAlignCenter small textColor={COLORS.WHITE}>Overdue</RNText>
                </View>
                :
                flashcardPreviewDetailsData?.userProgress?.status?.toLowerCase() == 'completed' && flashcardPreviewDetailsData?.userProgress?.isPassed != null && flashcardPreviewDetailsData?.userProgress?.isPassed !== undefined ?
                  <View style={{ backgroundColor: flashcardPreviewDetailsData?.userProgress?.isPassed ? COLORS.GREEN : COLORS.RED, padding: 3, paddingHorizontal: 10, borderRadius: 5, marginRight: 10 }}>
                    <RNText TextAlignCenter small textColor={COLORS.WHITE}>{flashcardPreviewDetailsData?.userProgress?.isPassed ? "Passed" : "Failed"}</RNText>
                  </View>
                  : null
            }
          </View>

          {flashcardPreviewDetailsData?.userProgress?.status == "CANCELLED" ?
            <Pressable
              onPress={() => {
                if (flashcardPreviewDetailsData?.enrollmentStatus == "PENDING") {
                  console.log("pending!!")
                }
                else if (flashcardPreviewDetailsData?.enrollmentStatus == "APPROVED") {
                  console.log("APPROVED!!")
                }
                else {
                  setModalVisible(true)
                }
              }}
              style={{ borderWidth: 1, borderColor: flashcardPreviewDetailsData?.enrollmentStatus == "" || flashcardPreviewDetailsData?.enrollmentStatus.toLowerCase() == "rejected" ? COLORS.TRANSPARENT : flashcardPreviewDetailsData?.enrollmentStatus?.toLowerCase() == "pending" ? "#f29e1a" : COLORS.TRANSPARENT, paddingVertical: scale(5), paddingHorizontal: scale(10), borderRadius: 5, backgroundColor: flashcardPreviewDetailsData?.enrollmentStatus == "" || flashcardPreviewDetailsData?.enrollmentStatus?.toLowerCase() == "rejected" ? COLORS.PRIMARY : flashcardPreviewDetailsData?.enrollmentStatus?.toLowerCase() == "pending" ? "#fef5e8" : COLORS.TRANSPARENT, width: flashcardPreviewDetailsData?.enrollmentStatus == "" ? scale(200) : flashcardPreviewDetailsData?.enrollmentStatus == "APPROVED" ? scale(100) : scale(130), marginLeft: scale(20) }}>
              {sendRequestLoading ? <ActivityIndicator size={"small"} color={COLORS.WHITE} /> :
                <RNText small textColor={flashcardPreviewDetailsData?.enrollmentStatus == "" || flashcardPreviewDetailsData?.enrollmentStatus.toLowerCase() == "rejected" ? COLORS.WHITE : flashcardPreviewDetailsData?.enrollmentStatus.toLowerCase() == "pending" ? "#f29e1a" : COLORS.TRANSPARENT} semiBold TextAlignCenter>{flashcardPreviewDetailsData?.enrollmentStatus == "" || flashcardPreviewDetailsData?.enrollmentStatus?.toLowerCase() == "rejected" ? "Send Request for Enrollment" : flashcardPreviewDetailsData?.enrollmentStatus?.toLowerCase() == "pending" ? "Request Sent" : ""}</RNText>}
            </Pressable> : null}

          <View style={styles.progressContainer}>
            <Progress.Bar
              borderWidth={0}
              color="#4284F4"
              unfilledColor={"#EEEEEE"}
              progress={!isNaN(courseProgressData) && courseProgressData !== null ? courseProgressData : 0} width={scale(235)} />
            <RNText style={styles.progressText} bold small>{!isNaN(courseFinalPercentage) && courseFinalPercentage !== null ? courseFinalPercentage : 0}%</RNText>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Enrollment Date</RNText>
              {!flashcardPreviewDetailsData?.userProgress?.assignedDate ?
                <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                :
                <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{convertDateIntoDay(flashcardPreviewDetailsData?.userProgress?.assignedDate)?.newConvertDate || ""}</RNText>
              }
            </View>

            <View style={styles.infoRow}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Duration</RNText>
              {!flashcardPreviewDetailsData?.courseType ?
                <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                :
                <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{flashcardPreviewDetailsData?.courseType == "SCORM" ? " " + formattedDuration : " " + secondFormattedDuration}</RNText>
              }
            </View>

            {flashcardPreviewDetailsData?.isCertificateAvailable == false ? null :
              <View style={styles.infoRow}>
                <RNText textColor={COLORS.BORDER_COLOR} medium>Certificate Available</RNText>
                {!flashcardPreviewDetailsData?.userProgress?.assignedDate ?
                  <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                  :
                  <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{flashcardPreviewDetailsData?.isCertificateAvailable == false ? "No" : "Yes"}</RNText>
                }
              </View>}

            <View style={styles.infoRow}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Due Date</RNText>
              {!flashcardPreviewDetailsData?.userProgress?.dueDate ?
                <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                :
                <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{convertDateIntoDay(flashcardPreviewDetailsData?.userProgress?.dueDate)?.newConvertDate || ""}</RNText>
              }
            </View>

            <View style={styles.infoRow}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Department</RNText>
              {!flashcardPreviewDetailsData?.department ?
                <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                :
                <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{flashcardPreviewDetailsData?.department || ""}</RNText>
              }
            </View>

            {flashcardPreviewDetailsData?.userProgress?.lastViewedDate === "0001-01-01T00:00:00" ? null :
              <View style={[styles.infoRow, { paddingVertical: 5 }]}>
                <RNText textColor={COLORS.BORDER_COLOR} medium>Last View Date</RNText>
                {!flashcardPreviewDetailsData?.userProgress?.lastViewedDate ?
                  <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                  :
                  <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{convertDateIntoDay(flashcardPreviewDetailsData?.userProgress?.lastViewedDate)?.newConvertDate || ""}</RNText>
                }
              </View>
            }

          </View>
        </View>
      </>
    )
  }

  const GradeView = () => {
    const playedTime = flashcardPreviewDetailsData?.userProgress?.playedTime ?? 0;
    const duration = flashcardPreviewDetailsData?.userProgress?.duration ?? 0;

    let courseProgressData = flashcardPreviewDetailsData?.userProgress?.status === "COMPLETED" ? 1 : playedTime && duration ? playedTime / duration : 0;
    courseProgressData = flashcardPreviewDetailsData?.userProgress?.status === "IN_PROGRESS" && courseProgressData === 1 ? 0.99 : courseProgressData;
    let courseProgressPercentage = flashcardPreviewDetailsData?.userProgress?.status === "COMPLETED" ? 100 : playedTime && duration ? (playedTime / duration) * 100 : 0;
    courseProgressPercentage = flashcardPreviewDetailsData?.userProgress?.status === "IN_PROGRESS" && courseProgressPercentage >= 100 ? 99 : courseProgressPercentage;
    const roundedPercentage = Math.round(courseProgressPercentage * 10) / 10; // This gives 65.6
    const courseFinalPercentage = roundedPercentage % 1 >= 0.5 ? Math.ceil(roundedPercentage) : Math.floor(roundedPercentage);

    const formattedDuration = formatDuration(flashcardPreviewDetailsData?.userProgress?.duration);
    const secondFormattedDuration = secondFormatDuration(flashcardPreviewDetailsData?.userProgress?.duration);

    const today = formatDate();

    return (
      <>
        <View style={[styles.cardMainView, { marginTop: scale(20) }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RNImage source={IMAGES.trophyStar} style={{ width: scale(15), height: scale(15), left: scale(15) }} />
            <RNText textColor={COLORS.TEXTCOLOR} style={[styles.cardTitle, { maxWidth: "70%", left: scale(0) }]} bold large>{"Grade"}</RNText>
          </View>

          <View style={styles.infoContainer}>
            <View style={{ bottom: scale(10) }}>

              {/* {flashcardPreviewDetailsData?.userProgress?.lastViewedDate === "0001-01-01T00:00:00" ? null :
                <View style={[styles.infoRow, { paddingVertical: 5 }]}>
                  <RNText textColor={COLORS.BORDER_COLOR} medium>Exam Percentage</RNText>
                  {!flashcardPreviewDetailsData?.userProgress?.lastViewedDate ?
                    <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                    :
                    <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{"0%"}</RNText>
                  }
                </View>
              }

              {flashcardPreviewDetailsData?.userProgress?.lastViewedDate === "0001-01-01T00:00:00" ? null :
                <View style={[styles.infoRow, { paddingVertical: 5 }]}>
                  <RNText textColor={COLORS.BORDER_COLOR} medium>Assignment Percentage</RNText>
                  {!flashcardPreviewDetailsData?.userProgress?.lastViewedDate ?
                    <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                    :
                    <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{"0%"}</RNText>
                  }
                </View>
              }

              {flashcardPreviewDetailsData?.userProgress?.status == "COMPLETED" && flashcardPreviewDetailsData?.userProgress?.earnedPercentage != null && flashcardPreviewDetailsData?.userProgress?.earnedPercentage != undefined ?
                <View style={[styles.infoRow, { paddingVertical: 5 }]}>
                  <RNText textColor={COLORS.BORDER_COLOR} medium>Earned Percentage</RNText>
                  {flashcardPreviewDetailsData?.userProgress?.earnedPercentage == null && flashcardPreviewDetailsData?.userProgress?.earnedPercentage == undefined ?
                    <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                    :
                    <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{flashcardPreviewDetailsData?.userProgress?.earnedPercentage || 0}%</RNText>
                  }
                </View> : null}

              {flashcardPreviewDetailsData?.userProgress?.lastViewedDate === "0001-01-01T00:00:00" ? null :
                <View style={[styles.infoRow, { paddingVertical: 5 }]}>
                  <RNText textColor={COLORS.BORDER_COLOR} medium>Total Percentage</RNText>
                  {!flashcardPreviewDetailsData?.userProgress?.lastViewedDate ?
                    <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                    :
                    <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{"0%"}</RNText>
                  }
                </View>
              } */}

              {scromChapterByData?.length != 0 && scromChapterByData?.chapters?.length != 0 ? null :
                <View style={styles.infoRow}>
                  <RNText textColor={COLORS.BORDER_COLOR} medium>Total Gamification Points</RNText>
                  {!flashcardPreviewDetailsData?.gamificationPoints && flashcardPreviewDetailsData?.gamificationPoints !== 0 ?
                    <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                    :
                    <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{totalGamificationPoint()}</RNText>
                  }
                </View>}




              {/* {flashcardPreviewDetailsData?.userProgress?.lastViewedDate === "0001-01-01T00:00:00" ? null :
              <>
              <View style={[styles.infoRow, { paddingVertical: 5 }]}>
                  <RNText textColor={COLORS.BORDER_COLOR} medium>Assignment Feedback</RNText>
                </View>
                <RNText style={{paddingVertical: 5, left:scale(20)}} textColor={COLORS.TEXTCOLOR} small>I have completed the assignment following all the requirements. Please find my detailed explanation</RNText>
              </>
            } */}
            </View>
          </View>
        </View>
      </>
    )
  }

  const AssignmentDisView = () => {
    return (
      <View style={[styles.cardMainView, { marginTop: scale(20) }]}>
        <>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RNImage source={IMAGES.commentImage} style={{ width: scale(15), height: scale(15), left: scale(15) }} />
            <RNText textColor={COLORS.TEXTCOLOR} style={[styles.cardTitle, { maxWidth: "70%", left: scale(0) }]} bold large>{"Assignment Feedback"}</RNText>
          </View>
          <View style={{ width: "85%" }}>
            <RNText style={{ paddingVertical: 5, left: scale(20), marginBottom: scale(10), bottom: 10 }} textColor={"#575757"} medium>Good job completing the assignment. Your work shows understanding and effort. Keep it up!</RNText>
          </View>
        </>
      </View>
    )
  }

  const enrollmentItemModal = () => {
    return (
      <RNModal transparent visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={{ paddingHorizontal: 10, backgroundColor: COLORS.WHITE, paddingVertical: 20 }}>
          <RNText style={{ marginTop: 5 }} large bold>Confirmation</RNText>
          <RNText style={{ marginTop: 10 }} large>Are you sure that you want to send request for this course?</RNText>

          <RNButton
            onPress={sendRequestFunction}
            textColor={COLORS.SECONDARY}
            title={STRINGS.yes}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.WHITE}
          />

          <RNButton
            onPress={() => setModalVisible(false)}
            textColor={COLORS.WHITE}
            title={STRINGS.no}
            minHeightButton={true}
            style={styles.courseButtonStyle}
            backgroundColor={COLORS.SECONDARY}
          />
        </View>
      </RNModal>
    );
  };

  const CourseDescrption = () => {
    const { width } = useWindowDimensions();
    const truncatedText = flashcardPreviewDetailsData?.longDescription || "";

    const truncate = (str: any, max: any) => {
      if (str?.length <= max) return str;
      return str?.slice(0, max).trim() + '...';
    };

    return (
      <View style={[styles.cardMainView, { marginTop: scale(20), marginBottom: scale(20) }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RNImage source={IMAGES.circleInfo} style={{ width: scale(15), height: scale(15), left: scale(15) }} />
          <RNText textColor={COLORS.TEXTCOLOR} style={[styles.cardTitle, { maxWidth: "70%", left: scale(0) }]} bold large>{"About Course"}</RNText>
        </View>
        <View style={{ left: scale(20), width: "85%", bottom: 10 }}>
          <RenderHTML
            contentWidth={width} source={{ html: truncate(truncatedText, 150) }} />
          <Pressable onPress={() => _onPressChangeProfileName()} style={{ flexDirection: "row", justifyContent: "flex-end", marginRight: scale(12), marginTop: 5 }}>
            <RNText style={{ marginBottom: scale(10), bottom: 5, marginTop: scale(5) }} textColor={COLORS.BORDER_COLOR} medium>{flashcardPreviewDetailsData?.longDescription?.length > 150 ? "Read More" : ""}</RNText>
          </Pressable>
        </View>
      </View>
    )
  }

  const CourseDiscrptionSheet = () => { //ActionSheetRef?.current?.hide();
    const { width } = useWindowDimensions();
    return (
      <RNActionSheet ActionSheetRef={ActionSheetRef}>
        <RNImage source={IMAGES.ActionSheetIcon} style={{ alignSelf: "center", width: scale(50) }} />
        <View style={styles.actionsheet}>
          <RNText style={{ marginBottom: 5 }} bold extraLarge>About Course</RNText>
          <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:scale(10)}}>
          <RenderHTML contentWidth={width} source={{ html: flashcardPreviewDetailsData?.longDescription || "" }} />
          </ScrollView>
          {/* <RNText style={{ padding: 5 }} textColor='#575757' medium>{flashcardPreviewDetailsData?.longDescription || ""}</RNText> */}
        </View>
      </RNActionSheet>
    )
  }

  const ExamCountView = () => {
    return (
      <>
        <View style={[styles.examMainView, { marginTop: scale(20), alignItems: "center" }]}>
          <View style={styles.examHeader}>
            <RNText textColor={COLORS.BORDER_COLOR} medium>Exam</RNText>
            {/* <View style={styles.examIconContainer}>
            <RNImage source={IMAGES.lockKeyhole} style={styles.examIcon} />
          </View> */}

            <View style={styles.examQuestions}>
              <RNImage source={IMAGES.clipboardQuestion} style={{ width: 15, height: 15 }} />
              <RNText style={{ marginLeft: 5 }} textColor={COLORS.BORDER_COLOR} medium>
                {flashcardPreviewDetailsData?.exam?.questionsCount || 0} questions
              </RNText>

              {/* {
                flashcardPreviewDetailsData?.exam?.retryAllowed === 1 ? null :
                  <><View style={styles.lineView} />
                    <RNImage source={IMAGES.arrowRotateRight} style={{ width: 13, height: 13, marginLeft: scale(10) }} /><RNText style={{ marginLeft: 5 }} textColor={COLORS.BORDER_COLOR} medium>
                      {flashcardPreviewDetailsData?.exam?.remainingRetries + "/" + flashcardPreviewDetailsData?.exam?.retryAllowed || 0} Attempts Remaining
                    </RNText>
                  </>} */}
            </View>
          </View>
          {/* <RNText style={styles.examTitle} textColor={COLORS.TEXTCOLOR} bold medium>
            {flashcardPreviewDetailsData?.exam?.title || ""}
          </RNText> */}
        </View>
      </>
    )
  }

  const AttestationCountView = () => {
    return ( //flashcardPreviewDetailsData?.userProgress?.status != "COMPLETED" &&
      <>
        <Pressable onPress={() => {
          if (flashcardPreviewDetailsData?.userProgress?.status === "COMPLETED" && flashcardPreviewDetailsData?.attestationDetail?.isAttestationCompleted === false) {
            setAttModalVisible(true);
          }
        }} style={[styles.examMainView, { marginTop: scale(20), alignItems: "center" }]}>
          <View style={styles.examHeader}>
            <RNText textColor={COLORS.BORDER_COLOR} medium>Attestation</RNText>
            {/* <View style={styles.examIconContainer}>
            <RNImage source={IMAGES.lockKeyhole} style={styles.examIcon} />
          </View> */}

            <View style={styles.examQuestions}>
              <RNImage source={IMAGES.clipboardQuestion} style={{ width: 15, height: 15 }} />
              <RNText style={{ marginLeft: 5 }} textColor={COLORS.BORDER_COLOR} medium>
                {flashcardPreviewDetailsData?.attestationDetail?.questionCount || 0} questions
              </RNText>

              {/* {
                flashcardPreviewDetailsData?.exam?.retryAllowed === 1 ? null :
                  <><View style={styles.lineView} />
                    <RNImage source={IMAGES.arrowRotateRight} style={{ width: 13, height: 13, marginLeft: scale(10) }} /><RNText style={{ marginLeft: 5 }} textColor={COLORS.BORDER_COLOR} medium>
                      {flashcardPreviewDetailsData?.exam?.remainingRetries + "/" + flashcardPreviewDetailsData?.exam?.retryAllowed || 0} Attempts Remaining
                    </RNText>
                  </>} */}
            </View>
          </View>
          {/* <RNText style={styles.examTitle} textColor={COLORS.TEXTCOLOR} bold medium>
            {flashcardPreviewDetailsData?.exam?.title || ""}
          </RNText> */}
        </Pressable>
      </>
    )
  }

  const AssignmentCountView = () => {
    return (
      <>
        <Pressable onPress={() => {
          if (flashcardPreviewDetailsData?.userProgress?.status === "COMPLETED") {
            setAssModalVisible(true);
          }
        }} style={[styles.examMainView, { marginTop: scale(20), alignItems: "center" }]}>
          <View style={styles.examHeader}>
            <RNText textColor={COLORS.BORDER_COLOR} medium>Assignment</RNText>
            {/* <View style={styles.examIconContainer}>
            <RNImage source={IMAGES.lockKeyhole} style={styles.examIcon} />
          </View> */}

            <View style={styles.examQuestions}>
              <RNImage source={IMAGES.clipboardQuestion} style={{ width: 15, height: 15 }} />
              <RNText style={{ marginLeft: 5 }} textColor={COLORS.BORDER_COLOR} medium>
                {3} questions
              </RNText>

              {/* {
                flashcardPreviewDetailsData?.exam?.retryAllowed === 1 ? null :
                  <><View style={styles.lineView} />
                    <RNImage source={IMAGES.arrowRotateRight} style={{ width: 13, height: 13, marginLeft: scale(10) }} /><RNText style={{ marginLeft: 5 }} textColor={COLORS.BORDER_COLOR} medium>
                      {flashcardPreviewDetailsData?.exam?.remainingRetries + "/" + flashcardPreviewDetailsData?.exam?.retryAllowed || 0} Attempts Remaining
                    </RNText>
                  </>} */}
            </View>
          </View>
          {/* <RNText style={styles.examTitle} textColor={COLORS.TEXTCOLOR} bold medium>
            {flashcardPreviewDetailsData?.exam?.title || ""}
          </RNText> */}
        </Pressable>
      </>
    )
  }

  const AttestationModal = () => {
    return (
      <RNModal transparent visible={attModalVisible} onDismiss={() => setAttModalVisible(false)}>
        <View style={{ paddingHorizontal: 10, backgroundColor: COLORS.WHITE, paddingVertical: 20, width: "90%" }}>
          <RNText large bold>Attestation</RNText>
          <RNText style={{ marginTop: 20 }} large>Please complete this one-question quiz to confirm your acceptance of the training materials. Click the Start button below, answer the question, and then click Submit.</RNText>

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
              setAttModalVisible(false)
              _onPressNavigate(SCREEN_NAMES.CourseStack, {
                screen: SCREEN_NAMES.AttestationExam,
                params: {
                  startAttestionData: flashcardPreviewDetailsData
                }
              })
            }}
            textColor={COLORS.WHITE}
            title={STRINGS.start}
            minHeightButton={true}
            style={[styles.courseButtonStyle, { marginTop: scale(30) }]}
            backgroundColor={COLORS.SECONDARY}
          />
        </View>
      </RNModal>
    );
  };

  const AssignmentnModal = () => {
    return (
      <RNModal transparent visible={assModalVisible} onDismiss={() => setAssModalVisible(false)}>
        <View style={{ paddingHorizontal: scale(20), backgroundColor: COLORS.WHITE, paddingVertical: 20, width: scale(270) }}>
          <RNImage onPress={() => setAssModalVisible(false)} source={IMAGES.VectorIcon} style={{ width: 17, height: 17, left: scale(230), bottom: scale(15) }} />
          <RNText style={{ paddingBottom: scale(5) }} TextAlignCenter large semiBold>Assignment Overview</RNText>
          <RNText textColor='#9398A4' style={{ fontSize: scale(10) }}>Complete your assignment within the time limit</RNText>
          <View style={{ flexDirection: "row", marginTop: scale(30) }}>
            <RNText style={{ fontSize: 11.5 }}>Assessment Type :</RNText>
            <RNText style={{ left: scale(7), fontSize: 11.5 }} semiBold>Timed Assignment</RNText>
          </View>

          <View style={{ flexDirection: "row", marginTop: scale(5) }}>
            <RNText style={{ fontSize: 11.5 }}>Attempts Allowed :</RNText>
            <RNText style={{ left: scale(5), fontSize: 11.5 }} semiBold>Single Attempt</RNText>
          </View>

          <RNText TextAlignCenter style={{ marginTop: scale(40) }} large semiBold>This assignment has a 1h 20m Time limit.</RNText>
          <RNText style={{ marginTop: scale(20), fontSize: 13 }} textColor='#667085'>Please ensure to submit your response within the allotted time to avoid penalties.</RNText>

          <View style={{ marginTop: scale(30), flexDirection: "row", alignItems: "center" }}>
            <RNImage source={IMAGES.FrameBulb} style={{ width: 15, height: 15 }} />
            <RNText style={{ left: 5 }} small>Quick Tips</RNText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
            <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: "#5E5E5ECC" }} />
            <RNText style={{ fontSize: 12, left: 5 }} textColor='#5E5E5ECC'>Read all questions carefully before starting.</RNText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
            <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: "#5E5E5ECC" }} />
            <RNText style={{ fontSize: 12, left: 5 }} textColor='#5E5E5ECC'>Keep track of your remaining time.</RNText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
            <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: "#5E5E5ECC" }} />
            <RNText style={{ fontSize: 12, left: 5 }} textColor='#5E5E5ECC'>Review your answers before submitting.</RNText>
          </View>

          <View style={{ width: "100%", flexDirection: "row", marginTop: scale(30), justifyContent: "space-between" }}>
            <RNButton
              onPress={() => {
                setAssModalVisible(false)
                _onPressNavigate(SCREEN_NAMES.CourseStack, {
                  screen: SCREEN_NAMES.CourseAssignment,
                })
              }}
              textColor={"#9398A4"}
              title={"Do it later"}
              minHeightButton={true}
              textStyle={{ fontSize: 11.5 }}
              style={{ width: scale(120), borderWidth: 0.5, right: 5 }}
              backgroundColor={COLORS.WHITE}
            />

            <RNButton
              onPress={() => {
                setAssModalVisible(false)
                _onPressNavigate(SCREEN_NAMES.CourseStack, {
                  screen: SCREEN_NAMES.CourseAssignment,
                })
              }}
              textColor={COLORS.WHITE}
              title={"Start Assignment"}
              minHeightButton={true}
              textStyle={{ fontSize: 11.5 }}
              style={{ width: scale(120), left: 5 }}
              backgroundColor={"#4284F3"}
            />
          </View>
        </View>
      </RNModal>
    );
  };

  const ButtonView = () => {
    return (
      <RNButton
        onPress={() => {
          if (flashcardPreviewDetailsData?.userProgress?.status == "CANCELLED") {
            console.log("canel")
          }
          else {
            if (storeCourseItemData?.resourceType === "COURSE") {
              dispatch(getScormChaptersByCourseFailAction());
              _onPressNavigate(SCREEN_NAMES.CourseStack, {
                screen: SCREEN_NAMES.MainCourse,
              })
            }
            else {
              _onPressNavigate(SCREEN_NAMES.CourseStack, {
                screen: SCREEN_NAMES.MainCourse,
              })
            }

          }
        }
        }
        textColor={flashcardPreviewDetailsData?.userProgress?.status == "IN_PROGRESS" ? COLORS.PRIMARY : flashcardPreviewDetailsData?.userProgress?.status == "COMPLETED" ? COLORS.PRIMARY : flashcardPreviewDetailsData?.userProgress?.status == "CANCELLED" ? COLORS.PRIMARY : COLORS.WHITE}
        title={flashcardPreviewDetailsData?.userProgress?.status == "IN_PROGRESS" ? STRINGS.continue : flashcardPreviewDetailsData?.userProgress?.status == "COMPLETED" ? "Completed (Replay)" : flashcardPreviewDetailsData?.userProgress?.status == "CANCELLED" ? "Cancelled" : STRINGS.start}
        backgroundColor={flashcardPreviewDetailsData?.userProgress?.status == "IN_PROGRESS" ? COLORS.DULLBUTTONCOLOR : flashcardPreviewDetailsData?.userProgress?.status == "COMPLETED" ? COLORS.DULLBUTTONCOLOR : flashcardPreviewDetailsData?.userProgress?.status == "CANCELLED" ? COLORS.DULLBUTTONCOLOR : COLORS.SECONDARY}
        style={{ width: "96%" }}
        disabled={!flashcardPreviewDetailsData?.userProgress?.status}
      />
    )
  }


  const ChapterItem: React.FC<ChapterItemProps> = ({ chapter, storeCourseItemData, indexNumber }: { chapter: any, storeCourseItemData: any, indexNumber: any }) => {
    const [showDetailsBoolean, setShowDetailsBoolean] = useState(false);
    const formattedDuration = formatDuration(chapter?.duration);
    const secondFormattedDuration = secondFormatDuration(chapter?.duration);


    const renderMaterialItem = (material: any, index: any) => {
      return (
        <><View
          key={index}
          style={{
            paddingVertical: scale(10),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={styles.secondMaterialView}>
            <RNImage source={IMAGES.fileLines} style={styles.materialImage} />
            <RNText
              style={{ marginLeft: scale(5) }}
              textColor={COLORS.TEXTCOLOR}
              small
              bold
            >
              {material?.sequenceNumber || 0} {material?.title.length > 25
                ? material?.title.slice(0, 25) + '...'
                : material?.title || ''}
            </RNText>
          </View>
          <View style={[styles.secondMaterialView, { marginLeft: scale(5) }]}>
            <RNImage source={IMAGES.circleClock} style={styles.materialImage} />
            <RNText
              style={{ marginLeft: scale(5) }}
              textColor={COLORS.GRAYTEXTCOLOR}
              small
            >
              {/* {secondFormatDuration(material?.duration || 0)} */}
              {storeCourseItemData?.resourceType === 'SCORM'
                ? formatDuration(material?.duration)
                : secondFormatDuration(material?.duration)}
            </RNText>
          </View>
        </View>
        </>
      )
    };

    return (
      <View style={styles.examMainView}>
        <RNText textColor={COLORS.GRAYTEXTCOLOR} small>
          Chapter {indexNumber + 1}
        </RNText>
        <RNText
          style={{ marginTop: scale(10) }}
          textColor={COLORS.TEXTCOLOR}
          medium
          semiBold
        >
          {chapter?.title}
        </RNText>

        <View style={styles.materialMainView}>
          <View style={styles.secondMaterialView}>
            <RNImage source={IMAGES.fileLines} style={styles.materialImage} />
            <RNText
              style={{ marginLeft: scale(5) }}
              textColor={COLORS.GRAYTEXTCOLOR}
              small
            >
              {chapter?.materials?.length} Material
            </RNText>
          </View>

          <View style={[styles.secondMaterialView, { marginLeft: scale(5) }]}>
            <RNImage source={IMAGES.circleQuestion} style={styles.materialImage} />
            <RNText
              style={{ marginLeft: scale(5) }}
              textColor={COLORS.GRAYTEXTCOLOR}
              small
            >
              {1} Knowledge Check
            </RNText>
          </View>

          <View style={[styles.secondMaterialView, { marginLeft: scale(5) }]}>
            <RNImage source={IMAGES.circleClock} style={styles.materialImage} />
            <RNText
              style={{ marginLeft: scale(5) }}
              textColor={COLORS.GRAYTEXTCOLOR}
              small
            >
              {storeCourseItemData?.resourceType === 'SCORM'
                ? formattedDuration
                : secondFormattedDuration
              }
            </RNText>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            borderBottomWidth: 0.2,
            borderBottomColor: COLORS.GRAY,
            marginBottom: 10,
            marginTop: scale(15),
          }}
        />

        {showDetailsBoolean &&
          chapter?.materials?.map(renderMaterialItem)}

        {showDetailsBoolean &&
          <View
            style={{
              paddingVertical: scale(10),
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 0.2,
              borderTopColor: COLORS.GRAY,
              marginTop: 10,
            }}
          >
            <View style={styles.secondMaterialView}>
              <RNImage source={IMAGES.circleQuestion} style={styles.materialImage} />
              <RNText
                style={{ marginLeft: scale(5) }}
                textColor={COLORS.TEXTCOLOR}
                small
                bold
              >
                Knowledge Check
              </RNText>
            </View>
            <View style={[styles.secondMaterialView, { marginLeft: scale(5) }]}>
              <RNText
                style={{ marginLeft: scale(5) }}
                textColor={COLORS.GRAYTEXTCOLOR}
                small
              >
                {chapter?.kcExam?.questionsCount || 0}
              </RNText>
              <RNText
                style={{ marginLeft: scale(5) }}
                textColor={COLORS.GRAYTEXTCOLOR}
                small
              >
                Questions
              </RNText>
            </View>
          </View>
        }

        <Pressable
          onPress={() => setShowDetailsBoolean(!showDetailsBoolean)}
          style={{
            flexDirection: 'row',
            marginTop: scale(10),
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <RNText textColor={COLORS.GRAYTEXTCOLOR} medium>
            {showDetailsBoolean ? 'Hide Details' : 'Show Details'}
          </RNText>
          <RNImage
            source={showDetailsBoolean ? IMAGES.chevronDown : IMAGES.chevronDown}
            style={[styles.materialImage, { marginLeft: scale(7), top: 1 }]}
          />
        </Pressable>
      </View>
    );
  };

  const ChaptersView = () => {
    return (
      <FlatList
        data={flashcardPreviewDetailsData?.chapters}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item, index }) => (
          <ChapterItem
            chapter={item}
            storeCourseItemData={storeCourseItemData}
            indexNumber={index}
          />
        )}
      />
    );
  };

  const ScromChapterFunction = () => {
    return (
      <View style={styles.examMainView}>
        <RNText textColor={COLORS.TEXTCOLOR} large>Chapters</RNText>
        {scromChapterByData?.chapters && scromChapterByData.chapters.length > 0 ? (
          scromChapterByData.chapters.map((item: any, index: any) => (
            <View key={index} style={[styles.secondMaterialView, { marginLeft: scale(5), marginTop: scale(7) }]}>
              <RNImage source={IMAGES.fileLines} style={{ width: 20, height: 20 }} />
              <RNText style={{ marginLeft: scale(10) }} textColor={COLORS.GRAYTEXTCOLOR} large>
                {item?.title || ""}
              </RNText>
            </View>
          ))
        ) : (
          <RNText textColor={COLORS.GRAYTEXTCOLOR} small>
            No chapters available
          </RNText>
        )}
      </View>
    );
  };

  return (
    <RNContainer
      style={styles.container}
      back={true}
      onBack={() => _onPressNavigate(SCREEN_NAMES.Home)}
      title={STRINGS.courseDetails}
      scrollViewRef={scrollViewRef}
      //titleMarginRight={true}
      scroll
      showsVerticalScrollIndicator={false}
      bottomChildren={ButtonView()}
      hideBackgroundImage Points={undefined}>
      {PreviewMainView()}
      {/* {GradeView()}
      {AssignmentDisView()} */}
      {CourseDescrption()}
      {flashcardPreviewDetailsData?.chapters ? ChaptersView() : null}
      {scromChapterByData?.length != 0 && scromChapterByData?.chapters?.length != 0 ? ScromChapterFunction() : null}
      {flashcardPreviewDetailsData?.exam ? ExamCountView() : null}
       {flashcardPreviewDetailsData?.exam ? AssignmentCountView() : null}
      {/*{flashcardPreviewDetailsData?.attestationDetail?.title ? AttestationCountView() : null} */}
      {CourseDiscrptionSheet()}
      {enrollmentItemModal()}
      {/* {AttestationModal()}*/}
      {AssignmentnModal()} 
        <LevelUpGamificationModal
          data={gamificationPopUpAndTotalPointsData}
          visible={gamificationModal}
          onClose={() => {
            dispatch(gamificationBooleanFailAction())
            setGamificationModal(false)
          }}
        />

    </RNContainer>
  );
};

export default CoursePreview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
    width: "106%",
    alignSelf: "center"
  },
  imageContainer: {
    width: '106%', // Full width
    alignSelf: "center",
    aspectRatio: 16 / 9, // Set aspect ratio to maintain image's aspect ratio
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cardMainView: {
    width: "87%",
    marginTop: "-16%",
    alignSelf: "center",
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 15,
    elevation: COLORS.ELEVATION,
    position: "relative",
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },
  cardTitle: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
  },
  progressContainer: {
    flexDirection: 'row',
    //paddingLeft: scale(20),
    //paddingRight: scale(10),
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    padding: scale(6),
    justifyContent: "space-between",
  },
  progressText: {
    //marginLeft: scale(20),
  },
  infoContainer: {
    marginTop: scale(5),
    marginBottom: scale(10),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
  },
  actionsheet: {
    //height: "0%",
    padding: 20,
    justifyContent: 'space-evenly'
  },
  cardMainView1: {
    width: "87%",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 5,
    elevation: COLORS.ELEVATION,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },

  examMainView: {
    width: "87%",
    alignSelf: "center",
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 5,
    elevation: COLORS.ELEVATION,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },
  materialMainView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(12)
  },
  secondMaterialView: {
    flexDirection: "row",
    alignItems: "center"
  },

  materialImage:
  {
    height: 15,
    width: 15
  },

  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: "center"
    // borderBottomColor: COLORS.BORDER_COLOR,
    // borderBottomWidth: 0.5,
    //paddingBottom: scale(10),
  },
  examIconContainer: {
    backgroundColor: '#E1E7FB',
    width: scale(23),
    height: scale(23),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examIcon: {
    width: scale(13),
    height: scale(13),
  },

  courseButtonStyle: {
    //marginTop: scale(7),
    marginTop:scale(7),
    width: "87%",
  },

  examTitle: {
    marginTop: scale(10),
  },
  examQuestions: {
    //marginTop: scale(10),
    flexDirection: "row",
    alignItems: "center"
  },

  courseButtonStyle1: {
    marginTop: scale(25),
    width: "87%",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },

  lineView: {
    borderWidth: 0.7,
    height: 13,
    marginLeft: 10,
    borderColor: COLORS.GRAYTEXTCOLOR
  },
});
