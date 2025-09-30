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
  View
} from 'react-native';
import {
  RNActionSheet,
  RNButton,
  RNContainer,
  RNImage,
  RNText,
  RNTextInput
} from '../../../Common';
import {_onPressNavigate, onLogout} from '../../../utils/commonFunction';
import {COLORS, IMAGES, STRINGS} from '../../../constants';
import {SCREEN_NAMES} from '../../../config';
import * as Progress from 'react-native-progress';
import {scale} from 'react-native-size-matters';
import {CheckBox} from 'react-native-elements';
import DraggableFlatList, {
  RenderItemParams,
  DragEndParams
} from 'react-native-draggable-flatlist';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  addExamResponseRequestAction,
  examAddUserAttemptFailAction,
  examAddUserAttemptRequestAction,
  examPlayFailAction,
  examPlayRequestAction,
  getExamResultRequestAction
} from './module/action';
import {useDispatch} from 'react-redux';
import {scromChapterSelector} from './module/reducer';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {homeScreenSelector} from '../Home/module/reducer';

interface DataItem {
  key: string;
  label: string;
}

const initialData: DataItem[] = [
  {key: '1', label: '9=18+2'},
  {key: '2', label: '9-9'},
  {key: '3', label: '18+2'},
  {key: '4', label: '=0'}
];

const QuestionCheck = {
  TEXT: 'TEXT',
  MCQs: 'MCQs',
  TRUE_FALSE: 'TRUE_FALSE',
  ORDEREDLIST: 'ORDEREDLIST',
  MATCHLIST: 'MATCHLIST',
  CLOZE: 'CLOZE',
  seventhQuestion: 'seventhQuestion'
};

const booleanFourthoptions = [
  {id: 1, text: 'True', isCorrect: true},
  {id: 2, text: 'False', isCorrect: false}
];

const screenWidth = Dimensions.get('window').width;

const CourseAIExam: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const startExamData = props?.route?.params?.startExamData || {};
  const {storeCourseItemData} = homeScreenSelector();
  const initialTimeInSeconds = startExamData?.timeAllocated * 60; // Convert initial time to seconds
  const {
    examAddUserAttemptLoading,
    examAddUserAttemptData,
    examPlayLoading,
    examPlayData
  } = scromChapterSelector();
  const ActionSheetClozeNameRef: any = useRef(null);
  const ActionSheetNameRef: any = useRef(null);
  const [checkedIndex, setCheckedIndex] = useState(-1); // Initialize with none selected
  const [data, setData] = useState<DataItem[]>(initialData);
  const [answerText, setAnswerText] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [singleMCQItem, setSingleMCQItem] = useState<any>([]);
  const [multiSelectedMCQItem, setMultiSelectedMCQItem] = useState<any>([]);
  const [selectedMultiOptions, setSelectedMultiOptions] = useState<any>([]);
  const [checkTrueFalseIndex, setCheckTrueFalseIndex] = useState(-1);
  const [trueAndFalseItem, setTrueAndFalseItem] = useState<any>([]);
  const [fifthDraggableData, setFifthDraggableData] = useState<any>([]);
  const [draggableBoolean, setDraggableBoolean] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [clozeButtonDisable, setClozeButtonDisable] = useState(true);
  const [clozeButtonSelectedItem, setClozeButtonSelectedItem] = useState<any>(
    []
  );
  const [submitButtonCondtion, setSubmitButtonCondtion] = useState(false);
  const [matchListIndexValue, setMatchListIndexValue] = useState(-1);
  const [passingMatchListData, setPassingMatchListData] = useState<any>([]);
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
  const [alert20to30Shown, setAlert20to30Shown] = useState(false);
  const [alert10Shown, setAlert10Shown] = useState(false);
  const toastShownRef = useRef({alert20to30: false, alert10: false});
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation when changing cards
    slideAnim.setValue(500);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [currentCardIndex]);

  const clearState = () => {
    setCheckedIndex(-1);
    setData(initialData);
    setAnswerText('');
    setCurrentCardIndex(0);
    setLoading(false);
    setSingleMCQItem([]);
    setMultiSelectedMCQItem([]);
    setSelectedMultiOptions([]);
    setCheckTrueFalseIndex(-1);
    setTrueAndFalseItem([]);
    setFifthDraggableData([]);
    setDraggableBoolean(true);
    setSelectedIndex(-1);
    setClozeButtonDisable(true);
    setClozeButtonSelectedItem([]);
    setSubmitButtonCondtion(false);
    setMatchListIndexValue(-1);
    setPassingMatchListData([]);
    setTimeLeft(initialTimeInSeconds);
    setAlert20to30Shown(false);
    setAlert10Shown(false);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(examPlayFailAction());
      addUserAttemptFunction();
      return () => {
        clearState();
      };
    }, [])
  );

  const addUserAttemptFunction = () => {
    setLoading(true);
    const body = {
      EntityId: startExamData?.id || '',
      assignedDate: storeCourseItemData?.assignedDate || '',
      EntityType: 'EXAM'
    };
    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        examPlayFunction();
      }
    };
    dispatch(examAddUserAttemptRequestAction({body, callback}));
  };

  const _onPressActionSheetCloze = () => {
    ActionSheetClozeNameRef?.current?.show();
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     if (!startExamData?.isTimed) {
  //       return;
  //     }

  //     let isMounted = true;
  //     let timerId: NodeJS.Timeout;

  //     function tick() {
  //       if (isMounted) {
  //         setTimeLeft((prevTime: number) => {
  //           const newTime = prevTime - 1;

  //           if (newTime <= 0) {
  //             // Instead of calling submitButtonFunction directly, we'll use a local function
  //             handleTimeUp();
  //             return 0;
  //           }

  //           // Check for Toast messages outside the setTimeLeft callback
  //           if (newTime <= 30 && newTime > 20 && !toastShownRef.current.alert20to30) {
  //             Toast.show("Hurry up ! Only 30s left", { type: 'danger' });
  //             setAlert20to30Shown(true);
  //             setAlert10Shown(false);
  //             toastShownRef.current.alert20to30 = true;
  //           }

  //           if (newTime === 10 && !toastShownRef.current.alert10) {
  //             Toast.show("Hurry up ! Only 10s left", { type: 'danger' });
  //             setAlert20to30Shown(false);
  //             setAlert10Shown(true);
  //             toastShownRef.current.alert10 = true;
  //           }

  //           return newTime;
  //         });
  //       }
  //     }

  //     function handleTimeUp() {
  //       // Call submitButtonFunction here if it's available
  //       if (typeof submitButtonFunction === 'function') {
  //         submitButtonFunction();
  //       } else {
  //         console.warn('submitButtonFunction is not available');
  //         // You might want to add some fallback behavior here
  //       }
  //     }

  //     timerId = setInterval(tick, 1000);

  //     return () => {
  //       isMounted = false;
  //       clearInterval(timerId);
  //       // Reset the toast shown flags when the effect cleanup runs
  //       toastShownRef.current = { alert20to30: false, alert10: false };
  //     };
  //   }, [startExamData?.isTimed, setTimeLeft, setAlert20to30Shown, setAlert10Shown])
  // );

  const hasCalledHandleTimeUpRef = useRef(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const handleTimeUp = () => {
    Toast.show('Your time duration is over now', {type: 'danger'});
    submitButtonFunction();
  };

  useFocusEffect(
    useCallback(() => {
      if (!startExamData?.isTimed || examPlayLoading) {
        return;
      }

      let isMounted = true;

      function tick() {
        if (isMounted) {
          setTimeLeft((prevTime: number) => {
            // If time is already 0, just return without processing
            if (prevTime <= 0) {
              return 0;
            }
            const newTime = prevTime - 1;
            if (
              newTime == 30 &&
              newTime > 20 &&
              !toastShownRef.current.alert20to30
            ) {
              Toast.show('Hurry up! Only 30s left', {type: 'danger'});
              setAlert20to30Shown(true);
              setAlert10Shown(false);
              toastShownRef.current.alert20to30 = true;
            }

            if (newTime === 10 && !toastShownRef.current.alert10) {
              Toast.show('Hurry up! Only 10s left', {type: 'danger'});
              setAlert20to30Shown(false);
              setAlert10Shown(true);
              toastShownRef.current.alert10 = true;
            }

            if (newTime === 0) {
              if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
                timerIdRef.current = null;
              }

              if (!hasCalledHandleTimeUpRef.current) {
                hasCalledHandleTimeUpRef.current = true;
                handleTimeUp();
              }
            }

            return newTime;
          });
        }
      }
      timerIdRef.current = setInterval(tick, 1000);
      return () => {
        isMounted = false;
        if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
          timerIdRef.current = null;
        }
        hasCalledHandleTimeUpRef.current = false;
        toastShownRef.current = {alert20to30: false, alert10: false};
      };
    }, [
      startExamData?.isTimed,
      examPlayLoading,
      setTimeLeft,
      setAlert20to30Shown,
      setAlert10Shown,
      handleTimeUp
    ])
  );

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
    submitButtonFunction();
    return true;
  };

  // useEffect(() => {
  //   let isMounted = true;
  //   if (timeLeft <= 0) {
  //     submitButtonFunction();
  //     return;
  //   }

  //   if (timeLeft <= 30 && timeLeft > 20 && !alert20to30Shown) {
  //     Toast.show("Only 30 seconds left!", { type: 'danger' });
  //     setAlert10Shown(false);
  //     setAlert20to30Shown(true);
  //   }

  //   if (timeLeft === 10 && !alert10Shown) {
  //     Toast.show("Only 10 seconds left!", { type: 'danger' });
  //     setAlert20to30Shown(false);
  //     setAlert10Shown(true);
  //   }

  //   const timerId = setInterval(() => {
  //     if (isMounted) {
  //       setTimeLeft((prevTime: any) => prevTime - 1);
  //     }
  //   }, 1000);

  //   // Cleanup interval on component unmount
  //   return () => {
  //     isMounted = false;
  //     clearInterval(timerId);
  //   };
  // }, [timeLeft]);

  const formatTime = (totalSeconds: any) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h:${mins}m:${secs}s`;
  };

  const handleCheckAnswer = () => {
    setLoading(true); // Set loading state to true before making the request
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (
      !hasFilterData ||
      !hasFilterData.examQuesOptionsList ||
      !Array.isArray(hasFilterData.examQuesOptionsList)
    ) {
      Toast.show('Invalid data structure for examQuesOptionsList', {
        type: 'danger'
      });
      setLoading(false); // Set loading state to false if there's an error
      return;
    }

    const modifiedExamQuesOptionsList = hasFilterData.examQuesOptionsList.map(
      (option: any) => {
        if (!option || typeof option !== 'object' || !option.answer) {
          Toast.show('Invalid option object in examQuesOptionsList', {
            type: 'danger'
          });
          setLoading(false); // Set loading state to false if there's an error
          return option;
        }

        return {
          ...option,
          answer: answerText !== undefined ? answerText : option.answer // Use the provided answerText or keep the existing answer
        };
      }
    );

    const hasId =
      typeof hasFilterData.id === 'string' &&
      hasFilterData.id.trim().length > 0;
    const hasType =
      typeof hasFilterData.type === 'string' &&
      hasFilterData.type.trim().length > 0;

    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : '',
            type: hasType ? hasFilterData.type : '',
            isStatementTrue: false,
            examQuesOptionsList: modifiedExamQuesOptionsList
          }
        ]
      },
      attemptId: examAddUserAttemptData?.attemptId
    };

    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        setSubmitButtonCondtion(currentCardIndex === examPlayData?.length - 1);
        if (currentCardIndex < examPlayData?.length - 1) {
          setTimeout(() => {
            setCurrentCardIndex(currentCardIndex + 1);
          }, 1000);
        } else {
          submitButtonFunction();
        }
      }
    };
    dispatch(addExamResponseRequestAction({body, callback}));
  };

  const examPlayFunction = () => {
    const body = {
      EntityId: startExamData?.id || '',
      assignedDate: storeCourseItemData?.assignedDate || ''
    };
    dispatch(examPlayRequestAction({body}));
  };

  const _onPressActionSheet = (item: any, index: number) => {
    setMatchListIndexValue(index);
    ActionSheetNameRef?.current?.show();
  };

  const optionalQuestionCheckAnswer = () => {
    setLoading(true);
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (
      !hasFilterData ||
      !hasFilterData.examQuesOptionsList ||
      !Array.isArray(hasFilterData.examQuesOptionsList)
    ) {
      Toast.show('Invalid data structure for examQuesOptionsList', {
        type: 'danger'
      });
      setLoading(false);
      return;
    }

    const hasId =
      typeof hasFilterData.id === 'string' &&
      hasFilterData.id.trim().length > 0;
    const hasType =
      typeof hasFilterData.type === 'string' &&
      hasFilterData.type.trim().length > 0;

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
      selectedOptions = singleMCQItem
        ? [
            {
              id: singleMCQItem.id,
              answer: singleMCQItem.answer,
              isCorrect: singleMCQItem.isCorrect
            }
          ]
        : [];
    }

    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : '',
            type: hasType ? hasFilterData.type : '',
            isStatementTrue: false,
            examQuesOptionsList: selectedOptions
          }
        ]
      },
      attemptId: examAddUserAttemptData?.attemptId
    };

    const callback = (res: any) => {
      setLoading(false);
      if (res !== 'error') {
        setSubmitButtonCondtion(currentCardIndex === examPlayData?.length - 1);
        if (currentCardIndex < examPlayData?.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
          setCheckedIndex(-1);
        } else {
          submitButtonFunction();
        }
      }
    };
    dispatch(addExamResponseRequestAction({body, callback}));
  };

  const handleMultiSubmit = () => {
    setLoading(true);
    let updatedDataForServer = passingMatchListData
      ?.map((item: any) => {
        const hasId = item?.id !== undefined && item?.id !== null;
        const hasType = item?.type !== undefined && item?.type !== null;
        return {
          id: hasId ? item.id : '',
          type: hasType ? item.type : '',
          isStatementTrue: false,
          examQuesOptionsList: Array.isArray(item.examQuesOptionsList)
            ? item.examQuesOptionsList.map((option: any) => ({
                id: option?.id || '',
                answer: option?.answer || '',
                SequenceNumber: option?.SequenceNumber || 0
              }))
            : []
        };
      })
      .filter(Boolean);

    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (
      !hasFilterData ||
      !hasFilterData.examQuesOptionsList ||
      !Array.isArray(hasFilterData.examQuesOptionsList)
    ) {
      Toast.show('Invalid data structure for examQuesOptionsList', {
        type: 'danger'
      });
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
        if (currentCardIndex < examPlayData?.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
        } else {
          submitButtonFunction();
        }
      }
    };
    dispatch(addExamResponseRequestAction({body, callback}));
  };

  const handleFourthBooleanSubmit = () => {
    // setQuestionCheckState("fifthQuestion");
    setLoading(true);
    const examQuesOptionsList = [
      {
        Answer: 'string',
        SequenceNumber: 1,
        Id: '00000000-0000-0000-0000-000000000000'
      }
    ];
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (
      !hasFilterData ||
      !hasFilterData.examQuesOptionsList ||
      !Array.isArray(hasFilterData.examQuesOptionsList)
    ) {
      Toast.show('Invalid data structure for examQuesOptionsList', {
        type: 'danger'
      });
      setLoading(false);
      return;
    }

    const hasId =
      typeof hasFilterData.id === 'string' &&
      hasFilterData.id.trim().length > 0;
    const hasType =
      typeof hasFilterData.type === 'string' &&
      hasFilterData.type.trim().length > 0;

    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : '',
            type: hasType ? hasFilterData.type : '',
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
        if (currentCardIndex < examPlayData?.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
        } else {
          submitButtonFunction();
        }
      }
    };
    dispatch(addExamResponseRequestAction({body, callback}));
  };

  const handleFifthDraggleSubmit = () => {
    setLoading(true);
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (
      !hasFilterData ||
      !hasFilterData.examQuesOptionsList ||
      !Array.isArray(hasFilterData.examQuesOptionsList)
    ) {
      Toast.show('Invalid data structure for examQuesOptionsList', {
        type: 'danger'
      });
      setLoading(false);
      return;
    }

    const hasId =
      typeof hasFilterData.id === 'string' &&
      hasFilterData.id.trim().length > 0;
    const hasType =
      typeof hasFilterData.type === 'string' &&
      hasFilterData.type.trim().length > 0;

    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : '',
            type: hasType ? hasFilterData.type : '',
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
        if (currentCardIndex < examPlayData?.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
        } else {
          submitButtonFunction();
        }
      }
    };
    dispatch(addExamResponseRequestAction({body, callback}));
  };

  const handleSixthDraggleSubmit = () => {
    setLoading(true);
    let selectedItem = [];
    selectedItem.push(clozeButtonSelectedItem);
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList?.[0];

    if (
      !hasFilterData ||
      !hasFilterData.examQuesOptionsList ||
      !Array.isArray(hasFilterData.examQuesOptionsList)
    ) {
      Toast.show('Invalid data structure for examQuesOptionsList', {
        type: 'danger'
      });
      setLoading(false);
      return;
    }

    const hasId =
      typeof hasFilterData.id === 'string' &&
      hasFilterData.id.trim().length > 0;
    const hasType =
      typeof hasFilterData.type === 'string' &&
      hasFilterData.type.trim().length > 0;

    let body = {
      body: {
        isGrouped: false,
        examQuesList: [
          {
            id: hasId ? hasFilterData.id : '',
            type: hasType ? hasFilterData.type : '',
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
        if (currentCardIndex < examPlayData?.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
        } else {
          submitButtonFunction();
        }
      }
    };
    dispatch(addExamResponseRequestAction({body, callback}));
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
    let body = {
      attemptId: examAddUserAttemptData?.attemptId || '',
      assignedDate: storeCourseItemData?.assignedDate || ''
    };
    const callback = (res: any) => {
      if (res !== 'error') {
        setAlert20to30Shown(false);
        setAlert10Shown(false);
        dispatch(examPlayFailAction());
        dispatch(examAddUserAttemptFailAction());
        _onPressNavigate(SCREEN_NAMES.CourseStack, {
          screen: SCREEN_NAMES.CourseAIExamFinish,
          params: {
            examResultData: res,
            leftTime: timeLeft,
            startExamData: startExamData
          }
        });
      }
    };
    dispatch(getExamResultRequestAction({body, callback}));
  };

  // useEffect(() => {
  //   Animated.sequence([
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 300,
  //       useNativeDriver: true,
  //     })
  //   ]).start();
  // }, [currentCardIndex]);

  const openActionSheetFunction = () => {
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList;
    const handleSelectOption = (selectedItem: any) => {
      const hasFilterDataUpdateWithIndex = hasFilterData[matchListIndexValue];
      const selectedItemUpdate = selectedItem?.examQuesOptionsList?.map(
        (
          {answer, id, ...rest}: {answer: string; id: string},
          index: number
        ) => ({
          answer: answer,
          id: id,
          SequenceNumber: index + 1
        })
      );
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
        newPassingMatchListData = passingMatchListData.map(
          (item: any, index: number) =>
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
            style={{paddingHorizontal: scale(10), marginBottom: scale(10)}}
            textColor={COLORS.TEXTCOLOR}
            medium>
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
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#DDE1F6',
                margin: 5,
                marginBottom: scale(10)
              }}>
              <CheckBox
                checkedIcon={
                  <RNImage
                    source={IMAGES.checked}
                    style={{width: 20, height: 20}}
                  />
                }
                uncheckedIcon={
                  <RNImage
                    source={IMAGES.unchecked}
                    style={{width: 20, height: 20}}
                  />
                }
                checked={selectedIndex === index}
                onPress={() => {
                  handleSelectOption(item);
                  setSelectedIndex(index);
                }}
              />
              <RNText small textColor={COLORS.GRAYTEXTCOLOR}>
                {item?.examQuesOptionsList[0]?.answer || ''}
              </RNText>
            </Pressable>
          ))}
        </View>
      </RNActionSheet>
    );
  };

  const clozeListSelectedFunction = (item: any, index: number) => {
    setSelectedIndex(index);
    setClozeButtonDisable(false);
    setClozeButtonSelectedItem(item || []);
    ActionSheetClozeNameRef?.current?.hide();
  };

  const openClozeActionSheetFunction = () => {
    const examPlayCard = examPlayData[currentCardIndex];
    const hasFilterData = examPlayCard?.questionsList[0];
    return (
      <RNActionSheet ActionSheetRef={ActionSheetClozeNameRef}>
        <View style={styles.actionsheet}>
          <RNText
            style={{paddingHorizontal: scale(10), marginBottom: scale(10)}}
            textColor={COLORS.TEXTCOLOR}
            medium>
            Please select your answer.
          </RNText>
          {hasFilterData?.examQuesOptionsList?.map(
            (item: any, index: number) => (
              <Pressable
                key={index}
                onPress={() => clozeListSelectedFunction(item, index)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#DDE1F6',
                  marginBottom: scale(10)
                }}>
                <CheckBox
                  checkedIcon={
                    <RNImage
                      source={IMAGES.checked}
                      style={{width: 20, height: 20}}
                    />
                  }
                  uncheckedIcon={
                    <RNImage
                      source={IMAGES.unchecked}
                      style={{width: 20, height: 20}}
                    />
                  }
                  checked={selectedIndex === index}
                />
                <RNText small textColor={COLORS.GRAYTEXTCOLOR}>
                  {item?.answer || ''}
                </RNText>
              </Pressable>
            )
          )}
        </View>
      </RNActionSheet>
    );
  };

  const calculateProgress = () => {
    if (
      typeof timeLeft !== 'number' ||
      typeof initialTimeInSeconds !== 'number'
    ) {
      return 0; // Return 0 progress while loading or if data is invalid
    }
    return Math.max(0, Math.min(1, timeLeft / initialTimeInSeconds));
  };

  const getProgressColor = () => {
    if (alert20to30Shown) return 'orange';
    if (alert10Shown) return COLORS.RED;
    return '#4CAF50';
  };

  const handleDragEnd = ({data}: DragEndParams<any>) => {
    const updatedData: any = data.map((item: any, index: number) => ({
      answer: item.answer,
      id: item.id,
      sequenceNumber: index + 1
    }));
    setFifthDraggableData(updatedData);
    setDraggableBoolean(false);
  };

  const renderItem = ({item, drag, isActive}: RenderItemParams<any>) => {
    return (
      <Pressable
        onPressIn={drag}
        onPressOut={() => console.log(item)}
        style={[
          styles.optionButton,
          {
            backgroundColor: isActive ? '#f0f0f0' : '#fff',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
          }
        ]}>
        <RNText style={styles.optionText}>{item?.answer || ''}</RNText>
        <Image
          source={IMAGES.gripDotsVertical}
          style={{width: 10, height: 20}}
        />
      </Pressable>
    );
  };

  const HeaderProgressView = () => {
    return (
      <View style={[styles.cardMainView, {justifyContent: 'center'}]}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={getProgressColor()}
            borderWidth={0}
            unfilledColor={'#EBEBEB'}
            progress={calculateProgress()}
            width={200}
          />
          {/* <Progress.Bar color={alert20to30Shown ? "orange" : alert10Shown ? COLORS.RED : "#4CAF50"} borderWidth={0} unfilledColor={"#EBEBEB"} progress={timeLeft / initialTimeInSeconds} width={200} /> */}
          <RNText
            textColor={COLORS.TEXTCOLOR}
            style={styles.progressText}
            small>
            {formatTime(timeLeft)}
          </RNText>
        </View>
      </View>
    );
  };

  const QuestionView = () => {
    const examPlayCard = examPlayData?.[currentCardIndex] ?? {};
    const examPlayType = examPlayCard?.questionsList?.[0]?.type;

    if (!examPlayCard || typeof examPlayCard !== 'object') {
      return (
        <View
          style={{
            justifyContent: 'center',
            width: '90%',
            alignItems: 'center',
            marginTop: scale(10)
          }}>
          <RNText TextAlignCenter large textColor={COLORS.BORDER_COLOR}>
            No Record Found
          </RNText>
        </View>
      );
    }

    useEffect(() => {
      if (
        QuestionCheck?.ORDEREDLIST === examPlayType &&
        examPlayCard?.questionsList
      ) {
        const hasDragerData = examPlayCard.questionsList.flatMap(
          (question: any) => question?.examQuesOptionsList || []
        );
        setFifthDraggableData(hasDragerData);
      }
    }, [examPlayType, examPlayCard?.questionsList, QuestionCheck]);

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
                marginTop: scale(10)
              }}>
              <RNText TextAlignCenter small textColor={COLORS.GRAYTEXTCOLOR}>
                Question{' '}
                {`${examPlayData?.length != 0 ? currentCardIndex + 1 : 0}/${
                  examPlayData?.length || 0
                }`}
              </RNText>
            </View>
          </>
        )}

        {QuestionCheck?.TEXT === examPlayType && (
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
                        {backgroundColor: COLORS.WHITE}
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
                  <RNText
                    style={styles.answerLabel}
                    medium
                    textColor={COLORS.GRAYTEXTCOLOR}>
                    Answer*
                  </RNText>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: COLORS.WHITE,
                        backgroundColor: COLORS.WHITE
                      }
                    ]}
                    multiline
                    placeholder="Type your answer here..."
                    value={answerText}
                    onChangeText={text => {
                      setAnswerText(text);
                    }}
                  />
                </React.Fragment>
              ))}
          </>
        )}

        {QuestionCheck?.MCQs === examPlayType && (
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
                        {backgroundColor: COLORS.WHITE}
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
                                optionItem
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
                            padding: 5
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
                                  optionItem
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
                      )
                    )}
                  </View>
                </React.Fragment>
              ))}
          </>
        )}

        {QuestionCheck?.TRUE_FALSE === examPlayType && (
          <>
            {Array.isArray(examPlayCard?.questionsList) &&
              examPlayCard?.questionsList?.map((item: any, index: any) => (
                <React.Fragment key={index}>
                  <RNText
                    style={styles.questionText}
                    semiBold
                    medium
                    textColor={COLORS.TEXTCOLOR}>
                    {item?.title || ''}
                  </RNText>
                  {item?.imageURL && typeof item.imageURL === 'string' ? (
                    <View
                      style={[
                        styles.imageContainer,
                        {backgroundColor: COLORS.WHITE}
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
                    {booleanFourthoptions.map((item, index) => (
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
                          }
                        ]}>
                        <CheckBox
                          checked={checkTrueFalseIndex === index}
                          checkedIcon={
                            <RNImage
                              source={IMAGES.checked}
                              style={styles.checkBoxIcon}
                            />
                          }
                          uncheckedIcon={
                            <RNImage
                              source={IMAGES.unchecked}
                              style={styles.checkBoxIcon}
                            />
                          }
                        />
                        <RNText small textColor={COLORS.GRAYTEXTCOLOR}>
                          {item.text}
                        </RNText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </React.Fragment>
              ))}
          </>
        )}

        {QuestionCheck?.ORDEREDLIST === examPlayType && (
          <>
            {Array.isArray(examPlayCard?.questionsList) &&
              examPlayCard?.questionsList?.map(
                (question: any, questionIndex: any) => (
                  <View key={questionIndex}>
                    <RNText
                      style={styles.questionText}
                      semiBold
                      medium
                      textColor={COLORS.TEXTCOLOR}>
                      {question?.title || ''}
                    </RNText>
                    <View style={{marginTop: scale(30)}}>
                      <DraggableFlatList
                        data={fifthDraggableData}
                        onDragEnd={handleDragEnd}
                        keyExtractor={item => item?.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.optionsContainer}
                      />
                    </View>
                  </View>
                )
              )}
          </>
        )}

        {QuestionCheck?.MATCHLIST === examPlayType &&
          Array.isArray(examPlayCard?.questionsList) &&
          examPlayCard?.questionsList.map((item: any, index: any) => (
            <View key={index}>
              <Pressable
                style={[styles.optionButton, {backgroundColor: '#fff'}]}>
                <RNText textColor={COLORS.TEXTCOLOR} medium>
                  {item?.title || ''}
                </RNText>
                <View
                  style={{
                    marginTop: scale(15),
                    alignSelf: 'center',
                    width: '110%',
                    borderWidth: 0.2,
                    borderColor: COLORS.GRAYTEXTCOLOR
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: scale(20)
                  }}>
                  <RNText textColor={COLORS.TEXTCOLOR} medium>
                    {(() => {
                      if (!item || !passingMatchListData) return '';
                      const matchingItem = Array.isArray(passingMatchListData)
                        ? passingMatchListData.find(
                            data => data?.id === item?.id
                          )
                        : passingMatchListData?.id === item?.id
                        ? passingMatchListData
                        : null;
                      return (
                        matchingItem?.examQuesOptionsList?.[0]?.answer || ''
                      );
                    })()}
                  </RNText>
                  <RNImage
                    onPress={() => _onPressActionSheet(item, index)}
                    source={IMAGES.angleDown}
                    style={{width: 13, height: 13, top: 2}}
                  />
                </View>
              </Pressable>
            </View>
          ))}

        {QuestionCheck?.CLOZE === examPlayType && (
          <>
            {Array.isArray(examPlayCard?.questionsList) &&
              examPlayCard?.questionsList?.map((item: any, index: any) => {
                const correctAnswer = item?.examQuesOptionsList?.find(
                  (option: any) => option.isCorrectAnswer
                )?.answer;
                const containsCorrectAnswer =
                  item?.title?.includes(correctAnswer);
                const parts = containsCorrectAnswer
                  ? item?.title?.split(correctAnswer)
                  : [item?.title];

                const newView = () => {
                  return (
                    containsCorrectAnswer && (
                      <View style={{alignItems: 'center'}}>
                        <RNText
                          style={{
                            position: 'absolute',
                            top: 3, // Adjust this value to move the text up
                            textAlign: 'center',
                            width: '100%'
                          }}
                          medium
                          textColor={COLORS.TEXTCOLOR}>
                          {clozeButtonSelectedItem?.answer
                            ? clozeButtonSelectedItem?.answer
                            : ''}
                        </RNText>
                        <RNImage
                          onPress={_onPressActionSheetCloze}
                          resizeMode={'stretch'}
                          source={IMAGES.ClozeDropDown}
                          style={{width: 180, height: 16, marginTop: scale(10)}}
                        />
                      </View>
                    )
                  );
                };

                const secondNewView = () => {
                  return (
                    <RNText
                      style={[styles.questionText, {flexShrink: 1}]}
                      semiBold
                      large
                      textColor={COLORS.TEXTCOLOR}>
                      {parts[1] || ''}
                    </RNText>
                  );
                };

                return (
                  <React.Fragment key={index}>
                    <View style={{width: '100%'}}>
                      <RNText
                        style={[styles.questionText, {flexShrink: 1}]}
                        semiBold
                        large
                        textColor={COLORS.TEXTCOLOR}>
                        {parts[0]} {newView()} {secondNewView()}
                      </RNText>
                    </View>
                    {item?.imageURL && typeof item.imageURL === 'string' ? (
                      <View
                        style={[
                          styles.imageContainer,
                          {backgroundColor: COLORS.WHITE}
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
                  </React.Fragment>
                );
              })}
          </>
        )}
      </>
    );
  };

  const FirstButtonBottomView = useMemo(() => {
    return () => (
      <RNButton
        title={submitButtonCondtion ? STRINGS.next : STRINGS.next}
        textColor={COLORS.WHITE}
        disabled={!answerText}
        style={styles.button}
        loading={loading}
        backgroundColor={COLORS.SECONDARY}
        onPress={handleCheckAnswer}
      />
    );
  }, [submitButtonCondtion, answerText, loading, handleCheckAnswer]);

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
    optionalQuestionCheckAnswer
  ]);

  const ThirdButtonBottomView = useMemo(() => {
    return () => (
      <RNButton
        title={submitButtonCondtion ? STRINGS.next : STRINGS.next}
        textColor={COLORS.WHITE}
        style={styles.button}
        loading={loading}
        disabled={
          !(
            passingMatchListData?.length ===
            examPlayData[currentCardIndex]?.questionsList?.length
          )
        }
        backgroundColor={COLORS.SECONDARY}
        onPress={handleMultiSubmit}
      />
    );
  }, [
    submitButtonCondtion,
    passingMatchListData,
    loading,
    currentCardIndex,
    handleMultiSubmit
  ]);

  const FourthButtonBottomView = useMemo(() => {
    return () => (
      <RNButton
        title={submitButtonCondtion ? STRINGS.next : STRINGS.next}
        textColor={COLORS.WHITE}
        style={styles.button}
        loading={loading}
        disabled={checkTrueFalseIndex === -1 ? true : false}
        backgroundColor={COLORS.SECONDARY}
        onPress={handleFourthBooleanSubmit}
      />
    );
  }, [
    submitButtonCondtion,
    checkTrueFalseIndex,
    loading,
    handleFourthBooleanSubmit
  ]);

  const FifthButtonBottomView = useMemo(() => {
    return () => (
      <RNButton
        title={submitButtonCondtion ? STRINGS.next : STRINGS.next}
        textColor={COLORS.WHITE}
        style={styles.button}
        disabled={draggableBoolean}
        loading={loading}
        backgroundColor={COLORS.SECONDARY}
        onPress={handleFifthDraggleSubmit}
      />
    );
  }, [
    submitButtonCondtion,
    draggableBoolean,
    loading,
    handleFifthDraggleSubmit
  ]);

  const SixthButtonBottomView = useMemo(() => {
    return () => (
      <RNButton
        title={submitButtonCondtion ? STRINGS.next : STRINGS.next}
        textColor={COLORS.WHITE}
        style={styles.button}
        disabled={clozeButtonDisable}
        loading={loading}
        backgroundColor={COLORS.SECONDARY}
        onPress={handleSixthDraggleSubmit}
      />
    );
  }, [
    submitButtonCondtion,
    clozeButtonDisable,
    loading,
    handleSixthDraggleSubmit
  ]);

  const getBottomChildren = (): React.ReactNode => {
    const examPlayCard = examPlayData[currentCardIndex];
    const examPlayType = examPlayCard?.questionsList[0]?.type;

    if (!examPlayCard) {
      return null;
    }

    const buttonComponents = {
      [QuestionCheck.TEXT]: FirstButtonBottomView,
      [QuestionCheck.MCQs]: SecondButtonBottomView,
      [QuestionCheck.MATCHLIST]: ThirdButtonBottomView,
      [QuestionCheck.TRUE_FALSE]: FourthButtonBottomView,
      [QuestionCheck.ORDEREDLIST]: FifthButtonBottomView,
      [QuestionCheck.CLOZE]: SixthButtonBottomView
    };

    const ButtonComponent = buttonComponents[examPlayType];
    return ButtonComponent ? ButtonComponent() : null;
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RNContainer
        style={{backgroundColor: COLORS.MAINBACKGROUNDCOLOR}}
        //back={true}
        onBack={submitButtonFunction}
        title={
          startExamData?.title?.trimEnd().length > 27
            ? startExamData?.title.trimEnd().slice(0, 27) + '...'
            : startExamData?.title
        }
        //title={startExamData?.title?.length > 27 ? startExamData?.title?.slice(0, 27) + "..." : startExamData?.title}
        bottomChildren={getBottomChildren()}
        titleMarginRight={true}
        scroll
        showsVerticalScrollIndicator={false}
        hideBackgroundImage
        Points={undefined}>
        {startExamData?.isTimed ? HeaderProgressView() : null}
        <Animated.View style={{transform: [{translateX: slideAnim}]}}>
          {QuestionView()}
        </Animated.View>
        {openActionSheetFunction()}
        {openClozeActionSheetFunction()}
      </RNContainer>
    </GestureHandlerRootView>
  );
};

export default CourseAIExam;

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
    shadowRadius: Platform.OS === 'android' ? 0 : 3.84
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6
  },
  progressText: {
    marginLeft: 20
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
    textAlignVertical: 'top' // for Android to align text to the top
  },
  optionsContainer: {
    padding: 15
  },
  button: {
    width: '95%'
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
    shadowRadius: Platform.OS === 'android' ? 0 : 3.84
  },
  optionText: {
    fontSize: 14,
    color: '#333'
  },
  actionsheet: {
    //height: "0%",
    padding: 20,
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.WHITE,
    borderRadius: 20
  },
  dragHandle: {
    fontSize: 24,
    color: '#666'
  },
  questionText: {
    //marginTop: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: scale(5),
    marginBottom: scale(10)
  },
  imageContainer: {
    width: 373,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10
  },
  borderLine: {
    marginTop: scale(20),
    marginBottom: scale(20),
    borderWidth: 0.3,
    borderColor: COLORS.GRAYTEXTCOLOR,
    width: '100%'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    //padding: 10,
    borderWidth: 1,
    borderRadius: 5
    //paddingVertical:scale()
  },
  checkBoxIcon: {
    width: 20,
    height: 20
  },
  answerLabel: {
    paddingHorizontal: scale(10),
    marginTop: scale(40)
  }
});
