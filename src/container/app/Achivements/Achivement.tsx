import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { RNContainer, RNIcon, RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { getGamificationPointRequestAction } from '../Home/module/action';
import { useFocusEffect } from '@react-navigation/native';
import { homeScreenSelector } from '../Home/module/reducer';
import { achivementSelector } from './module/reducer';
import { getGamificationAchivementRequestAction, getGamificationBadgesRequestAction, getGamificationLevelsRequestAction } from './module/action';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const screenWidth = Dimensions.get('window').width;
const Achivement: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const { gamificationPointData, gamificationPointLoading } = homeScreenSelector();
  const { gamificationLevelsData, gamificationLevelsLoading, gamificationBadgesData, gamificationBadgesLoading, gamificationachivementData, gamificationachivementLoading } = achivementSelector();

  useFocusEffect(
    useCallback(() => {
      getGamificationPointFunction();
      getGamificationBadgesFunction();
      getGamificationLevelsFunction();
      getGamificationAchivementFunction();
      // if (scrollViewRef.current) {
      //   scrollViewRef.current.scrollTo({ y: 0, animated: true });
      // }
      return () => {
        // Any cleanup logic if necessary
      };
    }, [])
  );

  const getGamificationPointFunction = () => {
    dispatch(getGamificationPointRequestAction());
  }

  const getGamificationBadgesFunction = () => {
    dispatch(getGamificationBadgesRequestAction());
  }

  const getGamificationLevelsFunction = () => {
    dispatch(getGamificationLevelsRequestAction());
  }

  const getGamificationAchivementFunction = () => {
    dispatch(getGamificationAchivementRequestAction());
  }


  useEffect(() => {
    //console.log(gamificationachivementData, "gamificationachivementDatagamificationachivementData")
  }, [gamificationLevelsData, gamificationBadgesData, gamificationachivementData])

  const PointView = () => {
    return (
      <View style={{ paddingHorizontal: scale(10), paddingVertical: scale(30), borderBottomWidth: 0.5, borderBottomColor: "#D4DDFF" }}>
        <View>
          <RNText large semiBold textColor={COLORS.TEXTCOLOR}>Points</RNText>
        </View>
        <View style={{ flexDirection: "row", marginTop: scale(15), alignItems: "center" }}>
          <View>
            <RNText textColor={COLORS.TEXTCOLOR} small>Current Points</RNText>
            <RNText style={{ marginTop: scale(20) }} textColor={COLORS.TEXTCOLOR} small>Level up</RNText>
          </View>
          <View>
            {!gamificationachivementData?.currentPoints && gamificationachivementData?.currentPoints !== 0 ?
              <ShimmerPlaceHolder duration={2000} style={{ marginLeft: scale(20) }} />
              :
              <View style={{ paddingHorizontal: 20, paddingVertical: 1, marginLeft: scale(20) }}>
                <RNText textColor={COLORS.TEXTCOLOR} small>{gamificationachivementData?.currentPoints || 0}</RNText>
              </View>}

            {!gamificationachivementData?.levelUp && gamificationachivementData?.levelUp !== 0 ?
              <ShimmerPlaceHolder duration={2000} style={{ marginLeft: scale(20), marginTop: scale(20) }} />
              :
              <View style={{ paddingHorizontal: 20, paddingVertical: 1, marginLeft: scale(20), marginTop: scale(20) }}>
                <RNText textColor={"#9398A4"} small>{gamificationachivementData?.levelUp || 0}</RNText>
              </View>}
          </View>
        </View>
      </View>
    )
  }

  const BadgesView = () => {
    const renderItem = ({ item }: { item: any }) => {
      const isBadgesCompleted = gamificationachivementData?.badges?.some(
        (badges: any) => badges?.id === item?.id
      );
      return (
        <View style={styles.itemContainer}>
          <View style={styles.badgeWrapper}>
            <RNImage source={{ uri: isBadgesCompleted ? item?.badgeImage : item?.idleBadgeImage }} style={styles.image1} />
          </View>
          <View style={styles.levelWrapper}>
            <RNText small textColor={isBadgesCompleted ? COLORS.TEXTCOLOR : "#9398A4"}>
              {item?.levelName || ""}
            </RNText>
          </View>
        </View>
      )
    };

    return (
      <View style={styles.container1}>
        <RNText large semiBold textColor={COLORS.TEXTCOLOR}>
          Badges
        </RNText>
        {gamificationBadgesLoading ?
          <FlatList
            data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
            renderItem={({ item, index }) => (
              <ShimmerPlaceHolder duration={2000} style={[styles.itemContainer, { height: scale(70), }]} />
            )}
            keyExtractor={(item, index) => `${item}-${index}`}
            numColumns={4}
            columnWrapperStyle={styles.row1}
            contentContainerStyle={styles.gridContainer1}
            showsVerticalScrollIndicator={false}
          />
          :
          <FlatList
            data={gamificationBadgesData || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            numColumns={4}
            columnWrapperStyle={styles.row1}
            contentContainerStyle={styles.gridContainer1}
            showsVerticalScrollIndicator={false}
          />}
      </View>
    );
  };

  const LevelsView = () => {
    const renderItem = ({ item }: { item: any }) => {
      const isLevelCompleted = gamificationachivementData?.levels?.some(
        (level: any) => level?.id === item?.id
      );
      return (
        <View style={[styles.item, { backgroundColor: isLevelCompleted ? COLORS.LIGHTBLUECOLOR : '#E3E3E8', flexDirection: "column", justifyContent: "center", paddingHorizontal: scale(0), paddingVertical: scale(0) }]}>
          <View style={[styles.item, { backgroundColor: isLevelCompleted ? COLORS.LIGHTBLUECOLOR : '#E3E3E8' }]}>
            <RNText style={styles.itemText} small semiBold textColor={isLevelCompleted ? "#7D94EC" : "#9398A4"}>
              {item?.name}
            </RNText>
            {isLevelCompleted ? null :
              <RNImage source={IMAGES.lockKeyhole1} style={styles.image} />}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", bottom: 10, right: 5 }}>
            <RNImage source={IMAGES.boltLeaderBoard} style={{ height: 12, width: 12 }} />
            <RNText textColor={COLORS.TEXTCOLOR} small>{item?.points || ""}</RNText>
          </View>
        </View>
      )
    };

    return (
      <View style={styles.container}>
        <RNText large semiBold textColor={COLORS.TEXTCOLOR}>
          Levels
        </RNText>

        {gamificationLevelsLoading ?
          <FlatList
            data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
            renderItem={({ item, index }) => (
              <ShimmerPlaceHolder duration={2000} style={[styles.item, { height: scale(50), }]} />
            )}
            style={{ width: "100%", alignSelf: "center", }}
            keyExtractor={(item: any, index: number) => `${item}-${index}`}
            numColumns={3} // Number of columns
            columnWrapperStyle={styles.row} // Style for rows
            contentContainerStyle={styles.gridContainer} // Padding for the grid
            showsVerticalScrollIndicator={false} // Hide the scroll indicator
          />
          :
          <FlatList
            data={gamificationLevelsData}
            renderItem={renderItem}
            style={{ width: "100%", alignSelf: "center", }}
            keyExtractor={(item: any, index: number) => `${item}-${index}`}
            numColumns={3} // Number of columns
            columnWrapperStyle={styles.row} // Style for rows
            contentContainerStyle={styles.gridContainer} // Padding for the grid
            showsVerticalScrollIndicator={false} // Hide the scroll indicator
          />}
      </View>
    );
  };

  return (
    <RNContainer
      style={{ backgroundColor: COLORS.MAINBACKGROUNDCOLOR }}
      back={true}
      scroll
      showsVerticalScrollIndicator={false}
      title={"Achievements"}
      titleMarginRight={true}
      hideBackgroundImage Points={undefined}>
      {PointView()}
      {BadgesView()}
      {LevelsView()}
    </RNContainer>
  );
};

export default Achivement;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(30),
    borderBottomWidth: 0.5,
    borderBottomColor: '#D4DDFF',
  },
  gridContainer: {
    marginTop: scale(20),
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: scale(10),
    gap: 5
  },
  item: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    backgroundColor: '#E3E3E8',
    borderRadius: 7,
    //marginHorizontal: '1%',
    width: scale(100), // Width of each item
  },
  itemText: {
    left: 20,
  },
  image: {
    height: 13,
    width: 10,
    bottom: 7,
  },
  container1: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(20),
    borderBottomWidth: 0.5,
    borderBottomColor: '#D4DDFF',
  },
  gridContainer1: {
    marginTop: scale(20),
  },
  row1: {
    gap: scale(10),
    justifyContent: "flex-start",
    marginBottom: scale(16),
  },
  itemContainer: {
    width: '23%',
    alignItems: 'center',
  },
  item1: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '22%', // Ensures proper spacing for 4 items
    aspectRatio: 1, // Makes each item square
    marginHorizontal: '1%', // Add small spacing between items
    backgroundColor: COLORS.TRANSPARENT, // Set transparent background
  },
  image1: {
    width: scale(60),
    height: scale(60),
  },
  levelWrapper: {
    padding: scale(4),
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(4),
    minWidth: '100%',
    alignItems: 'center',
  },
  badgeWrapper: {
    marginBottom: scale(8),
  },

});
