import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  RNActionSheet,
  RNButton,
  RNContainer,
  RNImage,
  RNText,
  RNTextInput,
} from '../../../Common';
import {_onPressNavigate, onLogout} from '../../../utils/commonFunction';
import {COLORS, IMAGES, STRINGS} from '../../../constants';
import {SCREEN_NAMES} from '../../../config';
import * as Progress from 'react-native-progress';
import {scale} from 'react-native-size-matters';
import {CheckBox} from 'react-native-elements';
import DraggableFlatList, {
  RenderItemParams,
  DragEndParams,
} from 'react-native-draggable-flatlist';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  addExamResponseRequestAction,
  AttestionQuestionRequestAction,
  examAddUserAttemptFailAction,
  examAddUserAttemptRequestAction,
  examPlayFailAction,
  examPlayRequestAction,
  getExamResultRequestAction,
  SubmitAttestationRequestAction,
} from './module/action';
import {useDispatch} from 'react-redux';
import {scromChapterSelector} from './module/reducer';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {homeScreenSelector} from '../Home/module/reducer';
import RNModal from '../../../Common/Modal/Modal';

interface DataItem {
  key: string;
  label: string;
}

const initialData: DataItem[] = [
  {key: '1', label: '9=18+2'},
  {key: '2', label: '9-9'},
  {key: '3', label: '18+2'},
  {key: '4', label: '=0'},
];

const QuestionCheck = {
  MCQs: 'MCQs',
  CLOZE: 'CLOZE',
};

const booleanFourthoptions = [
  {id: 1, text: 'True', isCorrect: true},
  {id: 2, text: 'False', isCorrect: false},
];

const screenWidth = Dimensions.get('window').width;

const AttestationExam: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const startAttestionData = props?.route?.params?.startAttestionData || {};
  const {storeCourseItemData} = homeScreenSelector();
  const {
    examAddUserAttemptLoading,
    examAddUserAttemptData,
    examPlayLoading,
    attestionQuestionData,
    attestionQuestionLoading,
  } = scromChapterSelector();
  const [checkedIndex, setCheckedIndex] = useState(-1);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [multiSelectedMCQItem, setMultiSelectedMCQItem] = useState<any>([]);
  const [selectedMultiOptions, setSelectedMultiOptions] = useState<any>([]);
  const [clozeButtonDisable, setClozeButtonDisable] = useState(true);
  const [clozeButtonSelectedItem, setClozeButtonSelectedItem] = useState<any>(
    [],
  );
  const [submitButtonCondtion, setSubmitButtonCondtion] = useState(false);
  const [singleMCQItem, setSingleMCQItem] = useState<any>([]);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
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

  console.log(startAttestionData, 'startAttestionDatastartAttestionData');

  const clearState = () => {
    setCheckedIndex(-1);
    setCurrentCardIndex(0);
    setLoading(false);
    setMultiSelectedMCQItem([]);
    setSelectedMultiOptions([]);
    setClozeButtonDisable(true);
    setClozeButtonSelectedItem([]);
    setSubmitButtonCondtion(false);
  };

  useFocusEffect(
    useCallback(() => {
      //dispatch(examPlayFailAction())
      attestationFunction();
      return () => {
        clearState();
      };
    }, []),
  );

  const attestationFunction = () => {
    setLoading(true);
    const body = {
      id: startAttestionData?.attestationDetail?.id || '',
    };
    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        console.log(res);
      }
    };
    dispatch(AttestionQuestionRequestAction({body, callback}));
  };

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
    submitButtonFunction();
    return true;
  };

  const optionalQuestionCheckAnswer = () => {
    const examPlayCard = attestionQuestionData[currentCardIndex];
    if (!examPlayCard) {
      Toast.show('No exam data found for current question', {type: 'danger'});
      setLoading(false);
      return;
    }

    // Fix the data structure access - it should be examPlayCard directly, not nested
    const hasFilterData = examPlayCard;

    // Validate required data structure
    if (
      !hasFilterData?.attestationQuestionOptions ||
      !Array.isArray(hasFilterData.attestationQuestionOptions)
    ) {
      Toast.show('Invalid data structure for attestation question options', {
        type: 'danger',
      });
      setLoading(false);
      return;
    }

    // Get the first attestation question option for validation
    const firstOption = hasFilterData.attestationQuestionOptions[0];

    if (!firstOption) {
      Toast.show('No question options available', {type: 'danger'});
      setLoading(false);
      return;
    }
    let selectedOptions = [];

    if (firstOption.isMultipleAnswers) {
      if (
        multiSelectedMCQItem &&
        Array.isArray(multiSelectedMCQItem) &&
        multiSelectedMCQItem.length > 0
      ) {
        selectedOptions = multiSelectedMCQItem
          .filter(item => item?.id) // Filter out items without valid IDs
          .map(item => item.id);
      }
    } else {
      if (singleMCQItem?.id) {
        selectedOptions = [singleMCQItem.id];
      }
    }

    if (selectedOptions.length === 0) {
      Toast.show('Please select an answer before proceeding', {
        type: 'warning',
      });
      setLoading(false);
      return;
    }

    // Prepare request body
    const body = {
      attestationId: examPlayCard.attestationId,
      attestationQuestionId: firstOption.attestationQuestionId,
      // userId: "", // This should be populated with actual user ID
      userSelectedOptionIdList: selectedOptions,
      resourseMappingId: startAttestionData?.userProgress?.id,
      createdDate: startAttestionData?.createdDate,
    };

    // Validate required fields in body
    if (
      !body.attestationId ||
      !body.attestationQuestionId ||
      !body.resourseMappingId
    ) {
      Toast.show('Missing required data for submission', {type: 'danger'});
      setLoading(false);
      return;
    }
    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        setSubmitButtonCondtion(
          currentCardIndex === attestionQuestionData?.length - 1,
        );
        if (currentCardIndex < attestionQuestionData.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
          setCheckedIndex(-1);
        } else {
          setFinishModalVisible(true);
        }
      }
    };

    dispatch(SubmitAttestationRequestAction({body, callback}));
  };

  const FinshKnowledgeModalSecond = () => {
    return (
      //onDismiss={() => setModalVisible(!modalVisible)}
      <RNModal transparent visible={finishModalVisible}>
        <View
          style={{
            width: '90%',
            paddingHorizontal: 10,
            backgroundColor: COLORS.WHITE,
            paddingVertical: 20,
          }}>
          <RNText
            style={{marginTop: scale(15)}}
            TextAlignCenter
            textColor="#A3C3F9"
            extraLarge
            semiBold>
            {'Congratulations!'}
          </RNText>
          <RNText
            textColor={'#9398A4'}
            style={{marginTop: 15}}
            TextAlignCenter
            large>
            {"You've successfully completed the Attestaion Course."}
          </RNText>
          <RNButton
            onPress={() => {
              setFinishModalVisible(false);
              _onPressNavigate(SCREEN_NAMES.CourseStack, {
                screen: SCREEN_NAMES.CoursePreview,
              });
            }}
            textColor={COLORS.WHITE}
            title={'Close'}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.PRIMARY}
          />
        </View>
      </RNModal>
    );
  };

  const handleToggleCheckBox = (index: number) => {
    if (checkedIndex === index) {
      // If the same item is clicked again, unselect it
      setCheckedIndex(-1);
    } else {
      // Otherwise, select the new item and unselect the previously selected item
      setCheckedIndex(index);
    }
  };

  const handleMultiToggleCheckBox = (id: string, optionItem: any) => {
    setSelectedMultiOptions((prevSelected: string[]) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((optionId: string) => optionId !== id);
      } else {
        return [...prevSelected, id];
      }
    });

    setMultiSelectedMCQItem((prevItems: any[]) => {
      const itemIndex = prevItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        return prevItems.filter(item => item.id !== id);
      } else {
        return [...prevItems, optionItem];
      }
    });
  };

  const submitButtonFunction = () => {
    // let body = {
    //   attemptId: examAddUserAttemptData?.attemptId || "",
    //   assignedDate: storeCourseItemData?.assignedDate || ""
    // }
    // const callback = (res: any) => {
    //   if (res !== 'error') {
    //    console.log(res, "hghgghgghghghghg")
    //   }
    // }
    // dispatch(getExamResultRequestAction({ body, callback }))
    _onPressNavigate(SCREEN_NAMES.CourseStack, {
      screen: SCREEN_NAMES.CoursePreview,
    });
  };

  const QuestionView = () => {
    const examPlayCard = attestionQuestionData?.[currentCardIndex] ?? {};
    const examPlayType = examPlayCard?.type;

    if (!examPlayCard || typeof examPlayCard !== 'object') {
      return (
        <View
          style={{
            justifyContent: 'center',
            width: '90%',
            alignItems: 'center',
            marginTop: scale(10),
          }}>
          <RNText TextAlignCenter large textColor={COLORS.BORDER_COLOR}>
            No Record Found
          </RNText>
        </View>
      );
    }

    return (
      <>
        {examPlayLoading ? (
          <ActivityIndicator
            style={{padding: 15}}
            size="small"
            color={COLORS.PRIMARY}
          />
        ) : (
          <>
            <View
              style={{
                paddingHorizontal: scale(5),
                paddingVertical: scale(10),
                marginTop: scale(10),
              }}>
              <RNText TextAlignCenter small textColor={COLORS.GRAYTEXTCOLOR}>
                Question{' '}
                {`${
                  attestionQuestionData?.length != 0 ? currentCardIndex + 1 : 0
                }/${attestionQuestionData?.length || 0}`}
              </RNText>
            </View>
          </>
        )}

        {QuestionCheck?.MCQs === examPlayType && (
          <>
            <React.Fragment>
              <RNText
                style={styles.questionText}
                semiBold
                large
                textColor={COLORS.TEXTCOLOR}>
                {examPlayCard?.question || ''}
              </RNText>
              {examPlayCard?.imageURL &&
              typeof examPlayCard.imageURL === 'string' ? (
                <View
                  style={[
                    styles.imageContainer,
                    {backgroundColor: COLORS.WHITE},
                  ]}>
                  <RNImage
                    resizeMode={'cover'}
                    source={{uri: examPlayCard.imageURL}}
                    style={styles.image}
                  />
                </View>
              ) : (
                <View style={styles.borderLine} />
              )}

              <View style={{marginTop: scale(30)}}>
                {examPlayCard?.attestationQuestionOptions?.map(
                  (optionItem: any, index: number) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (examPlayCard?.isMultipleAnswers) {
                          handleMultiToggleCheckBox(optionItem.id, optionItem);
                        } else {
                          handleToggleCheckBox(index);
                          setSingleMCQItem(optionItem);
                        }
                      }}
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: examPlayCard?.isMultipleAnswers
                          ? selectedMultiOptions.includes(optionItem.id)
                            ? '#DDE1F6'
                            : COLORS.WHITE
                          : checkedIndex !== index
                          ? COLORS.WHITE
                          : '#DDE1F6',
                        margin: 5,
                        padding: 5,
                      }}>
                      <CheckBox
                        checkedIcon={
                          examPlayCard?.isMultipleAnswers ? (
                            <Image
                              source={IMAGES.squareCheckBlue}
                              style={styles.checkBoxIcon}
                            />
                          ) : (
                            <Image
                              source={IMAGES.checked}
                              style={{width: 20, height: 20}}
                            />
                          )
                        }
                        uncheckedIcon={
                          examPlayCard?.isMultipleAnswers ? (
                            <Image
                              source={IMAGES.squareBlack}
                              style={styles.checkBoxIcon}
                            />
                          ) : (
                            <Image
                              source={IMAGES.unchecked}
                              style={{width: 20, height: 20}}
                            />
                          )
                        }
                        checked={
                          examPlayCard?.isMultipleAnswers
                            ? selectedMultiOptions.includes(optionItem.id)
                            : checkedIndex === index
                        }
                        onPress={() => {
                          if (examPlayCard?.isMultipleAnswers) {
                            handleMultiToggleCheckBox(
                              optionItem.id,
                              optionItem,
                            );
                          } else {
                            handleToggleCheckBox(index);
                          }
                        }}
                      />
                      <RNText
                        style={{width: '80%'}}
                        small
                        textColor={COLORS.GRAYTEXTCOLOR}>
                        {optionItem?.option || ''}
                      </RNText>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </React.Fragment>
          </>
        )}

        {QuestionCheck?.CLOZE === examPlayType && (
          <>
            {Array.isArray(examPlayCard?.questionsList) &&
              examPlayCard?.questionsList?.map((item: any, index: any) => (
                <React.Fragment key={index}>
                  <RNText
                    style={styles.questionText}
                    semiBold
                    large
                    textColor={COLORS.TEXTCOLOR}>
                    {item?.title || ''}
                  </RNText>
                  {item?.imageURL && typeof item.imageURL === 'string' ? (
                    <View
                      style={[
                        styles.imageContainer,
                        {backgroundColor: COLORS.WHITE},
                      ]}>
                      <RNImage
                        resizeMode={'cover'}
                        source={{uri: item.imageURL}}
                        style={styles.image}
                      />
                    </View>
                  ) : (
                    <View style={styles.borderLine} />
                  )}

                  <View style={{marginTop: scale(30)}}>
                    {item?.examQuesOptionsList?.map(
                      (optionItem: any, index: number) => (
                        <TouchableOpacity
                          onPress={() => {
                            if (item?.isMultipleAnswers) {
                              handleMultiToggleCheckBox(
                                optionItem.id,
                                optionItem,
                              );
                            } else {
                              handleToggleCheckBox(index);
                              setSingleMCQItem(optionItem);
                            }
                          }}
                          key={index}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: item?.isMultipleAnswers
                              ? selectedMultiOptions.includes(optionItem.id)
                                ? '#DDE1F6'
                                : COLORS.WHITE
                              : checkedIndex !== index
                              ? COLORS.WHITE
                              : '#DDE1F6',
                            margin: 5,
                            padding: 5,
                          }}>
                          <CheckBox
                            checkedIcon={
                              item?.isMultipleAnswers ? (
                                <Image
                                  source={IMAGES.squareCheckBlue}
                                  style={styles.checkBoxIcon}
                                />
                              ) : (
                                <Image
                                  source={IMAGES.checked}
                                  style={{width: 20, height: 20}}
                                />
                              )
                            }
                            uncheckedIcon={
                              item?.isMultipleAnswers ? (
                                <Image
                                  source={IMAGES.squareBlack}
                                  style={styles.checkBoxIcon}
                                />
                              ) : (
                                <Image
                                  source={IMAGES.unchecked}
                                  style={{width: 20, height: 20}}
                                />
                              )
                            }
                            checked={
                              item?.isMultipleAnswers
                                ? selectedMultiOptions.includes(optionItem.id)
                                : checkedIndex === index
                            }
                            onPress={() => {
                              if (item?.isMultipleAnswers) {
                                handleMultiToggleCheckBox(
                                  optionItem.id,
                                  optionItem,
                                );
                              } else {
                                handleToggleCheckBox(index);
                              }
                            }}
                          />
                          <RNText
                            style={{width: '80%'}}
                            small
                            textColor={COLORS.GRAYTEXTCOLOR}>
                            {optionItem?.answer || ''}
                          </RNText>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </React.Fragment>
              ))}
          </>
        )}
      </>
    );
  };

  const SecondButtonBottomView = useMemo(() => {
    return () => (
      <RNButton
        title={submitButtonCondtion ? STRINGS.next : STRINGS.next}
        textColor={COLORS.WHITE}
        style={styles.button}
        loading={loading}
        disabled={
          multiSelectedMCQItem?.length === 0 && checkedIndex == -1
            ? true
            : false
        }
        backgroundColor={COLORS.SECONDARY}
        onPress={optionalQuestionCheckAnswer}
      />
    );
  }, [
    submitButtonCondtion,
    multiSelectedMCQItem,
    loading,
    optionalQuestionCheckAnswer,
  ]);

  const SixthButtonBottomView = useMemo(() => {
    return () => (
      <RNButton
        title={submitButtonCondtion ? STRINGS.next : STRINGS.next}
        textColor={COLORS.WHITE}
        style={styles.button}
        disabled={
          multiSelectedMCQItem?.length === 0 && checkedIndex == -1
            ? true
            : false
        }
        loading={loading}
        backgroundColor={COLORS.SECONDARY}
        onPress={optionalQuestionCheckAnswer}
      />
    );
  }, [
    submitButtonCondtion,
    clozeButtonDisable,
    loading,
    optionalQuestionCheckAnswer,
  ]);

  const getBottomChildren = (): React.ReactNode => {
    const examPlayCard = attestionQuestionData[currentCardIndex];
    const examPlayType = examPlayCard?.attestationQuestionOptions[0]?.type;

    if (!examPlayCard) {
      return null;
    }

    const buttonComponents = {
      [QuestionCheck.MCQs]: SecondButtonBottomView,
      //[QuestionCheck.CLOZE]: SixthButtonBottomView,
    };

    const ButtonComponent = buttonComponents[examPlayType];
    return ButtonComponent ? ButtonComponent() : null;
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RNContainer
        style={{backgroundColor: COLORS.MAINBACKGROUNDCOLOR}}
        onBack={submitButtonFunction}
        title={
          startAttestionData?.attestationDetail?.title?.trimEnd().length > 27
            ? startAttestionData?.attestationDetail?.title
                .trimEnd()
                .slice(0, 27) + '...'
            : startAttestionData?.attestationDetail?.title
        }
        bottomChildren={SecondButtonBottomView()}
        titleMarginRight={true}
        scroll
        showsVerticalScrollIndicator={false}
        hideBackgroundImage
        Points={undefined}>
        <Animated.View style={{transform: [{translateX: slideAnim}]}}>
          {QuestionView()}
          {FinshKnowledgeModalSecond()}
        </Animated.View>
      </RNContainer>
    </GestureHandlerRootView>
  );
};

export default AttestationExam;

const styles = StyleSheet.create({
  cardMainView: {
    width: '98%',
    marginTop: '7%',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: scale(10),
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 10,
    elevation: COLORS.ELEVATION,
    shadowOffset:
      Platform.OS === 'android' ? {width: 0, height: 0} : {width: 0, height: 2},
    shadowOpacity: Platform.OS === 'android' ? 0 : 1,
    shadowRadius: Platform.OS === 'android' ? 0 : 3.84,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  progressText: {
    marginLeft: 20,
  },
  textInput: {
    height: scale(110),
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    marginTop: scale(15),
    borderRadius: scale(5),
    padding: scale(10),
    width: '95%',
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    fontSize: scale(14),
    textAlignVertical: 'top', // for Android to align text to the top
  },
  optionsContainer: {
    padding: 15,
  },
  button: {
    width: '95%',
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    paddingVertical: scale(25),
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
    shadowOffset:
      Platform.OS === 'android' ? {width: 0, height: 0} : {width: 0, height: 2},
    shadowOpacity: Platform.OS === 'android' ? 0 : 0.24,
    shadowRadius: Platform.OS === 'android' ? 0 : 3.84,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  actionsheet: {
    //height: "0%",
    padding: 20,
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
  },
  dragHandle: {
    fontSize: 24,
    color: '#666',
  },
  questionText: {
    //marginTop: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: scale(5),
    marginBottom: scale(10),
  },
  imageContainer: {
    width: 373,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
  borderLine: {
    marginTop: scale(20),
    marginBottom: scale(20),
    borderWidth: 0.3,
    borderColor: COLORS.GRAYTEXTCOLOR,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    //padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    //paddingVertical:scale()
  },
  checkBoxIcon: {
    width: 20,
    height: 20,
  },
  answerLabel: {
    paddingHorizontal: scale(10),
    marginTop: scale(40),
  },
  courseButtonStyle1: {
    marginTop: scale(25),
    width: '87%',
    fontWeight: '300',
  },
});
