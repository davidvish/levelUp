import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';
import {COLORS, COMMON_SIZE, IMAGES} from '../../../../constants';
import {RNListView} from '../../../../Common/ListView/ListView';
import moment from 'moment';

const NotificationListView = ({item, index, onPress}) => {
  return (
    <RNListView
      onPress={onPress}
      imageStyle={styles.icon}
      listViewContainerStyle={[styles.listStyle]}
      //  hideBorderLine
      resizeMode="cover"
      borderRadius={ICON_SIZE / 2}
      source={{uri: IMAGES.DEMO_PIC_RANDOM}}
      title={item.message}
      // titleStyle={titleStyle}
      subTitle={
        'Sit et sit duo ut justo lorem et invidunt accusam. Justo invidunt invidunt tempor erat erat justo invidunt rebum sed..'
      }
      rightText={moment().format('hh:mm a')}
    />
  );
};

export default NotificationListView;

const ICON_SIZE = scale(35);
const PROFILE_PIC_SIZE = scale(65);
const styles = StyleSheet.create({
  listStyle: [
    {
      marginBottom: scale(10),
      borderRadius: 10,
      backgroundColor: COLORS.WHITE,
      padding: scale(10),
      borderBottomWidth: 0.5,
    },
    // commonStyle.SHADOW,
  ],
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
