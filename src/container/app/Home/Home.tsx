import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  View,
  FlatList,
  BackHandler,
  Platform,
  RefreshControl,
  Linking,
  Button,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {RNButton, RNContainer, RNImage, RNText} from '../../../Common';
import {COLORS, COMMON_SIZE, IMAGES, STRINGS} from '../../../constants';
import {scale} from 'react-native-size-matters';
import {_onPressNavigate, onLogout} from '../../../utils/commonFunction';
import * as Progress from 'react-native-progress';
import {BarChart} from 'react-native-gifted-charts';
import {styles} from './styles';
import {SCREEN_NAMES} from '../../../config';
import {PieChart} from 'react-native-svg-charts';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {homeScreenSelector} from './module/reducer';
import {
  barChartFailAction,
  barChartRequestAction,
  countinueLearningFailAction,
  countinueLearningRequestAction,
  getGamificationPointFailAction,
  getGamificationPointRequestAction,
  getProfileRequestAction,
  getSettingsFailAction,
  getSettingsRequestAction,
  getUserEntitiesFailAction,
  getUserEntitiesRequestAction,
  pieChartFailAction,
  pieChartRequestAction,
  storeCourseItemDataOnNavigationAction,
  storePathItemDataOnNavigationAction,
  upcomingEventsRequestAction,
  watchHistoryDeleteRequestAction,
} from './module/action';
//import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
import RNModal from '../../../Common/Modal/Modal';
import RNTextScrollable from '../../../Common/TextScrollable/TextScrollable';
const {height, width} = Dimensions.get('window');
import moment from 'moment-timezone';
import {Text as SVGText, Line, G, SvgUri} from 'react-native-svg';
import TruncatedText from './component/TruncatedText';
import {scromChapterSelector} from '../CourseStack/module/reducer';
import {loginSelector} from '../../auth/Login/module/reducer';
import {getValue, setAuthenticationToken} from '../../../utils/authentication';
import {refreshTokenRequestAction} from '../../auth/Login/module/action';
//import DocumentPicker, {types} from 'react-native-document-picker';

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
};

function convertIntoTime(
  time: string,
  timeZone: string,
): {formattedTime: string; timestamp: number} {
  const timeInTimezone = moment.tz(time, timeZone);
  const systemTimezone = moment.tz.guess();
  const timeInSystemTimezone = timeInTimezone.clone().tz(systemTimezone);

  const formattedTime = timeInSystemTimezone.format('HH:mm');
  const timestamp = timeInSystemTimezone.valueOf(); // Returns the timestamp in milliseconds

  return {formattedTime, timestamp};
}

function convertIntoMonth(time: string, timeZone: string): any {
  const timeInJapanTimezone = moment.tz(time, timeZone);
  const systemTimezone = moment.tz.guess();
  const timeInSystemTimezone = timeInJapanTimezone.clone().tz(systemTimezone);
  const formatedMonth = timeInSystemTimezone.format('MMM');
  return formatedMonth;
}
function convertIntoDate(time: string, timeZone: string): any {
  const currentTimezone = moment
    .tz(time, 'YYYY-MM-DD HH:mm', timeZone)
    .toDate();
  const formattedDate = moment(currentTimezone).format('DD');
  return formattedDate;
}

function convertDateIntoDay(dateString: any) {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthName = monthNames[monthIndex];
  const newConvertDate = `${monthName} ${day}, ${year}`;
  return {day, monthName, year, newConvertDate};
}

function extractTimeFromDate(dateString: any) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // Format hours and minutes with leading zeros if necessary
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${formattedHours}:${formattedMinutes}`;
}

function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const Home = (props: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollViewRef: any = useRef(null);
  const {userData} = loginSelector();
  const {
    getSettingData,
    gamificationPointData,
    isLoading,
    upcomingEventUserData,
    countinueLearningData,
    courseListData,
    flashCardListData,
    pathListData,
    barChartData,
    pieChartData,
    getProfileData,
    upcomingEventLoading,
    countinueLearningLoading,
    pieChartLoading,
    barChartLoading,
  } = homeScreenSelector();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [barData, setBarData] = useState<any[]>([]);
  const [piadata, setPieData] = useState<any[]>([]);
  const [pieChartStatus, setPieChartStatus] = useState('All');
  const [pieChartBooleanHide, setPieChartBooleanHide] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [removeItemStore, setRemoveItemStore] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [shouldLoadFreshUserScreen, setShouldLoadFreshUserScreen] =
    React.useState(false);
  const isFocused = useIsFocused();
  // Define the colors
  const CHARTCOLORS = {
    BLACK: '#000000',
    CHATCOLOR1: COLORS.CHATCOLOR2, // Replace with your actual color value
    CHATCOLOR2: COLORS.CHATCOLOR1, // Replace with your actual color value
  };

  // Define type for bar chart data
  interface BarChartData {
    IN_PROGRESS: number;
    COMPLETED: number;
    OVERDUE: number;
    CANCELLED: number;
    NOT_STARTED: number;
  }

  // Initialize aggregated data
  const initializeAggregatedData = (): BarChartData => ({
    IN_PROGRESS: 0,
    COMPLETED: 0,
    OVERDUE: 0,
    CANCELLED: 0,
    NOT_STARTED: 0,
  });

  const RemoveFunction = (item: any) => {
    setRemoveItemStore(item);
    setModalVisible(true);
  };

  const removeCountinueItemModal = () => {
    return (
      <RNModal
        transparent
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}>
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: COLORS.WHITE,
            paddingVertical: 20,
          }}>
          <RNText style={{marginTop: 5}} large bold>
            Confirmation
          </RNText>
          <RNText style={{marginTop: 10}} large>
            Are you sure you want to hide this Item?
          </RNText>

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

  useEffect(() => {
    navigation.addListener('blur', () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
    navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
    return () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

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
        },
      },
      {
        text: STRINGS.cancel,
        onPress: () => console.log('cancelled'),
      },
    ]);
    return true;
  };

  // useEffect(() => {
  //   courseFunction();
  //   upcomingEventFunction();
  //   countinueLearningFunction();
  //   barChartFunction();
  //   pieChartFunction("All");
  //   getProfileFunction();
  // }, [])

  const handleRefresh = useCallback(async () => {
    dispatch(barChartFailAction());
    courseFunction();
    upcomingEventFunction();
    countinueLearningFunction();
    barChartFunction();
    dispatch(barChartRequestAction());
    pieChartFunction('All');
    getProfileFunction();
    await Promise.all([
      new Promise(resolve => setTimeout(resolve, 2000)), // Simulating an API call
      // Add other async operations here
    ]);
    console.log('Refresh complete');
  }, []);

  //  const refreshTokenFunction = () => {
  //     let body = {
  //       token: userData?.accessToken || "",
  //       refreshToken: userData?.refreshToken || ""
  //     }
  //     const callback = async(res: any) => {
  //       if (res !== 'error') {
  //          await setAuthenticationToken(res?.data?.token);
  //          setTimeout(() => {
  //           dispatch(getSettingsFailAction())
  //           dispatch(getGamificationPointFailAction())
  //           dispatch(barChartFailAction())
  //           dispatch(getUserEntitiesFailAction())
  //           dispatch(countinueLearningFailAction())
  //           dispatch(pieChartFailAction())
  //           getSettingFunction();
  //           getGamificationPointFunction();
  //           courseFunction();
  //           upcomingEventFunction();
  //           countinueLearningFunction();
  //           barChartFunction();
  //           pieChartFunction("All");
  //           getProfileFunction();
  //          },500)
  //       }}
  //     dispatch(refreshTokenRequestAction({body, callback}))
  //   }

  useFocusEffect(
    useCallback(() => {
      dispatch(getSettingsFailAction());
      dispatch(countinueLearningFailAction());
      dispatch(getGamificationPointFailAction());
      dispatch(barChartFailAction());
      dispatch(getUserEntitiesFailAction());
      dispatch(pieChartFailAction());
      getSettingFunction();
      getGamificationPointFunction();
      courseFunction();
      upcomingEventFunction();
      countinueLearningFunction();
      barChartFunction();
      pieChartFunction('All');
      getProfileFunction();
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({y: 0, animated: true});
      }
      return () => {
        // Any cleanup logic if necessary
      };
    }, []),
  );

  const upcomingEventFunction = () => {
    let body = {
      PageSize: 2,
      PageNumber: 1,
      orderBy: 'startDateTime',
      sortOrder: 'asc',
    };
    dispatch(upcomingEventsRequestAction({body}));
  };

  const countinueLearningFunction = () => {
    let body = {
      entityType: 0,
      pageNumber: 1,
      pageSize: 3,
    };
    dispatch(countinueLearningRequestAction({body}));
  };

  const courseFunction = () => {
    let body = {
      entityType: 0,
      pageNumber: 1,
      pageSize: 5,
    };
    dispatch(getUserEntitiesRequestAction({body}));
  };

  const barChartFunction = () => {
    dispatch(barChartRequestAction());
  };

  const pieChartFunction = (item: any) => {
    let body = {
      type: item,
    };
    dispatch(pieChartRequestAction({body}));
  };

  const watchHistoryDeleteFunction = () => {
    let body = {
      id: removeItemStore?.watchListId || '',
    };
    let callback = (res: any) => {
      setModalVisible(false);
      if (res != 'error') {
        countinueLearningFunction();
      }
    };
    dispatch(watchHistoryDeleteRequestAction({body, callback}));
  };

  const getProfileFunction = () => {
    dispatch(getProfileRequestAction());
  };

  const getGamificationPointFunction = () => {
    dispatch(getGamificationPointRequestAction());
  };

  const getSettingFunction = () => {
    dispatch(getSettingsRequestAction());
  };

  // const rotateEvent = useCallback(() => {
  //   if (upcomingEventUserData && upcomingEventUserData.length > 0) {
  //     setCurrentEventIndex(prevIndex => (prevIndex + 1) % upcomingEventUserData.length);
  //   }
  // }, [upcomingEventUserData]);

  // useEffect(() => {
  //   let interval: any;

  //   if (isFocused) {
  //     interval = setInterval(rotateEvent, 3000);
  //   }

  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [isFocused, rotateEvent]);

  // const processedBarData = useMemo(() => {
  //   if (!barChartData || barChartData.length === 0) return [];

  //   const aggregatedData: any = {
  //     COMPLETED: 0,
  //     IN_PROGRESS: 0,
  //     NOT_STARTED: 0,
  //     OVERDUE: 0,
  //     CANCELLED: 0
  //   };
  //   const aggregatedDataPath: any = { ...aggregatedData };

  //   const resource = barChartData[0];
  //   resource?.statusCounts?.forEach((statusCount: any) => {
  //     if (statusCount.status in aggregatedData) {
  //       aggregatedData[statusCount.status] += statusCount.count;
  //     }
  //   });

  //   const resource2 = barChartData[2];
  //   resource2?.statusCounts?.forEach((statusCount: any) => {
  //     if (statusCount.status in aggregatedDataPath) {
  //       aggregatedDataPath[statusCount.status] += statusCount.count;
  //     }
  //   });

  //   return [
  //     {
  //       value: aggregatedData.COMPLETED,
  //       label: 'Completed',
  //       spacing: 2,
  //       labelWidth: 50,
  //       labelTextStyle: { color: CHARTCOLORS.BLACK },
  //       frontColor: CHARTCOLORS.CHATCOLOR2,
  //     },
  //     { value: aggregatedDataPath.COMPLETED, frontColor: CHARTCOLORS.CHATCOLOR1 },
  //     {
  //       value: aggregatedData.IN_PROGRESS,
  //       label: 'In Progress',
  //       spacing: 2,
  //       labelWidth: 50,
  //       labelTextStyle: { color: CHARTCOLORS.BLACK },
  //       frontColor: CHARTCOLORS.CHATCOLOR2,
  //     },
  //     { value: aggregatedDataPath.IN_PROGRESS, frontColor: CHARTCOLORS.CHATCOLOR1 },
  //     {
  //       value: aggregatedData.NOT_STARTED,
  //       label: 'Not Started',
  //       spacing: 2,
  //       labelWidth: 30,
  //       labelTextStyle: { color: CHARTCOLORS.BLACK },
  //       frontColor: CHARTCOLORS.CHATCOLOR2,
  //     },
  //     { value: aggregatedDataPath.NOT_STARTED, frontColor: CHARTCOLORS.CHATCOLOR1 },
  //     {
  //       value: aggregatedData.OVERDUE,
  //       label: 'Overdue',
  //       spacing: 2,
  //       labelWidth: 30,
  //       labelTextStyle: { color: CHARTCOLORS.BLACK },
  //       frontColor: CHARTCOLORS.CHATCOLOR2,
  //     },
  //     { value: aggregatedDataPath.OVERDUE, frontColor: CHARTCOLORS.CHATCOLOR1 },
  //   ];
  // }, [barChartData]);

  useEffect(() => {
    setBarData(barChartData);
  }, [barChartData]);

  useEffect(() => {
    if (pieChartData && pieChartData?.length != 0) {
      const piadata: any = [
        {value: pieChartData[0]?.count || 0, svg: {fill: '#4647C6'}},
        {value: pieChartData[1]?.count || 0, svg: {fill: '#63FFEC'}}, // Transparent segment to create half-circle effect
      ];
      setPieData(piadata);
    }
  }, [pieChartData]);

  const countinueLearningFunctionGo = (item: any) => {
    if (item?.resourceType == 'SCORM' || item?.resourceType == 'COURSE') {
      dispatch(storeCourseItemDataOnNavigationAction(item));
      _onPressNavigate(SCREEN_NAMES.CourseStack, {
        screen: SCREEN_NAMES.CoursePreview,
      });
    } else if (item?.resourceType == 'LEARNINGCARD') {
      _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
        screen: SCREEN_NAMES.FlashCardPreview,
        params: {
          data: item,
        },
      });
    } else {
      dispatch(storeCourseItemDataOnNavigationAction(item));
      dispatch(storePathItemDataOnNavigationAction(item));
      _onPressNavigate(SCREEN_NAMES.PathStack, {
        screen: SCREEN_NAMES.MainPath,
        params: {
          data: item,
        },
      });
    }
  };

  const menulistPieChartFunction = (item: any) => {
    pieChartFunction(item);
    setPieChartStatus(item);
    setPieChartBooleanHide(false);
  };

  const UpcomingEventView = () => {
    //const event = upcomingEventUserData[currentEventIndex];
    //const originalText = event?.title;
    // const truncatedText = originalText ? originalText.substring(0, 20) : '';
    // const day = event?.startDateTime;
    // //const { day: hasDay, monthName: hasMonth } = convertDateIntoDay(day);
    // const startDate = upcomingEventUserData[currentEventIndex]?.startDateTime;
    // const endDate = upcomingEventUserData[currentEventIndex]?.endDateTime;
    // const time1 = convertIntoTime(startDate, upcomingEventUserData[currentEventIndex]?.timeZone);
    // const time2 = convertIntoTime(endDate, upcomingEventUserData[currentEventIndex]?.timeZone);
    // const hasDate = convertIntoDate(event?.startDateTime, upcomingEventUserData[currentEventIndex]?.timeZone);
    // const hasMonth = convertIntoMonth(event?.startDateTime, upcomingEventUserData[currentEventIndex]?.timeZone);

    // const handlePress = (item: any) => {
    //   _onPressNavigate(SCREEN_NAMES.UpcomingEventDetails, {
    //     data: item
    //   });
    // };

    // const truncate = (str: any, max: any) => {
    //   if (str?.length <= max) return str;
    //   return str?.slice(0, max).trim() + '...';
    // };

    return (
      <>
        {upcomingEventLoading || countinueLearningLoading ? (
          <ShimmerPlaceHolder
            duration={2000}
            style={[
              styles.cardMainView,
              {height: scale(100), elevation: 0, borderRadius: 0},
            ]}
          />
        ) : upcomingEventUserData?.length != 0 ? (
          <>
            <View style={[styles.seeAllView, {marginTop: '4%'}]}>
              <RNText large bold>
                Upcoming Events
              </RNText>
              <Pressable
                onPress={() => _onPressNavigate(SCREEN_NAMES.UpcomingEvents)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <RNText style={{marginRight: 10}} medium bold>
                  See All
                </RNText>
                <RNImage
                  source={IMAGES.circleChevronRight}
                  style={{height: 15, width: 15}}
                />
              </Pressable>
            </View>

            <FlatList
              horizontal={false}
              data={upcomingEventUserData}
              contentContainerStyle={{
                paddingBottom: 5, // adjust the value as needed
              }}
              renderItem={({item, index}) => {
                const handlePress = (item: any) => {
                  _onPressNavigate(SCREEN_NAMES.UpcomingEventDetails, {
                    data: item,
                  });
                };

                const truncate = (str: any, max: any) => {
                  if (str?.length <= max) return str;
                  return str?.slice(0, max).trim() + '...';
                };
                return (
                  <Pressable
                    onPress={() => handlePress(item)}
                    style={styles.cardMainView}>
                    <RNImage
                      source={IMAGES.upcomingEventLayoutImage}
                      style={styles.upcomingLeftImage}
                    />
                    <View style={styles.textContainer}>
                      <RNText style={styles.upcomingLeftMonthText}>
                        {convertIntoMonth(item?.startDateTime, item?.timeZone)}
                      </RNText>
                      <RNText style={styles.upcomingLeftDateText}>
                        {convertIntoDate(item?.startDateTime, item?.timeZone)}
                      </RNText>
                    </View>
                    <View style={[styles.secondRowView]}>
                      <RNText style={[styles.upcomingEventText]} medium>
                        Upcoming Events
                      </RNText>
                      {/* <RNText textColor={COLORS.PRIMARY} style={{ right: 20, padding: 5 }} small bold>
                              {originalText && originalText.length > 20 ? truncatedText + ' ..' : originalText}
                            </RNText> */}
                      <RNText
                        textColor={COLORS.PRIMARY}
                        style={{right: 20, padding: 5}}
                        small
                        bold>
                        {truncate(item?.title, 20)}
                      </RNText>
                      <RNText style={styles.eventNameText} medium>
                        {
                          convertIntoTime(item?.startDateTime, item?.timeZone)
                            ?.formattedTime
                        }{' '}
                        -{' '}
                        {
                          convertIntoTime(item?.endDateTime, item?.timeZone)
                            ?.formattedTime
                        }
                      </RNText>
                    </View>
                    <View>
                      <RNText
                        TextAlignCenter
                        textColor={COLORS.PRIMARY}
                        style={[
                          styles.calendarInviteText,
                          {
                            width: scale(82),
                            right: scale(30),
                            fontSize: 10,
                            padding: 2,
                          },
                        ]}>
                        {item?.meetingType}
                      </RNText>
                    </View>
                  </Pressable>
                );
              }}
            />
          </>
        ) : null}
      </>
    );
  };

  // const pickFile = async () => {
  //   try {
  //     console.log('DocumentPicker object:', DocumentPicker);

  //     const res = await DocumentPicker.pickSingle({
  //       type: [
  //         types.pdf,
  //         types.doc,
  //         types.docx,
  //         types.plainText,
  //         types.audio,
  //         types.video
  //       ]
  //     });
  //     console.log('File details:', res);
  //   } catch (err: any) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('User cancelled file picker');
  //     } else {
  //       console.error('Error picking file:', err);
  //     }
  //   }
  // };

  const CountinueLearningView = () => {
    return (
      <>
        {countinueLearningLoading ? (
          <>
            <ShimmerPlaceHolder duration={2000} style={styles.seeAllView} />
            <FlatList
              horizontal={false}
              showsVerticalScrollIndicator={false}
              data={[1]}
              renderItem={({item, index}) => (
                <ShimmerPlaceHolder
                  duration={2000}
                  style={[
                    styles.cardMainView,
                    {height: scale(100), elevation: 0, borderRadius: 0},
                  ]}
                />
              )}
            />
          </>
        ) : (
          <>
            {countinueLearningData?.length != 0 ? (
              <>
                <View
                  style={[
                    styles.seeAllView,
                    {
                      marginTop:
                        upcomingEventUserData?.length != 0 ? '15%' : '7%',
                    },
                  ]}>
                  <RNText large bold>
                    Continue Learning
                  </RNText>
                  {countinueLearningData?.length < 3 ? null : (
                    <Pressable
                      onPress={() =>
                        _onPressNavigate(SCREEN_NAMES.CountinueSeeAllView)
                      }
                      style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RNText style={{marginRight: 10}} medium bold>
                        See All
                      </RNText>
                      <RNImage
                        source={IMAGES.circleChevronRight}
                        style={{height: 15, width: 15}}
                      />
                    </Pressable>
                  )}
                </View>
                <FlatList
                  horizontal={false}
                  data={countinueLearningData}
                  contentContainerStyle={{
                    paddingBottom: 5, // adjust the value as needed
                  }}
                  renderItem={({item, index}) => {
                    const playedTime = item?.playedTime || 0;
                    const duration = item?.duration || 0;
                    let courseProgressData =
                      item?.status === 'COMPLETED' ? 1 : playedTime / duration;
                    courseProgressData =
                      item?.status === 'IN_PROGRESS' && courseProgressData === 1
                        ? 0.99
                        : courseProgressData;
                    let courseProgressPercentage =
                      item?.status === 'COMPLETED'
                        ? 100
                        : (playedTime / duration) * 100;
                    courseProgressPercentage =
                      item?.status === 'IN_PROGRESS' &&
                      courseProgressPercentage >= 100
                        ? 99
                        : courseProgressPercentage;
                    const roundedPercentage =
                      Math.round(courseProgressPercentage * 10) / 10; // This gives 65.6
                    const courseFinalPercentage =
                      roundedPercentage % 1 >= 0.5
                        ? Math.ceil(roundedPercentage)
                        : Math.floor(roundedPercentage);

                    const flashcardProgressData =
                      item?.status === 'COMPLETED'
                        ? 1
                        : (playedTime / duration) * 0.5;
                    const flashcardProgressPercentage =
                      item?.status === 'COMPLETED'
                        ? 100
                        : (playedTime / duration) * 50;
                    const roundedPercentage2 =
                      Math.round(flashcardProgressPercentage * 10) / 10; // This gives 65.6
                    const flashFinalPercentage =
                      roundedPercentage2 % 1 >= 0.5
                        ? Math.ceil(roundedPercentage2)
                        : Math.floor(roundedPercentage2);

                    const spentDuration = item?.spentDuration ?? 0;
                    const pathProgressData =
                      item?.status === 'COMPLETED' ? 1 : spentDuration / 100;
                    const pathProgressPercentage =
                      item?.status === 'COMPLETED'
                        ? 100
                        : Math.floor(spentDuration);

                    const truncate = (str: any, max: any) => {
                      if (str?.length <= max) return str;
                      return str?.slice(0, max).trim() + '...';
                    };

                    return (
                      <Pressable
                        onPress={() => countinueLearningFunctionGo(item)}
                        style={styles.cardMainView}>
                        <View style={[styles.rowContainer, {padding: 0}]}>
                          {item?.bannerImageUrl ? (
                            <Image
                              source={
                                item?.bannerImageUrl
                                  ? {uri: item?.bannerImageUrl}
                                  : IMAGES.dummyFlashCard
                              }
                              style={styles.image}
                            />
                          ) : (
                            <View
                              style={[styles.image, {alignItems: 'center'}]}>
                              <RNText
                                style={{top: 40}}
                                small
                                textColor={COLORS.BORDER_COLOR}>
                                No Image
                              </RNText>
                              <RNText
                                style={{top: 40}}
                                small
                                textColor={COLORS.BORDER_COLOR}>
                                URL Found
                              </RNText>
                            </View>
                          )}
                          {/* <Image source={item?.bannerImageUrl ? { uri: item?.bannerImageUrl } : IMAGES.dummyFlashCard} style={styles.image} /> */}
                          <View
                            style={[styles.contentContainer, {paddingLeft: 6}]}>
                            <RNText
                              style={styles.labelText}
                              textColor={COLORS.GRAYTEXTCOLOR}
                              small
                              bold>
                              {item?.resourceType == 'LEARNINGCARD'
                                ? 'FLASHCARD'
                                : item?.resourceType || ''}
                            </RNText>
                            <RNText
                              style={styles.titleText}
                              textColor={COLORS.FALSHCARDTEXTCOLOR}
                              small
                              bold>
                              {truncate(item?.title, 20)}
                            </RNText>

                            <View style={styles.rowContainer}>
                              <RNImage
                                source={IMAGES.calendarCockCard}
                                style={styles.icon}
                              />
                              <RNText
                                style={styles.dateText}
                                textColor={COLORS.GRAYTEXTCOLOR}
                                small>
                                {convertDateIntoDay(item?.dueDate)
                                  ?.newConvertDate || ''}
                              </RNText>
                            </View>
                            <View style={styles.progressContainer}>
                              {item?.resourceType === 'COURSE' ||
                              item?.resourceType === 'SCORM' ? (
                                <>
                                  <Progress.Bar
                                    borderWidth={0}
                                    color="#4284F4"
                                    unfilledColor={'#EEEEEE'}
                                    progress={
                                      !isNaN(courseProgressData) &&
                                      courseProgressData !== null
                                        ? courseProgressData
                                        : 0
                                    }
                                    width={130}
                                  />
                                  <RNText
                                    style={styles.progressText}
                                    bold
                                    small>
                                    {!isNaN(courseFinalPercentage) &&
                                    courseFinalPercentage !== null
                                      ? courseFinalPercentage
                                      : 0}
                                    %
                                  </RNText>
                                </>
                              ) : item?.resourceType === 'LEARNINGCARD' ? (
                                <>
                                  <Progress.Bar
                                    borderWidth={0}
                                    color="#4284F4"
                                    unfilledColor={'#EEEEEE'}
                                    progress={flashcardProgressData}
                                    width={130}
                                  />
                                  <RNText
                                    style={styles.progressText}
                                    bold
                                    small>
                                    {flashFinalPercentage}%
                                  </RNText>
                                </>
                              ) : item?.resourceType === 'PATH' ? (
                                <>
                                  <Progress.Bar
                                    borderWidth={0}
                                    color="#4284F4"
                                    unfilledColor={'#EEEEEE'}
                                    progress={pathProgressData}
                                    width={130}
                                  />
                                  <RNText
                                    style={styles.progressText}
                                    bold
                                    small>
                                    {pathProgressPercentage}%
                                  </RNText>
                                </>
                              ) : null}
                            </View>
                          </View>
                        </View>
                        <Pressable onPress={() => RemoveFunction(item)}>
                          <Image
                            resizeMode="stretch"
                            source={IMAGES.circleXmark}
                            style={styles.closeIcon}
                          />
                        </Pressable>
                      </Pressable>
                    );
                  }}
                />
              </>
            ) : null}
          </>
        )}
      </>
    );
  };

  const ChartView = () => {
    return (
      <>
        {barChartLoading ? (
          <ShimmerPlaceHolder
            duration={2000}
            style={[
              styles.barChartMainView,
              {
                width: '109%',
                height: scale(250),
                elevation: 0,
                borderRadius: 0,
                paddingVertical: 0,
              },
            ]}
          />
        ) : (
          <>
            {barChartData?.length > 0 && (
              <View style={styles.barChartMainView}>
                <View style={{paddingVertical: 0, paddingBottom: 30}}>
                  <RNText large bold>
                    Progress Overview
                  </RNText>
                  {/* Progress Rate of Course/Path */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 15,
                      alignItems: 'center',
                      paddingLeft: 5,
                    }}>
                    <View
                      style={{
                        borderRadius: 2,
                        width: 12,
                        height: 12,
                        backgroundColor: COLORS.CHATCOLOR1,
                      }}
                    />
                    <RNText style={{marginLeft: 10}} small>
                      Course
                    </RNText>
                    <View
                      style={{
                        borderRadius: 2,
                        width: 12,
                        height: 12,
                        backgroundColor: COLORS.CHATCOLOR2,
                        marginLeft: 20,
                      }}
                    />
                    <RNText style={{marginLeft: 10}} small>
                      Path
                    </RNText>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.mainBoxStyleRow}>
                    <RNText
                      textColor={COLORS.TEXTCOLOR}
                      style={{fontWeight: '500', fontSize: 13}}>
                      Completed
                    </RNText>
                    <View style={styles.graphSmallTextView}>
                      <View style={styles.smallBoxRow}>
                        <RNImage
                          source={IMAGES.courseChartLine}
                          style={{height: 15, width: 15}}
                        />
                        <RNText
                          style={{marginLeft: 5, fontWeight: '500'}}
                          textColor={'#4284F3'}>
                          {barData[0]?.statusCounts[1]?.count || 0}
                        </RNText>
                      </View>

                      <View style={styles.graphSmallLine} />

                      <View style={[styles.smallBoxRow, {width: '45%'}]}>
                        <RNImage
                          source={IMAGES.pathChartLine}
                          style={{height: 15, width: 15}}
                        />
                        <RNText
                          style={{marginLeft: 5, fontWeight: '500'}}
                          textColor={'#6DCFF6'}>
                          {barData[2]?.statusCounts[1]?.count || 0}
                        </RNText>
                      </View>
                    </View>
                  </View>

                  <View style={styles.mainBoxStyleRow}>
                    <RNText
                      textColor={COLORS.TEXTCOLOR}
                      style={{fontWeight: '500', fontSize: 13}}>
                      In Progress
                    </RNText>
                    <View style={styles.graphSmallTextView}>
                      <View style={styles.smallBoxRow}>
                        <RNImage
                          source={IMAGES.courseChartLine}
                          style={{height: 15, width: 15}}
                        />
                        <RNText
                          style={{marginLeft: 5, fontWeight: '500'}}
                          textColor={'#4284F3'}>
                          {barData[0]?.statusCounts[2]?.count || 0}
                        </RNText>
                      </View>

                      <View style={styles.graphSmallLine} />

                      <View style={[styles.smallBoxRow, {width: '45%'}]}>
                        <RNImage
                          source={IMAGES.pathChartLine}
                          style={{height: 15, width: 15}}
                        />
                        <RNText
                          style={{marginLeft: 5, fontWeight: '500'}}
                          textColor={'#6DCFF6'}>
                          {barData[2]?.statusCounts[2]?.count || 0}
                        </RNText>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: '6%',
                    marginBottom: '3%',
                  }}>
                  <View style={styles.mainBoxStyleRow}>
                    <RNText
                      textColor={COLORS.TEXTCOLOR}
                      style={{fontWeight: '500', fontSize: 13}}>
                      Not Started
                    </RNText>
                    <View style={styles.graphSmallTextView}>
                      <View style={styles.smallBoxRow}>
                        <RNImage
                          source={IMAGES.courseChartLine}
                          style={{height: 15, width: 15}}
                        />
                        <RNText
                          style={{marginLeft: 5, fontWeight: '500'}}
                          textColor={'#4284F3'}>
                          {barData[0]?.statusCounts[3]?.count || 0}
                        </RNText>
                      </View>

                      <View style={styles.graphSmallLine} />

                      <View style={[styles.smallBoxRow, {width: '45%'}]}>
                        <RNImage
                          source={IMAGES.pathChartLine}
                          style={{height: 15, width: 15}}
                        />
                        <RNText
                          style={{marginLeft: 5, fontWeight: '500'}}
                          textColor={'#6DCFF6'}>
                          {barData[2]?.statusCounts[3]?.count || 0}
                        </RNText>
                      </View>
                    </View>
                  </View>

                  <View style={styles.mainBoxStyleRow}>
                    <RNText
                      textColor={COLORS.TEXTCOLOR}
                      style={{fontWeight: '500', fontSize: 13}}>
                      Overdue
                    </RNText>
                    <View style={styles.graphSmallTextView}>
                      <View style={styles.smallBoxRow}>
                        <RNImage
                          source={IMAGES.courseChartLine}
                          style={{height: 15, width: 15}}
                        />
                        <RNText
                          style={{marginLeft: 5, fontWeight: '500'}}
                          textColor={'#4284F3'}>
                          {barData[0]?.statusCounts[4]?.count || 0}
                        </RNText>
                      </View>

                      <View style={styles.graphSmallLine} />

                      <View style={[styles.smallBoxRow, {width: '45%'}]}>
                        <RNImage
                          source={IMAGES.pathChartLine}
                          style={{height: 15, width: 15}}
                        />
                        <RNText
                          style={{marginLeft: 5, fontWeight: '500'}}
                          textColor={'#6DCFF6'}>
                          {barData[2]?.statusCounts[4]?.count || 0}
                        </RNText>
                      </View>
                    </View>
                  </View>
                </View>
                {/* <BarChart
                    data={barData}
                    barWidth={15}
                    spacing={37}
                    roundedTop
                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: 'gray' }}
                    noOfSections={noOfSections}
                    xAxisLabelTextStyle={{ fontSize: 50 }}
                    maxValue={maxValue}
                  />
                  <RNText TextAlignCenter small style={{ marginTop: 15 }}>Number of Course/Path</RNText> */}
              </View>
            )}
          </>
        )}
      </>
    );
  };

  const CircleChartView = () => {
    const Labels = ({slices}: {slices: any}) => {
      return slices.map((slice: any, index: any) => {
        const {pieCentroid, data} = slice;
        return (
          <SVGText
            key={index}
            x={pieCentroid[0]}
            y={pieCentroid[1]}
            fill={'black'}
            textAnchor={'middle'}
            alignmentBaseline={'middle'}
            fontSize={14}
            stroke={'black'}
            strokeWidth={0.2}>
            {`${slice?.value || ''}`}
          </SVGText>
        );
      });
    };

    return (
      <>
        {pieChartLoading ? (
          <ShimmerPlaceHolder
            duration={2000}
            style={[
              styles.circleCardMainView,
              {
                width: '109%',
                height: scale(250),
                elevation: 0,
                borderRadius: 0,
                paddingVertical: 0,
              },
            ]}
          />
        ) : (
          <>
            {upcomingEventUserData?.length !== 0 ||
            pathListData?.length !== 0 ||
            flashCardListData?.length !== 0 ||
            courseListData?.length !== 0 ? (
              <View style={styles.circleCardMainView}>
                <View
                  style={{
                    paddingVertical: 0,
                    paddingBottom: 30,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <RNText large bold>
                    Success Rate
                  </RNText>
                  <Pressable
                    onPress={() => setPieChartBooleanHide(true)}
                    style={{
                      alignItems: 'center',
                      backgroundColor: COLORS.WHITE,
                      borderRadius: 50,
                      padding: 10,
                      elevation: 15,
                    }}>
                    <Image
                      source={IMAGES.chartFilter}
                      style={{width: 20, height: 18, top: 1}}
                    />
                  </Pressable>

                  {pieChartBooleanHide ? (
                    <View style={styles.menuContainer}>
                      <Pressable
                        onPress={() => menulistPieChartFunction('All')}>
                        <RNText small bold style={styles.menuItem}>
                          All
                        </RNText>
                      </Pressable>
                      <Pressable
                        onPress={() => menulistPieChartFunction('Course')}>
                        <RNText small bold style={styles.menuItem}>
                          Courses
                        </RNText>
                      </Pressable>
                      <Pressable
                        onPress={() => menulistPieChartFunction('Path')}>
                        <RNText small bold style={styles.menuItem}>
                          Paths
                        </RNText>
                      </Pressable>
                    </View>
                  ) : null}
                </View>

                {pieChartData[0]?.count != 0 || pieChartData[1]?.count != 0 ? (
                  <>
                    <View
                      style={{
                        width: 120,
                        marginTop: scale(140),
                        left: '23.7%',
                        position: 'absolute',
                        alignItems: 'center',
                        height: 20,
                      }}>
                      <RNText TextAlignCenter medium semiBold>
                        {pieChartStatus == 'All'
                          ? 'Courses/Paths'
                          : pieChartStatus == 'Path'
                          ? 'Paths'
                          : 'Courses'}
                      </RNText>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        position: 'relative',
                      }}>
                      <PieChart
                        style={{height: 200, width: 240}}
                        data={piadata}
                        innerRadius="60%"
                        padAngle={0}
                        startAngle={-Math.PI / 2}
                        endAngle={Math.PI / 2}>
                        <Labels slices={undefined} />
                      </PieChart>

                      {!pieChartBooleanHide ? (
                        <View>
                          <View style={styles.piaChartFlexDirection}>
                            <View style={styles.piaChartResultBox1} />
                            <RNText style={{marginLeft: 10}} small>
                              Passed
                            </RNText>
                          </View>
                          <View style={styles.piaChartFlexDirection}>
                            <View style={styles.piaChartResultBox} />
                            <RNText style={{marginLeft: 10}} small>
                              Failed
                            </RNText>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </>
                ) : (
                  <RNText
                    alignSelfCenter
                    style={{marginTop: scale(150), position: 'absolute'}}
                    bold
                    TextAlignCenter
                    textColor={COLORS.BORDER_COLOR}>
                    No results found
                  </RNText>
                )}
              </View>
            ) : null}
          </>
        )}
      </>
    );
  };

  const courseButtonFunction = (item: any) => {
    {
      if (item?.status == 'CANCELLED') {
        console.log('canel');
      } else if (item?.status == 'NOT_STARTED') {
        dispatch(storeCourseItemDataOnNavigationAction(item));
        _onPressNavigate(SCREEN_NAMES.CourseStack, {
          screen: SCREEN_NAMES.CoursePreview,
        });
      } else {
        dispatch(storeCourseItemDataOnNavigationAction(item));
        _onPressNavigate(SCREEN_NAMES.CourseStack, {
          screen: SCREEN_NAMES.MainCourse,
        });
      }
    }
  };

  const CourseView = () => {
    return (
      <>
        {isLoading ? (
          <>
            <ShimmerPlaceHolder duration={2000} style={styles.seeAllView} />
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={[1, 1, 1]}
              renderItem={({item, index}) => (
                <ShimmerPlaceHolder
                  duration={2000}
                  style={[
                    styles.horizontalMainCardView,
                    {
                      height: scale(250),
                      elevation: 0,
                      borderRadius: 0,
                      paddingBottom: 0,
                    },
                  ]}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 20}} />}
            />
          </>
        ) : (
          <>
            {courseListData?.length != 0 ? (
              <>
                <View style={styles.seeAllView}>
                  <RNText large bold>
                    Course
                  </RNText>
                  {courseListData?.length > 4 ? (
                    <Pressable
                      onPress={() =>
                        _onPressNavigate(SCREEN_NAMES.CourseSeeAllView)
                      }
                      style={styles.seeSecondView}>
                      <RNText style={{marginRight: 10}} medium bold>
                        See All
                      </RNText>
                      <RNImage
                        source={IMAGES.circleChevronRight}
                        style={{height: 15, width: 15}}
                      />
                    </Pressable>
                  ) : null}
                </View>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={courseListData}
                  contentContainerStyle={{
                    paddingBottom: 5, // adjust the value as needed
                  }}
                  renderItem={_courseRenderItem}
                  ItemSeparatorComponent={() => <View style={{width: 20}} />}
                />
              </>
            ) : null}
          </>
        )}
      </>
    );
  };

  const _courseRenderItem = ({item, index}: {item: any; index: any}) => {
    // const progressData = item?.playedTime / item?.duration;
    // const progressPercentage = Math.floor((item?.playedTime / item?.duration) * 100);
    const playedTime = item?.playedTime || 0;
    const duration = item?.duration || 0;
    let progressData = item?.status === 'COMPLETED' ? 1 : playedTime / duration;
    progressData =
      item?.status === 'IN_PROGRESS' && progressData === 1
        ? 0.99
        : progressData;
    let progressPercentage =
      item?.status === 'COMPLETED' ? 100 : (playedTime / duration) * 100;
    progressPercentage =
      item?.status === 'IN_PROGRESS' && progressPercentage >= 100
        ? 99
        : progressPercentage;
    const roundedPercentage = Math.round(progressPercentage * 10) / 10; // This gives 65.6
    const courseFinalPercentage =
      roundedPercentage % 1 >= 0.5
        ? Math.ceil(roundedPercentage)
        : Math.floor(roundedPercentage);

    const formattedDuration = formatDuration(item?.duration);
    const secondFormattedDuration = secondFormatDuration(item?.duration);
    const today = formatDate();

    const truncate = (str: any, max: any) => {
      if (str?.length <= max) return str;
      return str?.slice(0, max).trim() + '...';
    };

    return (
      <View style={styles.horizontalMainCardView}>
        <Pressable
          onPress={() => {
            dispatch(storeCourseItemDataOnNavigationAction(item));
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CoursePreview,
            });
          }}>
          {item?.bannerImageUrl ? (
            <Image
              source={
                item?.bannerImageUrl
                  ? {uri: item?.bannerImageUrl}
                  : IMAGES.dummyFlashCard
              }
              style={[
                styles.courseDummyImageStyle,
                {borderTopLeftRadius: 10, borderTopRightRadius: 10},
              ]}
            />
          ) : (
            <RNText
              style={[styles.courseDummyImageStyle, {top: 80}]}
              TextAlignCenter
              small
              textColor={COLORS.BORDER_COLOR}>
              No Image URL Found
            </RNText>
          )}
          {/* <View style={{backgroundColor:"red", padding:5, paddingHorizontal:10, borderRadius:5, position:"absolute"}}><RNText small textColor={COLORS.WHITE}>passed</RNText></View> */}
          {/* <Image source={item?.bannerImageUrl ? { uri: item?.bannerImageUrl } : IMAGES.dummyPathCard} style={styles.courseDummyImageStyle} /> */}
          <View
            style={[
              styles.rowContainer,
              {
                marginTop: 10,
                paddingLeft: scale(20),
                paddingRight: scale(10),
                justifyContent: 'space-between',
              },
            ]}>
            <View style={{flexDirection: 'row'}}>
              <RNImage source={IMAGES.calendarCockCard} style={styles.icon} />
              <RNText
                style={styles.dateText}
                textColor={COLORS.GRAYTEXTCOLOR}
                small>
                {convertDateIntoDay(item?.dueDate)?.newConvertDate || ''}
              </RNText>
            </View>

            {item.dueDate.split('T')[0] < today &&
            item.status?.toLowerCase() !== 'completed' ? (
              <View
                style={{
                  backgroundColor: 'red',
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  marginLeft: 3,
                }}>
                <RNText TextAlignCenter small textColor={COLORS.WHITE}>
                  Overdue
                </RNText>
              </View>
            ) : item.status?.toLowerCase() == 'completed' &&
              item?.isPassed != null &&
              item?.isPassed !== undefined ? (
              <View
                style={{
                  backgroundColor: item?.isPassed ? COLORS.GREEN : COLORS.RED,
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  marginLeft: 3,
                }}>
                <RNText TextAlignCenter small textColor={COLORS.WHITE}>
                  {item?.isPassed ? 'Passed' : 'Failed'}
                </RNText>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: COLORS.TRANSPARENT,
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  marginLeft: 3,
                }}>
                <RNText TextAlignCenter small textColor={COLORS.WHITE}>
                  {''}
                </RNText>
              </View>
            )}
          </View>
          <RNText style={styles.courseViewText} medium semiBold>
            {truncate(item?.title, 27)}
          </RNText>
          {/* <RNTextScrollable
            medium
            semiBold
            style={styles.courseViewText}
            duration={20000}
            loop
            onPress={() => courseButtonFunction(item)}
          >
            {item?.title || ""}
          </RNTextScrollable> */}

          {/* <View style={[styles.courseLabelContainer, { paddingHorizontal: 10, marginLeft: scale(20) }]}>
            <RNText textColor={COLORS.TEXTCOLOR} small semiBold>{item?.department || ""}</RNText>
          </View> */}
          <View
            style={[
              styles.courseViewSmallText,
              {
                paddingLeft:
                  item?.resourceType == 'SCORM' ? scale(10) : scale(10),
              },
            ]}>
            <RNText textColor={COLORS.GRAYTEXTCOLOR} small>
              {item?.resourceType == 'SCORM'
                ? ''
                : `${item?.materialCount || 0} Material`}
            </RNText>
            <View style={styles.courseViewSmallCircle} />
            <RNText
              style={{marginLeft: 3}}
              textColor={COLORS.GRAYTEXTCOLOR}
              small>
              {item?.chapterCount || 0} Chapter
            </RNText>
            <View style={styles.courseViewSmallCircle} />
            <RNText
              style={{marginLeft: 3}}
              textColor={COLORS.GRAYTEXTCOLOR}
              small>
              {item?.resourceType == 'SCORM'
                ? ' ' + formattedDuration
                : ' ' + secondFormattedDuration}
            </RNText>
          </View>

          <View
            style={[
              styles.progressContainer,
              {paddingLeft: scale(20), marginTop: 7, width: '87%'},
            ]}>
            <Progress.Bar
              borderWidth={0}
              color="#4284F4"
              unfilledColor={'#EEEEEE'}
              progress={
                isNaN(progressData) ||
                progressData === null ||
                progressData === undefined
                  ? 0
                  : progressData
              }
              width={Platform.OS === 'android' ? scale(160) : scale(150)}
            />
            <RNText style={styles.progressText} bold small>
              {isNaN(courseFinalPercentage) ||
              courseFinalPercentage === null ||
              courseFinalPercentage === undefined
                ? 0
                : courseFinalPercentage}
              %
            </RNText>
          </View>
        </Pressable>

        <RNButton
          textColor={
            item?.status == 'IN_PROGRESS'
              ? COLORS.PRIMARY
              : item?.status == 'COMPLETED'
              ? COLORS.PRIMARY
              : item?.status == 'CANCELLED'
              ? COLORS.PRIMARY
              : COLORS.WHITE
          }
          title={
            item?.status == 'IN_PROGRESS'
              ? STRINGS.continue
              : item?.status == 'COMPLETED'
              ? 'Completed (Replay)'
              : item?.status == 'CANCELLED'
              ? 'Cancelled'
              : STRINGS.start
          }
          minHeightButton={true}
          disabled={item?.status == 'CANCELLED'}
          style={styles.courseButtonStyle}
          backgroundColor={
            item?.status == 'IN_PROGRESS'
              ? COLORS.DULLBUTTONCOLOR
              : item?.status == 'COMPLETED'
              ? COLORS.DULLBUTTONCOLOR
              : item?.status == 'CANCELLED'
              ? COLORS.DULLBUTTONCOLOR
              : COLORS.SECONDARY
          }
          onPress={() => courseButtonFunction(item)}
        />
      </View>
    );
  };

  const FlashCardView = () => {
    return (
      <>
        {isLoading ? (
          <>
            <ShimmerPlaceHolder duration={2000} style={styles.seeAllView} />
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={[1, 1, 1]}
              renderItem={({item, index}) => (
                <ShimmerPlaceHolder
                  duration={2000}
                  style={[
                    styles.horizontalMainCardView,
                    {
                      height: scale(230),
                      elevation: 0,
                      borderRadius: 0,
                      paddingBottom: 0,
                    },
                  ]}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 20}} />}
            />
          </>
        ) : (
          <>
            {flashCardListData?.length != 0 ? (
              <>
                <View style={styles.seeAllView}>
                  <RNText large bold>
                    Flashcard
                  </RNText>
                  {flashCardListData?.length > 4 ? (
                    <Pressable
                      onPress={() =>
                        _onPressNavigate(SCREEN_NAMES.FlashCardSeeAllView)
                      }
                      style={styles.seeSecondView}>
                      <RNText style={{marginRight: 10}} medium bold>
                        See All
                      </RNText>
                      <RNImage
                        source={IMAGES.circleChevronRight}
                        style={{height: 15, width: 15}}
                      />
                    </Pressable>
                  ) : null}
                </View>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={flashCardListData}
                  contentContainerStyle={{
                    paddingBottom: 5, // adjust the value as needed
                  }}
                  renderItem={_flashCardRenderItem}
                  ItemSeparatorComponent={() => <View style={{width: 20}} />}
                />
              </>
            ) : null}
          </>
        )}
      </>
    );
  };

  const _flashCardRenderItem = ({item, index}: {item: any; index: any}) => {
    // const progressData = item?.playedTime / item?.duration * 0.5;
    // const progressPercentage = Math.floor((item?.playedTime / item?.duration) * 50);
    const playedTime = item?.playedTime || 0;
    const duration = item?.duration || 0;

    const progressData =
      item?.status === 'COMPLETED' ? 1 : (playedTime / duration) * 0.5;
    const progressPercentage =
      item?.status === 'COMPLETED' ? 100 : (playedTime / duration) * 50;
    const roundedPercentage = Math.round(progressPercentage * 10) / 10; // This gives 65.6
    const courseFinalPercentage =
      roundedPercentage % 1 >= 0.5
        ? Math.ceil(roundedPercentage)
        : Math.floor(roundedPercentage);

    const today = formatDate();

    const truncate = (str: any, max: any) => {
      if (str?.length <= max) return str;
      return str?.slice(0, max).trim() + '...';
    };

    return (
      <View style={[styles.horizontalMainCardView, {width: 230}]}>
        <Pressable
          onPress={() =>
            _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
              screen: SCREEN_NAMES.FlashCardPreview,
              params: {
                data: item,
              },
            })
          }>
          {item?.bannerImageUrl ? (
            <Image
              source={
                item?.bannerImageUrl
                  ? {uri: item?.bannerImageUrl}
                  : IMAGES.dummyFlashCard
              }
              style={[styles.courseDummyImageStyle, {width: 230}]}
            />
          ) : (
            <RNText
              style={[styles.courseDummyImageStyle, {width: 230, top: 80}]}
              TextAlignCenter
              small
              textColor={COLORS.BORDER_COLOR}>
              No Image URL Found
            </RNText>
          )}
          <View
            style={[
              styles.rowContainer,
              {
                marginTop: 10,
                paddingLeft: scale(20),
                paddingRight: scale(10),
                justifyContent: 'space-between',
              },
            ]}>
            <View style={{flexDirection: 'row'}}>
              <RNImage source={IMAGES.calendarCockCard} style={styles.icon} />
              <RNText
                style={styles.dateText}
                textColor={COLORS.GRAYTEXTCOLOR}
                small>
                {convertDateIntoDay(item?.dueDate)?.newConvertDate || ''}
              </RNText>
            </View>
            {item.dueDate.split('T')[0] < today &&
            item.status?.toLowerCase() !== 'completed' ? (
              <View
                style={{
                  backgroundColor: 'red',
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  marginLeft: 3,
                }}>
                <RNText TextAlignCenter small textColor={COLORS.WHITE}>
                  Overdue
                </RNText>
              </View>
            ) : item.status?.toLowerCase() == 'completed' &&
              item?.isPassed != null &&
              item?.isPassed !== undefined ? (
              <View
                style={{
                  backgroundColor: item?.isPassed ? COLORS.GREEN : COLORS.RED,
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  marginLeft: 3,
                }}>
                <RNText TextAlignCenter small textColor={COLORS.WHITE}>
                  {item?.isPassed ? 'Passed' : 'Failed'}
                </RNText>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: COLORS.TRANSPARENT,
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  marginLeft: 3,
                }}
              />
            )}
          </View>
          <RNText style={styles.courseViewText} medium semiBold>
            {truncate(item?.title, 20)}
          </RNText>

          {/* <RNTextScrollable
            medium
            semiBold
            style={styles.courseViewText}
            duration={20000}
            loop
            onPress={() => console.log('Text pressed')}
          >
            {item?.title || ""}
          </RNTextScrollable> */}

          <View
            style={[
              styles.courseViewSmallText,
              {
                width: 205,
                alignItems: 'center',
                marginRight: scale(20),
                justifyContent: 'space-between',
              },
            ]}>
            <RNText textColor={COLORS.GRAYTEXTCOLOR} small>
              {item?.cardCount || 0} {item?.cardCount == 1 ? 'Card' : 'Cards'}
            </RNText>
            {/* <View style={styles.courseLabelContainer}>
              <RNText textColor={COLORS.TEXTCOLOR} small semiBold>{item?.department || ""}</RNText>
            </View> */}
          </View>

          <View
            style={[
              styles.progressContainer,
              {paddingLeft: scale(20), marginTop: 7},
            ]}>
            <Progress.Bar
              borderWidth={0}
              color="#4284F4"
              unfilledColor={'#EEEEEE'}
              progress={progressData ? progressData : 0}
              //width={Platform.OS === "android" ? scale(120) : scale(110)}
            />
            <RNText style={styles.progressText} bold small>
              {!Number.isNaN(courseFinalPercentage) || courseFinalPercentage
                ? courseFinalPercentage
                : 0}
              %
            </RNText>
          </View>
        </Pressable>
        <RNButton
          onPress={() => {
            if (item?.status == 'CANCELLED') {
              console.log('canel');
            } else if (item?.status == 'NOT_STARTED') {
              _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
                screen: SCREEN_NAMES.FlashCardPreview,
                params: {
                  data: item,
                },
              });
            } else {
              _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
                screen: SCREEN_NAMES.MainFlashCard,
                params: {
                  data: item,
                },
              });
            }
          }}
          textColor={
            item?.status == 'IN_PROGRESS'
              ? COLORS.PRIMARY
              : item?.status == 'COMPLETED'
              ? COLORS.PRIMARY
              : item?.status == 'CANCELLED'
              ? COLORS.PRIMARY
              : COLORS.WHITE
          }
          title={
            item?.status == 'IN_PROGRESS'
              ? STRINGS.continue
              : item?.status == 'COMPLETED'
              ? 'Completed (Replay)'
              : item?.status == 'CANCELLED'
              ? 'Cancelled'
              : STRINGS.start
          }
          minHeightButton={true}
          disabled={item?.status == 'CANCELLED'}
          style={styles.courseFlashcardButtonStyle}
          backgroundColor={
            item?.status == 'IN_PROGRESS'
              ? COLORS.DULLBUTTONCOLOR
              : item?.status == 'COMPLETED'
              ? COLORS.DULLBUTTONCOLOR
              : item?.status == 'CANCELLED'
              ? COLORS.DULLBUTTONCOLOR
              : COLORS.SECONDARY
          }
        />
      </View>
    );
  };

  const PathView = () => {
    return (
      <>
        {isLoading ? (
          <>
            <ShimmerPlaceHolder duration={2000} style={styles.seeAllView} />
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={[1, 1, 1]}
              renderItem={({item, index}) => (
                <ShimmerPlaceHolder
                  duration={2000}
                  style={[
                    styles.horizontalMainCardView,
                    {
                      height: scale(230),
                      elevation: 0,
                      borderRadius: 0,
                      paddingBottom: 0,
                    },
                  ]}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 20}} />}
            />
          </>
        ) : (
          <>
            {pathListData?.length != 0 ? (
              <>
                <View style={styles.seeAllView}>
                  <RNText large bold>
                    Path
                  </RNText>
                  {pathListData?.length > 4 ? (
                    <Pressable
                      onPress={() =>
                        _onPressNavigate(SCREEN_NAMES.PathSeeAllView)
                      }
                      style={styles.seeSecondView}>
                      <RNText style={{marginRight: 10}} medium bold>
                        See All
                      </RNText>
                      <RNImage
                        source={IMAGES.circleChevronRight}
                        style={{height: 15, width: 15}}
                      />
                    </Pressable>
                  ) : null}
                </View>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={pathListData}
                  contentContainerStyle={{
                    paddingBottom: 5, // adjust the value as needed
                  }}
                  renderItem={_pathCardRenderItem}
                  ItemSeparatorComponent={() => <View style={{width: 20}} />}
                />
              </>
            ) : null}
          </>
        )}
      </>
    );
  };

  const _pathCardRenderItem = ({item, index}: {item: any; index: any}) => {
    // const progressData = item?.spentDuration / 100;
    // const progressPercentage = Math.floor(item?.spentDuration);
    const spentDuration = item?.spentDuration || 0;

    const progressData = item?.status === 'COMPLETED' ? 1 : spentDuration / 100;
    const progressPercentage =
      item?.status === 'COMPLETED' ? 100 : Math.floor(spentDuration);
    const today = formatDate();

    const truncate = (str: any, max: any) => {
      if (str?.length <= max) return str;
      return str?.slice(0, max).trim() + '...';
    };

    return (
      <Pressable style={styles.horizontalMainCardView}>
        {item?.bannerImageUrl ? (
          <Image
            source={
              item?.bannerImageUrl
                ? {uri: item?.bannerImageUrl}
                : IMAGES.dummyFlashCard
            }
            style={[
              styles.courseDummyImageStyle,
              {borderTopLeftRadius: 10, borderTopRightRadius: 10},
            ]}
          />
        ) : (
          <RNText
            style={[styles.courseDummyImageStyle, {top: 80}]}
            TextAlignCenter
            small
            textColor={COLORS.BORDER_COLOR}>
            No Image URL Found
          </RNText>
        )}
        <View
          style={[
            styles.rowContainer,
            {
              marginTop: 10,
              paddingLeft: scale(20),
              paddingRight: scale(10),
              justifyContent: 'space-between',
            },
          ]}>
          <View style={{flexDirection: 'row'}}>
            <RNImage source={IMAGES.calendarCockCard} style={styles.icon} />
            <RNText
              style={styles.dateText}
              textColor={COLORS.GRAYTEXTCOLOR}
              small>
              {convertDateIntoDay(item?.dueDate)?.newConvertDate || ''}
            </RNText>
          </View>
          {item.dueDate.split('T')[0] < today &&
          item.status?.toLowerCase() !== 'completed' ? (
            <View
              style={{
                backgroundColor: 'red',
                padding: 3,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginLeft: 3,
              }}>
              <RNText TextAlignCenter small textColor={COLORS.WHITE}>
                Overdue
              </RNText>
            </View>
          ) : item.status?.toLowerCase() == 'completed' &&
            item?.isPassed != null &&
            item?.isPassed !== undefined ? (
            <View
              style={{
                backgroundColor: item?.isPassed ? COLORS.GREEN : COLORS.RED,
                padding: 3,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginLeft: 3,
              }}>
              <RNText TextAlignCenter small textColor={COLORS.WHITE}>
                {item?.isPassed ? 'Passed' : 'Failed'}
              </RNText>
            </View>
          ) : null}
        </View>
        {/* <RNText style={styles.courseViewText} medium semiBold>
          {item?.title.length > 20
            ? item?.title.slice(0, 20) + '..'
            : item?.title || ''}
        </RNText> */}
        <RNText style={styles.courseViewText} medium semiBold>
          {truncate(item?.title, 27)}
        </RNText>

        {/* <RNTextScrollable
          medium
          semiBold
          style={styles.courseViewText}
          duration={20000}
          loop
          onPress={() => console.log('Text pressed')}
        >
          {item?.title || ""}
        </RNTextScrollable> */}

        <View style={[styles.courseViewSmallText1]}>
          <View style={styles.pathSmallTextView}>
            <RNText style={{width: 90}} textColor={COLORS.GRAYTEXTCOLOR} small>
              {item?.classroomCount || 0} Classroom
            </RNText>
            <View style={styles.lineView} />
            <RNText
              style={{marginLeft: 10}}
              textColor={COLORS.GRAYTEXTCOLOR}
              small>
              {item?.examCount || 0} Exam
            </RNText>
          </View>

          <View style={styles.courseViewSmallViewSecond}>
            <RNText style={{width: 90}} textColor={COLORS.GRAYTEXTCOLOR} small>
              {item?.learningCardCount || 0} Flashcard
            </RNText>
            <View style={styles.lineView} />
            <RNText
              style={{marginLeft: 10}}
              textColor={COLORS.GRAYTEXTCOLOR}
              small>
              {item?.courseCount || 0} Course
            </RNText>
          </View>
        </View>

        <View
          style={[
            styles.progressContainer,
            {paddingLeft: scale(20), marginTop: 7, width: '87%'},
          ]}>
          <Progress.Bar
            borderWidth={0}
            color="#4284F4"
            unfilledColor={'#EEEEEE'}
            progress={
              isNaN(progressData) ||
              progressData === null ||
              progressData === undefined
                ? 0
                : progressData
            }
            width={Platform.OS === 'android' ? scale(160) : scale(150)}
          />
          <RNText style={styles.progressText} bold small>
            {progressPercentage}%
          </RNText>
        </View>

        <RNButton
          textColor={
            item?.status == 'IN_PROGRESS'
              ? COLORS.PRIMARY
              : item?.status == 'COMPLETED'
              ? COLORS.PRIMARY
              : item?.status == 'CANCELLED'
              ? COLORS.PRIMARY
              : COLORS.WHITE
          }
          title={
            item?.status == 'IN_PROGRESS'
              ? STRINGS.continue
              : item?.status == 'COMPLETED'
              ? 'Completed (Replay)'
              : item?.status == 'CANCELLED'
              ? 'Cancelled'
              : STRINGS.start
          }
          minHeightButton={true}
          disabled={item?.status == 'CANCELLED'}
          style={styles.courseButtonStyle}
          backgroundColor={
            item?.status == 'IN_PROGRESS'
              ? COLORS.DULLBUTTONCOLOR
              : item?.status == 'COMPLETED'
              ? COLORS.DULLBUTTONCOLOR
              : item?.status == 'CANCELLED'
              ? COLORS.DULLBUTTONCOLOR
              : COLORS.SECONDARY
          }
          onPress={() => {
            dispatch(storeCourseItemDataOnNavigationAction(item));
            dispatch(storePathItemDataOnNavigationAction(item));
            _onPressNavigate(SCREEN_NAMES.PathStack, {
              screen: SCREEN_NAMES.MainPath,
            });
          }}
        />
      </Pressable>
    );
  };

  // useEffect(() => {
  //   const isDataEmpty =
  //   !upcomingEventUserData?.length &&
  //   !pathListData?.length &&
  //   !flashCardListData?.length &&
  //   !courseListData?.length
  //   if (isDataEmpty) {
  //     const timer = setTimeout(() => {
  //       setShouldLoadFreshUserScreen(true);
  //     }, 0);
  //     return () => clearTimeout(timer);
  //   }
  //   else {
  //     setShouldLoadFreshUserScreen(false);
  //   }
  // }, [
  //   upcomingEventUserData,
  //   pathListData,
  //   flashCardListData,
  //   courseListData
  // ]);

  const FreshUserHomeScreen = () => {
    const hasNoData =
      !upcomingEventUserData?.length &&
      !pathListData?.length &&
      !flashCardListData?.length &&
      !courseListData?.length &&
      !upcomingEventLoading &&
      !barChartLoading &&
      !isLoading &&
      !countinueLearningLoading &&
      !pieChartLoading;

    if (!hasNoData) {
      return null;
    }

    return (
      <View>
        {/* <Image
          source={IMAGES.GroupImage}
          style={{
            width: scale(170),
            height: scale(170),
            alignSelf: "center",
            marginTop: scale(50),
            marginBottom: scale(70)
          }}
        /> */}
        <Image
          source={require('../../../assets/images/FreshUserNoDataImage.gif')}
          style={{
            width: scale(170),
            height: scale(170),
            alignSelf: 'center',
            marginTop: scale(50),
            marginBottom: scale(70),
          }}
          resizeMode="cover"
        />
        <View style={{width: scale(350), alignSelf: 'center'}}>
          <RNText
            semiBold
            TextAlignCenter
            textColor={COLORS.TEXTCOLOR}
            extraLarge>
            Welcome to your learning platform
          </RNText>
          <RNText
            style={{marginTop: 10, padding: 3}}
            semiBold
            TextAlignCenter
            textColor={COLORS.BORDER_COLOR}
            medium>
            Learn anytime, anywhere. To browse or enroll in courses, please
            visit our website
          </RNText>
        </View>
        <RNButton
          textColor={COLORS.WHITE}
          title="Browse on Website"
          minHeightButton={true}
          textStyle={{fontSize: 12, fontWeight: '100'}}
          style={{width: scale(240), marginTop: scale(40)}}
          backgroundColor={COLORS.SECONDARY}
          onPress={() => Linking.openURL('https://appdev.leveluplms.com/')}
        />
      </View>
    );
  };

  const shouldRenderChartView = !barChartData?.every((item: any) =>
    item?.statusCounts?.every((statusCount: any) => statusCount?.count === 0),
  );
  const headerName = `Hi, ${getProfileData?.firstName || ''}`;
  // getSettingData?.gamification
  return (
    <RNContainer
      style={{backgroundColor: COLORS.MAINBACKGROUNDCOLOR}}
      // onPressCalnderHeader={() => _onPressNavigate(SCREEN_NAMES.UpcomingEvents)}
      onPressAchivementHeader={() => _onPressNavigate(SCREEN_NAMES.Achivement)}
      onPressLeaderBoaderHeader={() =>
        _onPressNavigate(SCREEN_NAMES.LeaderBoard)
      }
      Points={gamificationPointData?.points || 0}
      leftComponent={
        <Pressable
          onPress={() => _onPressNavigate(SCREEN_NAMES.Profile)}
          style={{
            marginLeft: 5,
            marginRight: 10,
            borderWidth: 1,
            borderColor: COLORS.WHITE,
            borderRadius: 50,
            padding: 6,
          }}>
          <Image
            borderRadius={40}
            resizeMode={'cover'}
            source={
              getProfileData?.imageUrl
                ? {uri: getProfileData?.imageUrl}
                : IMAGES.headerProfileDummyIcon
            }
            style={{width: 16, height: 16}}
          />
        </Pressable>
      }
      showsVerticalScrollIndicator={false}
      back={false}
      title={
        headerName?.trimEnd().length > 19
          ? headerName.trimEnd().slice(0, 19) + '..'
          : headerName
      }
      // title={headerName?.length > 27 ? headerName?.slice(0, 27) + "..." : headerName}
      calnderHeader={getSettingData?.leaderboard}
      scroll
      scrollViewRef={scrollViewRef}
      onRefresh={handleRefresh}
      hideBackgroundImage>
      {UpcomingEventView()}
      {CountinueLearningView()}
      <TouchableOpacity
        style={{padding: 15, backgroundColor: 'red'}}
        onPress={() => pickFile()}>
        <Text>Button</Text>
      </TouchableOpacity>
      {shouldRenderChartView && ChartView()}
      {CircleChartView()}
      {CourseView()}
      {FlashCardView()}
      {PathView()}
      {FreshUserHomeScreen()}
      {removeCountinueItemModal()}
    </RNContainer>
  );
};

export default Home;
