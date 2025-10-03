import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  BackHandler,
  Alert,
  View,
  StatusBar,
  ScrollView,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {RNButton, RNImage, RNText} from '../../../Common';
import {_onPressNavigate} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../config';
import {COLORS, COMMON_SIZE, IMAGES, STRINGS} from '../../../constants';
import {scale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {navigationRef} from '../../../navigation/rootNavigation';
import {styles} from './styles';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const DOT_SIZE = scale(10);
const OnBoardings = () => {
  const carouselRef: any = useRef<Carousel<any>>(null);
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState<any>(0);
  const carouselItems = [
    {
      image: IMAGES.onBoarding1,
      title: STRINGS.onBoarding1Title,
      subTitle: STRINGS.dummyText1,
    },
    {
      image: IMAGES.onBoarding2,
      title: STRINGS.onBoarding2Title,
      subTitle: STRINGS.dummyText2,
    },
    {
      image: IMAGES.onBoarding3,
      title: STRINGS.onBoarding3Title,
      subTitle: STRINGS.dummyText3,
    },
  ];

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

  const PaginationView = () => {
    return (
      <Pagination
        containerStyle={{marginTop: scale(15)}}
        carouselRef={carouselRef}
        tappableDots
        dotsLength={carouselItems?.length}
        activeDotIndex={activeIndex}
        dotStyle={{
          width: DOT_SIZE + scale(20),
          height: DOT_SIZE - scale(2),
          borderRadius: DOT_SIZE / 2,
          backgroundColor: '#FFF',
        }}
        inactiveDotStyle={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: '#FFF',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  const _onPressSkip = () => {
    navigationRef.reset({
      routes: [{name: SCREEN_NAMES.AuthNavigation}],
    });
  };

  const _renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 1,
              width: '100%',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <RNImage
              resizeMode={'Cover'}
              source={item.image}
              style={styles.banner}
            />

            <View style={{marginTop: scale(70)}}>
              <Title firstText={item.title} />
              <RNText
                textColor={COLORS.WHITE}
                style={styles.subTitletext}
                numberOfLines={6}
                TextAlignCenter>
                {item.subTitle}
              </RNText>
            </View>
            {PaginationView()}
          </View>
        </ScrollView>
      </>
    );
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.HEADERCOLOR}
      />
      <SafeAreaView style={styles.container}>
        <Carousel
          loop
          autoplayInterval={10000}
          layout={'default'}
          ref={carouselRef}
          data={carouselItems}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index?.toString()}
          onSnapToItem={index => setActiveIndex(index)}
          lockScrollWhileSnapping={true}
          enableMomentum={false}
          decelerationRate={0.25}
        />

        <RNButton
          style={styles.button}
          backgroundColor={COLORS.SKIPSECONDARY}
          textColor={COLORS.WHITE}
          onPress={_onPressSkip}
          title={
            activeIndex == carouselItems?.length - 1
              ? STRINGS.next
              : STRINGS.skip
          }
        />
      </SafeAreaView>
    </>
  );
};

export default OnBoardings;

const Title = ({firstText}: {firstText: any}) => {
  return (
    <RNText TextAlignCenter style={[styles.text, styles.title]} bold>
      {firstText}
    </RNText>
  );
};
