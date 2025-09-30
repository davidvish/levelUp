import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS, IMAGES } from '../../../../constants'; // Adjust path as needed
import { useDispatch } from 'react-redux';
import { scale } from 'react-native-size-matters';
import { RNActionSheet, RNImage, RNText } from '../../../../Common';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { getGamificationAllLeaderboardRequestAction } from '../module/action';
import { useFocusEffect } from '@react-navigation/native';
import { leaderboardSelector } from '../module/reducer';
import { styles } from './styles';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const AllTimeTabComponent = (props: any) => {
    const dispatch = useDispatch();
    const { gamificationAllLeaderboardLoading, gamificationAllLeaderboardData } = leaderboardSelector();
    const [secondTimeBoardData, setSecondAllTimeBoardData] = useState<any>([]);
    const [firstTimeBoardData, setFirstAllTimeBoardData] = useState<any>([]);

    useFocusEffect(
        useCallback(() => {
            leaderboardAll();
            return () => {
                // Any cleanup logic if necessary
            };
        }, [])
    );

    const leaderboardAll = () => {
        let body = {
            leaderboardType: "Alltime",
            orderBy: "points",
            pageNumber: 1,
            pageSize: 100,
            searchQry: "",
            sortOrder: ""
        };
        let callback = (res: any) => {
            if (res != 'error') {
            }
        };
        dispatch(getGamificationAllLeaderboardRequestAction({ body, callback }))
    }

    useEffect(() => {
        if (gamificationAllLeaderboardData?.items?.length) {
            if (gamificationAllLeaderboardData?.items?.length > 5) {
                setFirstAllTimeBoardData(gamificationAllLeaderboardData?.items?.slice(0, 3));
                setSecondAllTimeBoardData(gamificationAllLeaderboardData?.items?.slice(3));
            } else {
                setFirstAllTimeBoardData([]);
                setSecondAllTimeBoardData(gamificationAllLeaderboardData?.items);
            }
        }
        else {
            setFirstAllTimeBoardData([]);
            setSecondAllTimeBoardData([]);
        }
    }, [gamificationAllLeaderboardData]);


    const FirstThreeView = () => {
        return (
            <View style={styles.FirstContainer}>
                {firstTimeBoardData?.length != 0 ?
                    <View style={styles.thirdStyle}>
                        <View style={styles.thirdStyleCircle}>
                            <RNImage source={IMAGES.EllipseSoftBoard} style={{ width: 40, height: 40 }} />
                            <RNText style={styles.thirdStyleText}>2</RNText>
                        </View>
                        <View style={styles.sameViewContainer}>
                            <RNText style={styles.sameViewName} medium semiBold textColor={COLORS.TEXTCOLOR}>{firstTimeBoardData[1]?.name || "--"}</RNText>
                            <View style={styles.sameViewRow}>
                                <RNImage source={IMAGES.boltLeaderBoard} style={styles.sameViewIcon} />
                                <RNText medium textColor={COLORS.BORDER_COLOR}>{firstTimeBoardData[1]?.points || 0}</RNText>
                            </View>
                            <View style={[styles.sameViewRow, { bottom: scale(13) }]}>
                                <RNImage source={IMAGES.trophyStarLeaderBoard} style={styles.sameViewIcon} />
                                <RNText medium textColor={COLORS.BORDER_COLOR}>{firstTimeBoardData[1]?.level || "Level 0"}</RNText>
                            </View>
                            <View style={[styles.sameViewRow, { bottom: scale(10) }]}>
                                <RNImage source={IMAGES.medalLeaderBoard} style={styles.sameViewIcon} />
                                <RNText medium textColor={COLORS.BORDER_COLOR}>{firstTimeBoardData[1]?.badge || "Badge 0"}</RNText>
                            </View>
                        </View>
                    </View>
                    :
                    <ShimmerPlaceHolder duration={2000} style={styles.thirdStyle} />
                }

                {firstTimeBoardData?.length != 0 ?
                    <View style={{ marginTop: "3.3%", paddingHorizontal: scale(25), height: scale(145), paddingVertical: scale(10), borderRadius: 7, backgroundColor: COLORS.WHITE, alignItems: "center", }}>
                        <ImageBackground source={IMAGES.EllipseDarkBoard} style={{ width: 65, height: 65, bottom: scale(30), justifyContent: "center", }}>
                            <RNImage source={IMAGES.crownLeaderBoard} style={{ width: 33, height: 33, alignSelf: "center" }} />
                        </ImageBackground>

                        <View style={{ alignItems: "center" }}>
                            <RNText style={{ bottom: scale(20) }} medium semiBold textColor={COLORS.TEXTCOLOR}>{firstTimeBoardData[0]?.name || "--"}</RNText>
                            <View style={styles.sameViewRow}>
                                <RNImage source={IMAGES.boltLeaderBoard} style={styles.sameViewIcon} />
                                <RNText medium textColor={COLORS.BORDER_COLOR}>{firstTimeBoardData[0]?.points || 0}</RNText>
                            </View>
                            <View style={[styles.sameViewRow, { bottom: scale(13) }]}>
                                <RNImage source={IMAGES.trophyStarLeaderBoard} style={styles.sameViewIcon} />
                                <RNText medium textColor={COLORS.BORDER_COLOR}>{firstTimeBoardData[0]?.level || "Level 0"}</RNText>
                            </View>
                            <View style={[styles.sameViewRow, { bottom: scale(10) }]}>
                                <RNImage source={IMAGES.medalLeaderBoard} style={styles.sameViewIcon} />
                                <RNText medium textColor={COLORS.BORDER_COLOR}>{firstTimeBoardData[0]?.badge || "Badge 0"}</RNText>
                            </View>
                        </View>
                    </View> :
                    <ShimmerPlaceHolder duration={2000} style={[styles.thirdStyle, { height: scale(143), bottom: scale(20) }]} />
                }

                {firstTimeBoardData?.length != 0 ?
                    <View style={styles.thirdStyle}>
                        <View style={styles.thirdStyleCircle}>
                            <RNImage source={IMAGES.EllipseSoftBoard} style={{ width: 40, height: 40 }} />
                            <RNText style={styles.thirdStyleText}>3</RNText>
                        </View>
                        <View style={styles.sameViewContainer}>
                            <RNText style={styles.sameViewName} medium semiBold textColor={COLORS.TEXTCOLOR}>{firstTimeBoardData[2]?.name || "--"}</RNText>
                            <View style={styles.sameViewRow}>
                                <RNImage source={IMAGES.boltLeaderBoard} style={styles.sameViewIcon} />
                                <RNText medium textColor={COLORS.BORDER_COLOR}>{firstTimeBoardData[2]?.points || 0}</RNText>
                            </View>
                            <View style={[styles.sameViewRow, { bottom: scale(13) }]}>
                                <RNImage source={IMAGES.trophyStarLeaderBoard} style={styles.sameViewIcon} />
                                <RNText medium textColor={COLORS.BORDER_COLOR}>{firstTimeBoardData[2]?.level || "Level 0"}</RNText>
                            </View>
                            <View style={[styles.sameViewRow, { bottom: scale(10) }]}>
                                <RNImage source={IMAGES.medalLeaderBoard} style={styles.sameViewIcon} />
                                <RNText medium textColor={COLORS.BORDER_COLOR}>{firstTimeBoardData[2]?.badge || "Badge 0"}</RNText>
                            </View>
                        </View>
                    </View>
                    :
                    <ShimmerPlaceHolder duration={2000} style={styles.thirdStyle} />
                }
            </View>
        )
    }

    const RankBoardView = () => {
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.actionsheet}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                            <View style={{ flexDirection: "row" }}>
                                <RNText medium textColor={COLORS.TEXTCOLOR}>Rank</RNText>
                                <RNText style={{ marginLeft: scale(30) }} medium textColor={COLORS.TEXTCOLOR}>Name</RNText>
                            </View>
                            <RNText medium textColor={COLORS.TEXTCOLOR}>Points</RNText>
                        </View>
                        <View style={{ borderBottomWidth: 1, width: "100%", alignSelf: "center", borderBottomColor: "#D9D9D9" }} />

                        {gamificationAllLeaderboardLoading ?
                            // <ActivityIndicator size={"small"} color={COLORS.PRIMARY} style={{ marginTop: 10 }} />
                            <FlatList
                                horizontal={false}
                                data={[1, 1, 1]}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    marginTop: scale(7),
                                    paddingBottom: 5,
                                    marginBottom: 10
                                }}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <ShimmerPlaceHolder duration={2000} style={[styles.flatListMainStyle, {
                                        height: scale(50), paddingHorizontal: scale(0),
                                        paddingVertical: scale(5),
                                    }]} />
                                )}
                            />
                            :
                            secondTimeBoardData?.length ?
                                <FlatList
                                    horizontal={false}
                                    data={secondTimeBoardData}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        marginTop: scale(7),
                                        paddingBottom: 5,
                                        marginBottom: 10
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View
                                                style={styles.flatListMainStyle}
                                            >
                                                {/* Circle with Text */}
                                                <View
                                                    style={styles.circleWithTextView}
                                                >
                                                    <RNText medium TextAlignCenter textColor={COLORS.TEXTCOLOR}>
                                                        {gamificationAllLeaderboardData?.items?.length && gamificationAllLeaderboardData?.items?.length > 5 ? index + 4 : index + 1}
                                                    </RNText>
                                                </View>

                                                {/* Details Section */}
                                                <View style={{ marginLeft: scale(10), flex: 1 }}>
                                                    <RNText medium textColor={COLORS.TEXTCOLOR}>
                                                        {item?.name || "--"}
                                                    </RNText>

                                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(3) }}>
                                                        <RNImage
                                                            source={IMAGES.trophyStarLeaderBoard}
                                                            style={{ width: scale(10), height: scale(10), marginRight: scale(1) }}
                                                        />
                                                        <RNText small textColor={COLORS.BORDER_COLOR} style={{ marginRight: scale(5) }}>
                                                            {item?.level || "Level 0"}
                                                        </RNText>

                                                        <View style={{ flexDirection: "row", marginLeft: 10, alignItems: "center" }}>
                                                            <RNImage
                                                                source={IMAGES.medalLeaderBoard}
                                                                style={{ width: scale(10), height: scale(10), marginRight: scale(1) }}
                                                            />
                                                            <RNText small textColor={COLORS.BORDER_COLOR}>
                                                                {item?.badge || "Badge 0"}
                                                            </RNText>
                                                        </View>

                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <RNImage source={IMAGES.boltLeaderBoard} style={{ width: 12, height: 12 }} />
                                                    <RNText small textColor={COLORS.TEXTCOLOR}>{item?.points || 0}</RNText>
                                                </View>
                                            </View>
                                        );
                                    }}
                                /> :
                                <RNText alignSelfCenter style={{ marginTop: scale(230) }} bold TextAlignCenter textColor={COLORS.BORDER_COLOR}>No record found!</RNText>}
                    </ScrollView>
                </View>
            </GestureHandlerRootView>

        )
    }

    return (
        <View style={styles.container}>
            {gamificationAllLeaderboardData?.items?.length && gamificationAllLeaderboardData?.items?.length > 5 ? FirstThreeView() : null}
            {RankBoardView()}
        </View>
    );
};

export default AllTimeTabComponent;


