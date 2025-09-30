import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Linking, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { RNActionSheet, RNButton, RNContainer, RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import * as Progress from 'react-native-progress';
import { useDispatch } from 'react-redux';
import { pathSelector } from './module/reducer';
import { AddUpdateLearnersToSlotRequestAction, CondtionExamRequestAction, CondtionRequestAction, GetAssignedPathDetailsV2FailAction, GetAssignedPathDetailsV2RequestAction } from './module/action';
import { _onPressNavigate, convertDateIntoDay } from '../../../utils/commonFunction';
import RenderHTML from 'react-native-render-html';
import { SCREEN_NAMES } from '../../../config';
import { storeCourseItemDataOnNavigationAction, storePathItemDataOnNavigationAction } from '../Home/module/action';
import { useFocusEffect } from '@react-navigation/native';
import { startExamRequestAction } from '../CourseStack/module/action';
import moment from 'moment-timezone';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { homeScreenSelector } from '../Home/module/reducer';


// function convertTime(timeString: any, desiredHour = null, desiredMinute = null) {
//   // Create a Date object from the time string
//   let date = new Date(timeString);

//   // If desired hour and minute are provided, set them
//   if (desiredHour !== null && desiredMinute !== null) {
//     date.setHours(desiredHour);
//     date.setMinutes(desiredMinute);
//   }



//   // Format the time
//   const formattedTime = date.toLocaleTimeString('en-US', {
//     hour: 'numeric',
//     minute: '2-digit',
//     hour12: true
//   }).toUpperCase();

//   return formattedTime;
// }

function convertTime(time: string, timeZone: string): string {
  const date = moment.tz(time, 'YYYY-MM-DD HH:mm', timeZone).toDate();

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();

  return formattedTime;
}

// function convertTime(time: string, timeZone: string): { formattedTime: string; timestamp: number } {
//   const timeInTimezone = moment.tz(time, timeZone);
//   const systemTimezone = moment.tz.guess();
//   const timeInSystemTimezone = timeInTimezone.clone().tz(systemTimezone);

//   const formattedTime = timeInSystemTimezone.format('HH:mm');
//   const timestamp = timeInSystemTimezone.valueOf(); // Returns the timestamp in milliseconds

//   return { formattedTime, timestamp };
// }

const formatDate = (dateString: any) => {
  const date = new Date(dateString);

  // Get day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  // Return the formatted date string
  return `${day}-${month}-${year}`;
};

function formatDate1(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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

const filterExpiredItems = (slotDate: any) => {
  const currentDate = new Date();
  const itemDate = new Date(slotDate);
  currentDate.setHours(0, 0, 0, 0);
  itemDate.setHours(0, 0, 0, 0);
  return itemDate >= currentDate;
};

function convertIntoTime(time: string, timeZone: string): { formattedTime: string; timestamp: number } {
  const timeInTimezone = moment.tz(time, timeZone); // Create moment object in the specified timezone
  const systemTimezone = moment.tz.guess(); // Get the system's timezone
  const timeInSystemTimezone = timeInTimezone.clone().tz(systemTimezone); // Convert to system timezone

  const formattedTime = timeInSystemTimezone.format('hh:mm A'); // Use 'hh:mm A' for 12-hour format with AM/PM
  const timestamp = timeInSystemTimezone.valueOf(); // Returns the timestamp in milliseconds

  return { formattedTime, timestamp }; // Return the formatted time and timestamp
}

const MainPath: React.FC = (props: any) => {
  const actionSheetRef = useRef<any>(null);
  const slotActionSheetRef = useRef<any>(null);
  //const storePathItemData = props?.route?.params?.data || [];
  const scrollViewRef: any = useRef(null);
  const { GetAssignedPathLoading, GetAssignedPathData } = pathSelector();
  const { storePathItemData } = homeScreenSelector();

  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [slotType, setSlotType] = useState("");
  const [slotData, setSlotData] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedSlotData, setSelectedSlotData] = useState<any>([]);

  useEffect(() => {
    pathDetailsFunction();
  }, [])

  useFocusEffect(
    useCallback(() => {
      dispatch(GetAssignedPathDetailsV2FailAction())
      pathDetailsFunction();
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
      return () => {
        clearStateFunction();
      };
    }, [])
  );

  const handleRefresh = useCallback(async () => {
    clearStateFunction();
    pathDetailsFunction();
    await Promise.all([
      new Promise(resolve => setTimeout(resolve, 2000)), // Simulating an API call
      // Add other async operations here
    ]);
  }, []);

  const clearStateFunction = () => {
    setSlotType("");
    setSlotData([]);
    setSelectedIndex(-1);
    setSelectedSlotData([])
  }

  const pathDetailsFunction = () => {
    const body = {
      id: storePathItemData?.id || "",
    };
    dispatch(GetAssignedPathDetailsV2RequestAction({ body }));
  }

  // useEffect(() => {
  //   console.log(GetAssignedPathData?.pathDetails, "GetAssignedPathData")
  // }, [GetAssignedPathData])

  const handlePressReadMoreAction = () => {
    actionSheetRef.current?.show();
  };

  const handleSlotRegisterChange = (type: string, data: any) => {
    setSlotType(type);
    setSlotData(data);
    slotActionSheetRef.current?.show();
  };

  const examStartFunction = (item: any) => {
    if (item?.id) {
      let body = {
        id: item?.id || ""
      }
      const callback = (res: any) => {
        if (res !== 'error') {
          if (res?.isPassingScoreReqd || res?.isTimed) {
            dispatch(CondtionExamRequestAction("Exam"))
            dispatch(storeCourseItemDataOnNavigationAction(GetAssignedPathData?.pathDetails || []))
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CourseAIExamStart,
              params: {
                startExamData: res ? res : [],
              }
            })
          }
          else {
            dispatch(CondtionExamRequestAction("Exam"))
            dispatch(storeCourseItemDataOnNavigationAction(GetAssignedPathData?.pathDetails || []))
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CourseAIExam,
              params: {
                startExamData: res ? res : [],
              }
            })
          }
        }
      }
      dispatch(startExamRequestAction({ body, callback }));
      // () => _onPressNavigate(SCREEN_NAMES.CourseStack, {
      //   screen: SCREEN_NAMES.CourseAIExamStart
      // })
    }
  }

  const slotRegistrationFunction = () => {
    const hasNewData = [{
      LearnerId: selectedSlotData?.createdBy || "",
      SlotId: selectedSlotData?.id || ""
    }]
    let body = {
      ClassRoomId: selectedSlotData?.classroomId || "",
      IsUserSelfRegister: true,
      PathId: GetAssignedPathData?.pathDetails?.pathSettings?.pathId || "",
      usersList: hasNewData ? hasNewData : []
    };

    const callback = (res: any) => {
      if (res !== 'error') {
        clearStateFunction();
        pathDetailsFunction();
        slotActionSheetRef.current?.hide();
      }
    };
    dispatch(AddUpdateLearnersToSlotRequestAction({ body, callback }));
  }
  const renderInfoRow = (label: string, value: string, additionalStyle: object = {}) => {
    return (
      <View style={[styles.infoRow, additionalStyle]}>
        <RNText textColor={COLORS.BORDER_COLOR} medium>{label}</RNText>
        {/* {value == undefined NaN ?  
        <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
        : */}
        {!GetAssignedPathData?.pathDetails?.assignedDate || !GetAssignedPathData?.pathDetails?.dueDate ?
          <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
          :
          <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{value ? value : ""}</RNText>
        }
        {/* } */}
      </View>
    )
  };

  const PreviewMainView = () => {
    const spentDuration = storePathItemData?.spentDuration ?? 0;
    const progressData = storePathItemData?.status === "COMPLETED" ? 1 : spentDuration / 100;
    const progressPercentage = storePathItemData?.status === "COMPLETED" ? 100 : spentDuration ? Math.floor(spentDuration) : 0;
    const today = formatDate1();
    return (
      <>
        <View style={styles.imageContainer}>
          {GetAssignedPathData?.pathDetails?.bannerImageUrl ?
            <RNImage resizeMode="Cover" source={{ uri: GetAssignedPathData?.pathDetails?.bannerImageUrl }} style={styles.image} />
            :
            <RNText style={{ top: 100 }} TextAlignCenter large textColor={COLORS.BORDER_COLOR}>No Image URL Found</RNText>}
        </View>
        <View style={styles.cardMainView}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <RNText textColor={COLORS.TEXTCOLOR} style={[styles.cardTitle, { maxWidth: "70%" }]} bold large>
              {GetAssignedPathData?.pathDetails?.title || ""}
            </RNText>
            {
              storePathItemData.dueDate.split('T')[0] < today && storePathItemData.status?.toLowerCase() !== 'completed' ?
                <View style={{ backgroundColor: COLORS.RED, padding: 3, paddingHorizontal: 10, borderRadius: 5, marginRight: 10 }}>
                  <RNText TextAlignCenter small textColor={COLORS.WHITE}>Overdue</RNText>
                </View>
                :
                storePathItemData.status?.toLowerCase() == 'completed' && storePathItemData?.isPassed != null && storePathItemData?.isPassed !== undefined ?
                  <View style={{ backgroundColor: storePathItemData?.isPassed ? COLORS.GREEN : COLORS.RED, padding: 3, paddingHorizontal: 10, borderRadius: 5, marginRight: 10 }}>
                    <RNText TextAlignCenter small textColor={COLORS.WHITE}>{storePathItemData?.isPassed ? "Passed" : "Failed"}</RNText>
                  </View>
                  : null
            }
          </View>
          <View style={styles.progressContainer}>
            <Progress.Bar
              borderWidth={0}
              color="#4284F4"
              unfilledColor={"#EEEEEE"}
              progress={isNaN(progressData) || progressData === null || progressData === undefined ? 0 : progressData}
              width={scale(235)}
            />
            <RNText style={styles.progressText} bold small>{progressPercentage}%</RNText>
          </View>
          <View style={styles.infoContainer}>
            {renderInfoRow("Enrollment Date", convertDateIntoDay(GetAssignedPathData?.pathDetails?.assignedDate)?.newConvertDate || "")}
            {renderInfoRow("Due Date", convertDateIntoDay(GetAssignedPathData?.pathDetails?.dueDate)?.newConvertDate || "")}
            {renderInfoRow("Is Sequential", GetAssignedPathData?.pathDetails?.pathSettings?.isSequential ? "Yes" : "No")}
            {renderInfoRow("Classroom Self-Registration", GetAssignedPathData?.pathDetails?.pathSettings?.selfMeetingRegisterEnabled ? "Yes" : "No", { paddingVertical: 10 })}
          </View>
        </View>
      </>
    )
  };

  const PathDescription = () => {
    //const truncatedText = GetAssignedPathData?.pathDetails?.description?.slice(0, 230) + '...' || "";
    const truncatedText = GetAssignedPathData?.pathDetails?.description || "";
    const shouldTruncate = truncatedText.length > 230;
    const displayText = shouldTruncate ? truncatedText.slice(0, 230) + '...' : truncatedText;
    return (
      <View style={styles.descriptionContainer}>
        <RNText textColor={COLORS.TEXTCOLOR} bold large>About Path</RNText>
        {/* <RenderHTML contentWidth={width} source={{ html: truncatedText ? truncatedText : "" }} /> */}
        <RenderHTML contentWidth={width} source={{ html: displayText }} />
        {shouldTruncate && (
          <Pressable onPress={handlePressReadMoreAction} style={[styles.readMoreContainer, { bottom: scale(10) }]}>
            <RNText textColor={COLORS.BORDER_COLOR} medium>Read More</RNText>
          </Pressable>
        )}
      </View>
    )
  };

  const PathDescriptionSheet = () => {
    const truncatedText = GetAssignedPathData?.pathDetails?.description || "";
    return (
      <RNActionSheet ActionSheetRef={actionSheetRef}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <RNImage source={IMAGES.ActionSheetIcon} style={styles.actionSheetIcon} />
          <View style={styles.actionSheet}>
            <RNText bold extraLarge>About Path</RNText>
            <RenderHTML contentWidth={width} source={{ html: truncatedText }} />
          </View>
        </ScrollView>
      </RNActionSheet>
    )
  };

  const ClassRoomFlashExamCourse = () => {
    const cardItems = GetAssignedPathData?.blockDetails || [];
    return (
      <FlatList
        data={cardItems}
        renderItem={renderItem}
        keyExtractor={(item: any, index: number) => `${item.blockType}-${index}`}
        contentContainerStyle={{ paddingBottom: scale(20) }}
      />
    );
  }

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    switch (item.blockType) {
      case 'EXAM':
        return renderExam(item);
      case 'COURSE':
        return renderCourse(item);
      case 'FLASHCARD':
        return renderFlashcard(item);
      case 'CLASSROOM':
        return renderClassroom(item);
      default:
        return null;
    }
  };

  const renderExam = (item: any) => {
    return (
      <View style={[styles.examMainView, { marginTop: scale(20) }]}>
        <View style={styles.examHeader}>
          <RNText textColor={COLORS.BORDER_COLOR} small>Exam</RNText>

          {(item?.remainingAttempts === 0 || item?.isSliceLocked) ? (
            <Pressable style={styles.examIconContainer}>
              <RNImage source={IMAGES.lockKeyhole} style={styles.examIcon} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => examStartFunction(item)}
              style={styles.examIconContainer}>
              <Image source={IMAGES.arrowRotateRightBlue} style={styles.examIcon} />
            </Pressable>
          )}

        </View>
        <RNText style={styles.examTitle} textColor={COLORS.TEXTCOLOR} bold medium>
          {item?.title || ""}
        </RNText>

        <View style={styles.examQuestions}>
          <RNImage source={IMAGES.clipboardQuestion} style={{ width: 15, height: 15 }} />
          <RNText style={{ marginLeft: 5 }} textColor={COLORS.BORDER_COLOR} medium>
            {item?.examQuesCount || 0} questions
          </RNText>
          <View style={styles.lineView} />
          <RNImage source={IMAGES.arrowRotateRight} style={{ width: 13, height: 13, marginLeft: scale(10) }} />
          <RNText style={{ marginLeft: 5 }} textColor={COLORS.BORDER_COLOR} medium>
            {item?.remainingAttempts || 0}/{item?.totalAttempts || 0} Attempts Remaining
          </RNText>
        </View>
      </View>
    )
  };

  const renderCourse = (item: any) => {
    return (
      <View style={[styles.examMainView, { marginTop: scale(20) }]}>
        <View style={styles.examHeader}>
          <RNText textColor={COLORS.BORDER_COLOR} small>Course</RNText>
          {item?.isSliceLocked ?
            <Pressable
              style={styles.examIconContainer}>
              <RNImage source={IMAGES.lockKeyhole} style={styles.examIcon} />
            </Pressable>
            :
            null
          }
        </View>

        <View style={styles.courseContent}>
          <RNImage resizeMode="Cover" source={{ uri: item?.bannerImageUrl }} style={styles.courseImage} />
          <View style={styles.courseDetails}>
            <RNText textColor={COLORS.TEXTCOLOR} medium bold>
              {item?.title || ""}
            </RNText>
            <View style={[styles.courseLabelContainer, { marginBottom: 10, marginTop: 10 }]}>
              <RNText textColor={COLORS.TEXTCOLOR} small semiBold>{item?.department || ""}</RNText>
            </View>
            <View style={[styles.courseInfoRow]}>

              <View style={{ flexDirection: "row", alignItems: "center", width: "58%" }}>
                <RNImage source={IMAGES.hourglassEnd} style={styles.courseInfoIcon} />
                <RNText style={{ left: 5 }} textColor={COLORS.BORDER_COLOR} small>{formatDate(item?.assignedDate || "")}</RNText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", width: "50%" }}>
                <RNImage source={IMAGES.clockGray} style={styles.courseInfoIcon} />
                <RNText style={{ left: 5 }} textColor={COLORS.BORDER_COLOR} small>{secondFormatDuration(item?.duration || 0)}</RNText>
              </View>

            </View>

            <View style={styles.courseInfoRow}>
              <View style={{ flexDirection: "row", alignItems: "center", width: "58%" }}>
                <RNImage source={IMAGES.fileLines} style={styles.courseInfoIcon} />
                <RNText style={{ left: 5 }} textColor={COLORS.BORDER_COLOR} small>{item?.materialCount || 0} Material</RNText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", width: "50%" }}>
                <RNImage source={IMAGES.listUI} style={styles.courseInfoIcon} />
                <RNText style={{ left: 5 }} textColor={COLORS.BORDER_COLOR} small>{item?.chapterCount || 0} Chapter</RNText>
              </View>
            </View>
          </View>
        </View>

        <RNButton
          style={styles.courseButton}
          minHeightButton
          backgroundColor={item?.learnerProgressStatus == "IN_PROGRESS" ? COLORS.DULLBUTTONCOLOR : item?.learnerProgressStatus == "COMPLETED" ? COLORS.DULLBUTTONCOLOR : item?.learnerProgressStatus == "CANCELLED" ? COLORS.DULLBUTTONCOLOR : COLORS.SECONDARY}
          textColor={item?.learnerProgressStatus == "IN_PROGRESS" ? COLORS.PRIMARY : item?.learnerProgressStatus == "COMPLETED" ? COLORS.PRIMARY : item?.learnerProgressStatus == "CANCELLED" ? COLORS.PRIMARY : COLORS.WHITE}
          title={item?.learnerProgressStatus == "IN_PROGRESS" ? STRINGS.continue : item?.learnerProgressStatus == "COMPLETED" ? "Completed (Replay)" : item?.learnerProgressStatus == "CANCELLED" ? "Cancelled" : STRINGS.start}
          disabled={item?.isSliceLocked}
          onPress={() => {
            if (item?.learnerProgressStatus == "CANCELLED") {
              console.log("canel")
            }
            else {
              //dispatch(CondtionExamRequestAction("Exam"))
              dispatch(storeCourseItemDataOnNavigationAction(item))
              dispatch(CondtionRequestAction("coursePath"))
              _onPressNavigate(SCREEN_NAMES.CourseStack, {
                screen: SCREEN_NAMES.MainCourse,
              })
            }
          }}
        />
      </View>
    )
  };

  const renderFlashcard = (item: any) => {
    return (
      <View style={[styles.examMainView, { marginTop: scale(20) }]}>
        <View style={styles.examHeader}>
          <RNText textColor={COLORS.BORDER_COLOR} small>Flashcard</RNText>

          {item?.isSliceLocked ?
            <Pressable
              //onPress={() => }
              style={styles.examIconContainer}>
              <RNImage source={IMAGES.lockKeyhole} style={styles.examIcon} />
            </Pressable>
            :
            null
          }
        </View>

        <View style={styles.courseContent}>
          <RNImage resizeMode="Cover" source={{ uri: item?.bannerImageUrl }} style={styles.courseImage} />
          <View style={[styles.courseDetails, { justifyContent: "space-evenly" }]}>
            <RNText textColor={COLORS.TEXTCOLOR} medium bold>
              {item?.title || ""}
            </RNText>
            <View style={styles.courseLabelContainer}>
              <RNText textColor={COLORS.TEXTCOLOR} small semiBold>{item?.department || ""}</RNText>
            </View>

            <View style={styles.courseInfoRow1}>
              <RNImage source={IMAGES.cardsblank} style={{ width: 15, height: 15 }} />
              <RNText style={{ marginLeft: scale(8) }} textColor={COLORS.BORDER_COLOR} medium>{item?.flashCardCount || 0} Cards</RNText>
            </View>
          </View>
        </View>

        <RNButton
          style={styles.courseButton}
          minHeightButton
          backgroundColor={item?.learnerProgressStatus == "IN_PROGRESS" ? COLORS.DULLBUTTONCOLOR : item?.learnerProgressStatus == "COMPLETED" ? COLORS.DULLBUTTONCOLOR : item?.learnerProgressStatus == "CANCELLED" ? COLORS.DULLBUTTONCOLOR : COLORS.SECONDARY}
          title={item?.learnerProgressStatus == "IN_PROGRESS" ? STRINGS.continue : item?.learnerProgressStatus == "COMPLETED" ? "Completed (Replay)" : item?.learnerProgressStatus == "CANCELLED" ? "Cancelled" : STRINGS.start}
          textColor={item?.learnerProgressStatus == "IN_PROGRESS" ? COLORS.PRIMARY : item?.learnerProgressStatus == "COMPLETED" ? COLORS.PRIMARY : item?.learnerProgressStatus == "CANCELLED" ? COLORS.PRIMARY : COLORS.WHITE}
          disabled={item?.isSliceLocked}
          onPress={() => {
            if (item?.learnerProgressStatus == "CANCELLED") {
              console.log("canel")
            }
            else {
              _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
                screen: SCREEN_NAMES.MainFlashCard,
                params: {
                  data: item,
                },
              })
            }
          }
          }
        />
      </View>

    )
  };

  const renderClassroom = (item: any) => {
    // const truncatedText = item?.description?.slice(0, 230) + '...' || item?.description;
    const truncatedText = item?.description || "";
    const shouldTruncate = truncatedText.length > 230;
    const displayText = shouldTruncate ? truncatedText.slice(0, 230) + '...' : truncatedText;
    const truncateUrl = (url: string, maxLength: any) => {
      if (!url) return '';

      try {
        const urlObj = new URL(url);
        let displayUrl = urlObj.hostname + urlObj.pathname;

        if (displayUrl.length > maxLength) {
          displayUrl = displayUrl.substring(0, maxLength - 3) + '...';
        }

        return urlObj.protocol + '//' + displayUrl;
      } catch {
        // Fallback if URL is invalid
        return url.length > maxLength ? url.substring(0, maxLength - 3) + '...' : url;
      }
    };

    const areAllSlotsExpired = item?.classSlots?.length > 0 && item?.classSlots.every((item: any) => !filterExpiredItems(item?.slotDate));

    return (
      <>
        <View style={[styles.examMainView, { marginTop: scale(20), }]}>
          <View style={[styles.examHeader, { width: "95%" }]}>
            <RNText textColor={COLORS.BORDER_COLOR} small>Classroom</RNText>
            {GetAssignedPathData?.pathDetails?.pathSettings?.selfMeetingRegisterEnabled && !item?.isSlotAssigned ?
              <RNButton
                style={{
                  height: scale(20),
                  width: '40%',
                  marginBottom: scale(10),
                  marginLeft: scale(150)
                }}
                disabled={areAllSlotsExpired}
                minHeightButton
                backgroundColor={COLORS.SECONDARY}
                title={"Register"}
                onPress={() => handleSlotRegisterChange("registerSlot", item?.classSlots)} />
              : null}
          </View>

          <RNText style={styles.examTitle} textColor={COLORS.TEXTCOLOR} bold medium>
            {item?.title || ""}
          </RNText>

          <RenderHTML contentWidth={width} source={{ html: displayText }} />
          {shouldTruncate && (
            <Pressable onPress={handlePressReadMoreAction} style={[styles.readMoreContainer, { bottom: scale(10) }]}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Read More</RNText>
            </Pressable>
          )}
          {/* <RenderHTML contentWidth={width} source={{ html: truncatedText }} /> */}
          {/* <Pressable style={[styles.readMoreContainer, { bottom: scale(10) }]}>
            <RNText textColor={COLORS.BORDER_COLOR} medium>Read More</RNText>
          </Pressable> */}

          {item?.classroomAttachments?.map((item: any, index: number) => (
            <Pressable
              onPress={() => Linking.openURL(item?.url || "")}
              style={{ flexDirection: "row", alignItems: "center" }}>
              <RNImage source={IMAGES.attachmetPin} style={{ width: 20, height: 20 }} />
              <RNText style={{ marginLeft: scale(5), paddingEnd: 10 }} textColor={"#0087D3"} medium>{item?.name || ""}</RNText>
            </Pressable>
          ))}


          {item?.classSlots?.map((item: any, index: number) => {
            const time1 = convertTime(item.startTime, item.timezone);
            const time2 = convertTime(item.endTime, item.timezone);
            return (
              <View style={[styles.classroomCardView, { backgroundColor: item?.isLearnerAssigned ? "#E1E7FB" : COLORS.WHITE }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                  <RNText style={{ maxWidth: "90%" }} textColor={COLORS.TEXTCOLOR} bold medium>
                    {item?.title || ""}
                  </RNText>

                  <View style={{ alignItems: "center", width: scale(50), height: scale(20), borderRadius: 7, backgroundColor: item?.classType == "onSite" ? "#E1E7FB" : "#FDF4E7", top: 2 }}>
                    <RNText style={{ top: 2 }} textColor={item?.classType == "onSite" ? "#7D94EC" : "#F3AD55"} small>{item?.classType || ""}</RNText>
                  </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
                  <RNImage source={IMAGES.calendarBlue} style={{ width: 17, height: 17 }} />
                  <RNText style={{ marginLeft: 10 }} textColor="#575757" medium>{convertDateIntoDay(item?.slotDate)?.newConvertDate || ""}</RNText>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
                  <RNImage source={IMAGES.clockBlue} style={{ width: 17, height: 17 }} />
                  <RNText style={{ marginLeft: 10 }} textColor="#575757" medium>{time1} - {time2}</RNText>
                </View>

                {item?.url ?
                  <Pressable
                    onPress={() => Linking.openURL(item?.url || "")}
                    style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
                    <RNImage source={IMAGES.linkIconBlue} style={{ width: 17, height: 17 }} />
                    <RNText
                      underline
                      style={{ marginLeft: 10 }}
                      textColor="#7D94EC"
                      medium
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {truncateUrl(item?.url, 30)}
                    </RNText>
                  </Pressable> : null}


                <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
                  <RNImage source={IMAGES.userGroupBlue} style={{ width: 17, height: 17 }} />
                  <RNText style={{ marginLeft: 10 }} textColor="#575757" medium>{item?.existingLearnersCount || 0}/{item?.capacity || 0}</RNText>
                </View>
              </View>
            )
          })}


          {item?.isSlotAssigned && item?.classSlots && item?.classSlots.length !== 1 && (
            <RNButton
              style={{
                marginTop: scale(20),
                height: scale(20),
                width: '40%',
                marginBottom: scale(10),
                marginLeft: scale(170),
                borderWidth: 2,
                borderColor: "#7D94EC"
              }}
              minHeightButton
              textColor='#7D94EC'
              backgroundColor={"#E1E7FB"}
              title={"Switch Slot"}
              onPress={() => handleSlotRegisterChange("switchSlot", item?.classSlots)}
            />
          )}
        </View>
      </>
    )
  };


  const PathRegisterSheet = () => {
    return (
      <RNActionSheet ActionSheetRef={slotActionSheetRef}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ width: "90%", alignSelf: "center" }}>
            <View style={[styles.examHeader, { paddingTop: scale(15), padding: scale(10) }]}>
              <RNText bold extraLarge>{slotType === "registerSlot" ? "Register Slots" : "Switch Slots"}</RNText>
            </View>

            {slotData.length > 0 && slotData.filter((item: any) => filterExpiredItems(item?.slotDate)).map((item: any, index: any) => {
              const time1: any = convertIntoTime(item.startTime, item.timezone);
              const time2: any = convertIntoTime(item.endTime, item.timezone);
              return (
                <Pressable
                  key={index}
                  style={[
                    styles.classroomCardView,
                    {
                      backgroundColor: selectedIndex === index ? "#E1E7FB" : COLORS.WHITE,
                      borderWidth: 1,
                      borderColor: selectedIndex === index ? COLORS.PRIMARY : COLORS.WHITE
                    }
                  ]}
                  onPress={() => {
                    setSelectedIndex(index);
                    setSelectedSlotData(item);
                  }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <RNText textColor={COLORS.TEXTCOLOR} bold medium>
                      {item?.title || ""}
                    </RNText>
                    <View style={{ alignItems: "center", width: scale(50), height: scale(20), borderRadius: 7, backgroundColor: item?.classType == "onSite" ? "#E1E7FB" : "#FDF4E7", top: 2 }}>
                      <RNText style={{ top: 2 }} textColor={item?.classType == "onSite" ? "#7D94EC" : "#F3AD55"} small>{item?.classType || ""}</RNText>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
                    <RNImage source={IMAGES.calendarBlue} style={{ width: 17, height: 17 }} />
                    <RNText style={{ marginLeft: 10 }} textColor="#575757" medium>{convertDateIntoDay(item?.slotDate)?.newConvertDate || ""}</RNText>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
                    <RNImage source={IMAGES.clockBlue} style={{ width: 17, height: 17 }} />
                    <RNText style={{ marginLeft: 10 }} textColor="#575757" medium>{time1} - {time2}</RNText>
                  </View>

                  {item?.url && (
                    <Pressable
                      onPress={() => Linking.openURL(item?.url || "")}
                      style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
                      <RNImage source={IMAGES.linkIconBlue} style={{ width: 17, height: 17 }} />
                      <RNText underline style={{ marginLeft: 10 }} textColor="#7D94EC" medium>{item?.name}</RNText>
                    </Pressable>
                  )}

                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(10) }}>
                    <RNImage source={IMAGES.userGroupBlue} style={{ width: 17, height: 17 }} />
                    <RNText style={{ marginLeft: 10 }} textColor="#575757" medium>{item?.existingLearnersCount || 0}/{item?.capacity || 0}</RNText>
                  </View>
                </Pressable>
              )
            })}
          </View>

          <RNButton
            title={STRINGS.ok}
            style={{ marginTop: scale(20), marginBottom: scale(20) }}
            disabled={selectedIndex == -1}
            textColor={COLORS.WHITE}
            backgroundColor={COLORS.SECONDARY}
            onPress={slotRegistrationFunction}
          />

        </ScrollView>
      </RNActionSheet>

    )
  };

  return (
    <RNContainer
      style={styles.container}
      back
      title={STRINGS.pathDetails}
      titleMarginRight
      scroll
      scrollViewRef={scrollViewRef}
      onRefresh={handleRefresh}
      showsVerticalScrollIndicator={false}
      hideBackgroundImage Points={undefined}    >
      {PreviewMainView()}
      {PathDescription()}
      {ClassRoomFlashExamCourse()}
      {PathDescriptionSheet()}
      {PathRegisterSheet()}
    </RNContainer>
  );
};

export default MainPath;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
    width: '106%',
    alignSelf: 'center',
  },
  imageContainer: {
    width: '106%',
    alignSelf: 'center',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cardMainView: {
    width: '87%',
    marginTop: '-14%',
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 20,
    elevation: COLORS.ELEVATION,
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
    // paddingLeft: scale(20),
    // paddingRight: scale(10),
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    padding: scale(6),
    justifyContent: "space-between"
  },
  progressText: {
    //marginLeft: scale(20),
  },
  infoContainer: {
    marginTop: scale(7),
    marginBottom: scale(10),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
  },
  descriptionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    top: scale(20)
  },
  descriptionText: {
    marginTop: scale(5),
  },
  readMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: scale(12),
  },
  actionSheetIcon: {
    alignSelf: 'center',
    width: scale(50),
  },
  actionSheet: {
    padding: 20,
    justifyContent: 'space-evenly',
  },
  actionSheetText: {
    padding: 5,
    marginTop: scale(10),
  },
  examMainView: {
    width: '87%',
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 5,
    elevation: 3,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: COLORS.BORDER_COLOR,
    borderBottomWidth: 0.5,
    paddingBottom: scale(10),
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
  examTitle: {
    marginTop: scale(10),
  },
  examQuestions: {
    marginTop: scale(10),
    flexDirection: "row",
    alignItems: "center"
  },
  examProgressContainer: {
    backgroundColor: '#E1E7FB',
    width: scale(23),
    height: scale(23),
    borderRadius: 5,
    marginTop: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseContent: {
    flexDirection: 'row',
  },
  courseImage: {
    width: scale(100),
    height: scale(100),
    marginTop: scale(10),
    borderRadius: 10,
  },
  courseDetails: {
    width: scale(180),
    height: scale(100),
    marginLeft: scale(10),
    marginTop: scale(10),
  },
  courseLabelContainer: {
    alignSelf: 'flex-start',
    padding: scale(3),
    backgroundColor: '#E1E7FB',
    maxWidth: '90%',
    borderRadius: 5,
    marginTop: scale(5),
  },
  courseInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(5),
  },
  courseInfoRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(5),
  },
  courseInfoIcon: {
    width: 10,
    height: 10,
  },
  courseButton: {
    marginTop: scale(20),
    height: scale(20),
    width: '100%',
    marginBottom: scale(10),
  },
  lineView: {
    borderWidth: 0.7,
    height: 13,
    marginLeft: 10,
    borderColor: COLORS.GRAYTEXTCOLOR
  },

  classroomCardView: {
    width: '100%',
    marginTop: scale(20),
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 5,
    elevation: 3,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  }
});
