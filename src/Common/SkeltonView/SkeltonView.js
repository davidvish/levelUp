import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {wp} from '../../config/constants';

export const RNSkeltonView = () => {
  const renderItem = ({item, index}) => {
    return (
      <SkeletonPlaceholder key={index} highlightColor={'#F2F8FC'} speed={1500}>
        <View style={styles.renderContainerStyle}>
          <View style={{width: '20%'}}>
            <View style={styles.leftViewStyle} />
          </View>
          <View style={{width: '80%'}}>
            <View style={styles.rightUpperStyle} />
            <View style={styles.rightDownStyle} />
          </View>
        </View>
      </SkeletonPlaceholder>
    );
  };
  return (
    <View style={{flex: 1, width: wp(100)}}>
      <FlatList
        keyExtractor={(_, index) => index + ''}
        showsVerticalScrollIndicator={false}
        data={new Array(7)}
        renderItem={renderItem}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  renderContainerStyle: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 30,
    width: '100%',
    //     alignSelf: "center",
  },
  leftViewStyle: {height: 60, width: 60, borderRadius: 60 / 2},
  rightUpperStyle: {height: 20, width: '100%', borderRadius: 5},
  rightDownStyle: {
    height: 20,
    width: '80%',
    marginTop: 10,
    borderRadius: 5,
  },
});
