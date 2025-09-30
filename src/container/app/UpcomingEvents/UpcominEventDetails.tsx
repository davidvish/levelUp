import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, View, useWindowDimensions } from 'react-native';
import { FlatList, Pressable } from 'react-native';
import { RNButton, RNContainer, RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import RenderHTML from 'react-native-render-html';
import { useDispatch } from 'react-redux';
import { upcomingEventDetailsSelector } from './module/reducer';
import { upcomingEventDetailsRequestAction } from './module/action';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
import moment from 'moment-timezone';

// const tagsStyles = {
//   p: { color: 'blue' },
//   strong: { color: 'red' }
// };

function formatDate(dateString: any) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const formattedDate = `${day} ${months[monthIndex]} ${year}`;
  return formattedDate;
}

// function formatTime(timeString: any) {
//   const date = new Date(timeString);
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   const formattedHours = hours % 12 || 12; // Convert 0 to 12
//   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//   const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
//   return formattedTime;
// }

function convertIntoTime(time: string, timeZone: string): { formattedTime: string; timestamp: number } {
  const timeInTimezone = moment.tz(time, timeZone); // Create moment object in the specified timezone
  const systemTimezone = moment.tz.guess(); // Get the system's timezone
  const timeInSystemTimezone = timeInTimezone.clone().tz(systemTimezone); // Convert to system timezone

  const formattedTime = timeInSystemTimezone.format('hh:mm A'); // Use 'hh:mm A' for 12-hour format with AM/PM
  const timestamp = timeInSystemTimezone.valueOf(); // Returns the timestamp in milliseconds

  return { formattedTime, timestamp }; // Return the formatted time and timestamp
}

// Example usage
//const timeData = convertIntoTime("2024-10-05T20:00:08", "Asia/Calcutta");

const UpcomingEventDetails: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const hasParamData = props?.route?.params?.data || [];
  const { upcomingEventDetailsData, upcomingEventDetailsLoading } = upcomingEventDetailsSelector();
  // const [upcomingEventDetails, setUpcomingEventDetails] = useState(
  //   props?.route?.params?.data || []
  // );

  useEffect(() => {
    upcomingEventDetailsFunction();
  }, [])

  const upcomingEventDetailsFunction = () => {
    const body = {
      id: hasParamData?.id || "",
    };
    dispatch(upcomingEventDetailsRequestAction({ body }));
  }

  useEffect(() => {
    console.log(upcomingEventDetailsData, "upcomingEventDetailsData")
  }, [upcomingEventDetailsData])


  const EventHadingView = () => {
    const time1 = convertIntoTime(upcomingEventDetailsData?.startDateTime, upcomingEventDetailsData?.timeZone);
    const time2 = convertIntoTime(upcomingEventDetailsData?.endDateTime, upcomingEventDetailsData?.timeZone);
    const defaultStyles = {
      color: '#000000', // Set your desired default color here
    };

    return (
      <>
        {!upcomingEventDetailsData?.title ?
          <ShimmerPlaceHolder duration={2000} style={[styles.eventHeadingContainer, { height: 50, paddingHorizontal: 0, width: "100%", }]} />
          :
          <View style={styles.eventHeadingContainer}>
            <RNText style={{ paddingTop: 10, paddingBottom: 10 }} textColor={COLORS.TEXTCOLOR} large bold>{upcomingEventDetailsData?.title || ""}</RNText>
          </View>}
        {!upcomingEventDetailsData?.timeZone ?
          <ShimmerPlaceHolder duration={2000} style={[styles.eventDetailsContainer, { height: 150, width: "100%", paddingBottom: 20, paddingVertical: 20, paddingHorizontal: 0 }]} />
          :
          <View style={styles.eventDetailsContainer}>
            <RNText textColor={COLORS.GRAYTEXTCOLOR}>{upcomingEventDetailsData?.timeZone || ""}</RNText>
            <View style={styles.dateContainer}>
              <View>
                <RNText textColor={COLORS.TEXTCOLOR}>{formatDate(upcomingEventDetailsData?.startDateTime) || ""}</RNText>
                <RNText style={styles.timeText} textColor={COLORS.TEXTCOLOR}>{upcomingEventDetailsData?.startDateTime?.split('T')[1].slice(0, 5)}</RNText>
              </View>
              <RNImage source={IMAGES.arrowRight} style={styles.arrowIcon} />
              <View>
                <RNText textColor={COLORS.TEXTCOLOR}>{formatDate(upcomingEventDetailsData?.endDateTime) || ""}</RNText>
                <RNText style={styles.timeText} textColor={COLORS.TEXTCOLOR}>{upcomingEventDetailsData?.endDateTime?.split('T')[1].slice(0, 5)}</RNText>
              </View>
            </View>
          </View>}

        {upcomingEventDetailsData?.location ?
          <View style={styles.attendeesContainer}>
            <RNText textColor={COLORS.GRAYTEXTCOLOR}>Location</RNText>
            {!upcomingEventDetailsData?.location ?
              <ShimmerPlaceHolder duration={2000} style={[{ height: 20, paddingHorizontal: 0, width: "50%", }]} />
              :
              <RNText style={{ top: 3 }} textColor={COLORS.TEXTCOLOR}>{upcomingEventDetailsData?.location || ""}</RNText>}
          </View> : null}


        {!upcomingEventDetailsData?.description ?
          <ShimmerPlaceHolder duration={2000} style={{
            flex: 1,
            //paddingHorizontal: 16,
            marginTop: 20,
            borderBottomColor: COLORS.BOARDERBASECOLOR,
            borderBottomWidth: 1,
            width:"100%"
          }} />
          :
          <View style={{
            flex: 1,
            paddingHorizontal: 16,
            marginTop: 20,
            borderBottomColor: COLORS.BOARDERBASECOLOR,
            borderBottomWidth: 1,
          }}>
            <RenderHTML
              tagsStyles={{
                p: {
                  color: "#4F4F4F",
                  fontWeight: 'normal',
                  textAlign: 'justify',
                  paddingHorizontal: 8,
                  marginVertical: 0,
                  lineHeight: 20
                },
                span: {
                  color: '#000000',
                  fontWeight: 'normal',
                  textAlign: 'justify'
                },
              }}
              contentWidth={width - 32}
              source={{ html: upcomingEventDetailsData?.description || '' }}
              baseStyle={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "stretch",
                width: "100%"
              }}
              enableExperimentalMarginCollapsing={true}
            />
          </View>}
        <View style={styles.attendeesContainer}>
          <RNText textColor={COLORS.GRAYTEXTCOLOR}>Attendees</RNText>
          {upcomingEventDetailsData?.eventUsers?.map((item: any, index: number) => <RNText style={styles.attendeeText} textColor={COLORS.TEXTCOLOR}>{item?.role == "attendee" ? item?.userEmail : ''}</RNText>
          )}
        </View>

        <View>
          {Array.isArray(upcomingEventDetailsData?.eventAttachments) &&
            upcomingEventDetailsData?.eventAttachments[0]?.fileName && (
              <View style={styles.attendeesContainer}>
                <RNText textColor={COLORS.GRAYTEXTCOLOR}>Attachments</RNText>
                {upcomingEventDetailsData.eventAttachments.map((item: any, index: number) => (
                  <Pressable key={index} onPress={() => Linking.openURL(item?.filePath || "")}>
                    <RNText style={styles.attendeeText} textColor={COLORS.PRIMARY}>
                      {item?.fileName || ''}
                    </RNText>
                  </Pressable>
                ))}
              </View>
            )}
        </View>

      </>
    )
  }

  const ButtonView = () => {
    return (
      upcomingEventDetailsData?.meetingType === "Meeting" ?
        <RNButton
          title={STRINGS.join}
          //style={styles.buttonStyle} 
          textColor={COLORS.WHITE}
          //disabled={true}
          backgroundColor={COLORS.SECONDARY}
          onPress={() => Linking.openURL(upcomingEventDetailsData?.meetingUrl || "")}
        />
        :
        null
    )
  }

  return (
    <RNContainer
      style={styles.container}
      back={true}
      scroll
      showsVerticalScrollIndicator={false}
      title={""}
      bottomChildren={ButtonView()}
      hideBackgroundImage Points={undefined}>
      {EventHadingView()}
    </RNContainer>
  );
};

export default UpcomingEventDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
  },
  eventHeadingContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BOARDERBASECOLOR,
  },
  eventDetailsContainer: {
    paddingBottom: 40,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BOARDERBASECOLOR,
  },
  dateContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateView: {
    flex: 1,
  },
  timeText: {
    marginTop: 10,
  },
  arrowIcon: {
    height: 15,
    width: 15,
  },
  attendeesContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BOARDERBASECOLOR,
  },
  attendeeText: {
    marginTop: 0,
  },

});
