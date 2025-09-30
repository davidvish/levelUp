import React, { useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import { RNContainer, RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES } from '../../../constants';
import { scale } from 'react-native-size-matters';
import { _onPressNavigate } from '../../../utils/commonFunction';
import { SCREEN_NAMES } from '../../../config';
import { useDispatch } from 'react-redux';
import { upcomingEventsRequestAction } from '../Home/module/action';
import { homeScreenSelector } from '../Home/module/reducer';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
import moment from 'moment-timezone';

function convertIntoTime(time: string, timeZone: string): { formattedTime: string; timestamp: number } {
  const timeInTimezone = moment.tz(time, timeZone);
  const systemTimezone = moment.tz.guess();
  const timeInSystemTimezone = timeInTimezone.clone().tz(systemTimezone);

  const formattedTime = timeInSystemTimezone.format('HH:mm');
  const timestamp = timeInSystemTimezone.valueOf(); // Returns the timestamp in milliseconds

  return { formattedTime, timestamp };
}

function convertIntoMonth(time: string,timeZone: string): any {
  const timeInJapanTimezone = moment.tz(time, timeZone);
   const systemTimezone = moment.tz.guess();
   const timeInSystemTimezone = timeInJapanTimezone.clone().tz(systemTimezone);
   const formatedMonth = timeInSystemTimezone.format('MMM');
   return formatedMonth
  }
  function convertIntoDate(time: string,timeZone: string): any{
    const currentTimezone = moment.tz(time, 'YYYY-MM-DD HH:mm', timeZone).toDate();
    const formattedDate = moment(currentTimezone).format('DD');
    return formattedDate;
  }

type UpcomingEvent = {
  endDateTime: string;
  startDateTime: string;
  title: string;
  meetingType: string
  timeZone: string
  // Define other properties if needed
};

const UpcomingEvents: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const { upcomingEventUserData, upcomingEventLoading } = homeScreenSelector();
  const [upcomingListData, setUpcomingListData] = useState<any>([]);

  useEffect(() => {
    upcomingEventFunction();
  }, []);

  const upcomingEventFunction = () => {
    let body = {
      PageSize: 50,
      PageNumber: 1,
      orderBy: 'startDateTime',
      sortOrder: 'asc',
    };
    dispatch(upcomingEventsRequestAction({ body }));
  };

  useEffect(() => {
    if (upcomingEventUserData && upcomingEventUserData.length !== 0) {
      setUpcomingListData([...upcomingEventUserData]);
    }
  }, [upcomingEventUserData]);

  const UpcomingEventsListView = () => {
    const handlePress = (item: any) => {
      _onPressNavigate(SCREEN_NAMES.UpcomingEventDetails, {
        data: item
      });
    };
    return (
      <>
        {upcomingEventLoading ?
          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={[1, 1, 1]}
            renderItem={({ item, index }) => (
              <ShimmerPlaceHolder duration={2000} style={[styles.cardMainView, { height: scale(100), elevation: 0, borderRadius: 0, marginTop: 30 }]} />
            )} />
          :
          <View>
            {upcomingListData.length === 0 ? (
              <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <RNImage source={IMAGES.missingDocument} style={{height:40, width:40, marginBottom:10}}/>
                <RNText textColor={COLORS.BORDER_COLOR} extraLarge>
                  No record found
                </RNText>
              </View>
            ) : ( 
              <FlatList
                data={upcomingListData}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 5 // adjust the value as needed
                }}
                renderItem={({ item, index }: { item: UpcomingEvent; index: number }) => {
                  if (!item) {
                    // If item is null or undefined, you might want to return null or a placeholder
                    return null; // or a <Text>No upcoming events</Text>
                  }

                  const time1 = convertIntoTime(item.startDateTime, item.timeZone);
                  const time2 = convertIntoTime(item.endDateTime, item.timeZone);
                  const hasDate = convertIntoDate(item?.startDateTime, item.timeZone);
                  const hasMonth = convertIntoMonth(item?.startDateTime, item.timeZone);

                  return ( // Use return statement to return the JSX
                    <Pressable onPress={() => handlePress(item)} style={styles.cardMainView}>
                      <View style={styles.rightContainerView}>
                        <RNText textColor={COLORS.TEXTCOLORBG} large semiBold>
                          {hasMonth}
                        </RNText>
                        <RNText textColor={COLORS.TEXTCOLORBG} extraLarge semiBold>
                          {hasDate}
                        </RNText>
                      </View>
                      <View style={{ padding: 10, width: "100%", justifyContent: "space-between" }}>
                        <RNText textColor={COLORS.GRAYTEXTCOLOR} small>{item.meetingType}</RNText>
                        <RNText style={styles.eventText} textColor={COLORS.TEXTCOLOR} medium>
                          {item?.title || ""}
                        </RNText>
                        <View style={styles.leftContainerView}>
                          <RNImage source={IMAGES.EventClock} style={styles.circleImage} />
                          <RNText style={{ marginLeft: 10, paddingBottom: 10 }} textColor={COLORS.GRAYTEXTCOLOR} small>
                            {time1.formattedTime} - {time2.formattedTime}
                          </RNText>
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        }
      </>
    );
  };

  return (
    <RNContainer
      style={{ backgroundColor: COLORS.MAINBACKGROUNDCOLOR }}
      back={true}
      title={'Event'}
      titleMarginRight={true}
      hideBackgroundImage Points={undefined}>
      {UpcomingEventsListView()}
    </RNContainer>
  );
};

export default UpcomingEvents;
const styles = StyleSheet.create({
  cardMainView: {
    width: '98%',
    marginTop: '5%',
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 10,
    elevation: COLORS.ELEVATION,
    position: 'relative',
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },

  rightContainerView: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    width: '30%',
    backgroundColor: COLORS.EVENTDATECOLOR,
    paddingVertical: 40,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  leftContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    //paddingTop: 13,
  },
  circleImage: {
    width: 16,
    height: 16,
    marginBottom: 10
  },
  eventText: {
    width: '65%',
    //paddingTop: 13,
  },
});
