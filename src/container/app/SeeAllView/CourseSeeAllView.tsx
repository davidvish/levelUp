import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { RNButton, RNContainer, RNImage, RNSearchBar, RNText, RNTextInput } from '../../../Common';
import { _onPressNavigate, onLogout } from '../../../utils/commonFunction';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import RNActionSheet, { actionSheetRef } from '../../../Common/ActionSheet/ActionSheet';
import { scale } from 'react-native-size-matters';
import RNModal from '../../../Common/Modal/Modal';
import { SCREEN_NAMES } from '../../../config';
import * as Progress from 'react-native-progress';
import { homeScreenSelector } from '../Home/module/reducer';
import { useDispatch } from 'react-redux';
import { getUserEntitiesRequestAction, storeCourseItemDataOnNavigationAction } from '../Home/module/action';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const screenWidth = Dimensions.get('window').width;

function convertDateIntoDay(dateString: any) {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[monthIndex];
  const newConvertDate = `${monthName} ${day}, ${year}`
  return { day, monthName, year, newConvertDate };
}

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

function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const CourseSeeAllView: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const { isLoading, courseListData } = homeScreenSelector();
  const [courseStateData, setCourseStateData] = useState<any>([]);
  const [searchInputText, setSearchInputText] = useState("")

  useEffect(() => {
    courseFunction();
  }, [])

  useEffect(() => {
    if (courseListData && courseListData.length > 0) {
      setCourseStateData(courseListData)
    }
    else {
      setCourseStateData([])
    }
  }, [courseListData])

  const courseFunction = () => {
    let body = {
      entityType: 0,
      pageNumber: 1,
      pageSize: 100
    }
    dispatch(getUserEntitiesRequestAction({ body }));
  }
  const MainListingView = () => {
    const onPress = () => {
      if (searchInputText === "") {
        setCourseStateData([...courseListData]);
      } else {
        setCourseStateData([]);
        setTimeout(() => {
          const filteredCourses = courseListData.filter((course: any) =>
            course.title.toLowerCase().includes(searchInputText.toLowerCase())
          );
          setCourseStateData([...filteredCourses]);
        }, 0);
      }
    }
    return (
      <>
        {isLoading ?
          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={[1, 1, 1, 1]}
            renderItem={({ item, index }) => (
              <ShimmerPlaceHolder duration={2000} style={[styles.horizontalMainCardView, { height: scale(250), width: "98%", elevation: 0, borderRadius: 0, marginTop: 30, paddingBottom: 0 }]} />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
          />
          :
          <View style={{ marginTop: scale(0), alignItems: "center" }}>
            <RNSearchBar
              placeholder={"Search by Title"}
              onPress={onPress}
              inputText={searchInputText}
              onChangeText={(text) => {
                setSearchInputText(text);
                if (text === "") {
                  setCourseStateData(courseListData);
                }
              }}
            />
            {courseStateData.length === 0 ? (
              <View style={{ alignItems: 'center', height: '100%', marginTop: scale(250) }}>
                <RNText textColor={COLORS.BORDER_COLOR} extraLarge bold>
                  No record found!
                </RNText>
              </View>
            ) : (
              <>
                <View style={{ marginTop: scale(10), marginBottom: scale(150) }}>
                  <FlatList
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    data={courseStateData ? courseStateData : []}
                    renderItem={_courseRenderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                  />
                </View>
              </>
            )}
          </View>
        }
      </>

    )
  }

  const _courseRenderItem = ({ item, index }: { item: any; index: any }) => {

    // const progressData = item?.status === "COMPLETED" ? 1 : item?.playedTime / item?.duration;
    // const progressPercentage = item?.status === "COMPLETED" ? 100 : Math.floor((item?.playedTime / item?.duration) * 100);
  
    const playedTime = item?.playedTime ?? 0;
    const duration = item?.duration ?? 0;
    let progressData = item?.status === "COMPLETED" ? 1 : playedTime / duration;
    progressData = item?.status === "IN_PROGRESS" && progressData === 1 ? 0.99 : progressData;
    let progressPercentage = item?.status === "COMPLETED" ? 100 : (playedTime / duration) * 100;
    progressPercentage = item?.status === "IN_PROGRESS" && progressPercentage >= 100 ? 99 : progressPercentage;
    const roundedPercentage = Math.round(progressPercentage * 10) / 10; // This gives 65.6
    const courseFinalPercentage = roundedPercentage % 1 >= 0.5 ? Math.ceil(roundedPercentage) : Math.floor(roundedPercentage);
    
    const today = formatDate();
    const formattedDuration = formatDuration(duration);
    const secondFormattedDuration = secondFormatDuration(duration);

    return (
      <View style={styles.horizontalMainCardView}>
        <Pressable
          onPress={() => {
            dispatch(storeCourseItemDataOnNavigationAction(item))
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CoursePreview,
            })
          }}
        >
          {item?.bannerImageUrl ?
            <RNImage resizeMode="Cover" source={item?.bannerImageUrl ? { uri: item?.bannerImageUrl } : IMAGES.dummyPathCard} style={styles.courseDummyImageStyle} />
            :
            <RNText style={[styles.courseDummyImageStyle, { top: 80 }]} TextAlignCenter small textColor={COLORS.BORDER_COLOR}>No Image URL Found</RNText>}


          <View style={[styles.rowContainer, { marginTop: 10, paddingLeft: scale(20), paddingRight: scale(10), justifyContent: "space-between" }]}>

            <View style={{ flexDirection: "row" }}>
              <RNImage source={IMAGES.calendarCockCard} style={styles.icon} />
              <RNText style={styles.dateText} textColor={COLORS.GRAYTEXTCOLOR} small>{convertDateIntoDay(item?.dueDate)?.newConvertDate || ""}</RNText>
            </View>
            {
              item.dueDate.split('T')[0] < today && item.status?.toLowerCase() !== 'completed' ?
                <View style={{ backgroundColor: "red", padding: 3, paddingHorizontal: 10, borderRadius: 5, marginLeft: 3 }}>
                  <RNText TextAlignCenter small textColor={COLORS.WHITE}>Overdue</RNText>
                </View>
                :
                item.status?.toLowerCase() == 'completed' && item?.isPassed != null && item?.isPassed !== undefined ?
                  <View style={{ backgroundColor: item?.isPassed ? COLORS.GREEN : COLORS.RED, padding: 3, paddingHorizontal: 10, borderRadius: 5, marginLeft: 3 }}>
                    <RNText TextAlignCenter small textColor={COLORS.WHITE}>{item?.isPassed ? "Passed" : "Failed"}</RNText>
                  </View>
                  :
                  null
            }
          </View>
          <RNText style={styles.courseViewText} medium semiBold>{item?.title || ""}</RNText>

          {/* <View style={[styles.courseLabelContainer, {paddingHorizontal:10, marginLeft:scale(20)}]}>
            <RNText textColor={COLORS.TEXTCOLOR} small semiBold>{item?.department || ""}</RNText>
          </View> */}

          {item?.resourceType == "SCORM" ?
            <View style={{ width: scale(285), marginTop: scale(7), flexDirection: "row", justifyContent: "flex-start", marginLeft: 25 }}>
              {/* <RNText textColor={COLORS.GRAYTEXTCOLOR} small>{item?.resourceType == "SCORM" ? "" : `${item?.materialCount} Material`}</RNText> */}
              {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 5,
                  height: 5,
                  borderRadius: 10,
                  backgroundColor:
                    COLORS.GRAYTEXTCOLOR
                }} /> */}
              <RNText style={{ marginLeft: 0 }} textColor={COLORS.GRAYTEXTCOLOR} small>{item?.chapterCount || 0} Chapter</RNText>
              {/* </View> */}
              <View style={{ flexDirection: "row", alignItems: "center", marginLeft: scale(55) }}>
                <View style={{
                  width: 5,
                  height: 5,
                  borderRadius: 10,
                  backgroundColor:
                    COLORS.GRAYTEXTCOLOR
                }} />
                <RNText style={{ marginLeft: 18 }} textColor={COLORS.GRAYTEXTCOLOR} small>{" " + formattedDuration}</RNText>
              </View>
            </View>
            :
            <View style={[styles.courseViewSmallText, { paddingLeft: scale(20) }]}>
              <RNText textColor={COLORS.GRAYTEXTCOLOR} small>{`${item?.materialCount} Material`}</RNText>
              <View style={styles.courseViewSmallCircle} />
              <RNText style={{ marginLeft: 3 }} textColor={COLORS.GRAYTEXTCOLOR} small>{item?.chapterCount || 0} Chapter</RNText>
              <View style={styles.courseViewSmallCircle} />
              <RNText style={{ marginLeft: 3 }} textColor={COLORS.GRAYTEXTCOLOR} small>{" " + secondFormattedDuration}</RNText>
            </View>
          }



          <View style={[styles.progressContainer, { paddingLeft: scale(20), paddingRight: scale(10), marginTop: 7 }]}>
            <Progress.Bar borderWidth={0} color="#4284F4" unfilledColor={"#EEEEEE"} progress={isNaN(progressData) || progressData === null || progressData === undefined ? 0 : progressData} width={scale(250)} />
            <RNText style={styles.progressText} bold small>{isNaN(courseFinalPercentage) || courseFinalPercentage === null || courseFinalPercentage === undefined ? 0 : courseFinalPercentage}%</RNText>
          </View>
        </Pressable>

        <View style={{ marginTop: scale(7), width: "80%", padding: 10, alignSelf: "center" }}>
          <RNButton
            textColor={item?.status == "IN_PROGRESS" ? COLORS.PRIMARY : item?.status == "COMPLETED" ? COLORS.PRIMARY : item?.status == "CANCELLED" ? COLORS.GRAY : COLORS.WHITE}
            title={item?.status == "IN_PROGRESS" ? STRINGS.continue : item?.status == "COMPLETED" ? "Completed (Replay)" : item?.status == "CANCELLED" ? "Cancelled" : STRINGS.start}
            minHeightButton={true}
            disabled={item?.status == "CANCELLED"}
            style={styles.courseButtonStyle}
            backgroundColor={item?.status == "IN_PROGRESS" ? COLORS.DULLBUTTONCOLOR : item?.status == "COMPLETED" ? COLORS.DULLBUTTONCOLOR : item?.status == "CANCELLED" ? COLORS.DULLBUTTONCOLOR : COLORS.SECONDARY}
            onPress={() => {
              if (item?.status == "CANCELLED") {
                console.log("canel")
              }
              else if (item?.status == "NOT_STARTED") {
                dispatch(storeCourseItemDataOnNavigationAction(item))
                _onPressNavigate(SCREEN_NAMES.CourseStack, {
                  screen: SCREEN_NAMES.CoursePreview,
                })
              }
              else {
                dispatch(storeCourseItemDataOnNavigationAction(item))
                _onPressNavigate(SCREEN_NAMES.CourseStack, {
                  screen: SCREEN_NAMES.MainCourse,
                })
              }
            }
            }
          />
        </View>
        {/* <RNButton
          textColor={item?.status == "IN_PROGRESS" ? COLORS.PRIMARY : item?.status == "COMPLETED" ? COLORS.PRIMARY : item?.status == "CANCELLED" ? COLORS.GRAY : COLORS.WHITE}
          title={item?.status == "IN_PROGRESS" ? STRINGS.continue : item?.status == "COMPLETED" ? "Completed (Replay)" : item?.status == "CANCELLED" ? "Cancelled" : STRINGS.start}
          minHeightButton={true}
          disabled={item?.status == "CANCELLED"}
          style={styles.courseButtonStyle}
          backgroundColor={item?.status == "IN_PROGRESS" ? COLORS.DULLBUTTONCOLOR : item?.status == "COMPLETED" ? COLORS.DULLBUTTONCOLOR : item?.status == "CANCELLED" ? COLORS.DULLBUTTONCOLOR : COLORS.SECONDARY}
          onPress={() => {
            if (item?.status == "CANCELLED") {
              console.log("canel")
            }
            else {
              dispatch(storeCourseItemDataOnNavigationAction(item))
              _onPressNavigate(SCREEN_NAMES.CourseStack, {
                screen: SCREEN_NAMES.MainCourse,
              })
            }
          }
          }
        /> */}

      </View>
    )
  }

  return (
    <RNContainer
      style={{ backgroundColor: COLORS.MAINBACKGROUNDCOLOR }}
      back={true}
      title={"Course"}
      titleMarginRight={true}
      hideBackgroundImage Points={undefined}>
      {MainListingView()}
    </RNContainer>
  );
};

export default CourseSeeAllView;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    padding: 6,
    width: scale(325),
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
    marginLeft: 20,
    bottom: 1
  },

  horizontalMainCardView: {
    //width: "100%",
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 10,
    elevation: COLORS.ELEVATION,
    paddingBottom: 20,
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },
  courseDummyImageStyle: {
    height: 150,
    width: '100%',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // height: '100%',
    //resizeMode: 'contain',
  },
  courseViewText: {
    marginTop: 7,
    paddingLeft: scale(20),
    paddingRight: scale(20)
  },
  courseViewSmallText: {
    width: scale(313),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    //paddingLeft: scale(20),
    marginTop: scale(7),
    //marginLeft:20
  },

  courseViewSmallCircle: {
    width: 5,
    height: 5,
    borderRadius: 10,
    marginLeft: 50,
    backgroundColor:
      COLORS.GRAYTEXTCOLOR
  },
  courseButtonStyle: {
    width: scale(300),
    //alignItems: "center",
    //alignSelf:"center",
    //marginRight: scale(34)
  },
  courseLabelContainer: {
    alignSelf: 'flex-start',
    padding: scale(3),
    backgroundColor: '#E1E7FB',
    maxWidth: '90%',
    borderRadius: 5,
    marginTop: scale(5),
  },
});
