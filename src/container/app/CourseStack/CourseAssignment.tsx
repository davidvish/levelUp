import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  AppStateStatus,
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
  useWindowDimensions,
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
import {s, scale} from 'react-native-size-matters';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RNModal from '../../../Common/Modal/Modal';
import {AttestationnModal} from '../../../Common/Modals/AttestationModal/AttestationModal';
import {scromChapterSelector} from './module/reducer';
import {formatTime} from '../../../helper/helper';
import TimerComponent from './Component/TimerComponent';
import {
  AssignmentSubmissionRequestAction,
  GetAssignmentRequestAction,
  GetTimeOnAssignmentDetailRequestAction,
} from './module/action';
import RenderHTML from 'react-native-render-html';
import {G} from 'react-native-svg';
import {handleDownload} from '../../../helper/downloadFile';
import {call} from 'redux-saga/effects';
import {requestStoragePermission} from '../../../utils/permissions';
import {pickDocument} from '../../../helper/documentPicker';
import {
  initOAuthSettings,
  OAuthSettingsLms,
} from '../../../assets/json/CloudOAuthSettings';
import {uploadToAzure} from '../../../helper/azureUpload';

const CourseAssignment: React.FC = (props: any) => {
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();
  const data = useSelector((state: any) => state.CourseStackReducer);
  const navigation = useNavigation();
  const hasSubmitted = useRef(false); // ✅ flag to run only once

  const {coursePlayData, GetAssignmentData, GetTimeOnAssignmentDetailData} =
    scromChapterSelector();
  const startExamData = props?.route?.params?.startExamData || {};
  const [dropDownButtonConditions, setDropDownButtonConditions] =
    useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [attModalVisible, setAttModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [yourResponse, setYourResponse] = useState('');
  const [isSubmission, setIsSubmission] = useState(false);
  const [isResponseFileUrl, setIsResponseFileUrl] = useState(null);
  const [isFileSize, setIsFileSize] = useState(null);
  const isStartDateTime = GetTimeOnAssignmentDetailData?.startDate; // Assignment start time from server

  const [isSubmissionDateTime, setIsSubmissionDateTime] = useState(
    new Date('2025-09-23T07:06:27.211Z'),
  );
  const isTotalTimeAllocated = GetAssignmentData?.timeDuration; // Total time allocated for the assignment
  const isOldTimeSpent = GetTimeOnAssignmentDetailData?.timeSpent; // Old time spent from server

  const [isCurrentTimeSpent, setIsCurrentTimeSpent] = useState(0); // Current time spent in this session
  const [isTotalTimeLeft, setIsTotalTimeLeft] = useState(0);
  const timeSpentRef = useRef(0);
  const [isUploadFileName, setIsUploadFileName] = useState();
  const [isFileUrl, setIsFileUrl] = useState<any>(null);

  console.log('uploadFileName', GetAssignmentData);

  // console.log(isOldTimeSpent, 'isCurrentTimeSpent', isCurrentTimeSpent);

  const handleGetAssignment = () => {
    const body = {
      id: coursePlayData?.assignmentDetail?.id,
    };

    // Validate required fields in body
    if (!body.id) {
      (global as any).Toast.show('Missing required data for submission', {
        type: 'danger',
      });
      setIsLoading(false);
      return;
    }
    const callback = (res: any) => {
      setIsLoading(false);
      if (res !== 'error') {
        console.log('succsess');
      }
    };

    dispatch(GetAssignmentRequestAction({body, callback}));
  };

  const handleGetTimeOnAssignmentDetail = () => {
    const body = {
      id: coursePlayData?.userProgress?.id,
    };

    // Validate required fields in body
    if (!body.id) {
      (global as any).Toast.show('Missing required data for submission', {
        type: 'danger',
      });
      setIsLoading(false);
      return;
    }
    const callback = (res: any) => {
      setIsLoading(false);
      if (res !== 'error') {
        console.log(res);
      }
    };

    dispatch(GetTimeOnAssignmentDetailRequestAction({body, callback}));
  };

  useEffect(() => {
    const time = Math.max(
      0,
      isTotalTimeAllocated - (isOldTimeSpent + (isCurrentTimeSpent || 0)),
    );
    console.log(
      'time left =',
      time,
      'old =',
      isOldTimeSpent,
      'current =',
      isCurrentTimeSpent,
    );
    setIsTotalTimeLeft(time);
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleGetAssignment();
      handleGetTimeOnAssignmentDetail();
    }, []),
  );

  const TimerView = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          padding: scale(5),
          alignSelf: 'flex-end',
          paddingHorizontal: scale(10),
          height: scale(30),
          backgroundColor: isTotalTimeLeft <= 300 ? 'red' : '#2BBB84', // ✅ Change color here
          marginTop: scale(10),
          borderRadius: 5,
        }}>
        <RNImage
          source={IMAGES.miniClock}
          style={{right: 3, width: scale(10), height: scale(10)}}
        />
        {/* <TimerComponent
          initialTimeInSeconds={isTotalTimeLeft}
          onTimeUp={() => console.log('Time is up!')}
          onTimerCountChange={(count: number) => {
            timeSpentRef.current = count; // ✅ persist latest value
            setIsCurrentTimeSpent(count); // still update state for UI
          }}
        /> */}
      </View>
    );
  };

  const HeadingView = () => {
    return (
      <RNText style={{marginTop: scale(20)}} large>
        {GetAssignmentData?.title || 'No Title Found'}
      </RNText>
    );
  };

  const handleDownloadFile = async () => {
    try {
      await handleDownload(GetAssignmentData?.fileUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const SummaryView = () => {
    const lastPart = GetAssignmentData?.fileUrl?.split('/').pop().split('?')[0];
    const decoded = decodeURIComponent(lastPart);
    const fileName = decoded.replace(/^\d+-/, '');
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: scale(15),
            marginTop: scale(20),
            width: '100%',
            backgroundColor: COLORS.WHITE,
          }}>
          <RNText medium>Assignment Summary</RNText>
          {dropDownButtonConditions ? (
            <RNImage
              onPress={() =>
                setDropDownButtonConditions(!dropDownButtonConditions)
              }
              source={IMAGES.angleUpIcon}
              style={{width: scale(12), height: scale(12)}}
            />
          ) : (
            <RNImage
              onPress={() =>
                setDropDownButtonConditions(!dropDownButtonConditions)
              }
              source={IMAGES.angleDownIcon}
              style={{width: scale(13), height: scale(13)}}
            />
          )}
        </View>
        {dropDownButtonConditions ? (
          <View
            style={{
              bottom: 15,
              alignItems: 'center',
              padding: scale(15),
              marginTop: scale(0),
              width: '100%',
              backgroundColor: COLORS.WHITE,
            }}>
            <RenderHTML
              contentWidth={width}
              source={{
                html: GetAssignmentData?.requirement || '',
              }}
            />
            {/* <View style={{ borderBottomWidth: 1, borderBottomColor: "red", }} /> */}

            <View
              style={{
                padding: 10,
                borderTopWidth: 1,
                borderTopColor: '#F0F0F0',
                width: '100%',
                flexDirection: 'row',
                marginTop: scale(20),
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <RNImage
                source={IMAGES.PdfSmallIcon}
                style={{width: scale(40), height: scale(50)}}
              />
              <View>
                <RNText textColor={'#4284F3'} medium underline>
                  {fileName || 'No File Name'}
                </RNText>
                <RNText textColor="#9398A4" medium>
                  {GetAssignmentData?.fileSize || '0'}MB
                </RNText>
              </View>
              <RNImage
                onPress={handleDownloadFile}
                source={IMAGES.DownloadIcon}
                style={{width: scale(20), height: scale(20)}}
              />
            </View>
          </View>
        ) : null}
      </>
    );
  };

  const ResponseView = () => {
    return (
      <>
        <RNText style={{marginTop: scale(20)}} large>
          Your Response
        </RNText>
        <TextInput
          value={yourResponse}
          onChangeText={text => setYourResponse(text)}
          style={styles.textInput}
          placeholder="Type your response here..."
          multiline={true} // Enable multiline
          numberOfLines={4} // Optional: set initial number of lines
          textAlignVertical="top" // For Android to start text at top
        />
      </>
    );
  };

  let maxUploadFileSize;

  if (GetAssignmentData?.fileAllowedType?.toLowerCase() == 'video') {
    maxUploadFileSize = 200; // 200MB for video files
  } else if (GetAssignmentData?.fileAllowedType?.toLowerCase() == 'document') {
    maxUploadFileSize = 20; // 100MB for audio files
  } else if (GetAssignmentData?.fileAllowedType?.toLowerCase() == 'both') {
    maxUploadFileSize = 200; // 200MB for other file types
  } else {
    maxUploadFileSize = 20; // 20MB for other file types
  }

  useEffect(() => {
    requestStoragePermission();
  }, []);

  useEffect(() => {
    initOAuthSettings().then(() => {
      console.log('OAuth settings loaded:', OAuthSettingsLms);
    });
  }, []);

  const handleUpload = async () => {
    const localFile = await pickDocument();
    if (!localFile) return;

    const fileName =
      localFile?.fileName || localFile?.localUri?.split('/').pop();
    setIsUploadFileName(fileName);
    setIsFileUrl(localFile); // store only local file
    setIsFileSize(localFile.fileSizeMB.toFixed(2)); // Optional: track size for API

    console.log('📄 File selected:', localFile);
  };

  const UploadFileView = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            marginTop: scale(20),
            alignItems: 'center',
          }}>
          <RNText large>Upload File</RNText>
          <RNText style={{marginLeft: scale(10)}} textColor="#989AA0" medium>
            Max file size is {maxUploadFileSize}MB
          </RNText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: scale(10),
          }}>
          <View
            style={{
              padding: scale(15),
              width: '70%',
              backgroundColor: COLORS.WHITE,
            }}>
            <RNText textColor="#9398A4" medium>
              {isUploadFileName ? isUploadFileName : ' Please upload your file'}
            </RNText>
          </View>
          <Pressable
            onPress={handleUpload}
            style={{
              padding: scale(15),
              width: '30%',
              backgroundColor: '#E3EAF9',
            }}>
            <RNText TextAlignCenter textColor="#4284F3" medium>
              UPLOAD
            </RNText>
          </Pressable>
        </View>
      </>
      // <RNImage source={IMAGES.uploadFileViewImage} style={{width:"98%", alignSelf:"center", height:scale(150)}}/>
    );
  };

  // const BottomUploadedFileName = () => {
  //   return(
  //     <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: scale(15), marginTop: scale(20), width: "100%", backgroundColor: COLORS.WHITE }}>
  //       <RNText medium>Project Example file Name.pdf</RNText>
  //         <RNImage source={IMAGES.xmarkIcon} style={{ width: scale(13), height: scale(13) }} />
  //     </View>
  //   )
  // }

  const SubmitButtonModal = () => {
    return (
      <RNModal
        transparent
        visible={submitModalVisible}
        onDismiss={() => setSubmitModalVisible(false)}>
        <View
          style={{
            paddingHorizontal: scale(20),
            backgroundColor: COLORS.WHITE,
            paddingVertical: 20,
            width: scale(300),
          }}>
          <RNImage
            onPress={() => setSubmitModalVisible(false)}
            source={IMAGES.VectorIcon}
            style={{width: 17, height: 17, left: scale(250), bottom: scale(15)}}
          />
          <View style={{alignItems: 'center'}}>
            <RNImage
              source={IMAGES.circleCheck}
              style={{width: 50, height: 50}}
            />
          </View>
          <View style={{marginTop: scale(20)}}>
            <RNText TextAlignCenter extraLarge semiBold>
              Assignment Submitted
            </RNText>
            <RNText style={{marginTop: scale(20)}} textColor="#667085" medium>
              Your assignment has been successfully submitted and is now being
              processed for grading.
            </RNText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: scale(20),
              }}>
              <RNImage
                source={IMAGES.informationIcon}
                style={{width: scale(13), height: scale(13)}}
              />
              <RNText style={{left: 5}} textColor="#4284F3" medium semiBold>
                Next Steps
              </RNText>
            </View>
            <RNText style={{marginTop: scale(10)}} textColor="#667085" small>
              You will receive an email notification once your assignment has
              been graded.
            </RNText>
          </View>
          {/* <RNText large bold>Assignment Submitted</RNText>
          <RNText style={{ marginTop: 20 }} medium>Your assignment has been <RNText bold medium>{"submitted!"}</RNText></RNText>
          <RNText style={{ marginTop: 10 }} medium>You will receive an email notification once it has been graded.</RNText> */}

          {/* <RNButton
            onPress={sendRequestFunction}
            textColor={COLORS.SECONDARY}
            title={STRINGS.yes}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.WHITE}
          /> */}

          <RNButton
            onPress={() => {
              setSubmitModalVisible(false);
              setAttModalVisible(true);
              // _onPressNavigate(SCREEN_NAMES.CourseStack, {
              //   screen: SCREEN_NAMES.CourseAssignment,
              // })
            }}
            textColor={COLORS.WHITE}
            title={'Continue Learning'}
            minHeightButton={true}
            style={[styles.courseButtonStyle, {marginTop: scale(30)}]}
            backgroundColor={'#4284F3'}
          />
        </View>
      </RNModal>
    );
  };

  const handleSubmitAssignment = async () => {
    try {
      const isFileUploadAllowed = GetAssignmentData?.isFileUploadAllowed;
      const isTextAllowed = GetAssignmentData?.isTextAllowed;

      const hasLocalFile = !!isFileUrl; // local file (not yet uploaded)
      const hasText = yourResponse?.trim()?.length > 0;

      console.log('Has Text', hasText);

      // 🧩 Validation
      if (isFileUploadAllowed && isTextAllowed) {
        // 👉 Both are required
        if (!hasLocalFile && !hasText) {
          Alert.alert('Please upload a file and enter text before submitting.');
          return;
        } else if (!hasLocalFile) {
          Alert.alert('Please upload a file before submitting.');
          return;
        } else if (!hasText) {
          Alert.alert('Please enter your response before submitting.');
          return;
        }
      } else if (isFileUploadAllowed && !hasLocalFile) {
        // 👉 Only file is required
        Alert.alert('Please upload a file before submitting.');
        return;
      } else if (isTextAllowed && !hasText) {
        // 👉 Only text is required
        Alert.alert('Please enter your response before submitting.');
        return;
      }

      setIsLoading(true);

      let uploadedFileUrl = isResponseFileUrl;

      // 🟦 Upload to Azure only when file upload is allowed and local file exists
      if (isFileUploadAllowed && isFileUrl) {
        try {
          const container =
            OAuthSettingsLms.azureBlobStorageFileContainer || 'default';
          uploadedFileUrl = await uploadToAzure(isFileUrl, container); // Upload here
          setIsResponseFileUrl(uploadedFileUrl); // Store Azure URL
          console.log('✅ Uploaded to Azure:', uploadedFileUrl);
        } catch (uploadError) {
          console.error('Azure upload failed:', uploadError);
          setIsLoading(false);
          Alert.alert('File upload failed', 'Please try again.');
          return;
        }
      }

      // 🧾 Prepare request body
      const body = {
        assignmentId: GetAssignmentData?.assignmentId,
        resourseMappingId: coursePlayData?.userProgress?.id,
        responseText: isTextAllowed ? yourResponse : '',
        responseFileUrl: isFileUploadAllowed ? uploadedFileUrl : '',
        fileSize: isFileSize,
        startDate: isStartDateTime,
        submissionDate: new Date().toISOString(),
        timeSpent: timeSpentRef.current,
        isSubmissionComplete: isSubmission,
      };

      // 📨 API call
      const callback = (res: any) => {
        setIsLoading(false);
        if (res !== 'error') {
          if (isSubmission) setSubmitModalVisible(true);
        } else {
          Alert.alert('Submission failed. Please try again.');
        }
      };

      dispatch(AssignmentSubmissionRequestAction({body, callback}));
    } catch (error) {
      setIsLoading(false);
      console.error('Submission error:', error);
      Alert.alert('Something went wrong', 'Please try again.');
    }
  };

  const submitOnce = () => {
    if (!hasSubmitted.current) {
      handleSubmitAssignment();
      hasSubmitted.current = true;
    }
  };

  // --- Screen blur ---
  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('First Call');

        submitOnce();
      };
    }, []),
  );

  // --- Navigation back ---
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      console.log('Second  Call');

      submitOnce();
    });
    return unsubscribe;
  }, [navigation]);

  // // --- App background / minimized ---
  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     'change',
  //     (nextAppState: AppStateStatus) => {
  //       if (nextAppState === 'background' || nextAppState === 'inactive') {
  //         console.log('Thired  Call');

  //         submitOnce();
  //       }
  //     },
  //   );

  //   return () => subscription.remove();
  // }, []);

  const BottomFunction = () => {
    return (
      <RNButton
        title={STRINGS.submit}
        loading={isLoading}
        textColor={COLORS.WHITE}
        style={styles.button}
        backgroundColor={COLORS.SECONDARY}
        onPress={handleSubmitAssignment}
      />
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RNContainer
        style={{backgroundColor: COLORS.MAINBACKGROUNDCOLOR}}
        //onBack={submitButtonFunction}
        // title={startExamData?.title?.trimEnd().length > 27
        //   ? startExamData?.title.trimEnd().slice(0, 27) + "..."
        //   : startExamData?.title}
        bottomChildren={BottomFunction()}
        titleMarginRight={true}
        scroll
        showsVerticalScrollIndicator={false}
        hideBackgroundImage
        Points={undefined}>
        <View style={{padding: scale(10)}}>
          {TimerView()}
          {HeadingView()}
          {SummaryView()}
          {GetAssignmentData?.isTextAllowed ? ResponseView() : null}
          {GetAssignmentData?.isFileUploadAllowed ? UploadFileView() : null}
          {/* {BottomUploadedFileName()} */}
          {SubmitButtonModal()}
          <AttestationnModal
            visible={attModalVisible}
            setVisible={() => {
              setAttModalVisible(false);
            }}
            onStartAttestation={() => {
              setAttModalVisible(false);
              _onPressNavigate('AttestationExam', {
                startExamData: startExamData,
              });
            }}
          />
        </View>
      </RNContainer>
    </GestureHandlerRootView>
  );
};

export default CourseAssignment;

const styles = StyleSheet.create({
  button: {
    width: '95%',
  },
  courseButtonStyle: {
    marginTop: scale(7),
    width: '100%',
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: COLORS.WHITE,
    padding: scale(15),
    width: '100%',
    minHeight: scale(100), // Set minimum height instead of fixed height
    marginTop: scale(10),
    textAlignVertical: 'top', // Align text to top on Android
  },
});
