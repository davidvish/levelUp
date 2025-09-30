import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform, ActivityIndicator, Image, Animated } from 'react-native';
import { COLORS, IMAGES, STRINGS } from '../../../../constants';
import { RNButton, RNImage, RNText } from '../../../../Common';
import { scale } from 'react-native-size-matters';
import RNModal from '../../../../Common/Modal/Modal';
import { useDispatch } from 'react-redux';
import { flashcardPreviewSelector } from '../module/reducer';
import { studyListRequestAction, studyPlayRequestAction } from '../module/action';
import Tts from 'react-native-tts';
import { useFocusEffect } from '@react-navigation/native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

Tts.setDefaultLanguage('en-GB');
Tts.setDefaultVoice('com.apple.ttsbundle.Daniel-compact');
Tts.setDefaultRate(0.4);
Tts.setDefaultPitch(1.0);

let currentUtterance: any = null;

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

type CustomAndroidParams = {
  KEY_PARAM_PAN: number;
  KEY_PARAM_VOLUME: number;
  KEY_PARAM_STREAM: string;
};

const StudyTabComponent = (props: any) => {
  const { data: hasParamData = [], practiceOnPress, onChildDataChange } = props;
  const { studyLoading, studyListData } = flashcardPreviewSelector();
  const dispatch = useDispatch();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   playStudyFunction();
  //   studyListFunction();
  // }, []); 

  // useFocusEffect(
  //   useCallback(() => {
  //     playStudyFunction();
  //     studyListFunction();
  //   }, [])
  // );
const hasLoadedData = useRef(false);

  useFocusEffect(
  useCallback(() => {
    if (!hasLoadedData.current) {
      playStudyFunction();
      studyListFunction();
      hasLoadedData.current = true;
    }
    
    return () => {
      stopTTS();
    };
  }, [])
);

  useEffect(() => {
    const isDataValid =
      studyListData?.cards &&
      studyListData?.cards?.length !== 0 &&
      studyListData?.userProgress !== null &&
      studyListData?.userProgress?.resumeAtGuid;

    if (isDataValid) {
      const studyItemData = studyListData.cards[currentCardIndex];
      let updateQuestionProgressData = {
        progressId: studyListData?.userProgress?.id || "",
        quesId: studyItemData?.id || "",
        assignedDate: hasParamData?.assignedDate || "",
      };
      onChildDataChange(updateQuestionProgressData);
    }
  }, [studyListData, currentCardIndex]);

  useEffect(() => {
    const isDataValid =
      studyListData?.cards &&
      studyListData?.cards?.length !== 0 &&
      studyListData?.userProgress !== null &&
      studyListData?.userProgress?.resumeAtGuid;

    if (isDataValid) {
      const cardIndex = studyListData.cards.findIndex(
        (card: any) => card.id === studyListData?.userProgress?.resumeAtGuid
      );

      let currentIndex = cardIndex !== -1 ? cardIndex : 0;
      setCurrentCardIndex(currentIndex);
    }
  }, [studyListData]);

  const playStudyFunction = () => {
    const body = { id: hasParamData?.id || "", assignedDate: hasParamData?.assignedDate || "" };
    const callback = (res: any) => {
      if (res !== 'error') {
        console.log("hello world", res);
      }
    };
    dispatch(studyPlayRequestAction({ body, callback }));
  };

  const studyListFunction = () => {
    const body = { id: hasParamData?.id || "", assignedDate: hasParamData?.assignedDate || "" };
    dispatch(studyListRequestAction({ body }));
  };

  // Animation function for card transitions
  const animateCardTransition = (direction = 'next') => {
    setIsAnimating(true);
    
    // Reset animation values
    slideAnim.setValue(0);
    scaleAnim.setValue(1);
    rotateAnim.setValue(0);
    
    // Choose animation type (modify this to select different animation styles)
    const animationType : string = 'slide'; // Options: 'slide', 'fade', 'flip', 'scale'
    
    if (animationType === 'slide') {
      // Slide animation
      const slideOut = Animated.timing(slideAnim, {
        toValue: direction === 'next' ? -screenWidth : screenWidth,
        duration: 300,
        useNativeDriver: true,
      });
      
      slideOut.start(() => {
        updateCardIndex(direction);
        slideAnim.setValue(direction === 'next' ? screenWidth : -screenWidth);
        
        const slideIn = Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        });
        
        slideIn.start(() => setIsAnimating(false));
      });
    } 
    else if (animationType === 'fade') {
      // Fade animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start(() => {
        updateCardIndex(direction);
        setIsAnimating(false);
      });
    }
    else if (animationType === 'flip') {
      // Flip animation
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: direction === 'next' ? 1 : -1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        updateCardIndex(direction);
        setIsAnimating(false);
      });
    }
    else if (animationType === 'scale') {
      // Scale animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        updateCardIndex(direction);
        setIsAnimating(false);
      });
    }
  };

  const updateCardIndex = (direction:any) => {
    if (direction === 'next') {
      if (currentCardIndex < studyListData?.cards?.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setModalVisible(true);
      }
    } else {
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      }
    }
  };

  const nextQuestionButton = () => {
    if (isAnimating) return;
    stopTTS();
    if (currentCardIndex < studyListData?.cards?.length - 1) {
      animateCardTransition('next');
    } else {
      setModalVisible(true);
    }
  };

  const previousQuestionButton = () => {
    if (isAnimating) return;
    stopTTS();
    if (currentCardIndex > 0) {
      animateCardTransition('previous');
    }
  };

  const handlePracticePress = () => {
    stopTTS();
    if (practiceOnPress) {
      practiceOnPress();
    }
    setModalVisible(false);
    setCurrentCardIndex(0);
  };

  const volumFunction = (item: string) => {
    (Tts as any).speak(item, { rate: 1.0, androidParams: { KEY_PARAM_PAN: -1, KEY_PARAM_VOLUME: 0.8 } });
  }

  const stopTTS = () => {
    Tts.stop();
  }

  const renderDot = () => (
    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.BLACK }} />
  );

  // Calculate animated styles
  const getAnimatedStyles = () => {
    const rotateInterpolation = rotateAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: ['30deg', '0deg', '-30deg']
    });
    
    return {
      opacity: fadeAnim,
      transform: [
        { translateX: slideAnim },
        { scale: scaleAnim },
        { rotateY: rotateInterpolation }
      ]
    };
  };

  const CardMainView = () => {
    // Ensure studyListData and cards are defined
    if (!studyListData || !studyListData.cards) {
      return (
        <View style={[styles.cardMainView, { alignItems: "center" }]}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <ShimmerPlaceHolder duration={2000} style={[styles.iconContainer, { marginLeft: scale(300) }]} />
          </View>
          <ShimmerPlaceHolder duration={2000} style={{ width: "90%", marginTop: 15, height: 60 }} />
          <ShimmerPlaceHolder duration={2000} style={[{ height: 200, width: "90%", marginTop: 15 }]} />
          <ShimmerPlaceHolder duration={2000} style={{ width: "90%", marginTop: 15, height: 100 }} />
        </View>
      );
    }

    const card = studyListData.cards[currentCardIndex];
    if (!card) return (<View style={[styles.cardMainView, { justifyContent: "center" }]}><RNText TextAlignCenter large textColor={COLORS.BORDER_COLOR}>No Record Found</RNText></View>);

    return (
      <View style={styles.cardMainView}>
        <Animated.View style={getAnimatedStyles()}>
          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
            {["Basic", "MCQs", "Cloze"].includes(card?.learningCardType?.name) && (
              <>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  <View style={styles.iconContainer}>
                    <RNImage onPress={() => volumFunction(card?.title || "")} source={IMAGES.volumeIcon} style={styles.icon} />
                  </View>
                </View>
                <View style={[styles.textContainer]}>
                  <RNText bold large textColor={COLORS.TEXTCOLOR}>
                    {card?.title || ""}
                  </RNText>
                  {card?.imageUrl ?
                    <RNImage resizeMode="stretch" source={{ uri: card?.imageUrl }} style={styles.image} />
                    :
                    <View style={styles.borderLine} />
                  }

                  {card?.learningCardType?.name === "MCQs" && (
                    card?.cardOptions?.map((item: any, index: any) => (
                      <View key={index} style={{ alignSelf: "flex-start", marginTop: scale(10), paddingHorizontal: scale(10) }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          {renderDot()}
                          <RNText style={{ marginLeft: scale(10) }} large textColor={COLORS.TEXTCOLOR}>
                            {item?.answer || ""}
                          </RNText>
                        </View>
                      </View>
                    ))
                  )}
                  {card?.learningCardType?.name === "Basic" && (
                    <View style={[styles.textContainer, { paddingHorizontal: 0, marginTop: scale(10) }]}>
                      <RNText large textColor={COLORS.TEXTCOLOR}>
                        {card?.cardOptions[0]?.answer || ""}
                      </RNText>
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    );
  };

  const SingleButtonView = () => (
    <RNButton
      title={STRINGS.next}
      style={{ marginTop: "7%", width: screenWidth / 1.1 }}
      textColor={COLORS.WHITE}
      disabled={studyListData?.cards?.length == 0 || isAnimating}
      backgroundColor={COLORS.SECONDARY}
      onPress={nextQuestionButton}
    />
  );

  const DoubleButtonView = () => {
    const isLastCard = currentCardIndex === studyListData?.cards?.length - 1;
    return (
      <View style={{ marginTop: "7%", width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
        <RNButton
          title={STRINGS.previous}
          style={{ width: screenWidth / 2.4 }}
          textColor={COLORS.WHITE}
          backgroundColor={COLORS.SECONDARY}
          disabled={isAnimating}
          onPress={previousQuestionButton}
        />
        <RNButton
          title={isLastCard ? STRINGS.finish : STRINGS.next}
          style={{ width: screenWidth / 2.4 }}
          textColor={COLORS.WHITE}
          backgroundColor={COLORS.SECONDARY}
          disabled={isAnimating}
          onPress={nextQuestionButton}
        />
      </View>
    );
  };

  const RestartCourseModal = () => (
    <RNModal transparent visible={modalVisible} onDismiss={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <RNText style={{ marginTop: 5 }} large>
          Click <RNText bold style={{ marginTop: 5 }} large>Start Over</RNText> to study again or click <RNText bold style={{ marginTop: 5 }} large>Practice</RNText> to test your knowledge.
        </RNText>
        <RNButton
          onPress={() => {
            setModalVisible(false);
            setCurrentCardIndex(0);
          }}
          textColor={COLORS.SECONDARY}
          title={STRINGS.startOver}
          minHeightButton={true}
          style={styles.restartButtonStyle}
          backgroundColor={COLORS.WHITE}
        />
        <RNButton
          onPress={handlePracticePress}
          textColor={COLORS.WHITE}
          title={STRINGS.practice}
          minHeightButton={true}
          style={styles.restartButtonStyle}
          backgroundColor={COLORS.SECONDARY}
        />
      </View>
    </RNModal>
  );

  return (
    <View style={styles.container}>
      {studyLoading ?
        <ActivityIndicator style={{ padding: 20 }} size="small" color={COLORS.PRIMARY} />
        :
        <RNText style={styles.dateText} small textColor={COLORS.BORDER_COLOR}>Question {`${currentCardIndex + 1}/${studyListData?.cards?.length}`}</RNText>
      }
      {CardMainView()}
      {currentCardIndex === 0 ? SingleButtonView() : DoubleButtonView()}
      {RestartCourseModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
  },
  dateText: {
    padding: 20,
  },
  cardMainView: {
    width: '90%',
    height: Platform.OS === "android"
      ? screenHeight > 650
        ? 0.65 * screenHeight
        : 0.55 * screenHeight
      : 0.60 * screenHeight,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 5,
    elevation: COLORS.ELEVATION,
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
    backgroundColor: COLORS.WHITE,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    elevation: 5,
    backgroundColor: COLORS.WHITE,
    marginTop: "5%",
    right: scale(20),
  },
  icon: {
    width: scale(15),
    height: scale(15),
  },
  textContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  image: {
    width: "102%",
    alignSelf: "center",
    height: scale(180),
    borderRadius: 10,
    marginTop: scale(10)
  },
  restartButtonStyle: {
    marginTop: scale(15),
    width: "87%",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
  borderLine: {
    marginTop: scale(20),
    marginBottom: scale(20),
    borderWidth: 0.8,
    borderColor: "#F1F1F1",
    width: "100%",
  },
  modalContainer: {
    paddingHorizontal: 10,
    backgroundColor: COLORS.WHITE,
    paddingVertical: 20,
    width: "80%",
  },
});

export default StudyTabComponent;