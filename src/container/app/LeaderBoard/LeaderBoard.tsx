import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { RNButton, RNContainer, RNText } from '../../../Common';
import { COLORS, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { _onPressGoBackNavigate } from '../../../utils/commonFunction';
import AllTimeTabComponent from './component/AllTimeBoard';
import MonthlyTabComponent from './component/MonthlyBoard';

const LeaderBoard: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const hasParamData = props?.route?.params?.data || [];
  const tabCondtion = props?.route?.params?.playIncorrect;
  const [activeTab, setActiveTab] = useState('MonthlyBoard');

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTab = (tab: string, title: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tabButton, isActive ? styles.activeTabButton : null]}
        onPress={() => switchTab(tab)}
      >
        <RNText medium textColor={isActive ? COLORS.WHITE : '#D7DFFF'}>{title}</RNText>
      </TouchableOpacity>
    );
  };

  return (
    <RNContainer
      style={styles.container}
      back={true}
      title={"Leaderboard"}
      hideBackgroundImage 
      Points={undefined}>
      <View style={{flex:1, width:"106%", alignSelf:"center"}}>
        <View style={styles.tabBar}>
          {renderTab('MonthlyBoard', 'Monthly')}
          {renderTab('AllTimeBoard', 'All Time')}
        </View>
        <View style={styles.tabContent}>
          {activeTab === 'MonthlyBoard' ? <MonthlyTabComponent/> : <AllTimeTabComponent/>}
        </View>
      </View>
    </RNContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: COLORS.RED,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY,
    flex: 0,
    alignSelf: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.WHITE,
  },
  activeTabButton: {
    borderBottomColor: COLORS.WHITE,
    borderBottomWidth: 3, // Added border width for active tab
  },
  tabContent: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  restartButtonStyle: {
    marginTop: scale(15),
    width: "87%",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
});

export default LeaderBoard;

