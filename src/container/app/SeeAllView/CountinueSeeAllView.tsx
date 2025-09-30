import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { RNButton, RNContainer, RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import * as Progress from 'react-native-progress';
import { homeScreenSelector } from '../Home/module/reducer';
import { useDispatch } from 'react-redux';
import { countinueLearningRequestAction, storeCourseItemDataOnNavigationAction, watchHistoryDeleteRequestAction } from '../Home/module/action';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { _onPressNavigate } from '../../../utils/commonFunction';
import { SCREEN_NAMES } from '../../../config';
import RNModal from '../../../Common/Modal/Modal';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

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

const CountinueSeeAllView: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const { countinueLearningData, countinueLearningLoading } = homeScreenSelector();
  const [modalVisible, setModalVisible] = useState(false);
  const [removeItemStore, setRemoveItemStore] = useState<any>(null);

  useEffect(() => {
    countinueLearningFunction();
  }, [])

  const countinueLearningFunction = () => {
    let body = {
      entityType: 0,
      pageNumber: 1,
      pageSize: 50
    }
    dispatch(countinueLearningRequestAction({ body }));
  }

  const countinueLearningFunctionGo = (item: any) => {
    if (item?.resourceType == "SCORM") {
      dispatch(storeCourseItemDataOnNavigationAction(item))
      _onPressNavigate(SCREEN_NAMES.CourseStack, {
        screen: SCREEN_NAMES.CoursePreview,
      })
    }
    else if (item?.resourceType == "LEARNINGCARD") {
      _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
        screen: SCREEN_NAMES.FlashCardPreview,
        params: {
          data: item,
        },
      })
    }
    else {
      dispatch(storeCourseItemDataOnNavigationAction(item))
      _onPressNavigate(SCREEN_NAMES.CourseStack, {
        screen: SCREEN_NAMES.CoursePreview,
      })
    }
  }

  const RemoveFunction = (item: any) => {
    setRemoveItemStore(item);
    setModalVisible(true);
  }

  const watchHistoryDeleteFunction = () => {
    let body = {
      id: removeItemStore?.watchListId || ""
    };
    let callback = (res: any) => {
      setModalVisible(false)
      if (res != 'error') {
        countinueLearningFunction();
      }
    };
    dispatch(watchHistoryDeleteRequestAction({ body, callback }));
  }

  const removeCountinueItemModal = () => {
    return (
      <RNModal transparent visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={{ paddingHorizontal: 10, backgroundColor: COLORS.WHITE, paddingVertical: 20 }}>
          <RNText style={{ marginTop: 5 }} large bold>Warning</RNText>
          <RNText style={{ marginTop: 10 }} large>Are you sure you want to Remove this Item?</RNText>

          <RNButton
            onPress={watchHistoryDeleteFunction}
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

  const ListingView = () => {
    return (
      <>{countinueLearningLoading ?
        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          data={[1,1,1,1,1,1,1]}
          renderItem={({ item, index }) => (
            <ShimmerPlaceHolder duration={2000} style={[styles.cardMainView, { height: scale(100), elevation: 0, borderRadius: 0, marginTop: 30 }]} />
          )} />
        :
        <View style={{ marginTop: scale(20), }}>
          {countinueLearningData.length === 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <RNText textColor={COLORS.BORDER_COLOR} extraLarge bold>
                No record found!
              </RNText>
            </View>
          ) : (
            <FlatList
              horizontal={false}
              showsVerticalScrollIndicator={false}
              data={countinueLearningData}
              renderItem={({ item, index }) => {
                const playedTime = item?.playedTime ?? 0;
                    const duration = item?.duration ?? 0;
                    let courseProgressData = item?.status === "COMPLETED" ? 1 : playedTime / duration;
                    courseProgressData = item?.status === "IN_PROGRESS" && courseProgressData === 1 ? 0.99 : courseProgressData;
                    let courseProgressPercentage = item?.status === "COMPLETED" ? 100 : (playedTime / duration) * 100;
                    courseProgressPercentage= item?.status === "IN_PROGRESS" && courseProgressPercentage >= 100 ? 99 : courseProgressPercentage;
                    const roundedPercentage = Math.round(courseProgressPercentage * 10) / 10; // This gives 65.6
                    const courseFinalPercentage = roundedPercentage % 1 >= 0.5 ? Math.ceil(roundedPercentage) : Math.floor(roundedPercentage);

                    const flashcardProgressData = item?.status === "COMPLETED" ? 1 : (playedTime / duration) * 0.5;
                    const flashcardProgressPercentage = item?.status === "COMPLETED" ? 100 : (playedTime / duration) * 50;
                    const roundedPercentage2 = Math.round(flashcardProgressPercentage * 10) / 10; // This gives 65.6
                    const flashFinalPercentage = roundedPercentage2 % 1 >= 0.5 ? Math.ceil(roundedPercentage2) : Math.floor(roundedPercentage2);
                    
                    const spentDuration = item?.spentDuration ?? 0;
                    const pathProgressData = item?.status === "COMPLETED" ? 1 : spentDuration / 100;
                    const pathProgressPercentage = item?.status === "COMPLETED" ? 100 : spentDuration ? Math.floor(spentDuration) : 0;
                return (
                  <Pressable
                    onPress={() => countinueLearningFunctionGo(item)}
                    style={styles.cardMainView}>
                    <View style={[styles.rowContainer, { padding: 0 }]}>
                      {item?.bannerImageUrl ?
                        <Image source={item?.bannerImageUrl ? { uri: item?.bannerImageUrl } : IMAGES.dummyFlashCard} style={styles.image} />
                        :
                        <RNText style={[styles.image, { top: 50 }]} TextAlignCenter small textColor={COLORS.BORDER_COLOR}>No Image URL Found</RNText>}
                      <View style={styles.contentContainer}>
                        <RNText style={styles.labelText} textColor={COLORS.GRAYTEXTCOLOR} small bold>{item?.resourceType == "LEARNINGCARD" ? "FLASHCARD" : item?.resourceType || ""}</RNText>
                        <RNText style={styles.titleText} textColor={COLORS.FALSHCARDTEXTCOLOR} small bold>{item?.title || ""}</RNText>
                        <View style={[styles.rowContainer, { paddingLeft: 10 }]}>
                          <RNImage source={IMAGES.calendarCockCard} style={styles.icon} />
                          <RNText style={styles.dateText} textColor={COLORS.GRAYTEXTCOLOR} small>{convertDateIntoDay(item?.dueDate)?.newConvertDate || ""}</RNText>
                        </View>
                        <View style={styles.progressContainer}>
                          {/* <Progress.Bar borderWidth={0} color="#4284F4" unfilledColor={"#EEEEEE"} progress={item?.status === "COMPLETED" ? 1 : item?.spentDuration / 100} width={130} />
                        <RNText style={styles.progressText} bold small>{item?.status === "COMPLETED" ? 100 : item?.spentDuration}%</RNText> */}
                          {item?.resourceType === "COURSE" || item?.resourceType === "SCORM" ?
                            <>
                              <Progress.Bar borderWidth={0} color="#4284F4" unfilledColor={"#EEEEEE"} progress={!isNaN(courseProgressData) && courseProgressData !== null ? courseProgressData : 0} width={130} />
                              <RNText style={styles.progressText} bold small>{courseFinalPercentage}%</RNText>
                            </>
                            :
                            item?.resourceType === "LEARNINGCARD" ?
                              <>
                                <Progress.Bar borderWidth={0} color="#4284F4" unfilledColor={"#EEEEEE"} progress={flashcardProgressData} width={130} />
                                <RNText style={styles.progressText} bold small>{flashFinalPercentage}%</RNText>
                              </>
                              :
                              item?.resourceType === "PATH" ?
                                <>
                                  <Progress.Bar borderWidth={0} color="#4284F4" unfilledColor={"#EEEEEE"} progress={pathProgressData} width={130} />
                                  <RNText style={styles.progressText} bold small>{pathProgressPercentage}%</RNText>
                                </>
                                :
                                null
                          }
                        </View>
                      </View>
                    </View>
                    <RNImage onPress={() => RemoveFunction(item)} source={IMAGES.circleXmark} style={styles.closeIcon} />
                    {/* <RNImage source={IMAGES.circleXmark} style={styles.closeIcon} />  */}
                  </Pressable>
                )
              }}
            //ItemSeparatorComponent={}
            />
          )}
        </View>
      }</>
    )
  }
  return (
    <RNContainer
      style={{ backgroundColor: COLORS.MAINBACKGROUNDCOLOR }}
      back={true}
      title={"Countinue Learning"}
      titleMarginRight={true}
      hideBackgroundImage Points={undefined}>
      {ListingView()}
      {removeCountinueItemModal()}
    </RNContainer>
  );
};

export default CountinueSeeAllView;

const styles = StyleSheet.create({
  cardMainView: {
    width: "98%",
    marginTop: "7%",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 10,
    elevation: COLORS.ELEVATION,
    // alignItems: 'center', // Center align items vertically
    position: "relative",
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 6,
  },
  image: {
    height: 130,
    width: 120,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  contentContainer: {
    width: "60%",
    justifyContent: "space-between"
  },
  labelText: {
    paddingLeft: 10,
    paddingTop: 6
  },
  titleText: {
    paddingLeft: 10,
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
    paddingLeft: 10,
    paddingBottom: 6
  },
  progressText: {
    marginLeft: 20,
    bottom: 1
  },
  closeIcon: {
    height: 15,
    width: 15,
    marginTop: 7,
    right: 20,
  },
  courseButtonStyle: {
    marginTop: scale(7),
    width: "87%"
  },
  courseButtonStyle1: {
    marginTop: scale(25),
    width: "87%",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
});
