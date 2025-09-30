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
import { getUserEntitiesRequestAction } from '../Home/module/action';
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

const FlashCardSeeAllView: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const { isLoading, flashCardListData } = homeScreenSelector();
  const [flashcardStateData, setFlashcardStateData] = useState<any>([]);
  const [searchInputText, setSearchInputText] = useState("")

  useEffect(() => {
    courseFunction();
  }, [])

  useEffect(() => {
    if (flashCardListData && flashCardListData.length > 0) {
      setFlashcardStateData(flashCardListData)
    }
    else {
      setFlashcardStateData([])
    }
  }, [flashCardListData])

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
        setFlashcardStateData([...flashCardListData]);
      } else {
        setFlashcardStateData([]);
        setTimeout(() => {
          const filteredCourses = flashCardListData.filter((course: any) =>
            course.title.toLowerCase().includes(searchInputText.toLowerCase())
          );
          setFlashcardStateData([...filteredCourses]);
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
                  setFlashcardStateData(flashCardListData);
                }
              }}
            />
            {flashcardStateData.length === 0 ? (
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
                    data={flashcardStateData}
                    renderItem={_flashCardRenderItem}
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

  const _flashCardRenderItem = ({ item, index }: { item: any; index: any }) => {
     const playedTime = item?.playedTime ?? 0;
    const duration = item?.duration ?? 0;
    const progressData = item?.status === "COMPLETED" ? 1 : (playedTime / duration) * 0.5;
    const progressPercentage = item?.status === "COMPLETED" ? 100 : (playedTime / duration) * 50;
    const roundedPercentage = Math.round(progressPercentage * 10) / 10; // This gives 65.6
    const courseFinalPercentage = roundedPercentage % 1 >= 0.5 ? Math.ceil(roundedPercentage) : Math.floor(roundedPercentage);

    const today = formatDate();

    return (
      <View style={styles.horizontalMainCardView}>
        <Pressable onPress={() =>
          _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
            screen: SCREEN_NAMES.FlashCardPreview,
            params: {
              data: item,
            },
          })}>
          {item?.bannerImageUrl ?
            <RNImage resizeMode="Cover" source={item?.bannerImageUrl ? { uri: item?.bannerImageUrl } : IMAGES.dummyFlashCard} style={styles.courseDummyImageStyle} />
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

          <View style={styles.courseViewSmallText}>
            <RNText textColor={COLORS.GRAYTEXTCOLOR} small>{item?.cardCount || 0} {item?.cardCount == 1 ? "Card" : "Cards"}</RNText>
            {/* <View style={styles.courseLabelContainer}>
            <RNText textColor={COLORS.TEXTCOLOR} small semiBold>{item?.department || ""}</RNText>
          </View> */}
          </View>

          <View style={[styles.progressContainer, { paddingLeft: scale(20), paddingRight: scale(10), marginTop: 7 }]}>
            <Progress.Bar borderWidth={0} color="#4284F4" unfilledColor={"#EEEEEE"} progress={progressData} width={scale(248)} />
            <RNText style={styles.progressText} bold small>{!Number.isNaN(courseFinalPercentage) || courseFinalPercentage ? courseFinalPercentage : 0}</RNText>
          </View>
        </Pressable>
        <RNButton
          onPress={() => {
            if (item?.status == "CANCELLED") {
              console.log("canel")
            }
            else if (item?.status == "NOT_STARTED") {
              _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
                screen: SCREEN_NAMES.FlashCardPreview,
                params: {
                  data: item,
                },
              })
            }
            else {
              _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
                screen: SCREEN_NAMES.MainFlashCard,
                params: {
                  data: item,
                },
              })
            }
          }}
          textColor={item?.status == "IN_PROGRESS" ? COLORS.PRIMARY : item?.status == "COMPLETED" ? COLORS.PRIMARY : item?.status == "CANCELLED" ? COLORS.PRIMARY : COLORS.WHITE}
          title={item?.status == "IN_PROGRESS" ? STRINGS.continue : item?.status == "COMPLETED" ? "Completed (Replay)" : item?.status == "CANCELLED" ? "Cancelled" : STRINGS.start}
          minHeightButton={true}
          disabled={item?.status == "CANCELLED"}
          style={styles.courseButtonStyle}
          backgroundColor={item?.status == "IN_PROGRESS" ? COLORS.DULLBUTTONCOLOR : item?.status == "COMPLETED" ? COLORS.DULLBUTTONCOLOR : item?.status == "CANCELLED" ? COLORS.DULLBUTTONCOLOR : COLORS.SECONDARY}
        />
      </View>
    )
  }

  return (
    <RNContainer
      style={{ backgroundColor: COLORS.MAINBACKGROUNDCOLOR }}
      back={true}
      title={"Flashcard"}
      titleMarginRight={true}
      hideBackgroundImage Points={undefined}>
      {MainListingView()}
    </RNContainer>
  );
};

export default FlashCardSeeAllView;

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
    width: '102%',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  courseViewText: {
    marginTop: 7,
    paddingLeft: scale(20),
    paddingRight: scale(20)
  },
  courseViewSmallText: {
    width: 250,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: scale(20),
    marginTop: scale(7),
  },
  courseButtonStyle: {
    marginTop: scale(7),
    width: screenWidth / 1.2,
    alignItems: "center",
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
