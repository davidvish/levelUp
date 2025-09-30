import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { RNButton, RNContainer, RNImage, RNSearchBar, RNText, RNTextInput } from '../../../Common';
import { _onPressNavigate, onLogout } from '../../../utils/commonFunction';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import { SCREEN_NAMES } from '../../../config';
import * as Progress from 'react-native-progress';
import { useDispatch } from 'react-redux';
import { homeScreenSelector } from '../Home/module/reducer';
import { getUserEntitiesRequestAction, storeCourseItemDataOnNavigationAction, storePathItemDataOnNavigationAction } from '../Home/module/action';
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

function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const PathSeeAllView: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const { isLoading, pathListData } = homeScreenSelector();
  const [pathStateData, setPathStateData] = useState([]);
  const [searchInputText, setSearchInputText] = useState("")

  useEffect(() => {
    courseFunction();
  }, [])

  useEffect(() => {
    if (pathListData && pathListData.length > 0) {
      setPathStateData(pathListData)
    }
    else {
      setPathStateData([])
    }
  }, [pathListData])

  const courseFunction = () => {
    let body = {
      entityType: 0,
      pageNumber: 1,
      pageSize: 50
    }
    dispatch(getUserEntitiesRequestAction({ body }));
  }

  const MainListingView = () => {
    const onPress = () => {
      if (searchInputText === "") {
        setPathStateData([...pathStateData]);
      } else {
        setPathStateData([]);
        setTimeout(() => {
          const filteredCourses = pathStateData.filter((course: any) =>
            course.title.toLowerCase().includes(searchInputText.toLowerCase())
          );
          setPathStateData([...filteredCourses]);
        }, 0);
      }
    }
    return (
      <>
        {isLoading ?
          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={[1,1,1,1]}
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
                  setPathStateData(pathListData);
                }
              }}
            />
            {pathStateData.length === 0 ? (
              <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
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
                    data={pathStateData}
                    renderItem={_pathCardRenderItem}
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

  const _pathCardRenderItem = ({ item, index }: { item: any; index: any }) => {
    const progressData = item?.status === "COMPLETED" ? 1 : item?.spentDuration / 100;
    const progressPercentage = item?.status === "COMPLETED" ? 100 : Math.floor(item?.spentDuration);
    const today = formatDate();

    return (
      <Pressable style={styles.horizontalMainCardView}>
        {item?.bannerImageUrl ?
          <Image source={item?.bannerImageUrl ? { uri: item?.bannerImageUrl } : IMAGES.dummyPathCard} style={styles.courseDummyImageStyle} />
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

        <View style={[styles.courseViewSmallText1]}>
          <View style={styles.pathSmallTextView}>
            <RNText style={{ width: 90 }} textColor={COLORS.GRAYTEXTCOLOR} small>{item?.classroomCount || 0} Classroom</RNText>
            <View style={styles.lineView} />
            <RNText style={{ marginLeft: 10 }} textColor={COLORS.GRAYTEXTCOLOR} small>{item?.examCount || 0} Exam</RNText>
          </View>

          <View style={styles.courseViewSmallViewSecond}>
            <RNText style={{ width: 90 }} textColor={COLORS.GRAYTEXTCOLOR} small>{item?.learningCardCount || 0} FlashCard</RNText>
            <View style={styles.lineView} />
            <RNText style={{ marginLeft: 10 }} textColor={COLORS.GRAYTEXTCOLOR} small>{item?.courseCount || 0} Course</RNText>
          </View>
        </View>

        <View style={[styles.progressContainer, { paddingLeft: scale(20), paddingRight: scale(10), marginTop: 7 }]}>
          <Progress.Bar borderWidth={0} color="#4284F4" unfilledColor={"#EEEEEE"} progress={progressData} width={scale(248)} />
          <RNText style={styles.progressText} bold small>{progressPercentage}%</RNText>
        </View>

        <RNButton
          textColor={item?.status == "IN_PROGRESS" ? COLORS.PRIMARY : item?.status == "COMPLETED" ? COLORS.PRIMARY : item?.status == "CANCELLED" ? COLORS.PRIMARY : COLORS.WHITE}
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
              dispatch(storePathItemDataOnNavigationAction(item))
              _onPressNavigate(SCREEN_NAMES.PathStack, {
                screen: SCREEN_NAMES.MainPath,
              })
            }
          }}
        />
      </Pressable>
    )
  }

  return (
    <RNContainer
      style={{ backgroundColor: COLORS.MAINBACKGROUNDCOLOR }}
      back={true}
      title={"Path"}
      titleMarginRight={true}
      hideBackgroundImage Points={undefined}>
      {MainListingView()}
    </RNContainer>
  );
};

export default PathSeeAllView;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    padding: 6,
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
    //width: 370,
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
    width: 377,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  courseViewText: {
    marginTop: 7,
    paddingLeft: scale(20),
    paddingRight: scale(20)
  },
  courseButtonStyle: {
    marginTop: scale(7),
    width: screenWidth / 1.2,
    alignItems: "center",
    //marginRight:scale(34)
  },
  lineView: {
    borderWidth: 0.7,
    height: 13,
    marginLeft: 10,
    borderColor: COLORS.GRAYTEXTCOLOR
  },
  courseViewSmallViewSecond: {
    flexDirection: "row",
    alignItems: "center",
    width: 100
  },
  courseViewSmallText1: {
    width: 250,
    paddingLeft: scale(20),
    marginTop: scale(7),
  },
  pathSmallTextView: {
    flexDirection: "row",
    alignItems: "center"
  },
});
