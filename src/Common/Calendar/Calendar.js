import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Calendar} from 'react-native-calendars';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../constants';

const RNCalendar = ({selected, date, onDayPress, style}) => {
  return (
    <Calendar
      date={date}
      onDayPress={onDayPress}
      style={[styles.container, style]}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          selectedDotColor: COLORS.PRIMARY_DARK
        }
      }}
      theme={{
        // backgroundColor: COLORS.LIGHT_BLUE
        calendarBackground: COLORS.LIGHT_BLUE,

        // textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: COLORS.PRIMARY_DARK,
        // selectedDayTextColor: '#ffffff',
        todayTextColor: COLORS.PRIMARY_DARK,
        // dayTextColor: '#2d4150',
        textDisabledColor: 'transparent'
      }}
      // monthFormat=''
    />
  );
};

export default RNCalendar;

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(10)
  }
});
