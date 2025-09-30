import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Pressable, Image, Platform, Alert, ActivityIndicator, Animated } from 'react-native';
import { COLORS, IMAGES, STRINGS } from '../../../../constants';
import { RNButton, RNImage, RNText } from '../../../../Common';
import { scale } from 'react-native-size-matters';
import { _onPressNavigate } from '../../../../utils/commonFunction';
import { SCREEN_NAMES } from '../../../../config';
import RNModal from '../../../../Common/Modal/Modal';
import { CheckBox } from 'react-native-elements'
import { useDispatch } from 'react-redux';
import { flashcardPreviewSelector } from '../module/reducer';
import { AddUserAttempRequestAction, addUserAnsRequestAction, getRevisitRequestAction, getRevisitSuccessAction, practiceListRequestAction, revisitRequestAction } from '../module/action';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { useFocusEffect } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import Tts from 'react-native-tts';
import { getUserGamificationPointsRequestAction } from '../../CourseStack/module/action';
import { scromChapterSelector } from '../../CourseStack/module/reducer';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

Tts.setDefaultLanguage('en-GB');
Tts.setDefaultVoice('com.apple.ttsbundle.Daniel-compact');
Tts.setDefaultRate(0.4);
Tts.setDefaultPitch(1.0);

// const formatText = (text) => {
//   const words = text.split(' ');
//   const formattedWords = words.map((word, index) => {
//     if (word.toLowerCase() === 'world') {
//       const dashes = '-'.repeat(word.length);
//       return dashes;
//     } else {
//       return word;
//     }
//   });
//   return formattedWords.join(' ');
// };


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const PracticeTabComponent = (props: any) => {
  const { data: hasParamData = [], tabCondtion: tabCondtion, gamificationData: gamificationData } = props;
  //const tabCondtion = props?.route?.params?.playIncorrect;
  //const tabCondtion = props?.route?.params?.playIncorrect;
  const { addUserAttempData, addUserAttempLoading, practiceListData, practiceLoading, addUserAnsData, addUserAnsLoading, revisitData } = flashcardPreviewSelector();
  const { getUserGamificationPoints, getUserGamificationPointsLoading } = scromChapterSelector();
  const dispatch = useDispatch();
  const [ansShowingCondition, setAnsShowingCondition] = useState(false);
  const [worngOrRightansCondition, setWorngOrRightansCondition] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkedIndex, setCheckedIndex] = useState(-1); // Initialize with none selected
  const [correct, setCorrect] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [revealButtonCondtion, setRevealButtonCondtion] = useState("")
  const [selectedMultiOptions, setSelectedMultiOptions] = useState<any>([]);
  const [shouldRerender, setShouldRerender] = useState(false);
  const [hintValue, setHintValue] = useState("");
  const [revisitLaterLoading, setRevisitLaterLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const { coursePlayData } = scromChapterSelector();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation when changing cards
    slideAnim.setValue(500);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentCardIndex]);


  // const slideAnim = useRef(new Animated.Value(0)).current; // Start closer

  // const startSlideAnimation = () => {
  //   Animated.timing(slideAnim, {
  //     toValue: 0,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // useEffect(() => {
  //   addUserAtamFunction();
  //   practiceListFunction();
  //   // return() => {
  //   //   stopTTS();
  //   // }
  // }, [])


  // const conditionalCallback = React.useCallback(() => {
  //   if (tabCondtion) {
  //     console.log("okay!")
  //   }
  //   else {
  //     addUserAtamFunction();
  //     practiceListFunction();
  //   }
  //   return () => { };
  // }, [tabCondtion]);

  // useFocusEffect(conditionalCallback);
  const hasInitialized = useRef(false);

  const conditionalCallback = React.useCallback(() => {
    if (!hasInitialized.current) {
      if (tabCondtion) {
        console.log("okay!")
      }
      else {
        addUserAtamFunction();
        practiceListFunction();
      }
      hasInitialized.current = true;
    }

    return () => {
      // Cleanup if needed
    };
  }, [tabCondtion]);

  // Reset flag when tabCondtion changes
  useEffect(() => {
    hasInitialized.current = false;
  }, [tabCondtion]);

  useFocusEffect(conditionalCallback);

  const gamificationPointsFunction = () => {
    const { id, assignedDate } = hasParamData;
    if (id && assignedDate) {
      const body = { id, assignedDate };
      dispatch(getUserGamificationPointsRequestAction({ body }));
    }
  }

  useEffect(() => {
    console.log(getUserGamificationPoints, "getUserGamificationPointsgetUserGamificationPoints")
  }, [getUserGamificationPoints, coursePlayData])

  const addUserAtamFunction = () => {
    const body = {
      courseId: hasParamData?.id || "",
      assignedDate: hasParamData?.assignedDate || ""
    };
    const callback = (res: any) => {
      if (res !== 'error') {
        console.log("addUserAtamFunction", res);
      }
    };
    dispatch(AddUserAttempRequestAction({ body, callback }));
  };

  const revisitLaterFunction = () => {
    stopTTS();
    setRevisitLaterLoading(true)
    const card = practiceListData?.cards[currentCardIndex];
    const body = {
      AttemptId: addUserAttempData?.id || "",
      QuestionId: card?.id || ""
    };
    const callback = (res: any) => {
      setTimeout(() => {
        setRevisitLaterLoading(false)
      }, 1000)
      if (res !== 'error') {
        if (currentCardIndex < practiceListData?.cards?.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
          //startSlideAnimation();
          setAnsShowingCondition(false);
          setWorngOrRightansCondition(false);
          setSelectedMultiOptions([]);
          setCheckedIndex(-1);
        }
        else {
          getRevisitList();
        }
      }
    };
    dispatch(revisitRequestAction({ body, callback }));
  }

  const volumFunction = (item: string) => {
    (Tts as any).speak(item, { rate: 1.0, androidParams: { KEY_PARAM_PAN: -1, KEY_PARAM_VOLUME: 0.8 } });
  }

  const stopTTS = () => {
    Tts.stop();
  }

  const practiceListFunction = () => {
    const body = { id: hasParamData?.id || "", assignedDate: hasParamData?.assignedDate || "" };
    dispatch(practiceListRequestAction({ body }));
  };

  useEffect(() => {
    if (practiceListData?.cards && practiceListData?.cards?.length !== 0) {
      const card = practiceListData.cards[currentCardIndex];
      let condition: "revealSubmitButtons" | "revealButtons" | "singleButton";

      switch (card?.learningCardType?.name) {
        case "MCQs":
        case "Cloze":
          condition = "revealSubmitButtons";
          break;
        case "Basic":
          condition = "revealButtons";
          break;
        default:
          condition = "singleButton";
      }

      setRevealButtonCondtion(condition);
    }
  }, [practiceListData, currentCardIndex]);


  const handleToggleCheckBox = (index: number) => {
    if (checkedIndex === index) {
      // If the same item is clicked again, unselect it
      setCheckedIndex(-1);
    } else {
      // Otherwise, select the new item and unselect the previously selected item
      setCheckedIndex(index);
    }
  };


  const handleMultiToggleCheckBox = (id: any) => {
    setSelectedMultiOptions((prevSelected: any) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((optionId: any) => optionId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const guessQuestionFunction = (type: string) => {
    stopTTS();
    RevealComponentFunction(addUserAttempData?.id || "", type)
  }

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, [currentCardIndex]);


  const RevealFunction = (type: string) => {
    stopTTS();
    const card = practiceListData.cards?.[currentCardIndex];
    if (card?.learningCardType?.name == "Basic") {
      setRevealButtonCondtion("guessButtons");
      setAnsShowingCondition(true)
    }
    else {
      RevealComponentFunction(addUserAttempData?.id || "", type)
    }
  };

  const RevealComponentFunction = (attemptId: any, type: string) => {
    const card = practiceListData.cards?.[currentCardIndex];
    if (!card || !card.cardOptions || !Array.isArray(card.cardOptions) || !card.courseId || !card.id) {
      console.error("Invalid card data");
      return;
    }

    let ansId;
    if (type === "submit") {
      // If it's for revealing the answer, construct ansId using the checkedIndex
      if (card?.isMultipleAnswers) {
        if (selectedMultiOptions.length === 0) {
          console.log("No options selected");
          return;
        }

        ansId = selectedMultiOptions.map((optionId: any) => {
          const optionIndex = card.cardOptions.findIndex((option: any) => option.id === optionId);
          if (optionIndex === -1) {
            console.warn("Invalid answer option with ID:", optionId);
            return null;
          }
          return {
            AnswerId: card.cardOptions[optionIndex].id
          };
        }).filter(Boolean); // Remove null entries if any
      }
      else {
        if (checkedIndex === -1 || !card.cardOptions[checkedIndex]?.id) {
          console.warn("Invalid checked index or answer option");
          return;
        }
        ansId = [{
          AnswerId: card.cardOptions[checkedIndex].id
        }];
      }
    }

    else {
      // Otherwise, construct ansId for submitting all options
      ansId = card.cardOptions.map((item: any) => ({
        AnswerId: item.id
      })).filter(Boolean);
    }

    if (ansId.length === 0) {
      console.error("No valid answer options found");
      return;
    }
    const body = {
      Answers: ansId,
      AttemptId: attemptId,
      CourseId: card?.courseId || "",
      QuestionId: card?.id || ""
    };

    const callback = (res: any) => {
      if (res !== 'error') {
        gamificationPointsFunction();
        if (type === "reveal") {
          setRevealButtonCondtion("singleButton");
          setAnsShowingCondition(true);
        }
        else if (type === "guess") {
          if (currentCardIndex < practiceListData?.cards?.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setAnsShowingCondition(false)
            // setRevealButtonCondtion("revealSubmitButtons")
          }
          else {
            getRevisitList();
          }
        }
        else {
          setRevealButtonCondtion("singleButton");
          setWorngOrRightansCondition(true);
        }
      }
    };
    dispatch(addUserAnsRequestAction({ body, callback }));
  };

  const submitOptionButton = (type: string) => {
    stopTTS();
    RevealComponentFunction(addUserAttempData?.id || "", type)
  }

  const nextButtonFunction = () => {
    stopTTS();
    if (currentCardIndex < practiceListData?.cards?.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setAnsShowingCondition(false);
      setWorngOrRightansCondition(false);
      setSelectedMultiOptions([]);
      setCheckedIndex(-1);
    }
    else {
      getRevisitList();
    }
  }

  const getRevisitList = () => {
    const body = { id: addUserAttempData?.id || "" };
    const callback = (res: any) => {
      if (res !== 'error') {
        // Re-render the CardMainView component
        setCurrentCardIndex(0)
        setAnsShowingCondition(false);
        setWorngOrRightansCondition(false);
        setSelectedMultiOptions([]);
        setCheckedIndex(-1);
        setShouldRerender(!shouldRerender);
        Toast.show("Let's countinue with revisit list", {
          type: 'success'
        });
      } else {
        setCurrentCardIndex(0)
        setAnsShowingCondition(false);
        setWorngOrRightansCondition(false);
        setSelectedMultiOptions([]);
        setCheckedIndex(-1);
        _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
          screen: SCREEN_NAMES.FlashCardFinish,
          params: {
            data: hasParamData,
            gamificationData: gamificationData
          },
        })
      }
    };
    dispatch(getRevisitRequestAction({ body, callback }));
  };

  useEffect(() => {

  }, [practiceListData]);

  const renderDot = () => (
    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.BLACK }} />
  );

  const CardMainView = () => {
    if (!practiceListData || !practiceListData.cards) {
      return (
        <View style={[styles.cardMainView, { alignItems: "center", width: "100%" }]}>
          <ShimmerPlaceHolder duration={2000} style={[styles.iconContainer, { flexDirection: "row", justifyContent: "flex-end", marginLeft: "75%" }]} />
          <ShimmerPlaceHolder duration={2000} style={{ width: "90%", marginTop: 15, height: 60 }} />
          <ShimmerPlaceHolder duration={2000} style={[{ height: 200, width: "90%", marginTop: 15 }]} />
          <ShimmerPlaceHolder duration={2000} style={{ width: "90%", marginTop: 15, height: 100 }} />
        </View>
      );
    }

    const card = practiceListData.cards[currentCardIndex];
    if (!card) return (<View style={[styles.cardMainView, { justifyContent: "center", width: "100%" }]}><RNText TextAlignCenter large textColor={COLORS.BORDER_COLOR}>No Record Found</RNText></View>);


    // const renderImageOrBorderLine = () => (
    //   card?.imageUrl ? (
    //     <View style={styles.imageContainer}>
    //       <RNImage resizeMode="cover" source={{ uri: card?.imageUrl }} style={styles.image} />
    //     </View>
    //   ) : (
    //     <View style={styles.borderLine} />
    //   )
    // );

    const renderCardImage = () => {
      const cardType = card?.learningCardType?.name;
      const isMultiChoiceOrCloze = ['MCQs', 'Cloze'].includes(cardType);
      const isBasicCard = cardType === 'Basic';

      // Prioritize card options image for Basic card when answer is shown
      if (isBasicCard && ansShowingCondition && card?.cardOptions[0]?.imageUrl) {
        return (
          <Image
            resizeMode="stretch"
            source={{ uri: card.cardOptions[0].imageUrl }}
            style={styles.image}
          />
        );
      }

      // Fallback to main card image
      if (
        (isMultiChoiceOrCloze && card?.imageUrl) ||
        (isBasicCard && card?.imageUrl)
      ) {
        return (
          <Image
            resizeMode="stretch"
            source={{ uri: card.imageUrl }}
            style={styles.image}
          />
        );
      }

      // Render border line if no image is available
      return <View style={styles.borderLine} />;
    };

    const firstCardComeFunction = () => {
      setHintValue(card?.hint || "")
      setModalVisible(true);
      stopTTS();
    }

    return (
      <View style={[styles.cardMainView, { width: "100%" }]}>
        <View>
          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
            {["Basic", "MCQs", "Cloze"].includes(card?.learningCardType?.name) && (
              <>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  {!ansShowingCondition && card?.hint ?
                    <Pressable onPress={firstCardComeFunction}
                      style={[styles.iconContainer, { right: scale(30) }]}>
                      <Image source={IMAGES.lightBulb} style={styles.icon} />
                    </Pressable>
                    : null}

                  {card?.learningCardType?.name == "Basic" ?
                    <Pressable
                      style={[styles.iconContainer, { right: 20 }]}>
                      <RNImage onPress={() => volumFunction(card?.title)} source={IMAGES.volumeIcon} style={styles.icon} />
                    </Pressable>
                    : null}
                </View>


                <View style={[styles.textContainer, { paddingBottom: scale(20) }]}>
                  {card?.learningCardType?.name === "Cloze" ? (
                    (() => {
                      const correctAnswer = card?.cardOptions?.find((option: any) => option.isCorrectAnswer)?.answer;
                      const containsCorrectAnswer = card?.title?.includes(correctAnswer);
                      const parts = containsCorrectAnswer ? card?.title?.split(correctAnswer) : [card?.title];

                      return (
                        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
                          <RNText style={[styles.questionText, { flexShrink: 1 }]} semiBold large textColor={COLORS.TEXTCOLOR}>
                            {parts[0]}
                          </RNText>
                          {containsCorrectAnswer && (
                            <RNImage
                              // onPress={_onPressActionSheetCloze}
                              resizeMode={"cover"}
                              source={IMAGES.LineBlank}
                              style={{ width: 100, height: 1, marginTop: scale(18) }}
                            />
                          )}
                          <RNText style={[styles.questionText, { flexShrink: 1 }]} semiBold large textColor={COLORS.TEXTCOLOR}>
                            {parts[1] || ""}
                          </RNText>
                        </View>
                      );
                    })()
                  ) : (
                    <RNText bold large textColor={COLORS.TEXTCOLOR}>
                      {card?.title || ""}
                    </RNText>
                  )}
                  {/* {renderImageOrBorderLine()} */}

                  {/* {["MCQs", "Cloze"].includes(card?.learningCardType?.name) && card?.imageUrl ?
                      <Image resizeMode="cover" source={{ uri: card?.imageUrl }} style={styles.image} />
                      :
                      <View style={styles.borderLine} />
                    }

                    {["Basic"].includes(card?.learningCardType?.name) &&
                      ansShowingCondition ?
                      card?.cardOptions[0]?.imageUrl ?
                        <Image resizeMode="cover" source={{ uri: card?.cardOptions[0]?.imageUrl }} style={styles.image} />
                        :
                        <View style={styles.borderLine} />
                      :
                      card?.imageUrl ?
                        <Image resizeMode="cover" source={{ uri: card?.imageUrl }} style={styles.image} />
                        :
                        <View style={styles.borderLine} />
                    } */}
                  {renderCardImage()}

                  {!ansShowingCondition && !worngOrRightansCondition && ["MCQs"].includes(card?.learningCardType?.name) && (
                    card?.cardOptions?.map((item: any, index: any) => (
                      <Pressable
                        key={index}
                        onPress={() => {
                          if (card?.isMultipleAnswers) {
                            handleMultiToggleCheckBox(item?.id)
                          }
                          else {
                            handleToggleCheckBox(index)
                          }
                        }}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "110%",
                          alignSelf: "center",
                          marginBottom: scale(12), // <-- Add spacing here
                          paddingBottom: scale(0),
                          marginTop: scale(0),
                        }}
                      >
                        <CheckBox
                          checkedIcon={card?.isMultipleAnswers ? <Image source={IMAGES.squareCheckBlue} style={styles.checkBoxIcon} /> : <Image source={IMAGES.checked} style={{ width: 20, height: 20 }} />}
                          uncheckedIcon={card?.isMultipleAnswers ? <Image source={IMAGES.squareBlack} style={styles.checkBoxIcon} /> : <Image source={IMAGES.unchecked} style={{ width: 20, height: 20 }} />}
                          checked={card?.isMultipleAnswers ? selectedMultiOptions.includes(item.id) : checkedIndex === index}
                          onPress={() => {
                            if (card?.isMultipleAnswers) {
                              handleMultiToggleCheckBox(item?.id)
                            }
                            else {
                              handleToggleCheckBox(index)
                            }
                          }}
                        />
                        <RNText style={{ maxWidth: "90%" }} large textColor={checkedIndex === index || selectedMultiOptions.includes(item.id) ? COLORS.PRIMARY : COLORS.GRAYTEXTCOLOR}>
                          {item?.answer || ""}
                        </RNText>
                      </Pressable>
                    ))
                  )}

                  {!ansShowingCondition && !worngOrRightansCondition && ["Cloze"].includes(card?.learningCardType?.name) && (
                    card?.cardOptions?.map((item: any, index: any) => (
                      <Pressable
                        key={index}
                        onPress={() => {
                          // if (card?.isMultipleAnswers) {
                          //   handleMultiToggleCheckBox(item?.id)
                          // }
                          // else {
                          setSelectedMultiOptions([item?.id]);
                          handleToggleCheckBox(index)
                          //}
                        }}
                        style={{ flexDirection: "row", alignItems: "center", width: "110%", alignSelf: "center", marginTop: scale(0), paddingBottom: scale(0) }}>
                        <CheckBox
                          checkedIcon={<Image source={IMAGES.checked} style={{ width: 25, height: 23 }} />}
                          uncheckedIcon={<Image source={IMAGES.unchecked} style={{ width: 25, height: 23, }} />}
                          checked={checkedIndex === index}
                          onPress={() => {
                            // if (card?.isMultipleAnswers) {
                            //   handleMultiToggleCheckBox(item?.id)
                            // }
                            // else {
                            setSelectedMultiOptions([item?.id]);
                            handleToggleCheckBox(index)
                            //}
                          }}
                        />
                        <RNText style={{ maxWidth: "90%" }} large textColor={checkedIndex === index || selectedMultiOptions.includes(item.id) ? COLORS.PRIMARY : COLORS.GRAYTEXTCOLOR}>
                          {item?.answer || ""}
                        </RNText>
                      </Pressable>
                    ))
                  )}

                  {ansShowingCondition && (
                    <>
                      {card?.learningCardType?.name === "MCQs" && addUserAnsData?.learningCardDetail?.cardOptions ? (
                        addUserAnsData.learningCardDetail.cardOptions
                          .filter((item: any) => item.isCorrectAnswer === true)
                          .map((item: any) => (
                            <View key={`${item.id}`} style={{ width: "95%", marginTop: scale(0), paddingBottom: 10, }}>
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {renderDot()}
                                <RNText style={{ marginLeft: scale(10) }} large textColor={COLORS.GRAYTEXTCOLOR}>
                                  {item.answer || ""}
                                </RNText>
                              </View>
                            </View>
                          ))
                      ) : (
                        <>
                          {card?.learningCardType?.name === "Cloze" && addUserAnsData?.learningCardDetail?.cardOptions ? (
                            addUserAnsData.learningCardDetail.cardOptions
                              .filter((item: any) => item.isCorrectAnswer === true)
                              .map((item: any) => (
                                <View key={`${item.id}`} style={[styles.textContainer, { paddingHorizontal: 0, paddingBottom: 10, marginTop: scale(0) }]}>
                                  <RNText large textColor={COLORS.GRAYTEXTCOLOR}>
                                    {item?.answer || ""}
                                  </RNText>
                                </View>
                              ))
                          ) : (
                            <View style={[styles.textContainer, { paddingHorizontal: 0, marginTop: scale(0) }]}>
                              <RNText large textColor={COLORS.TEXTCOLOR} semiBold style={{ padding: 2 }}>
                                {card?.cardOptions[0]?.answer || ""}
                              </RNText>
                            </View>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {worngOrRightansCondition && (
                    <>
                      {["MCQs", "Cloze"].includes(card?.learningCardType?.name) && addUserAnsData?.learningCardDetail?.cardOptions ? (
                        addUserAnsData.learningCardDetail.cardOptions.map((item: any) => {
                          const isCorrect = item.isCorrectAnswer;
                          let isUserAnswer;

                          if (card?.isMultipleAnswers) {
                            isUserAnswer = selectedMultiOptions.includes(item.id);
                          } else {
                            isUserAnswer = item.answer === card?.cardOptions[checkedIndex]?.answer;
                          }

                          // Determine the background color and icon
                          let backgroundColor = COLORS.TRANSPARENT;
                          let icon = null;

                          if (card?.isMultipleAnswers) {
                            if (isCorrect) {
                              backgroundColor = COLORS.GREEN;
                              icon = IMAGES.checkWhite;
                            }
                            if (isUserAnswer) {
                              backgroundColor = isCorrect ? COLORS.GREEN : COLORS.RED;
                              icon = isCorrect ? IMAGES.checkWhite : IMAGES.xmarkWhite;
                            }
                          } else {
                            if (isCorrect) {
                              backgroundColor = COLORS.GREEN;
                              icon = IMAGES.checkWhite;
                              // Toast.show("Let's countinue with revisit list", {
                              //   type: 'success'
                              // })
                            } else if (isUserAnswer) {
                              backgroundColor = COLORS.RED;
                              icon = IMAGES.xmarkWhite;
                              // Toast.show("Let's countinue with revisit list", {
                              //   type: 'success'
                              // })
                            }
                          }

                          return (
                            <View key={`${item.id}`} style={{ width: "97%", marginTop: scale(10), paddingBottom: 10 }}>
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                  style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 17,
                                    height: 17,
                                    borderRadius: 10,
                                    borderWidth: backgroundColor === COLORS.TRANSPARENT ? 1 : 0,
                                    backgroundColor: backgroundColor
                                  }}
                                >
                                  {icon && <RNImage source={icon} style={{ width: 13, height: 10, alignItems: "center" }} />}
                                </View>
                                <RNText style={{ marginLeft: scale(10) }} large textColor={COLORS.GRAYTEXTCOLOR}>
                                  {item?.answer || ""}
                                </RNText>
                              </View>
                            </View>
                          );
                        })
                      ) : null}
                    </>
                  )}
                  {/* :
                  <>
                    <RNText style={{ right: 80, marginTop: 20 }} textColor={COLORS.SUCCESSCOLOR} large semiBold>Correct Answer</RNText>
                    <RNText style={{ right: 120, marginTop: 10 }} textColor={COLORS.TEXTCOLOR} large semiBold>Delhi</RNText>
                  </> */}

                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  const HintModal = () => {
    return (
      <RNModal transparent visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={{ paddingHorizontal: 10, backgroundColor: COLORS.WHITE, paddingVertical: 0, width: scale(250), maxHeight: scale(400) }}>
          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
            <RNText style={{ marginTop: 0, paddingHorizontal: 10 }} textColor={COLORS.TEXTCOLOR} semiBold extraLarge>Hint</RNText>
            <RNText style={{ marginTop: 15, paddingHorizontal: 10 }} textColor={COLORS.TEXTCOLOR} large>{hintValue ? hintValue : ""}</RNText>

            <RNButton
              onPress={() => setModalVisible(false)}
              textColor={COLORS.WHITE}
              title={STRINGS.ok}
              minHeightButton={true}
              style={styles.restartButtonStyle}
              backgroundColor={COLORS.SECONDARY}
            />
          </ScrollView>
        </View>

      </RNModal>
    );
  };

  const SingleButtonView = () => {
    return (
      <View style={{ elevation: 15, width: "90%" }}>
        <RNButton
          title={currentCardIndex == practiceListData?.cards?.length - 1 ? STRINGS.submit : STRINGS.next}
          style={{ marginTop: "8%", width: "100%" }}
          textColor={COLORS.WHITE}
          backgroundColor={COLORS.SECONDARY}
          onPress={nextButtonFunction}
        />
      </View>
    );
  };

  const DubleButtonView = () => {
    return (
      <View style={{ marginTop: "8%", width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
        <RNButton
          title={STRINGS.revisitLater}
          style={{ width: screenWidth / 2.4, borderWidth: 1, borderColor: revisitLaterLoading || practiceLoading ? COLORS.TRANSPARENT : COLORS.SECONDARY }}
          textColor={COLORS.SECONDARY}
          disabled={revisitLaterLoading || practiceLoading}
          backgroundColor={COLORS.TRANSPARENT}
          onPress={revisitLaterFunction}
        />

        <RNButton
          title={STRINGS.reveal}
          style={{ width: screenWidth / 2.4 }}
          textColor={COLORS.WHITE}
          disabled={revisitLaterLoading || practiceLoading}
          backgroundColor={COLORS.SECONDARY}
          onPress={() => RevealFunction("reveal")}
        />
      </View>

    );
  };

  const ThreeButtonView = () => {
    return (
      <View style={styles.threeButtonMainView}>
        <RNButton
          title={STRINGS.revisitLater}
          style={{ width: screenWidth / 3.5, borderWidth: 1, borderColor: revisitLaterLoading || practiceLoading ? COLORS.TRANSPARENT : COLORS.SECONDARY }}
          textColor={COLORS.SECONDARY}
          backgroundColor={COLORS.TRANSPARENT}
          disabled={revisitLaterLoading || practiceLoading}
          onPress={revisitLaterFunction}
        />

        <RNButton
          title={STRINGS.reveal}
          style={{ width: screenWidth / 3.5, borderWidth: 1, borderColor: revisitLaterLoading || practiceLoading ? COLORS.TRANSPARENT : COLORS.SECONDARY }}
          textColor={COLORS.SECONDARY}
          disabled={revisitLaterLoading || practiceLoading}
          backgroundColor={COLORS.TRANSPARENT}
          onPress={() => RevealFunction("reveal")}
        />

        <RNButton
          title={STRINGS.submit}
          style={{ width: screenWidth / 3.5 }}
          textColor={COLORS.WHITE}
          disabled={checkedIndex == -1 && selectedMultiOptions.length == 0}
          backgroundColor={COLORS.SECONDARY}
          onPress={() => submitOptionButton("submit")}
        />
      </View>
    );
  };

  const GuessDubleButtonView = () => {
    return (
      <View style={{ marginTop: "8%", width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
        <RNButton
          title={STRINGS.guessedWrong}
          style={{ width: screenWidth / 2.4, borderWidth: 1, borderColor: COLORS.SECONDARY }}
          textColor={COLORS.SECONDARY}
          backgroundColor={COLORS.TRANSPARENT}
          onPress={() => guessQuestionFunction("guess")}
        />

        <RNButton
          title={STRINGS.guessedRight}
          style={{ width: screenWidth / 2.4 }}
          textColor={COLORS.WHITE}
          backgroundColor={COLORS.SECONDARY}
          onPress={() => guessQuestionFunction("guess")}
        />
      </View>

    );
  };

  const headerGamificationView = () => {
    const hasGamificationPoints = gamificationData?.gamificationPoints * practiceListData?.cards?.length;
    const progressBarData = hasGamificationPoints
      ? (getUserGamificationPoints?.earnedPoints || 0) / hasGamificationPoints
      : 0;
    const animatedLeft = (progressAnim as any).interpolate({
      inputRange: [0, 1],
      outputRange: [0, scale(150)],
      extrapolate: 'clamp',
    }) || 0;

    console.log(gamificationData, practiceListData?.cards?.length, hasGamificationPoints, "hasGamificationPointshasGamificationPoints")

    useEffect(() => {
      if (!isNaN(progressBarData) && isFinite(progressBarData)) {
        (Animated as any).timing(progressAnim, {
          toValue: progressBarData,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    }, [progressBarData]);

    return (
      <View style={styles.headerGamificationStyle}>
        <View style={styles.gamificationSecondPointStyle}>
          {practiceLoading ? (
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          ) : (
            <RNText small textColor={COLORS.BORDER_COLOR}>
              Question {`${practiceListData?.cards?.length !== 0 ? currentCardIndex + 1 : 0}/${practiceListData?.cards?.length || 0}`}
            </RNText>
          )}
          <View>
            <Progress.Bar
              height={10}
              borderWidth={0}
              color="#4284F4"
              unfilledColor={"#F1F6FF"}
              progress={progressBarData ? progressBarData : 0}
              width={scale(150)}
            />

            {/* Animated Points Moving Under Progress */}
            <Animated.View style={{
              position: "absolute",
              left: animatedLeft,
              bottom: 0,
              flexDirection: "row",
              alignItems: "center",
            }}>
              <RNImage source={IMAGES.gamificationPointImage} style={{ width: 15, height: 15, right: scale(25) }} />
              <RNText style={{ right: scale(25) }} textColor={COLORS.TEXTCOLOR} small>{getUserGamificationPoints?.earnedPoints || 0}</RNText>
            </Animated.View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <RNText textColor={"#9398A4"} small></RNText>
              <RNText textColor={"#9398A4"} small>{hasGamificationPoints !== getUserGamificationPoints?.earnedPoints ? hasGamificationPoints : ""}</RNText>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {headerGamificationView()}
      <View style={styles.cardMainView}>
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          <CardMainView key={shouldRerender ? 1 : 0} />
        </Animated.View>
      </View>
      {/* {SingleButtonView()} */}
      {practiceListData?.cards?.length != 0 ?
        revealButtonCondtion == "revealButtons" ? DubleButtonView() : revealButtonCondtion == "guessButtons" ? GuessDubleButtonView() : revealButtonCondtion == "revealSubmitButtons" ? ThreeButtonView() : SingleButtonView()
        : null}
      {/* {ThreeButtonView()} */}
      {/* {checkedIndex == -1 ? GuessDubleButtonView() : correct ? SingleButtonView() : ThreeButtonView()} */}
      {HintModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.MAINBACKGROUNDCOLOR
  },
  dateText: {
    padding: 20,
  },
  headerGamificationStyle: {
    width: "100%",
    padding: 10,
    backgroundColor: COLORS.WHITE,
    marginBottom: scale(20),
    marginTop: scale(3),
    borderWidth: 0.2,
    borderColor: "#D0CFCF"
  },
  gamificationSecondPointStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    alignSelf: "center"
  },

  // cardMainView: {
  //   width: '90%',
  //   //alignItems: 'center',
  //   height: Platform.OS === "android" ? 0.65 * screenHeight : 0.60 * screenHeight,
  //   backgroundColor: COLORS.WHITE,
  //   shadowColor: COLORS.SHADOW_COLOR,
  //   borderRadius: 5,
  //   elevation: COLORS.ELEVATION,
  //   shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
  //   shadowOpacity: Platform.OS === "android" ? 0 : 1,
  //   shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  // },

  cardMainView: {
    width: '90%', // Maintains responsiveness across screen sizes
    height: Platform.OS === 'android' ? 0.62 * screenHeight : 0.57 * screenHeight, // Adjust height based on platform
    backgroundColor: COLORS.WHITE, // Ensure the background is fully opaque
    borderRadius: 8, // Slightly larger for better visual appeal
    shadowColor: COLORS.SHADOW_COLOR, // Universal shadow color
    elevation: 4, // Moderate elevation for Android shadows
    shadowOffset: { width: 0, height: 2 }, // Consistent shadow offset for iOS
    shadowOpacity: 0.2, // Subtle shadow for iOS
    shadowRadius: 4, // Softer shadow for iOS
    overflow: 'hidden', // Ensures content does not spill outside the card's radius
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
    //paddingHorizontal: 20,
    // alignItems: 'center',
    //width: "95%",
    //alignSelf: "center",
  },

  imageContainer: {
    // alignItems: 'center',
    alignSelf: "center",
    paddingVertical: 20,
    //borderRadius: 50,
    width: "100%",
    height: "50%",
  },
  image: {
    width: "102%",
    alignSelf: "center",
    height: scale(180),
    borderRadius: 10,
    marginTop: scale(10),
    marginBottom: scale(10)

  },
  restartButtonStyle: {
    marginTop: scale(15),
    width: "95%",
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
  checkBoxIcon: {
    width: 20,
    height: 20,
  },
  questionText: {
    //marginTop: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: scale(5),
    marginBottom: scale(10)
  },
  threeButtonMainView: {
    marginTop: "8%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default PracticeTabComponent;
