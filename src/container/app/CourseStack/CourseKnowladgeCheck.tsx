import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {
  RNActionSheet,
  RNButton,
  RNContainer,
  RNImage,
  RNText,
} from '../../../Common';
import { _onPressNavigate } from '../../../utils/commonFunction';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { SCREEN_NAMES } from '../../../config';
import { scale } from 'react-native-size-matters';
import { CheckBox } from 'react-native-elements';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, { RenderItemParams, DragEndParams } from 'react-native-draggable-flatlist';
import RNModal from '../../../Common/Modal/Modal';
import { useDispatch } from 'react-redux';
import { addKCResponseRequestAction, coursePlayRequestAction, examAddUserAttemptRequestAction, examPlayRequestAction, gamificationBooleanSuccessAction, startExamRequestAction, updateKCProgressRequestAction } from './module/action';
import { scromChapterSelector } from './module/reducer';
import { styles } from './styles';
import { string } from 'yup';
import { homeScreenSelector } from '../Home/module/reducer';
import { navigation } from '../../../config/constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CondtionClearAction } from '../PathStack/module/action';
import { pathSelector } from '../PathStack/module/reducer';
import LottieView from 'lottie-react-native';


const screenWidth = Dimensions.get('window').width;

const QuestionCheck = {
  TEXT: "TEXT",
  MCQs: "MCQs",
  TRUE_FALSE: "TRUE_FALSE",
  ORDEREDLIST: "ORDEREDLIST",
  MATCHLIST: "MATCHLIST",
  CLOZE: "CLOZE",
  seventhQuestion: "seventhQuestion",
}

const booleanFourthoptions = [
  { id: 1, text: 'True', isCorrect: true },
  { id: 2, text: 'False', isCorrect: false },
];



const CourseKnowledgeCheck: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { route } = props;
  const { kcData } = route?.params || {};
  const { storeCourseItemData } = homeScreenSelector();
  const { coursePlayData, examAddUserAttemptLoading, examAddUserAttemptData, examPlayLoading, examPlayData } = scromChapterSelector();
  const { condtionCourseString } = pathSelector();

  const ActionSheetNameRef: any = useRef(null);
  const ActionSheetClozeNameRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [seeCorrectAns, setSeeCorrectAns] = useState(false);
  const [seeYourAns, setSeeYourAns] = useState(false);
  const [disableButtonCondition, setDisableButtonCondition] = useState(false);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(false)
  const [answerText, setAnswerText] = useState('');
  const [previousAnswerText, setPreviousAnswerText] = useState('');
  const [questionCheckState, setQuestionCheckState] = useState("TEXT");
  const [optionalCheckWrongRight, setOptionalCheckWrongRight] = useState(false)
  const [checkedIndex, setCheckedIndex] = useState(-1);
  const [checkTrueFalseIndex, setCheckTrueFalseIndex] = useState(-1);
  const [selectedMultiOptions, setSelectedMultiOptions] = useState<any>([]);
  const [showMultiResults, setShowMultiResults] = useState(false);
  const [fifthDraggableData, setFifthDraggableData] = useState<any>([]);
  const [showFifthDraggleResults, setShowFifthDraggleResults] = useState(false);
  const [fifthSeeCorrectAnsState, setFifthSeeCorrectAnsState] = useState(false);
  const [showSeventhActionSheet, setShowSeventhActionSheet] = useState(false);
  const [showSixthActionResults, setShowSixthActionResults] = useState(false);
  const [showSeventhActionResults, setShowSeventhActionResults] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [MCQItem, setMCQItem] = useState<any>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [trueAndFalseItem, setTrueAndFalseItem] = useState<any>([]);
  const [booleanValueCheck, setBooleanValueCheck] = useState(false);
  const [booleanCorrectAns, setBooleanCorrectAns] = useState<any>([]);
  const [matchListValue, setMatchListValue] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [matchListIndexValue, setMatchListIndexValue] = useState(-1);
  const [passingMatchListData, setPassingMatchListData] = useState<any>([])
  const [draggableBoolean, setDraggableBoolean] = useState(true);
  const [draggableRightWrongAns, setDraggableRightWrongAns] = useState<any>([]);
  const [clozeButtonDisable, setClozeButtonDisable] = useState(true);
  const [clozeButtonSelectedItem, setClozeButtonSelectedItem] = useState<any>([])
  const [submitButtonCondtion, setSubmitButtonCondtion] = useState(false);
  const [multiSelectedMCQItem, setMultiSelectedMCQItem] = useState<any>([]);
  const [multiSelectedResponse, setMultiSelectedResponse] = useState<any>([]);
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

  useFocusEffect(
    useCallback(() => {
      addUserAttemptFunction();
      examPlayFunction();
      return () => {
        resetQuestionState();
      };
    }, [route?.params?.kcData])
  );

  const addUserAttemptFunction = () => {
    const { assignedDate } = storeCourseItemData;
    const { id } = kcData;
    if (assignedDate) {
      const body = {
        EntityId: props?.route?.params?.kcData?.id || "",
        assignedDate: assignedDate,
        EntityType: "EXAM"
      };
      dispatch(examAddUserAttemptRequestAction({ body }));
    }
  }
  const examPlayFunction = () => {
    const { assignedDate } = storeCourseItemData;
    const { id } = kcData;
    if (assignedDate) {
      const body = {
        EntityId: route?.params?.kcData?.id,
        assignedDate: assignedDate,
      };
      dispatch(examPlayRequestAction({ body }));
    }
  }


  useEffect(() => {
    navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      );
    });
    navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      );
      (navigation as any).removeListener('blur');
      (navigation as any).removeListener('focus');
    };
  }, []);

  const handleBackButtonClick = () => {
    Alert.alert(STRINGS.confirmation, STRINGS.appExitWarning, [
      {
        text: STRINGS.exit,
        onPress: () => {
          dispatch(CondtionClearAction())
          BackHandler.exitApp();
        }
      },
      {
        text: STRINGS.cancel,
        onPress: () => console.log('cancelled')
      }
    ]);
    return true;
  };

  const handleCheckAnswer = () => {
    setLoading(true); // Set loading state to true before making the request
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (!hasFilterData || !hasFilterData.examQuesOptionsList || !Array.isArray(hasFilterData.examQuesOptionsList)) {
      Toast.show("Invalid data structure for examQuesOptionsList", { type: 'danger' });
      setLoading(false); // Set loading state to false if there's an error
      return;
    }

    const modifiedExamQuesOptionsList = hasFilterData.examQuesOptionsList.map((option: any) => {
      if (!option || typeof option !== 'object' || !option.answer) {
        Toast.show("Invalid option object in examQuesOptionsList", { type: 'danger' });
        setLoading(false); // Set loading state to false if there's an error
        return option;
      }

      return {
        ...option,
        answer: answerText !== undefined ? answerText : option.answer // Use the provided answerText or keep the existing answer
      };
    });

    const hasId = typeof hasFilterData.id === 'string' && hasFilterData.id.trim().length > 0;
    const hasType = typeof hasFilterData.type === 'string' && hasFilterData.type.trim().length > 0;

    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : "",
            type: hasType ? hasFilterData.type : "",
            isStatementTrue: false,
            examQuesOptionsList: modifiedExamQuesOptionsList
          }
        ]
      },
      attemptId: examAddUserAttemptData?.attemptId
    };

    const callback = (res: any) => {
      setLoading(false); // Set loading state to false after receiving the response

      if (res && typeof res === 'object' && !Array.isArray(res) && res !== 'error') {
        const { userAnswerData } = res;
        if (userAnswerData && typeof userAnswerData === 'object') {
          const { correctAnswer, textAnswer } = userAnswerData;
          if (typeof correctAnswer === 'string' && typeof textAnswer === 'string') {
            const isAnswerCorrect = correctAnswer === textAnswer;
            setSubmitButtonCondtion(currentCardIndex === examPlayData?.length - 1);
            setDisableButtonCondition(true);
            setSeeCorrectAns(!isAnswerCorrect);
            setFirstAttemptCorrect(isAnswerCorrect);
            setAnswerText(isAnswerCorrect ? correctAnswer : textAnswer);
          }
        }
      } else {
        console.error("Invalid response data");
      }
    };

    dispatch(addKCResponseRequestAction({ body, callback }));
  };

  // const handleMultiSubmit = () => {
  //   setShowMultiResults(true);
  //   if (showMultiResults) {
  //     setQuestionCheckState("ORDEREDLIST");
  //   }
  //   else {

  //   }
  // };

  const handleDraggleCheck = () => {
    setLoading(true);
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (!hasFilterData || !hasFilterData.examQuesOptionsList || !Array.isArray(hasFilterData.examQuesOptionsList)) {
      Toast.show("Invalid data structure for examQuesOptionsList", { type: 'danger' });
      setLoading(false);
      return;
    }

    const hasId = typeof hasFilterData.id === 'string' && hasFilterData.id.trim().length > 0;
    const hasType = typeof hasFilterData.type === 'string' && hasFilterData.type.trim().length > 0;

    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : "",
            type: hasType ? hasFilterData.type : "",
            isStatementTrue: false,
            examQuesOptionsList: fifthDraggableData
          }
        ]
      },
      attemptId: examAddUserAttemptData?.attemptId
    };

    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        setSubmitButtonCondtion(currentCardIndex === examPlayData?.length - 1);
        setShowFifthDraggleResults(true);
        const correctAnswer = res?.questionDetails?.questionsList[0]?.examQuesOptionsList;
        setDraggableRightWrongAns(correctAnswer)
      }
    };
    dispatch(addKCResponseRequestAction({ body, callback }));
  }

  const resetQuestionState = () => {
    setLoading(false);
    setSeeCorrectAns(false);
    setSeeYourAns(false);
    setDisableButtonCondition(false);
    setFirstAttemptCorrect(false);
    setAnswerText('');
    setPreviousAnswerText('');
    setOptionalCheckWrongRight(false);
    setCheckedIndex(-1);
    setCheckTrueFalseIndex(-1);
    setSelectedMultiOptions([]);
    setShowMultiResults(false);
    setFifthDraggableData([]);
    setShowFifthDraggleResults(false);
    setFifthSeeCorrectAnsState(false);
    setShowSeventhActionSheet(false);
    setShowSixthActionResults(false);
    setShowSeventhActionResults(false);
    setModalVisible(false);
    setModalVisible1(false)
    setMCQItem([]);
    setCorrectAnswerIndex(null);
    setTrueAndFalseItem([]);
    setBooleanValueCheck(false);
    setBooleanCorrectAns([]);
    setMatchListValue([]);
    setSelectedIndex(-1);
    setMatchListIndexValue(-1);
    setPassingMatchListData([]);
    setDraggableBoolean(true);
    setDraggableRightWrongAns([]);
    setClozeButtonDisable(true);
    setClozeButtonSelectedItem([]);
    setSubmitButtonCondtion(false);
    setMultiSelectedMCQItem([]);
  };

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const plainTextInputFunction = (text: any) => {
    setAnswerText(text);
    setPreviousAnswerText(text);
  }

  const nextButtonCondtion = () => {
    if (currentCardIndex < examPlayData?.length - 1) {
      resetQuestionState();
      setCurrentCardIndex(currentCardIndex + 1)
    }
    else {
      //setModalVisible(true)
    }
  }

  const _onPressActionSheet = (item: any, index: number) => {
    setMatchListIndexValue(index)
    ActionSheetNameRef?.current?.show();
  };

  const _onPressActionSheetCloze = () => {
    ActionSheetClozeNameRef?.current?.show();
  };

  const handleSeeCorrectAnswer = (item: any) => {
    setAnswerText(item?.examQuesOptionsList[0]?.answer)
    setSeeCorrectAns(false);
    setSeeYourAns(true);
  };

  const handleSeeYourAnswer = (item: any) => {
    setAnswerText(previousAnswerText);
    setSeeCorrectAns(true)
    setSeeYourAns(false)
  };

  const mcqQuetionCheck = () => {
    setLoading(true);
    // let selectedItem = [];
    // selectedItem.push(MCQItem)
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (!hasFilterData || !hasFilterData.examQuesOptionsList || !Array.isArray(hasFilterData.examQuesOptionsList)) {
      Toast.show("Invalid data structure for examQuesOptionsList", { type: 'danger' });
      setLoading(false);
      return;
    }

    const hasId = typeof hasFilterData.id === 'string' && hasFilterData.id.trim().length > 0;
    const hasType = typeof hasFilterData.type === 'string' && hasFilterData.type.trim().length > 0;


    let selectedOptions;
    if (hasFilterData.isMultipleAnswers) {
      // For multiple selections
      selectedOptions = multiSelectedMCQItem.map((item: any) => ({
        id: item?.id,
        answer: item?.answer,
        isCorrectAnswer: item?.isCorrectAnswer
      }));
    } else {
      // For single selection
      selectedOptions = MCQItem ? [{
        id: MCQItem.id,
        answer: MCQItem.answer,
        isCorrect: MCQItem.isCorrect
      }] : [];
    }

    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : "",
            type: hasType ? hasFilterData.type : "",
            isStatementTrue: false,
            examQuesOptionsList: selectedOptions
          }
        ]
      },
      attemptId: examAddUserAttemptData?.attemptId
    };

    // let body = {
    //   body: {
    //     isGrouped: false,
    //     examQuesList: [
    //       {
    //         id: hasId ? hasFilterData.id : "",
    //         type: hasType ? hasFilterData.type : "",
    //         isStatementTrue: false,
    //         examQuesOptionsList: selectedItem
    //       }
    //     ]
    //   },
    //   attemptId: examAddUserAttemptData?.attemptId
    // };

    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        setOptionalCheckWrongRight(true);
        const correctAnswer = res?.questionDetails?.questionsList[0]?.examQuesOptionsList?.findIndex((item: any) => item?.isCorrectAnswer === true);
        setMultiSelectedResponse(res);
        setSubmitButtonCondtion(currentCardIndex === examPlayData?.length - 1);
        setCorrectAnswerIndex(correctAnswer)
      }
    };
    dispatch(addKCResponseRequestAction({ body, callback }));
  }

  const handleToggleCheckBox = (index: any) => {
    if (checkedIndex === index) {
      // If the same item is clicked again, unselect it
      setCheckedIndex(-1);
    } else {
      // Otherwise, select the new item and unselect the previously selected item
      setCheckedIndex(index);
    }
  };

  const handleBooleanCheck = () => {
    setLoading(true);
    const examQuesOptionsList = [
      {
        Answer: "string",
        SequenceNumber: 1,
        Id: "00000000-0000-0000-0000-000000000000"
      }
    ];
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (!hasFilterData || !hasFilterData.examQuesOptionsList || !Array.isArray(hasFilterData.examQuesOptionsList)) {
      Toast.show("Invalid data structure for examQuesOptionsList", { type: 'danger' });
      setLoading(false);
      return;
    }

    const hasId = typeof hasFilterData.id === 'string' && hasFilterData.id.trim().length > 0;
    const hasType = typeof hasFilterData.type === 'string' && hasFilterData.type.trim().length > 0;

    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : "",
            type: hasType ? hasFilterData.type : "",
            isStatementTrue: trueAndFalseItem?.isCorrect,
            examQuesOptionsList: examQuesOptionsList
          }
        ]
      },
      attemptId: examAddUserAttemptData?.attemptId
    };
    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        setSubmitButtonCondtion(currentCardIndex === examPlayData?.length - 1);
        setBooleanCorrectAns(res?.userAnswerData);
        setBooleanValueCheck(true);
      }
    };
    dispatch(addKCResponseRequestAction({ body, callback }));
  }


  const openActionSheetFunction = () => {
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList;
    const handleSelectOption = (selectedItem: any) => {
      const hasFilterDataUpdateWithIndex = hasFilterData[matchListIndexValue];
      const selectedItemUpdate = selectedItem?.examQuesOptionsList?.map(({ answer, id, ...rest }: { answer: string, id: string }, index: number) => ({
        answer: answer,
        id: id,
        SequenceNumber: index + 1
      }));
      const updatedItem = {
        ...hasFilterDataUpdateWithIndex,
        examQuesOptionsList: selectedItemUpdate
      };
      const existingIndex = passingMatchListData.findIndex(
        (item: any) => item.id === updatedItem.id
      );
      let newPassingMatchListData;
      if (existingIndex !== -1) {
        // If item exists, update it
        newPassingMatchListData = passingMatchListData.map((item: any, index: number) =>
          index === existingIndex ? updatedItem : item
        );
      } else {
        // If item doesn't exist, add it
        newPassingMatchListData = [...passingMatchListData, updatedItem];
      }

      setPassingMatchListData(newPassingMatchListData);
      ActionSheetNameRef?.current?.hide();
    };
    return (
      <RNActionSheet ActionSheetRef={ActionSheetNameRef}>
        <View style={styles.actionsheet}>
          <RNText
            style={{ paddingHorizontal: scale(10), marginBottom: scale(10) }}
            textColor={COLORS.TEXTCOLOR}
            medium
          >
            Which of the following is the only CORRECT combination?
          </RNText>

          {hasFilterData?.map((item: any, index: number) => (
            <Pressable
              onPress={() => {
                handleSelectOption(item);
                setSelectedIndex(index);
              }}
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: selectedIndex !== index ? COLORS.WHITE : "#DDE1F6",
                margin: 5,
                marginBottom: scale(10),
              }}
            >
              <CheckBox
                checkedIcon={<RNImage source={IMAGES.checked} style={{ width: 20, height: 20 }} />}
                uncheckedIcon={<RNImage source={IMAGES.unchecked} style={{ width: 20, height: 20 }} />}
                checked={selectedIndex === index}
              />
              <View style={{ width: scale(230) }}>
                <RNText small textColor={COLORS.GRAYTEXTCOLOR}>
                  {item?.examQuesOptionsList[0]?.answer || ""}
                </RNText>
              </View>

            </Pressable>
          ))}
        </View>
      </RNActionSheet>
    );
  };


  const clozeListSelectedFunction = (item: any, index: number) => {
    setSelectedIndex(index)
    setClozeButtonDisable(false);
    setClozeButtonSelectedItem(item || []);
    ActionSheetClozeNameRef?.current?.hide();
  }

  const openClozeActionSheetFunction = () => {
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList[0];
    return (
      <RNActionSheet ActionSheetRef={ActionSheetClozeNameRef}>
        <View style={styles.actionsheet}>
          {hasFilterData?.examQuesOptionsList?.map((item: any, index: number) => (
            <Pressable
              key={index}
              onPress={() => clozeListSelectedFunction(item, index)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.WHITE,
                marginBottom: scale(10),
              }}
            >
              <CheckBox
                checkedIcon={<RNImage source={IMAGES.checked} style={{ width: 20, height: 20 }} />}
                uncheckedIcon={<RNImage source={IMAGES.unchecked} style={{ width: 20, height: 20 }} />}
                checked={selectedIndex === index}
              />
              <View style={{ width: scale(230) }}>
                <RNText small textColor={COLORS.GRAYTEXTCOLOR}>
                  {item?.answer || ""}
                </RNText>
              </View>
            </Pressable>
          ))}
        </View>
      </RNActionSheet>
    );
  };

  const handleSixthActionSheetSubmit = () => {
    setLoading(true);
    let selectedItem = [];
    selectedItem.push(clozeButtonSelectedItem)
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];
    if (!hasFilterData || !hasFilterData.examQuesOptionsList || !Array.isArray(hasFilterData.examQuesOptionsList)) {
      Toast.show("Invalid data structure for examQuesOptionsList", { type: 'danger' });
      setLoading(false);
      return;
    }
    const hasId = typeof hasFilterData.id === 'string' && hasFilterData.id.trim().length > 0;
    const hasType = typeof hasFilterData.type === 'string' && hasFilterData.type.trim().length > 0;
    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : "",
            type: hasType ? hasFilterData.type : "",
            isStatementTrue: false,
            examQuesOptionsList: selectedItem
          }
        ]
      },
      attemptId: examAddUserAttemptData?.attemptId
    };

    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        setSubmitButtonCondtion(currentCardIndex === examPlayData?.length - 1);
        setShowSixthActionResults(true);
      }
    };
    dispatch(addKCResponseRequestAction({ body, callback }));

  }

  // const handleMultiToggleCheckBox = (index: number) => {
  //   if (checkedIndex === index) {
  //       // If the same item is clicked again, unselect it
  //       setCheckedIndex(-1);
  //   } else {
  //       // Otherwise, select the new item and unselect the previously selected item
  //       setCheckedIndex(index);
  //   }
  // };

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

  // const handleDragEnd = ({ data }: DragEndParams<any>) => {
  //   const updatedData: any = data.map((item: any, index: number) => ({
  //     answer: item.answer,
  //     id: item.id,
  //     sequenceNumber: index + 1
  //   }));
  //   setFifthDraggableData(updatedData);
  //   setDraggableBoolean(false)
  // };

  // const handleDragEnd = ({ data, from, to }: DragEndParams<any>) => {
  //   console.log('Moved from index:', from, 'to index:', to);
  //   console.log('New data order:', data.map(item => item.answer));

  //   const updatedData = data.map((item, index) => ({
  //     ...item,
  //     sequenceNumber: index + 1
  //   }));

  //   setFifthDraggableData(updatedData);
  //   setDraggableBoolean(false);
  // };

  const isOrderCorrect = (data: any, referenceData: any) => {
    if (data.length !== referenceData.length) {
      return false;
    }
    const referenceLabels = referenceData.map((item: any) => item.label);
    return data.every((item: any) => referenceLabels.includes(item.label));
  };

  const fifthSeeCorrectAns = () => {
    setFifthSeeCorrectAnsState(true)
  }

  const fifthSeeYourAns = () => {
    setFifthSeeCorrectAnsState(false)
  }

  const seventhSeeCorrectAns = () => {
    setShowSeventhActionSheet(true)
  }

  const seventhSeeYourAns = () => {
    setShowSeventhActionSheet(false)
  }

  const handleSeventhActionSheetCheck = () => {
    setLoading(true);
    let updatedDataForServer = passingMatchListData?.map((item: any) => {
      const hasId = item?.id !== undefined && item?.id !== null;
      const hasType = item?.type !== undefined && item?.type !== null;

      return {
        id: hasId ? item.id : "",
        type: hasType ? item.type : "",
        isStatementTrue: false,
        examQuesOptionsList: Array.isArray(item.examQuesOptionsList)
          ? item.examQuesOptionsList.map((option: any) => ({
            id: option?.id || "",
            answer: option?.answer || "",
            SequenceNumber: option?.SequenceNumber || 0
          }))
          : []
      };
    }).filter(Boolean);

    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (!hasFilterData || !hasFilterData.examQuesOptionsList || !Array.isArray(hasFilterData.examQuesOptionsList)) {
      Toast.show("Invalid data structure for examQuesOptionsList", { type: 'danger' });
      setLoading(false);
      return;
    }
    let body = {
      body: {
        isGrouped: true,
        examQuesList: updatedDataForServer
      },
      attemptId: examAddUserAttemptData?.attemptId
    };

    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        setSubmitButtonCondtion(currentCardIndex === examPlayData?.length - 1);
        setShowSeventhActionResults(true);
        setMatchListValue(res?.questionDetails)
      }
    };
    dispatch(addKCResponseRequestAction({ body, callback }));
  }

  // const submitButtonFunction = () => {
  //   setLoading(true);
  //   const { assignedDate } = storeCourseItemData;
  //   let body = {
  //     attemptId: examAddUserAttemptData?.attemptId || "",
  //     assignedDate: assignedDate
  //   }
  //   const callback = (res: any) => {
  //     setLoading(false);
  //     if (res !== 'error') {
  //       Toast.show("Knowledge Check Submitted Successfully", { type: 'success' });
  //       coursePlayFunction();
  //       // _onPressNavigate(SCREEN_NAMES.CourseStack, {
  //       //   screen: SCREEN_NAMES.MainCourse,
  //       // })
  //     }
  //   }

  //   dispatch(updateKCProgressRequestAction({ body, callback }));
  // }

  const TextInputFunction = () => {
    const handleTextChange = (text: string) => {
      setAnswerText(text);
      setPreviousAnswerText(text);
    };
    return (
      <TextInput
        style={[
          styles.textInput,
          {
            borderColor: seeCorrectAns ? COLORS.RED : COLORS.WHITE,
            backgroundColor: seeCorrectAns ? COLORS.LIGHTRED : COLORS.WHITE,
          },
        ]}
        multiline
        placeholder="Type your answer here..."
        value={answerText}
        onChangeText={handleTextChange}
      />
    )
  }

  const submitButtonFunction = () => {
    if (loading) return; // Prevent function execution if already loading

    setLoading(true);
    const { assignedDate } = storeCourseItemData;
    let body = {
      attemptId: examAddUserAttemptData?.attemptId || "",
      assignedDate: assignedDate
    };

    const callback = (res: any) => {
      setLoading(false);
      if (res) {
        // Toast.show("Knowledge Check Submitted Successfully", { type: 'success' });
        coursePlayFunction();
        // _onPressNavigate(SCREEN_NAMES.CourseStack, {
        //   screen: SCREEN_NAMES.MainCourse,
        // })
      }
    };
    dispatch(updateKCProgressRequestAction({ body, callback }));
    // Make your API call here and pass `callback` to handle the response
  };

  const coursePlayFunction = () => {
    const { id } = kcData;
    const currentChapterIndex = coursePlayData?.chapters.findIndex((chapter: any) => chapter?.kcExam?.id === props?.route?.params?.kcData?.id);
    if (currentChapterIndex !== -1 && currentChapterIndex + 1 < coursePlayData?.chapters.length) {
      const secondChapterItem = coursePlayData?.chapters[currentChapterIndex + 1];
      resetQuestionState();
      setCurrentCardIndex(0);
      _onPressNavigate(SCREEN_NAMES.CourseStack, {
        screen: SCREEN_NAMES.CourseTutorial,
        params: {
          materialData: secondChapterItem?.materials[0],
          hasParamData: storeCourseItemData
        },
      })
    }
    else {
      if (coursePlayData?.exam?.remainingRetries > 0) {
        setModalVisible(true);
      }
      else {
        setModalVisible1(true)
      }

    }
  }


  const replayFunction = () => {
    let materialItemReplay = coursePlayData?.chapters[0]?.materials[0] || [];
    resetQuestionState();
    setCurrentCardIndex(0);
    _onPressNavigate(SCREEN_NAMES.CourseStack, {
      screen: SCREEN_NAMES.CourseTutorial,
      params: {
        materialData: materialItemReplay,
        hasParamData: storeCourseItemData
      },
    })
  }


  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <Pressable
        onLongPress={drag} // Use onLongPress instead of onPressIn for better UX
        style={[
          styles.optionButton,
          {
            backgroundColor: isActive ? '#f0f0f0' : '#fff',
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: 'center',
            opacity: isActive ? 0.8 : 1, // Add visual feedback
            elevation: isActive ? 5 : 1, // Add shadow when dragging (Android)
            shadowOpacity: isActive ? 0.3 : 0.1, // Add shadow when dragging (iOS)
          },
        ]}
      >
        <RNText style={styles.optionText}>{item?.answer || ""}</RNText>
        <Image
          source={IMAGES.gripDotsVertical}
          style={{ width: 10, height: 20 }}
        />
      </Pressable>
    );
  };

  useEffect(() => {
    const examPlayCard = examPlayData?.[currentCardIndex] ?? {};
    const examPlayType = examPlayCard?.questionsList?.[0]?.type;
    if (QuestionCheck?.ORDEREDLIST === examPlayType && examPlayCard?.questionsList) {
      const hasDragerData = examPlayCard.questionsList.flatMap(
        (question: any) => question?.examQuesOptionsList || []
      );

      // Prevent unnecessary state update
      setFifthDraggableData((prevData: any) => {
        const isSame =
          prevData.length === hasDragerData.length &&
          prevData.every((item: any, index: number) => item === hasDragerData[index]);
        return isSame ? prevData : hasDragerData;
      });
    }
  }, [QuestionCheck, currentCardIndex]);

  const handleDragEnd = ({ data }: DragEndParams<any>) => {
    const updatedData: any = data.map((item: any, index: number) => ({
      answer: item.answer,
      id: item.id,
      sequenceNumber: index + 1
    }));
    setFifthDraggableData(updatedData);
    setDraggableBoolean(false)
  };

  const QuestionView = () => {
    const examPlayCard = examPlayData?.[currentCardIndex] ?? {};
    const examPlayType = examPlayCard?.questionsList?.[0]?.type;

    if (!examPlayCard || typeof examPlayCard !== 'object') {
      return (
        <View style={{ justifyContent: "center", width: '90%', alignItems: 'center' }}>
          <RNText TextAlignCenter large textColor={COLORS.BORDER_COLOR}>No Record Found</RNText>
        </View>
      );
    }

    // useEffect(() => {
    //   if (QuestionCheck?.ORDEREDLIST === examPlayType && examPlayCard?.questionsList) {
    //     const hasDragerData = examPlayCard.questionsList.flatMap(
    //       (question: any) => question?.examQuesOptionsList || []
    //     );
    //     setFifthDraggableData(hasDragerData);
    //   }
    // }, [examPlayType, examPlayCard?.questionsList, QuestionCheck]);


    return (
      !examPlayLoading &&
      <>
        {QuestionCheck?.TEXT === examPlayType && (
          <>
            {Array.isArray(examPlayCard?.questionsList) && examPlayCard?.questionsList?.map((item: any, index: any) => (
              <>
                <RNText style={styles.questionText} semiBold large textColor={COLORS.TEXTCOLOR}>
                  {item?.title || ""}
                </RNText>

                {(item?.imageURL && typeof item.imageURL === 'string') ? (
                  <View style={[styles.imageContainer, { backgroundColor: COLORS.WHITE }]}>
                    <RNImage resizeMode={"cover"} source={{ uri: item.imageURL }} style={styles.image} />
                  </View>
                ) : (
                  <View style={styles.borderLine} />
                )}

                <RNText style={styles.answerLabel} medium textColor={COLORS.GRAYTEXTCOLOR}>
                  Answer*
                </RNText>


                {seeCorrectAns && (
                  <View style={styles.incorrectAnswerContainer}>
                    <RNImage source={IMAGES.circleXmarkRed} style={styles.incorrectIcon} />
                    <RNText style={styles.incorrectText} textColor={COLORS.RED} small>
                      Incorrect
                    </RNText>
                    <Pressable onPress={() => handleSeeCorrectAnswer(item)}>
                      <RNText underline style={styles.seeCorrectAnswerText} textColor={COLORS.PRIMARY} small>
                        See Correct Answer
                      </RNText>
                    </Pressable>
                  </View>
                )}
                {seeYourAns && (
                  <Pressable onPress={() => handleSeeYourAnswer(item)} style={styles.seeYourAnswerContainer}>
                    <RNText underline style={styles.seeYourAnswerText} textColor={COLORS.PRIMARY} small>
                      See Your Answer
                    </RNText>
                  </Pressable>
                )}

                {firstAttemptCorrect && (
                  <View style={styles.incorrectAnswerContainer}>
                    <RNText style={styles.seeCorrectAnswerText} textColor={COLORS.GREEN} small>
                      Correct Answer ✅
                    </RNText>
                  </View>
                )}

              </>
            ))}
          </>
        )}

        {QuestionCheck?.MCQs === examPlayType && (
          <>
            {Array.isArray(examPlayCard?.questionsList) && examPlayCard?.questionsList?.map((item: any, index: any) => (
              <>
                <RNText style={styles.questionText} semiBold large textColor={COLORS.TEXTCOLOR}>
                  {item?.title || ""}
                </RNText>

                {(item?.imageURL && typeof item.imageURL === 'string') ? (
                  <View style={[styles.imageContainer, { backgroundColor: COLORS.WHITE }]}>
                    <RNImage resizeMode={"cover"} source={{ uri: item.imageURL }} style={styles.image} />
                  </View>
                ) : (
                  <View style={styles.borderLine} />
                )}
                <View style={{ marginTop: scale(30) }}>
                  {!optionalCheckWrongRight
                    ? item?.examQuesOptionsList?.map((optionItem: any, index: number) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (item?.isMultipleAnswers) {
                            handleMultiToggleCheckBox(optionItem.id, optionItem);
                          }
                          else {
                            handleToggleCheckBox(index);
                            setMCQItem(optionItem);
                          }
                          // setCorrectAnswerIndex(correctIndex !== -1 ? correctIndex : null);
                        }}
                        key={index}
                        style={{ flexDirection: "row", alignItems: "center", backgroundColor: checkedIndex !== index ? COLORS.WHITE : "#DDE1F6", margin: 5, }}>
                        <CheckBox
                          checkedIcon={
                            item?.isMultipleAnswers ? (
                              <Image source={IMAGES.squareCheckBlue} style={styles.checkBoxIcon} />
                            ) : (
                              <Image source={IMAGES.checked} style={{ width: 20, height: 20 }} />
                            )
                          }
                          uncheckedIcon={
                            item?.isMultipleAnswers ? (
                              <Image source={IMAGES.squareBlack} style={styles.checkBoxIcon} />
                            ) : (
                              <Image source={IMAGES.unchecked} style={{ width: 20, height: 20 }} />
                            )
                          }
                          checked={
                            item?.isMultipleAnswers
                              ? selectedMultiOptions.includes(optionItem.id)
                              : checkedIndex === index
                          }
                          onPress={() => {
                            if (item?.isMultipleAnswers) {
                              handleMultiToggleCheckBox(optionItem.id, optionItem);
                            } else {
                              //setMCQItem(optionItem);
                              handleToggleCheckBox(index);
                            }
                          }}
                        />
                        <RNText small style={{ width: "80%" }} textColor={COLORS.GRAYTEXTCOLOR}>{optionItem?.answer || ""}</RNText>
                      </TouchableOpacity>
                    ))
                    :
                    !item?.isMultipleAnswers ?
                      item?.examQuesOptionsList?.map((optionItem: any, index: number) => (
                        <Pressable
                          key={index}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor:
                              checkedIndex === correctAnswerIndex && checkedIndex === index
                                ? COLORS.LIGHTGREEN // Correct answer selected
                                : checkedIndex !== correctAnswerIndex && checkedIndex === index
                                  ? COLORS.LIGHTRED // Wrong answer selected
                                  : correctAnswerIndex === index
                                    ? COLORS.LIGHTGREEN // Correct answer
                                    : COLORS.WHITE, // Default color
                            borderWidth: 0.5,
                            borderColor:
                              checkedIndex === correctAnswerIndex && checkedIndex === index
                                ? COLORS.GREEN // Correct answer selected
                                : checkedIndex !== correctAnswerIndex && checkedIndex === index
                                  ? COLORS.RED // Wrong answer selected
                                  : correctAnswerIndex === index
                                    ? COLORS.GREEN // Correct answer
                                    : COLORS.WHITE, // Default color
                            margin: 5,
                            padding: checkedIndex === correctAnswerIndex && checkedIndex === index
                              ? scale(13) // Correct answer selected
                              : checkedIndex !== correctAnswerIndex && checkedIndex === index
                                ? scale(13) // Wrong answer selected
                                : correctAnswerIndex === index
                                  ? scale(13) // Correct answer
                                  : 0, // Default color
                          }}
                        >
                          {/* {checkedIndex == index ?
                        <RNImage source={IMAGES.circleXmarkRed} style={{ width: 20, height: 20, }} />
                        : */}


                          {
                            checkedIndex === index ? (
                              checkedIndex === correctAnswerIndex ? (
                                // Correct answer selected
                                <View
                                  style={[
                                    styles.checkboxConsdtions,
                                    {
                                      backgroundColor: COLORS.GREEN
                                    }
                                  ]}>
                                  <RNImage source={IMAGES.checkWhite} style={{ width: 13, height: 10, alignItems: "center" }} />
                                </View>
                              ) : (
                                // Wrong answer selected
                                <View
                                  style={[
                                    styles.checkboxConsdtions,
                                    {
                                      backgroundColor: COLORS.RED
                                    }
                                  ]}
                                >
                                  <RNImage source={IMAGES.xmarkWhite} style={{ width: 13, height: 10, alignItems: "center" }} />
                                </View>)
                            ) : correctAnswerIndex === index ? (
                              // Correct answer
                              <View
                                style={[
                                  styles.checkboxConsdtions,
                                  {
                                    backgroundColor: COLORS.GREEN
                                  }
                                ]}
                              >
                                <RNImage source={IMAGES.checkWhite} style={{ width: 13, height: 10, alignItems: "center" }} />
                              </View>) : (
                              // Default unchecked CheckBox
                              <CheckBox
                                uncheckedIcon={
                                  <RNImage source={IMAGES.unchecked} style={{ width: 20, height: 20 }} />
                                }
                              />
                            )
                          }



                          {/* <CheckBox
                          uncheckedIcon={<RNImage source={IMAGES.unchecked} style={{ width: 20, height: 20 }} />} /> */}

                          <RNText style={{
                            marginLeft: checkedIndex === correctAnswerIndex && checkedIndex === index
                              ? 22
                              : checkedIndex !== correctAnswerIndex && checkedIndex === index
                                ? 22
                                : correctAnswerIndex === index
                                  ? 22
                                  : 0, width: "80%"
                          }} small textColor={COLORS.GRAYTEXTCOLOR}>
                            {optionItem?.answer || ""}
                          </RNText>
                        </Pressable>
                      ))
                      :
                      multiSelectedResponse?.questionDetails?.questionsList[0]?.examQuesOptionsList?.map((optionItem: any, index: number) => {

                        const isCorrect = optionItem.isCorrectAnswer;
                        let isUserAnswer;
                        const userSelectedIds = multiSelectedResponse?.userAnswerData?.optionIds?.split('|') || [];
                        isUserAnswer = userSelectedIds.includes(optionItem.id);

                        let backgroundColor = COLORS.WHITE;
                        let widthcolor = COLORS.WHITE;
                        let icon = IMAGES.unchecked;

                        if (isCorrect) {
                          backgroundColor = COLORS.LIGHTGREEN;
                          widthcolor = COLORS.GREEN;
                          icon = IMAGES.checkWhite;
                        }
                        if (isUserAnswer) {
                          backgroundColor = isCorrect ? COLORS.LIGHTGREEN : COLORS.LIGHTRED;
                          widthcolor = isCorrect ? COLORS.GREEN : COLORS.RED;
                          icon = isCorrect ? IMAGES.checkWhite : IMAGES.xmarkWhite;
                        }

                        const anyIncorrectSelected = multiSelectedResponse?.questionDetails?.questionsList[0]?.examQuesOptionsList
                          .some((option: any) => !option.isCorrectAnswer && userSelectedIds.includes(option.id));

                        return (
                          <Pressable
                            key={index}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: backgroundColor,
                              borderWidth: 0.5,
                              borderColor: widthcolor,
                              margin: 5,
                              padding: scale(13)
                            }}
                          >
                            <View
                              style={[
                                styles.checkboxConsdtions,
                                {
                                  backgroundColor: widthcolor,
                                }
                              ]}>

                              {(!isCorrect && !isUserAnswer) ?
                                <RNImage source={IMAGES.unchecked} style={{ width: 23, height: 20, alignItems: "center" }} /> :
                                <RNImage source={icon} style={{ width: 13, height: 10, alignItems: "center" }} />
                              }
                            </View>

                            <RNText style={{
                              marginLeft: 22, width: "80%"
                            }} small textColor={COLORS.GRAYTEXTCOLOR}>
                              {optionItem?.answer || ""}
                            </RNText>
                          </Pressable>
                        )
                      }

                      )}
                </View></>
            ))}
          </>
        )}

        {QuestionCheck?.TRUE_FALSE === examPlayType && (
          <>
            {Array.isArray(examPlayCard?.questionsList) && examPlayCard?.questionsList?.map((item: any, index: any) => (
              <>
                <RNText style={styles.questionText} semiBold medium textColor={COLORS.TEXTCOLOR}>
                  {item?.title || ""}
                </RNText>
                {(item?.imageURL && typeof item.imageURL === 'string') ? (
                  <View style={[styles.imageContainer, { backgroundColor: COLORS.WHITE }]}>
                    <RNImage resizeMode={"cover"} source={{ uri: item.imageURL }} style={styles.image} />
                  </View>
                ) : (
                  <View style={styles.borderLine} />
                )}
                <View style={{ marginTop: scale(30) }}>
                  {!booleanValueCheck ?
                    booleanFourthoptions.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setCheckTrueFalseIndex(index);
                          setTrueAndFalseItem(item);
                        }}
                        style={[
                          styles.optionContainer,
                          {
                            backgroundColor: COLORS.WHITE,
                            borderColor: COLORS.TRANSPARENT
                          },
                        ]}>
                        <CheckBox
                          checked={checkTrueFalseIndex === index}
                          checkedIcon={<RNImage source={IMAGES.checked} style={styles.checkBoxIcon} />}
                          uncheckedIcon={<RNImage source={IMAGES.unchecked} style={styles.checkBoxIcon} />} />
                        <RNText small textColor={COLORS.GRAYTEXTCOLOR}>
                          {item.text}
                        </RNText>
                      </TouchableOpacity>
                    ))
                    :
                    booleanFourthoptions.map((optionItem, index) => {
                      return (
                        <Pressable
                          key={index}
                          style={[
                            styles.optionContainer,
                            {
                              height: 50,
                              backgroundColor:
                                booleanCorrectAns?.correctAnswer === optionItem?.text && checkTrueFalseIndex === index
                                  ? COLORS.LIGHTGREEN // Correct answer selected
                                  : booleanCorrectAns?.correctAnswer !== optionItem?.text && checkTrueFalseIndex === index
                                    ? COLORS.LIGHTRED // Wrong answer selected
                                    : booleanCorrectAns?.correctAnswer === optionItem?.text
                                      ? COLORS.LIGHTGREEN
                                      : COLORS.WHITE, // Default color
                              borderColor:
                                booleanCorrectAns?.correctAnswer === optionItem?.text && checkTrueFalseIndex === index
                                  ? COLORS.GREEN // Correct answer selected
                                  : booleanCorrectAns?.correctAnswer !== optionItem?.text && checkTrueFalseIndex === index
                                    ? COLORS.RED // Wrong answer selected
                                    : booleanCorrectAns?.correctAnswer === optionItem?.text
                                      ? COLORS.GREEN // Correct answer
                                      : COLORS.TRANSPARENT, // Default color
                            },
                          ]}
                        >
                          <View style={[styles.checkBoxIcon, { left: 20 }]}>
                            {
                              booleanCorrectAns?.correctAnswer === optionItem?.text && checkTrueFalseIndex === index ? (
                                // ✅ Correct answer selected
                                <View style={[styles.checkboxConsdtions, { backgroundColor: COLORS.GREEN }]}>
                                  <RNImage source={IMAGES.checkWhite} style={{ width: 13, height: 10 }} />
                                </View>
                              ) : booleanCorrectAns?.correctAnswer !== optionItem?.text && checkTrueFalseIndex === index ? (
                                // ❌ Wrong answer selected
                                <View style={[styles.checkboxConsdtions, { backgroundColor: COLORS.RED }]}>
                                  <RNImage source={IMAGES.xmarkWhite} style={{ width: 13, height: 10 }} />
                                </View>
                              ) : booleanCorrectAns?.correctAnswer === optionItem?.text ? (
                                // ✅ Correct answer not selected, still show check
                                <View style={[styles.checkboxConsdtions, { backgroundColor: COLORS.GREEN }]}>
                                  <RNImage source={IMAGES.checkWhite} style={{ width: 13, height: 10 }} />
                                </View>
                              ) : null
                            }
                          </View>

                          {/* <CheckBox
                            uncheckedIcon={<RNImage source={IMAGES.unchecked} style={styles.checkBoxIcon} />} /> */}
                          <RNText style={{ left: 40 }} small textColor={COLORS.GRAYTEXTCOLOR}>
                            {optionItem.text}
                          </RNText>
                        </Pressable>
                      )
                    })

                  }
                </View></>
            ))}
          </>
        )}

        {QuestionCheck?.ORDEREDLIST === examPlayType && (
          <>
            {Array.isArray(examPlayCard?.questionsList) && examPlayCard?.questionsList?.map((question: any, questionIndex: any) => (
              <View key={questionIndex}>
                <RNText style={styles.questionText} semiBold medium textColor={COLORS.TEXTCOLOR}>
                  {question?.title || ""}
                </RNText>
                <View style={{ marginTop: scale(30) }}>
                  {showFifthDraggleResults && (
                    <RNText
                      onPress={fifthSeeCorrectAnsState ? fifthSeeYourAns : fifthSeeCorrectAns}
                      style={[styles.seeCorrectAnswerText, { marginBottom: scale(10), marginTop: scale(-20) }]}
                      textColor={COLORS.PRIMARY}
                      small
                    >
                      {fifthSeeCorrectAnsState ? "See Your Answer" : "See Correct Answer"}
                    </RNText>
                  )}
                  {!showFifthDraggleResults ? (
                    <DraggableFlatList
                      data={fifthDraggableData}
                      onDragEnd={handleDragEnd}
                      keyExtractor={(item) => item?.id?.toString()}
                      renderItem={renderItem}
                      contentContainerStyle={styles.optionsContainer}
                    />
                  ) : fifthSeeCorrectAnsState ? (
                    draggableRightWrongAns?.map((item: any, index: any) => (
                      <Pressable
                        key={item.key}
                        style={[
                          styles.optionButton,
                          {
                            backgroundColor: '#fff',
                            borderColor: COLORS.WHITE,
                            borderWidth: 2,
                            borderRadius: 5,
                            justifyContent: "space-between",
                            flexDirection: "row",
                            alignItems: 'center'
                          },
                        ]}
                      >
                        <RNText style={styles.optionText}>{item?.answer || ""}</RNText>
                      </Pressable>
                    ))
                  ) : (
                    fifthDraggableData?.map((item: any, index: number) => {
                      const correctPosition = draggableRightWrongAns.findIndex((ans: any) => ans.id === item.id);
                      const isCorrect = index === correctPosition;
                      return (
                        <Pressable
                          key={item.key || item.id} // Fallback key
                          style={[
                            styles.optionButton,
                            {
                              backgroundColor: '#fff',
                              borderColor: isCorrect ? 'green' : 'red',
                              borderWidth: 1,
                              borderRadius: 5,
                              justifyContent: "space-between",
                              flexDirection: "row",
                              alignItems: 'center'
                            },
                          ]}
                        >
                          <RNText style={styles.optionText}>{item?.answer || ""}</RNText>
                        </Pressable>
                      );
                    })
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        {QuestionCheck?.CLOZE === examPlayType && (
          <>
            {Array.isArray(examPlayCard?.questionsList) && examPlayCard?.questionsList?.map((item: any, index: any) => {
              const correctAnswer = item?.examQuesOptionsList?.find((option: any) => option.isCorrectAnswer)?.answer;
              const containsCorrectAnswer = item?.title?.includes(correctAnswer);
              const parts = containsCorrectAnswer ? item?.title?.split(correctAnswer) : [item?.title];
              return (
                <React.Fragment key={index}>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
                    <RNText style={[styles.questionText, { flexShrink: 1 }]} semiBold large textColor={COLORS.TEXTCOLOR}>
                      {parts[0]}
                    </RNText>
                    {containsCorrectAnswer && (
                      <View style={{ alignItems: 'center' }}>
                        <RNText
                          style={{
                            position: "absolute",
                            top: 3, // Adjust this value to move the text up
                            textAlign: 'center',
                            width: '100%'
                          }}
                          medium
                          textColor={COLORS.TEXTCOLOR}
                        >
                          {clozeButtonSelectedItem?.answer ? clozeButtonSelectedItem?.answer : ""}
                        </RNText>
                        <RNImage
                          onPress={_onPressActionSheetCloze}
                          resizeMode={"stretch"}
                          source={IMAGES.ClozeDropDown}
                          style={{
                            width: 180,
                            height: 16,
                            marginTop: scale(10)
                          }}
                        />
                      </View>
                    )}
                    <RNText style={[styles.questionText, { flexShrink: 1 }]} semiBold large textColor={COLORS.TEXTCOLOR}>
                      {parts[1] || ""}
                    </RNText>
                  </View>
                  {(item?.imageURL && typeof item.imageURL === 'string') ? (
                    <View style={[styles.imageContainer, { backgroundColor: COLORS.WHITE }]}>
                      <RNImage resizeMode={"cover"} source={{ uri: item.imageURL }} style={styles.image} />
                    </View>
                  ) : (
                    <View style={styles.borderLine} />
                  )}
                  <View style={{ marginTop: scale(30), paddingHorizontal: scale(10) }}>
                    {showSixthActionResults ?

                      <>
                        <RNText textColor={COLORS.GREEN} medium>Correct Answer</RNText>
                        <RNText style={{ marginTop: scale(10) }} textColor={COLORS.TEXTCOLOR} medium>
                          {parts[0]}
                          <RNText textColor={COLORS.TEXTCOLOR} bold>{correctAnswer}</RNText>
                          {parts[1]}
                        </RNText>
                      </>

                      : null}
                    {/* Other components if any */}
                  </View>
                </React.Fragment>
              );
            })}
          </>
        )}

        {QuestionCheck?.MATCHLIST === examPlayType && (
          <>
            {/* Render title/text of the first card and action text */}
            {Array.isArray(examPlayCard?.questionsList) && examPlayCard?.questionsList.length > 0 && (
              <View style={{ marginTop: scale(10) }}>
                {/* <RNText style={styles.questionText} semiBold medium textColor={COLORS.TEXTCOLOR}>
                  {examPlayCard.questionsList[0]?.title || ""}
                </RNText> */}
                {showSeventhActionResults && (
                  <RNText
                    onPress={showSeventhActionSheet ? seventhSeeYourAns : seventhSeeCorrectAns}
                    style={[styles.seeCorrectAnswerText, { marginBottom: scale(10), marginTop: scale(0) }]}
                    textColor={COLORS.PRIMARY}
                    small
                  >
                    {showSeventhActionSheet ? "See Your Answer" : "See Correct Answer"}
                  </RNText>
                )}
              </View>
            )}

            {!showSeventhActionResults ? (
              Array.isArray(examPlayCard?.questionsList) && examPlayCard?.questionsList.map((item: any, index: any) => (
                <View key={index}>
                  <Pressable
                    style={[
                      styles.optionButton,
                      { backgroundColor: '#fff' },
                    ]}
                  >
                    <RNText textColor={COLORS.TEXTCOLOR} medium>{item?.title || ""}</RNText>
                    <View
                      style={{ marginTop: scale(15), alignSelf: "center", width: "110%", borderWidth: 0.2, borderColor: COLORS.GRAYTEXTCOLOR }}
                    />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(20) }}>
                      <RNText textColor={COLORS.TEXTCOLOR} medium>
                        {(() => {
                          if (!item || !passingMatchListData) return '';
                          const matchingItem = Array.isArray(passingMatchListData)
                            ? passingMatchListData.find(data => data?.id === item?.id)
                            : passingMatchListData?.id === item?.id ? passingMatchListData : null;
                          return matchingItem?.examQuesOptionsList?.[0]?.answer || '';
                        })()}
                      </RNText>
                      <RNImage
                        onPress={() => _onPressActionSheet(item, index)}
                        source={IMAGES.angleDown}
                        style={{ width: 13, height: 13, top: 2 }}
                      />
                    </View>
                  </Pressable>
                </View>
              ))
            ) : (
              showSeventhActionSheet ? (
                Array.isArray(matchListValue?.questionsList) && matchListValue?.questionsList.map((item: any, index: any) => (
                  <View key={index}>
                    <Pressable
                      style={[
                        styles.optionButton,
                        { backgroundColor: COLORS.WHITE },
                      ]}
                    >
                      <RNText textColor={COLORS.TEXTCOLOR} medium>{item?.title || ""}</RNText>
                      <View
                        style={{ marginTop: scale(15), alignSelf: "center", width: "110%", borderWidth: 0.2, borderColor: COLORS.GRAYTEXTCOLOR }}
                      />
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(20) }}>
                        <RNText textColor={COLORS.TEXTCOLOR} medium>
                          {item?.examQuesOptionsList[0]?.answer || ""}
                        </RNText>
                        <RNImage
                          onPress={() => _onPressActionSheet(item, index)}
                          source={IMAGES.angleDown}
                          style={{ width: 13, height: 13, top: 2 }}
                        />
                      </View>
                    </Pressable>
                  </View>
                ))
              ) : (
                Array.isArray(passingMatchListData) && passingMatchListData.map((item: any, index: any) => {
                  const correctPosition = matchListValue?.questionsList?.findIndex((ans: any) => ans?.examQuesOptionsList[0]?.id === item?.examQuesOptionsList[0]?.id);
                  const isCorrect = index === correctPosition;
                  return (
                    <View key={index}>
                      <Pressable
                        style={[
                          styles.optionButton,
                          { backgroundColor: '#fff', borderColor: isCorrect ? 'green' : 'red', borderWidth: 0.5 },
                        ]}
                      >
                        <RNText textColor={COLORS.TEXTCOLOR} medium>{item?.title || ""}</RNText>
                        <View
                          style={{ marginTop: scale(15), alignSelf: "center", width: "110%", borderWidth: 0.2, borderColor: COLORS.GRAYTEXTCOLOR }}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: scale(20) }}>
                          <RNText textColor={COLORS.TEXTCOLOR} medium>
                            {item?.examQuesOptionsList[0]?.answer || ""}
                          </RNText>
                          <RNImage
                            onPress={() => _onPressActionSheet(item, index)}
                            source={IMAGES.angleDown}
                            style={{ width: 13, height: 13, top: 2 }}
                          />
                        </View>
                      </Pressable>
                    </View>
                  )
                })
              )
            )}
          </>
        )}
      </>
    )
  };

  const startExamFunction = () => {
    if (coursePlayData?.exam || coursePlayData?.exam?.id) {
      let body = {
        id: coursePlayData?.exam?.id || ""
      }
      const callback = (res: any) => {
        setModalVisible(false);
        if (res !== 'error') {
          resetQuestionState();
          setCurrentCardIndex(0);
          if (res?.isPassingScoreReqd || res?.isTimed) {
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CourseAIExamStart,
              params: {
                startExamData: res ? res : [],
              }
            })
          }
          else {
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CourseAIExam,
              params: {
                startExamData: res ? res : [],
              }
            })
          }
        }
      }
      dispatch(startExamRequestAction({ body, callback }));
      // () => _onPressNavigate(SCREEN_NAMES.CourseStack, {
      //   screen: SCREEN_NAMES.CourseAIExamStart
      // })
    }
  }

  const FinshKnowledgeModal = () => {
    return (
      <RNModal transparent visible={modalVisible}>
        <View style={{ width: "90%", paddingHorizontal: 10, backgroundColor: COLORS.WHITE, paddingVertical: 20 }}>
          <RNText style={{ marginTop: 5 }} large bold>You are almost there!</RNText>
          <RNText style={{ marginTop: 15, paddingBottom: 10 }} large>Would you like to proceed to the final exam or replay the course?</RNText>

          <RNButton
            onPress={replayFunction}
            textColor={COLORS.SECONDARY}
            title={"Replay"}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.WHITE}
          />

          <RNButton
            onPress={startExamFunction}
            textColor={COLORS.WHITE}
            title={"Proceed to Exam"}
            minHeightButton={true}
            style={styles.courseButtonStyle}
            backgroundColor={COLORS.SECONDARY}
          />
        </View>
      </RNModal>
    );
  };

  const FinshKnowledgeModalSecond = () => {
    const CloseButton = () => {
      if (condtionCourseString == "coursePath") {
        resetQuestionState();
        setCurrentCardIndex(0);
        dispatch(CondtionClearAction())
        _onPressNavigate(SCREEN_NAMES.PathStack, {
          screen: SCREEN_NAMES.MainPath,
        })
      }
      else {
        resetQuestionState();
        setCurrentCardIndex(0);
        dispatch(CondtionClearAction())
        if (coursePlayData?.userProgress?.status !== "COMPLETED") {
          dispatch(gamificationBooleanSuccessAction("check"))
          setTimeout(() => {
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CoursePreview
            })
          }, 1000)
        }
        else {
          _onPressNavigate(SCREEN_NAMES.CourseStack, {
            screen: SCREEN_NAMES.CoursePreview,
          })
        }
      }
    }
    return (
      <RNModal transparent visible={modalVisible1}>
        <View style={{ width: "90%", paddingHorizontal: 10, backgroundColor: COLORS.WHITE, paddingVertical: 20 }}>
          <RNText TextAlignCenter extraLarge semiBold>{coursePlayData?.userProgress?.status !== "COMPLETED" ? "Course Completed" : "Replay Complete"}</RNText>
          <LottieView
            source={IMAGES.CoursePassed}
            loop={true}
            autoPlay={true}
            style={styles.badgeAnimation}
          />
          <RNText style={{ marginTop: scale(15) }} TextAlignCenter textColor='#A3C3F9' extraLarge semiBold>
            {coursePlayData?.userProgress?.status !== "COMPLETED" ? "Congratulations!" : ""}
          </RNText>
          <RNText style={{ marginTop: 15, paddingBottom: 10 }} textColor='#9398A4' TextAlignCenter large>{"You have completed the Course!"}</RNText>

          <RNButton //replayFunction
            onPress={CloseButton}
            textColor={COLORS.SECONDARY}
            title={"Close"}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.WHITE}
          />
        </View>
      </RNModal>
    );
  };

  const FirstButtonBottomView = () => (
    <RNButton
      title={
        disableButtonCondition
          ? submitButtonCondtion
            ? STRINGS.submit
            : STRINGS.next
          : STRINGS.check
      }
      textColor={COLORS.WHITE}
      disabled={!answerText}
      loading={loading}
      style={styles.button}
      backgroundColor={COLORS.SECONDARY}
      onPress={disableButtonCondition ? submitButtonCondtion ? submitButtonFunction : nextButtonCondtion : handleCheckAnswer}
    />
  );

  const isArrayEmpty = (arr: string[]): boolean => {
    return !arr || arr.length === 0;
  };

  // const SecondButtonBottomView = () => {
  //   //console.log(isArrayEmpty(multiSelectedMCQItem) || isArrayEmpty(MCQItem), "multiSelectedMCQItem")
  //   return (
  //     !examPlayLoading &&
  //     <RNButton
  //       title={
  //         optionalCheckWrongRight
  //           ? submitButtonCondtion
  //             ? STRINGS.submit
  //             : STRINGS.next
  //           : STRINGS.check
  //       }
  //       textColor={COLORS.WHITE}
  //       style={styles.button}
  //       loading={loading}
  //       disabled={isArrayEmpty(MCQItem) && isArrayEmpty(multiSelectedMCQItem)}
  //       backgroundColor={COLORS.SECONDARY}
  //       onPress={optionalCheckWrongRight ? submitButtonCondtion ? submitButtonFunction : nextButtonCondtion : mcqQuetionCheck}
  //     />
  //   )
  // };

  interface ButtonState {
    title: string;
    isDisabled: boolean;
    onPress: () => void;
  }

  const useButtonState = (): ButtonState => {
    // Compute button state with memoization
    return React.useMemo(() => {
      // Complex logic to determine button state
      const determineButtonTitle = () => {
        if (optionalCheckWrongRight) {
          return submitButtonCondtion ? STRINGS.submit : STRINGS.next;
        }
        return STRINGS.check;
      };
      const determineButtonDisabled = () => {
        return checkedIndex === -1 && isArrayEmpty(multiSelectedMCQItem);
      };

      const determineButtonPress = () => {
        if (optionalCheckWrongRight) {
          return submitButtonCondtion ? submitButtonFunction : nextButtonCondtion;
        }
        return mcqQuetionCheck;
      };

      return {
        title: determineButtonTitle(),
        isDisabled: determineButtonDisabled(),
        onPress: determineButtonPress()
      };
    }, [
      optionalCheckWrongRight,
      submitButtonCondtion,
      MCQItem,
      multiSelectedMCQItem
    ]);
  };

  const SecondButtonBottomView: React.FC = () => {
    // Prevent rendering if loading
    if (examPlayLoading) {
      return null;
    }

    const { title, isDisabled, onPress } = useButtonState();

    return (
      <RNButton
        title={title}
        textColor={COLORS.WHITE}
        style={styles.button}
        loading={loading}
        disabled={isDisabled}
        backgroundColor={COLORS.SECONDARY}
        onPress={onPress}
      />
    );
  };

  // const ThirdButtonBottomView = () => (
  //   <RNButton
  //     title={showMultiResults ? STRINGS.next : STRINGS.check}
  //     textColor={COLORS.WHITE}
  //     style={styles.button}
  //     backgroundColor={COLORS.SECONDARY}
  //     onPress={handleMultiSubmit}
  //   />
  // );

  const FourthButtonBottomView = () => (
    <RNButton
      title={
        booleanValueCheck
          ? submitButtonCondtion
            ? STRINGS.submit
            : STRINGS.next
          : STRINGS.check
      }
      textColor={COLORS.WHITE}
      style={styles.button}
      loading={loading}
      disabled={checkTrueFalseIndex === -1 ? true : false}
      backgroundColor={COLORS.SECONDARY}
      onPress={booleanValueCheck ? submitButtonCondtion ? submitButtonFunction : nextButtonCondtion : handleBooleanCheck}
    />
  );

  const FifthButtonBottomView = () => (
    <RNButton
      title={
        showFifthDraggleResults
          ? submitButtonCondtion
            ? STRINGS.submit
            : STRINGS.next
          : STRINGS.check
      }
      textColor={COLORS.WHITE}
      style={styles.button}
      loading={loading}
      disabled={draggableBoolean}
      backgroundColor={COLORS.SECONDARY}
      onPress={showFifthDraggleResults ? submitButtonCondtion ? submitButtonFunction : nextButtonCondtion : handleDraggleCheck}
    />
  );

  const SixthButtonBottomView = () => (
    <RNButton
      title={
        showSixthActionResults
          ? submitButtonCondtion
            ? STRINGS.submit
            : STRINGS.next
          : STRINGS.check
      }
      textColor={COLORS.WHITE}
      style={styles.button}
      loading={loading}
      disabled={clozeButtonDisable}
      backgroundColor={COLORS.SECONDARY}
      onPress={showSixthActionResults ? submitButtonCondtion ? submitButtonFunction : nextButtonCondtion : handleSixthActionSheetSubmit}
    />
  );

  const SeventhButtonBottomView = () => (
    <RNButton
      title={
        showSeventhActionResults
          ? submitButtonCondtion
            ? STRINGS.submit
            : STRINGS.next
          : STRINGS.check
      }
      textColor={COLORS.WHITE}
      style={styles.button}
      loading={loading}
      disabled={
        loading ||
        !(passingMatchListData?.length === examPlayData[currentCardIndex]?.questionsList?.length)
      }
      backgroundColor={COLORS.SECONDARY}
      onPress={showSeventhActionResults ? submitButtonCondtion ? submitButtonFunction : nextButtonCondtion : handleSeventhActionSheetCheck}
    />
  );

  const getBottomChildren = () => {
    const examPlayCard = examPlayData[currentCardIndex];
    const examPlayType = examPlayCard?.questionsList[0]?.type;

    if (!examPlayCard) {
      return null;
    }

    switch (examPlayType) {
      case QuestionCheck.TEXT:
        return <FirstButtonBottomView />;
      case QuestionCheck.MCQs:
        return <SecondButtonBottomView />;
      // case QuestionCheck.TRUE_FALSE:
      //   return <ThirdButtonBottomView />;
      case QuestionCheck.TRUE_FALSE:
        return <FourthButtonBottomView />;
      case QuestionCheck.ORDEREDLIST:
        return <FifthButtonBottomView />;
      case QuestionCheck.CLOZE:
        return <SixthButtonBottomView />;
      case QuestionCheck.MATCHLIST:
        return <SeventhButtonBottomView />;
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={[styles.container, { flex: 1 }]}>
      <RNContainer
        style={styles.container}
        scroll
        showsVerticalScrollIndicator={false}
        back
        onBack={() => {
          if (condtionCourseString == "coursePath") {
            dispatch(CondtionClearAction());
            _onPressNavigate(SCREEN_NAMES.PathStack, {
              screen: SCREEN_NAMES.MainPath,
            });
          }
          else {
            dispatch(CondtionClearAction());
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CoursePreview
            });
            // navigation.reset({
            //   index: 0,
            //   routes: [
            //     {
            //       name: SCREEN_NAMES.CourseStack,
            //       state: {
            //         routes: [
            //           {
            //             name: SCREEN_NAMES.CoursePreview,
            //             // params: { your params here }
            //           }
            //         ]
            //       }
            //     }
            //   ]
            // });
          }
        }}
        title={STRINGS.knowledgeCheck}
        bottomChildren={getBottomChildren()}
        titleMarginRight={true}
        hideBackgroundImage Points={undefined}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          {examPlayLoading ?
            <ActivityIndicator style={{ padding: 15 }} size="small" color={COLORS.PRIMARY} />
            :
            <RNText TextAlignCenter style={[styles.questionText, { paddingTop: 20 }]} small textColor={COLORS.BORDER_COLOR}>Question {`${examPlayData?.length != 0 ? currentCardIndex + 1 : 0}/${examPlayData?.length || 0}`}</RNText>
          }
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <QuestionView />
          </Animated.View>
          {/* {QuestionView()} */}
          {
            (() => {
              try {
                return QuestionCheck?.TEXT &&
                  examPlayData?.[currentCardIndex]?.questionsList?.[0]?.type === QuestionCheck.TEXT &&
                  Array.isArray(examPlayData) &&
                  currentCardIndex >= 0 &&
                  currentCardIndex < examPlayData.length
                  ? TextInputFunction()
                  : null;
              } catch {
                return null;
              }
            })()
          }
          {openActionSheetFunction()}
          {openClozeActionSheetFunction()}
          {FinshKnowledgeModal()}
          {FinshKnowledgeModalSecond()}
        </KeyboardAvoidingView>
      </RNContainer>
    </GestureHandlerRootView>
  );
};

export default CourseKnowledgeCheck;