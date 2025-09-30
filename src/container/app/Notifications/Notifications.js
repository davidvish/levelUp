import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RNAnimatableWrapper, RNContainer} from '../../../Common';
import {STRINGS} from '../../../constants';
import {scale} from 'react-native-size-matters';
import NotificationListView from './component/NotificationListView';

const Notifications = () => {
  const _onPressItem = item => {
    console.log('item', item);
  };

  const _renderItem = ({item, index}) => {
    return (
      <RNAnimatableWrapper
        animation={'fadeInUpBig'}
        // animation={'flipInX'}
        duration={700}
        delay={index * 100}>
        <NotificationListView
          onPress={() => _onPressItem(item)}
          item={item}
          index={index}
        />
      </RNAnimatableWrapper>
    );
  };
  return (
    <RNContainer
      hidePaddingHorizontal
      hideBottomSafeArea
      title={STRINGS.Notifications}>
      <FlatList
        keyExtractor={(_, index) => index + ''}
        contentContainerStyle={{
          paddingBottom: scale(50),
          paddingHorizontal: scale(10),
        }}
        data={new Array(25).fill({message: 'Notification'})}
        renderItem={_renderItem}
      />
    </RNContainer>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
