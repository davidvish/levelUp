import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  BackHandler,
  StyleSheet,
  View,
  useWindowDimensions,
  Modal,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import {
  RNButton,
  RNContainer,
  RNImage,
  RNLottie,
  RNText,
} from '../../../Common';
import {COLORS, IMAGES, STRINGS} from '../../../constants';
import YoutubePlayer from 'react-native-youtube-iframe';
import {scale} from 'react-native-size-matters';
import {scromChapterSelector} from './module/reducer';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {useDispatch} from 'react-redux';
import {
  gamificationBooleanSuccessAction,
  getScormChaptersByCourseRequestAction,
  getUserGamificationPointsRequestAction,
  startExamRequestAction,
  updateMaterialRequestAction,
} from './module/action';
import RenderHTML from 'react-native-render-html';
import {
  _onPressGoBackNavigate,
  _onPressNavigate,
} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../config';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RNModal from '../../../Common/Modal/Modal';
import {pathSelector} from '../PathStack/module/reducer';
import {CondtionClearAction} from '../PathStack/module/action';
import * as Progress from 'react-native-progress';
import {homeScreenSelector} from '../Home/module/reducer';
import {flashcardPreviewSelector} from '../FlashCardStack/module/reducer';
import {flashcardPreviewDetailsRequestAction} from '../FlashCardStack/module/action';
import LottieView from 'lottie-react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getAuthenticationToken } from '../../../utils/authentication';
// import { jsCode } from '../../../assets/scorm/js/scormwrapper';
// import ScormPlayer, { SCORMDataModel, API } from "react-native-scorm-player";
// import { downloadAndUnzipScorm, startLocalServer, stopLocalServer } from './ScormUtils';
import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';
//@ts-ignore
import StaticServer from 'react-native-static-server';

let server: StaticServer | null = null;

const tutorialTypes = {
  Text: 'Text',
  Video: 'Video',
  Document: 'Document',
  Youtube: 'YouTube',
  Embedded: 'Embedded',
};

const CourseTutorial = (props: any) => {
  const dispatch = useDispatch();
  const {storeCourseItemData, getSettingData} = homeScreenSelector();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const {route} = props;
  const {materialData, scromData} = route?.params || {};
  const {
    coursePlayData,
    getUserGamificationPoints,
    getUserGamificationPointsLoading,
  } = scromChapterSelector();
  const {condtionCourseString} = pathSelector();
  const {flashcardPreviewDetailsData, previewisLoading} =
    flashcardPreviewSelector();

  const [chapterMaterialData, setChapterMaterialData] = useState(materialData);
  const [types, setTypes] = useState(materialData?.type);
  //const [videoUrl, setVideoUrl] = useState(materialData?.type === "YouTube" ? materialData?.url : "");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [materialProgressLoading, setMaterialProgressLoading] = useState(false);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const playerRef = useRef<any>(null);
  const videoRef = useRef<any>(null);
  const [fullScreenVideoState, setFullScreenVideoState] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [scromModalVisible, setScromModalVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const {scromChapterByData, scromChapterLoading} = scromChapterSelector();
  const [gmaificationSinglePoints, setGmaificationSinglePoints] = useState(0);
  const [scromCurrentChapterIndex, setScromCurrentChapterIndex] = useState(-1);
  const [scromChapterDataStore, setScromChapterDataStore] = useState<any>([]);
  const [scromButtonLoading, setScromButtonLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    setDisabled(true); // Disable button
    setTimeout(() => setDisabled(false), 2 * 60 * 1000); // Enable after 2 minutes
  };

  const customHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; }
          iframe { width: 100%; height: 100vh; border: none; }
          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 90%;
            background: transparent;
            z-index: 10;
          }
          .container {
            position: relative;
            width: 100%;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <iframe 
            id="videoFrame"
            src=${chapterMaterialData?.indexerUrl}
            allow="autoplay; fullscreen"
            allowfullscreen>
          </iframe>
          ${
            coursePlayData?.isVideoControlsEnabled === false
              ? `<div class="overlay"></div>`
              : ''
          }
        </div>
        <script>
         
          window.addEventListener('message', function(event) {
            let videoCurrentTime = Math.ceil(event.data.currentTime);
            let duration = ${chapterMaterialData?.duration};
            if(videoCurrentTime >= (duration -1)){
            window.ReactNativeWebView.postMessage("true");
            videoCurrentTime=0;
            duration=0;
            }
            else{
            if(${
              coursePlayData?.isVideoControlsEnabled
            } == false && ${types} == 'Video'){
                window.ReactNativeWebView.postMessage("false")
              }
                        
              //window.ReactNativeWebView.postMessage("false");
            }
          });
        </script>
      </body>
    </html>
  `;
  // For debugging - log the URL to make sure it's correct

  const customScormHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f0f0f0; }
        iframe { width: 100%; height: 100vh; border: none; }
        .container { width: 100%; height: 100vh; position: relative; }
      </style>
    </head>
    <body>
      <div class="container">
        <iframe 
          src="https://appdev.leveluplms.com/f023123/scorm-files/b9db265a-c44a-4f8e-4f72-08dd7b1a1dcc/4f271bb03561DiversityInclusion/index.html" 
          allow="autoplay; fullscreen" 
          allowfullscreen>
        </iframe>
      </div>
    </body>
  </html>
`;

  //   const customHTML = `
  //   <!DOCTYPE html>
  //   <html>
  //     <head>
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <style>
  //         body { margin: 0; padding: 0; }
  //         iframe { width: 100%; height: 100vh; border: none; }
  //         .overlay {
  //           position: absolute;
  //           top: 0;
  //           left: 0;
  //           width: 100%;
  //           height: 90%;
  //           background: red;
  //           z-index: 10;
  //         }
  //         .container {
  //           position: relative;
  //           width: 100%;
  //           height: 100vh;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="container">
  //         <iframe
  //           id="videoFrame"
  //           src="https://www.videoindexer.ai/embed/player/efdaa22e-9b4a-4e5a-a68f-f6ae4062d609/os0e7ufx7p/?location=eastus"
  //           allow="autoplay; fullscreen"
  //           allowfullscreen>
  //         </iframe>
  //         ${
  //           coursePlayData?.isVideoControlsEnabled !== false
  //             ? `<div id="overlay" class="overlay"></div>`
  //             : ''
  //         }
  //       </div>
  //       <script>
  //         document.addEventListener("fullscreenchange", () => {
  //           const overlay = document.getElementById("overlay");
  //           const isFullscreen = !!document.fullscreenElement;

  //           if (overlay) {
  //             if (isFullscreen) {
  //               overlay.style.position = "fixed";
  //               overlay.style.top = "0";
  //               overlay.style.left = "0";
  //               overlay.style.width = "100%";
  //               overlay.style.height = "100%";
  //               overlay.style.zIndex = "10";
  //             } else {
  //               overlay.style.position = "absolute";
  //               overlay.style.top = "0";
  //               overlay.style.left = "0";
  //               overlay.style.width = "100%";
  //               overlay.style.height = "90%";
  //             }
  //           }
  //         });

  //         window.addEventListener('message', function(event) {
  //           let videoCurrentTime = Math.ceil(event.data.currentTime);
  //           let duration = ${chapterMaterialData?.duration};
  //           if(videoCurrentTime >= (duration - 1)){
  //             window.ReactNativeWebView.postMessage("true");
  //             videoCurrentTime = 0;
  //             duration = 0;
  //           } else {
  //             if(${coursePlayData?.isVideoControlsEnabled} == false && ${types} == 'Video'){
  //               window.ReactNativeWebView.postMessage("false");
  //             }
  //           }
  //         });
  //       </script>
  //     </body>
  //   </html>
  // `;

  const scromChapterFunction = () => {
    let body = {
      id: storeCourseItemData?.id || '',
      assignedDate: storeCourseItemData?.assignedDate || '',
    };
    dispatch(getScormChaptersByCourseRequestAction({body}));
  };

  useEffect(() => {
    scromChapterFunction();
  }, []);

  useEffect(() => {
    if (scromChapterByData?.chapters && scromData?.id) {
      const chapterNumber = scromChapterByData.chapters.findIndex(
        (chapter: any) => {
          return chapter.id === scromData.id;
        },
      );
      setScromCurrentChapterIndex(chapterNumber);
      setScromChapterDataStore(scromChapterByData?.chapters[chapterNumber]);
    }
  }, [scromChapterByData]);

  const scromNextButtonFunction = () => {
    setScromButtonLoading(true);
    const nextScromChapterIndex = scromCurrentChapterIndex + 1;
    setScromChapterDataStore(
      scromChapterByData?.chapters[nextScromChapterIndex],
    );
    if (nextScromChapterIndex < scromChapterByData?.chapters?.length) {
      setScromCurrentChapterIndex(nextScromChapterIndex);
      setScromButtonLoading(false);
      startTimer();
    } else {
      setScromModalVisible(true);
      setScromButtonLoading(false);
    }
  };

  const scromClosedFunction = () => {
    setScromModalVisible(false);
    // dispatch(CondtionClearAction())
    _onPressNavigate(SCREEN_NAMES.CourseStack, {
      screen: SCREEN_NAMES.CoursePreview,
    });
  };

  const handleMessage = (event: any) => {
    if (event?.nativeEvent?.data == 'true') {
      setIsVideoCompleted(true);
    } else {
      setIsVideoCompleted(false);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const extractEmbeddedURL = useCallback(() => {
    let id = '';
    if (chapterMaterialData?.url) {
      const urlRegex = /^(https?:\/\/[^\s]+)$/;
      if (urlRegex.test(chapterMaterialData.url)) {
        id = chapterMaterialData.url;
        //console.log("Direct URL found:", chapterMaterialData.url);
      } else {
        const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/;
        const match = chapterMaterialData.url.match(iframeRegex);
        if (match && match[1]) {
          id = match[1]; // Extracted URL from iframe
          //console.log("Iframe URL extracted:", match[1]);
        }
      }
    }
    if (!id) {
      console.error('No valid URL extracted from materialData');
      return ''; // Return empty string instead of null
    }
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <style>
          body { margin: 0; padding: 0; }
          iframe { width: 100%; height: 100vh; border: none; }
          .container {
            position: relative;
            width: 100%;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <iframe 
            id="videoFrame"
            src=${id}
            allow="autoplay; fullscreen"
            allowfullscreen>
          </iframe>
        </div>
      </html>`;
  }, [chapterMaterialData?.url]);

  const countMaterials = () => {
    let count = flashcardPreviewDetailsData?.chapters?.reduce(
      (acc: any, chapter: any) => acc + chapter.materials.length,
      0,
    );
    return flashcardPreviewDetailsData?.gamificationPoints
      ? flashcardPreviewDetailsData?.gamificationPoints * count
      : 0;
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
    Alert.alert(STRINGS.confirmation, STRINGS.appExitWarning, [
      {
        text: STRINGS.exit,
        onPress: () => {
          dispatch(CondtionClearAction());
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

  const handleVideoEnd = () => {
    setIsVideoCompleted(true);
    //setIsPaused(false)
    setTimeout(() => {
      videoRef?.current?.seek(0);
      setIsPaused(true);
      setIsVideoCompleted(false);
    }, 3000);
    // You can perform any other actions here when the video ends
  };

  const clearStates = () => {
    //const [videoUrl, setVideoUrl] = useState(materialData?.type === "YouTube" ? materialData?.url : "");
    setVideoId(null);
    setPlaying(false);
    setCurrentChapterIndex(-1);
  };

  const updateMaterialsProgress = (
    statusType: string,
    id: string,
    playedTime: any,
  ) => {
    setMaterialProgressLoading(true);
    let body = {
      body: {
        playedTime: playedTime,
        status: statusType,
      },
      materialId: id,
    };
    const callback = (res: any) => {
      setMaterialProgressLoading(false);
      if (res !== 'error') {
        gamificationPointsFunction();
      }
    };
    dispatch(updateMaterialRequestAction({body, callback}));
  };

  useEffect(() => {
    updateMaterialsProgress(
      'in_progress',
      materialData?.userMaterialProgress?.userMaterialMappingId || '',
      0,
    );
  }, []);

  useEffect(() => {
    setChapterMaterialData(materialData);
    if (materialData && materialData.type === 'YouTube' && materialData.url) {
      const id = extractVideoId(materialData.url);
      if (id) {
        setVideoId(id);
        setPlaying(true); // Auto-start the video
      } else {
        Alert.alert('Invalid YouTube URL');
      }
    }

    return () => setPlaying(false);
  }, [materialData]);

  // useEffect(() => {
  //   const id = extractVideoId(videoUrl);
  //   if (id) {
  //     setVideoId(id);
  //     setPlaying(true); // Auto-start the video
  //   } else {
  //     Alert.alert('Invalid YouTube URL');
  //   }

  //   return () => setPlaying(false);
  // }, [videoUrl]);

  const extractVideoId = (url: string | null | undefined): string | null => {
    if (!url) return null;

    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    let hasData = props?.route?.params?.materialData;
    setChapterMaterialData(hasData);
    setTypes(hasData?.type);
    // setCurrentChapterIndex(-1);
  }, [props]);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('Video has finished playing!');
    }
  }, []);

  const onBuffer = ({isBuffering}: {isBuffering: boolean}) => {};

  useEffect(() => {
    if (coursePlayData?.chapters && chapterMaterialData?.id) {
      const chapterNumber =
        coursePlayData.chapters.findIndex((chapter: any) => {
          return chapter.materials.some(
            (material: any) => material.id === chapterMaterialData.id,
          );
        }) + 1;
      setCurrentChapterIndex(chapterNumber);
    }
  }, [coursePlayData, chapterMaterialData?.id]);

  const nextButtonFunction = () => {
    updateMaterialsProgress(
      'completed',
      chapterMaterialData?.userMaterialProgress?.userMaterialMappingId || '',
      chapterMaterialData?.duration,
    );
    const currentChapterIndex = coursePlayData?.chapters.findIndex(
      (chapter: any) => {
        return chapter.materials.some(
          (material: any) => material.id === chapterMaterialData?.id,
        );
      },
    );
    setCurrentChapterIndex(currentChapterIndex);
    if (currentChapterIndex !== -1) {
      const currentChapter = coursePlayData.chapters[currentChapterIndex];
      const currentChapterMaterials = currentChapter.materials;
      const currentMaterialIndex = currentChapterMaterials.findIndex(
        (material: any) => material.id === chapterMaterialData?.id,
      );
      const nextMaterialIndex = currentMaterialIndex + 1;

      if (nextMaterialIndex < currentChapterMaterials.length) {
        const nextMaterial = currentChapterMaterials[nextMaterialIndex];
        setChapterMaterialData(nextMaterial);
        setTypes(nextMaterial?.type);
        setVideoId(extractVideoId(nextMaterial?.url));
        updateMaterialsProgress(
          'in_progress',
          nextMaterial?.userMaterialProgress?.userMaterialMappingId || '',
          0,
        );
      } else if (currentChapter.kcExam) {
        updateMaterialsProgress(
          'completed',
          chapterMaterialData?.userMaterialProgress?.userMaterialMappingId ||
            '',
          chapterMaterialData?.duration,
        );
        clearStates();
        _onPressNavigate(SCREEN_NAMES.CourseStack, {
          screen: SCREEN_NAMES.CourseKnowladgeCheck,
          params: {kcData: currentChapter.kcExam},
        });
      } else {
        const nextChapterIndex = currentChapterIndex + 1;
        if (nextChapterIndex < coursePlayData.chapters.length) {
          const nextChapter = coursePlayData.chapters[nextChapterIndex];
          const nextChapterMaterial = nextChapter.materials[0];
          setChapterMaterialData(nextChapterMaterial);
          setTypes(nextChapterMaterial?.type);
          setVideoId(extractVideoId(nextChapterMaterial?.url));
        } else {
          updateMaterialsProgress(
            'completed',
            chapterMaterialData?.userMaterialProgress?.userMaterialMappingId ||
              '',
            chapterMaterialData?.duration,
          );
          //clearStates();
          //Toast.show("You have completed the Course!", { type: 'success' });
          if (coursePlayData?.exam?.remainingRetries > 0) {
            setModalVisible(true);
          } else {
            setModalVisible1(true);
          }
        }
      }
    } else {
      clearStates();
      _onPressNavigate(SCREEN_NAMES.CourseStack, {
        screen: SCREEN_NAMES.MainCourse,
      });
      //Toast.show("No chapter found with the provided material ID.", { type: 'danger' });
    }
  };

  const hasAllClearState = () => {
    setChapterMaterialData(materialData);
    setTypes(materialData?.type);
    setVideoId(null);
    setPlaying(false);
    setCurrentChapterIndex(-1);
    setMaterialProgressLoading(false);
    setIsVideoCompleted(false);
    setFullScreenVideoState(false);
    setModalVisible(false);
    setModalVisible1(false);
    setIsPaused(false);

    // Reset refs
    if (playerRef.current) {
      playerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current = null;
    }
  };

  const replayFunction = () => {
    //setModalVisible(false);
    clearStates();
    hasAllClearState();
    // _onPressNavigate(SCREEN_NAMES.CourseStack, {
    //   screen: SCREEN_NAMES.MainCourse
    // })
  };

  useFocusEffect(
    useCallback(() => {
      gamificationPointsFunction();
      getFlashCardPreviewDetailsFunction();
      return () => {};
    }, []),
  );

  const getFlashCardPreviewDetailsFunction = () => {
    let body = {
      id: storeCourseItemData?.id || '',
      assignedDate: storeCourseItemData?.assignedDate,
    };
    dispatch(flashcardPreviewDetailsRequestAction({body}));
  };

  const gamificationPointsFunction = () => {
    const {id, assignedDate} = storeCourseItemData;
    if (id && assignedDate) {
      const body = {id, assignedDate};
      dispatch(getUserGamificationPointsRequestAction({body}));
    }
  };

  useEffect(() => {
    //console.log(getUserGamificationPoints, "getUserGamificationPointsgetUserGamificationPoints")
  }, [getUserGamificationPoints]);

  const closeFunction = () => {
    if (condtionCourseString == 'coursePath') {
      clearStates();
      hasAllClearState();
      dispatch(CondtionClearAction());
      _onPressNavigate(SCREEN_NAMES.PathStack, {
        screen: SCREEN_NAMES.MainPath,
      });
    } else {
      clearStates();
      hasAllClearState();
      dispatch(CondtionClearAction());
      if (coursePlayData?.userProgress?.status !== 'COMPLETED') {
        dispatch(gamificationBooleanSuccessAction('check'));
        setTimeout(() => {
          _onPressNavigate(SCREEN_NAMES.CourseStack, {
            screen: SCREEN_NAMES.CoursePreview,
          });
        }, 1000);
      } else {
        _onPressNavigate(SCREEN_NAMES.CourseStack, {
          screen: SCREEN_NAMES.CoursePreview,
        });
      }
    }
  };

  const FinshKnowledgeModal = () => {
    return (
      <RNModal transparent visible={modalVisible}>
        <View
          style={{
            width: '90%',
            paddingHorizontal: 10,
            backgroundColor: COLORS.WHITE,
            paddingVertical: 20,
          }}>
          <RNText style={{marginTop: 5}} large bold>
            You are almost there!
          </RNText>
          <RNText style={{marginTop: 10}} large>
            Would you like to proceed to the final exam or replay the course?
          </RNText>

          <RNButton
            onPress={() => replayFunction()}
            textColor={COLORS.SECONDARY}
            title={'Replay'}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.WHITE}
          />

          <RNButton
            onPress={startExamFunction}
            textColor={COLORS.WHITE}
            title={'Proceed to Exam'}
            minHeightButton={true}
            style={styles.courseButtonStyle}
            backgroundColor={COLORS.SECONDARY}
          />
        </View>
      </RNModal>
    );
  };

  const ScromFinshKnowledgeModal = () => {
    return (
      <RNModal transparent visible={scromModalVisible}>
        <View style={styles.modalContainer}>
          {/* <LottieView
            source={IMAGES.ConfettiAnimation}
            loop={true}
            autoPlay={true}
            style={styles.confettiBackground}
          /> */}
          <RNText
            TextAlignCenter
            textColor={COLORS.TEXTCOLOR}
            extraLarge
            semiBold>
            Scrom Completed
          </RNText>
          {/* Trophy/Badge animation */}
          <LottieView
            source={IMAGES.CourseCompleted}
            loop={true}
            autoPlay={true}
            style={[
              styles.badgeAnimation,
              {width: 150, height: 150, marginTop: 0},
            ]}
          />

          <RNText
            style={{marginTop: scale(0)}}
            TextAlignCenter
            textColor="#A3C3F9"
            extraLarge
            semiBold>
            Congratulations!
          </RNText>

          <RNText
            style={{marginTop: 15}}
            TextAlignCenter
            textColor="#9398A4"
            medium>
            You've successfully passed the course. Well done on your hard work!
          </RNText>

          <RNButton
            onPress={scromClosedFunction}
            textColor={COLORS.WHITE}
            title={'Close'}
            minHeightButton={true}
            style={{
              marginTop: scale(20),
              width: scale(250),
              alignSelf: 'center',
            }}
            backgroundColor={COLORS.SECONDARY}
          />
        </View>
      </RNModal>
    );
  };

  const FinshKnowledgeModalSecond = () => {
    return (
      <RNModal transparent visible={modalVisible1}>
        <View
          style={{
            width: '90%',
            paddingHorizontal: 10,
            backgroundColor: COLORS.WHITE,
            paddingVertical: 20,
          }}>
          <RNText TextAlignCenter style={{marginTop: 5}} extraLarge semiBold>
            {coursePlayData?.userProgress?.status !== 'COMPLETED'
              ? 'Course Completed'
              : 'Replay Complete'}
          </RNText>
          <LottieView
            source={IMAGES.CoursePassed}
            loop={true}
            autoPlay={true}
            style={styles.badgeAnimation}
          />
          <RNText
            style={{marginTop: scale(15)}}
            TextAlignCenter
            textColor="#A3C3F9"
            extraLarge
            semiBold>
            {coursePlayData?.userProgress?.status !== 'COMPLETED'
              ? 'Congratulations!'
              : ''}
          </RNText>
          <RNText
            style={{marginTop: 15, paddingBottom: 10}}
            textColor="#9398A4"
            TextAlignCenter
            large>
            {'You have completed the Course!'}
          </RNText>

          <RNButton
            onPress={closeFunction}
            textColor={COLORS.SECONDARY}
            title={'Close'}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.WHITE}
          />
        </View>
      </RNModal>
    );
  };

  const startExamFunction = () => {
    if (coursePlayData?.exam || coursePlayData?.exam?.id) {
      let body = {
        id: coursePlayData?.exam?.id || '',
      };
      const callback = (res: any) => {
        setModalVisible(false);
        if (res !== 'error') {
          if (res?.isPassingScoreReqd || res?.isTimed) {
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CourseAIExamStart,
              params: {
                startExamData: res ? res : [],
              },
            });
          } else {
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CourseAIExam,
              params: {
                startExamData: res ? res : [],
              },
            });
          }
        }
      };
      dispatch(startExamRequestAction({body, callback}));
      // () => _onPressNavigate(SCREEN_NAMES.CourseStack, {
      //   screen: SCREEN_NAMES.CourseAIExamStart
      // })
    }
  };

  const onGoBackFunction = () => {
    if (scromData) {
      _onPressNavigate(SCREEN_NAMES.CourseStack, {
        screen: SCREEN_NAMES.MainCourse,
      });
      // _onPressNavigate(SCREEN_NAMES.CourseStack, {
      //   screen: SCREEN_NAMES.CoursePreview
      // })
    } else {
      if (condtionCourseString == 'coursePath') {
        dispatch(CondtionClearAction());
        _onPressNavigate(SCREEN_NAMES.PathStack, {
          screen: SCREEN_NAMES.MainPath,
        });
      } else {
        dispatch(CondtionClearAction());
        _onPressNavigate(SCREEN_NAMES.CourseStack, {
          screen: SCREEN_NAMES.CoursePreview,
        });
      }
    }
  };

  const XmlViewer = ({xmlUrl}: {xmlUrl: any}) => {
    const [xmlContent, setXmlContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchXmlContent = async (url: any, attempt = 1) => {
      try {
        console.log(
          `Attempting to fetch XML from: ${url} (Attempt ${attempt})`,
        );

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/xml, text/xml, */*',
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();

        if (!text || text.trim().length === 0) {
          throw new Error('Empty XML content received');
        }

        setXmlContent(text);
        setLoading(false);
        setError(null);
      } catch (err: any) {
        console.error(`XML fetch error (attempt ${attempt}):`, err);

        if (attempt < 3) {
          // Retry up to 3 times
          setTimeout(() => {
            fetchXmlContent(url, attempt + 1);
          }, 1000 * attempt); // Exponential backoff
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    useEffect(() => {
      if (xmlUrl && xmlUrl.trim()) {
        setLoading(true);
        setError(null);
        fetchXmlContent(xmlUrl);
      } else {
        setError('No XML URL provided');
        setLoading(false);
      }
    }, [xmlUrl]);

    const handleRetry = () => {
      setRetryCount(prev => prev + 1);
      setLoading(true);
      setError(null);
      fetchXmlContent(xmlUrl);
    };

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <RNText textColor={COLORS.TEXTCOLOR} style={{marginTop: 10}}>
            Loading XML file...
          </RNText>
          <RNText textColor={COLORS.TEXTCOLOR} small style={{marginTop: 5}}>
            {retryCount > 0 ? `Retry attempt: ${retryCount}` : ''}
          </RNText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <RNText
            textColor={COLORS.RED}
            style={{textAlign: 'center', marginBottom: 10}}>
            Error loading XML file:
          </RNText>
          <RNText
            textColor={COLORS.RED}
            small
            style={{textAlign: 'center', marginBottom: 15}}>
            {error}
          </RNText>
          <RNText
            textColor={COLORS.TEXTCOLOR}
            small
            style={{textAlign: 'center', marginBottom: 15}}>
            URL: {xmlUrl}
          </RNText>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <RNText textColor={COLORS.WHITE}>Retry</RNText>
          </TouchableOpacity>
        </View>
      );
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>XML Viewer</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            padding: 10px; 
            margin: 0;
            background-color: #f8f9fa;
          }
          pre { 
            background: white; 
            padding: 15px; 
            border-radius: 8px; 
            overflow-x: auto;
            border: 1px solid #e9ecef;
            font-size: 12px;
            line-height: 1.4;
          }
          .xml-tag { color: #0066cc; font-weight: bold; }
          .xml-attr { color: #cc6600; }
          .xml-value { color: #009900; }
          .xml-comment { color: #666666; font-style: italic; }
        </style>
      </head>
      <body>
        <pre id="xml-content">${xmlContent
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</pre>
        <script>
          try {
            const content = document.getElementById('xml-content');
            let html = content.innerHTML;
            
            html = html.replace(/(&lt;\/?[^&\s]+)/g, '<span class="xml-tag">$1</span>');
            html = html.replace(/(\w+)=("([^"]*)")/g, '<span class="xml-attr">$1</span>=<span class="xml-value">$2</span>');
            html = html.replace(/(&lt;!--.*?--&gt;)/g, '<span class="xml-comment">$1</span>');
            
            content.innerHTML = html;
          } catch (e) {
            console.error('Error highlighting XML:', e);
          }
        </script>
      </body>
    </html>
  `;

    return (
      <WebView
        source={{html: htmlContent}}
        style={[styles.webView, {height: scale(500)}]}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
      />
    );
  };

  //console.log(chapterMaterialData, scromData?.scormURL, "scromData?.scormURLscromData?.scormURL")

  const defaultTextProps = {
    style: {
      fontSize: 18,
    },
  };

  const isExcelFile = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('.xls') || lowerUrl.includes('.xlsx');
  };

  const MainView = () =>
    materialProgressLoading ? (
      <ActivityIndicator
        style={{
          marginTop: scale(270),
          padding: 15,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center',
        }}
        size="large"
        color={COLORS.PRIMARY}
      />
    ) : (
      <View
        style={(() => {
          if (fullScreenVideoState) {
            return {flex: 1};
          }
          // Return an empty object if fullScreenVideoState is false
          return {};
        })()}>
        {types === tutorialTypes.Text && (
          <>
            <View style={styles.textContainer}>
              <RNText textColor={COLORS.TEXTCOLOR} bold large>
                {chapterMaterialData?.title || ''}
              </RNText>
            </View>
            <View style={styles.textContainer1}>
              <RenderHTML
                defaultTextProps={defaultTextProps}
                contentWidth={width}
                source={{html: chapterMaterialData?.longDescription || ''}}
              />
            </View>
          </>
        )}

        {types === tutorialTypes.Document &&
          (isExcelFile(chapterMaterialData?.url) ? (
            // For Excel files (.xls, .xlsx) - use Office Apps viewer
            <View style={styles.webViewContainer}>
              <WebView
                source={{
                  uri: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    chapterMaterialData?.url,
                  )}`,
                }}
                style={[styles.webView, {height: scale(6000)}]}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
              />
            </View>
          ) : (
            // For non-Excel documents (PDF, DOC, PPT, etc.) - use Google Docs viewer
            <View style={styles.webViewContainer}>
              <WebView
                source={{
                  uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                    chapterMaterialData?.url,
                  )}`,
                }}
                style={[styles.webView, {height: scale(6000)}]}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
              />
            </View>
          ))}

        {types === tutorialTypes.Video && (
          <>
            <WebView
              source={{html: customHTML}}
              style={[
                styles.webView,
                {
                  marginTop: scale(10),
                  height: scale(300),
                  backgroundColor: COLORS.TRANSPARENT,
                  width: '95%',
                },
              ]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              onMessage={handleMessage}
              originWhitelist={['*']}
            />
          </>
          // {!coursePlayData?.isVideoControlsEnabled ?
          //   <Pressable style={{height:25, width:"100%", backgroundColor:COLORS.TRANSPARENT, bottom:"18%"}}/> : null}
        )}

        {types === tutorialTypes.Embedded && (
          <>
            <View
              style={{
                paddingHorizontal: scale(10),
                height: 450,
                alignSelf: 'center',
                backgroundColor: COLORS.WHITE,
              }}>
              <WebView
                source={{html: extractEmbeddedURL()}}
                style={[styles.webView, {backgroundColor: COLORS.TRANSPARENT}]}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mediaPlaybackRequiresUserAction={false}
                startInLoadingState={true}
              />
            </View>
          </>
        )}

        {types === tutorialTypes.Youtube && (
          <View style={{marginTop: scale(10)}}>
            {videoId ? (
              <YoutubePlayer
                height={250}
                play={playing}
                videoId={videoId}
                onChangeState={onStateChange}
                ref={playerRef}
                onReady={() => setPlaying(true)}
              />
            ) : (
              <RNText>Loading YouTube video...</RNText>
            )}
          </View>
        )}
      </View>
    );

  // const ScromView = () => (
  //   <View style={styles.webViewContainer}>
  //     <WebView style={[styles.webView, { height: scale(195) }]} source={{ uri: scromData?.scormURL || '' }} />
  //   </View>
  // );

  const ScromView = () => {
    const [scormParamsJS, setScormParamsJS] = useState('');
    const [loading, setLoading] = useState(true);
    const webviewRef: any = useRef(null);

    const [webViewUrl, setWebViewUrl] = useState('');
    const [entryPoint, setEntryPoint] = useState('');
    const scromChpterUrl = scromChapterDataStore?.scormURL || ''; // "https://appdev.leveluplms.com/f023123/scorm-files/014d1730-2c3b-4ed8-01aa-08dd8c5c518b/196c59af2080DiversityInclusion/index.html",

    console.log(scromChapterDataStore, 'hello world');

    useEffect(() => {
      let server: any;

      const setup = async () => {
        try {
          // Define paths
          const zipUrl =
            'https://leveluplmsdevstorage.blob.core.windows.net/c50c31b/scorm-files/Diversity%20Inclusion.zip';
          const zipPath = `${RNFS.DocumentDirectoryPath}/scorm.zip`;
          const unzipPath = `${RNFS.DocumentDirectoryPath}/scormcourse`;

          // Clean up existing files
          if (await RNFS.exists(unzipPath)) {
            await RNFS.unlink(unzipPath);
          }

          // Create directory
          await RNFS.mkdir(unzipPath);

          console.log('Downloading ZIP file...');
          // Download the SCORM ZIP
          await RNFS.downloadFile({
            fromUrl: zipUrl,
            toFile: zipPath,
            progressDivider: 1,
            progress: res => {
              console.log(
                `Downloaded ${res.bytesWritten} of ${res.contentLength}`,
              );
            },
          }).promise;

          console.log('Download complete, unzipping...');
          // Unzip the file
          await unzip(zipPath, unzipPath);
          console.log('Unzip complete');

          // List the unzipped contents
          const contents = await RNFS.readDir(unzipPath);
          console.log(
            'Unzipped directory contents:',
            contents.map(item => item.name),
          );

          // Look for SCORM entry point by examining the manifest or common directories
          let scormEntryPoint = '';

          // Check if there's a "course" directory, which seems to be present in your package
          const courseDir = contents.find(
            item => item.name === 'course' && item.isDirectory(),
          );
          if (courseDir) {
            // Look inside the course directory for HTML files
            const courseContents = await RNFS.readDir(`${unzipPath}/course`);
            console.log(
              'Course directory contents:',
              courseContents.map(item => item.name),
            );

            for (const item of courseContents) {
              if (item.isDirectory()) {
                const subContents = await RNFS.readDir(
                  `${unzipPath}/course/${item.name}`,
                );
                console.log(
                  `Course/${item.name} contents:`,
                  subContents.map(subItem => subItem.name),
                );
              }
            }

            // Look for likely entry points like index.html, start.html, launch.html, etc.
            const htmlFile = courseContents.find(
              item =>
                item.name.toLowerCase() === 'index.html' ||
                item.name.toLowerCase() === 'start.html' ||
                item.name.toLowerCase() === 'launch.html' ||
                item.name.toLowerCase().endsWith('.html'),
            );

            if (htmlFile) {
              scormEntryPoint = `course/${htmlFile.name}`;
              console.log('Found entry point:', scormEntryPoint);
            }
          }

          // If we can't find a good entry point, try to parse the manifest
          if (!scormEntryPoint) {
            const manifestFile = contents.find(
              item => item.name === 'imsmanifest.xml',
            );
            if (manifestFile) {
              const manifestContent = await RNFS.readFile(
                `${unzipPath}/imsmanifest.xml`,
                'utf8',
              );
              console.log(
                'Found manifest file:',
                manifestContent.substring(0, 200) + '...',
              );

              // Basic XML parsing to find resource href (more sophisticated parsing might be needed)
              const resourceMatch = manifestContent.match(
                /<resource.*?href="(.*?)".*?>/i,
              );
              if (resourceMatch && resourceMatch[1]) {
                scormEntryPoint = resourceMatch[1];
                console.log('Found entry point in manifest:', scormEntryPoint);
              }
            }
          }

          if (!scormEntryPoint) {
            console.error('Could not find SCORM entry point');
            setLoading(false);
            return;
          }

          setEntryPoint(scormEntryPoint);

          // Copy the wrapper and SCORM API files **(Android & iOS)**
          if (Platform.OS === 'android') {
            await RNFS.copyFileAssets(
              'scormwrapper.html',
              `${unzipPath}/scormwrapper.html`,
            );
            await RNFS.copyFileAssets(
              'scorm-again.min.js',
              `${unzipPath}/scorm-again.min.js`,
            );
          } else {
            // iOS: these must be in Copy Bundle Resources in Xcode
            const bundle = RNFS.MainBundlePath;
            await RNFS.copyFile(
              `${bundle}/scormwrapper.html`,
              `${unzipPath}/scormwrapper.html`,
            );
            await RNFS.copyFile(
              `${bundle}/scorm-again.min.js`,
              `${unzipPath}/scorm-again.min.js`,
            );
          }

          // Modify the wrapper to point to the correct entry point
          let wrapperContent = await RNFS.readFile(
            `${unzipPath}/scormwrapper.html`,
            'utf8',
          );
          wrapperContent = wrapperContent.replace(
            `document.getElementById('contentFrame').src = './index.html';`,
            `document.getElementById('contentFrame').src = './${scormEntryPoint}';`,
          );
          await RNFS.writeFile(
            `${unzipPath}/scormwrapper.html`,
            wrapperContent,
            'utf8',
          );

          // Start the server
          server = new StaticServer(8080, unzipPath, {localOnly: true});
          const serverUrl = await server.start();
          console.log('Server started at:', serverUrl);

          // Set the WebView URL
          setWebViewUrl(`${serverUrl}/scormwrapper.html`);
          setLoading(false);
        } catch (err) {
          console.error('SCORM Setup Error:', err);
          setLoading(false);
        }
      };

      setup();

      return () => {
        if (server) {
          console.log('Stopping server');
          server.stop();
        }
      };
    }, []);

    // Enhanced initial CMI data with better structure
    // const initialCMIData = {
    //   'learner_id': "123456",
    //   'learner_name': "siri bhandya",
    //   'completion_status': 'incomplete',
    //   'success_status': 'unknown',
    //   'location': '',
    //   'credit': 'credit',
    //   'entry': 'ab-initio',
    //   'mode': 'normal',
    //   'suspend_data': '',
    //   'total_time': 'PT0H0M0S',
    //   'progress_measure': null,
    //   'score.scaled': null,
    //   'score.raw': null,
    //   'score.max': null,
    //   'score.min': null,
    //   // Add session tracking
    //   'session_time': 'PT0H0M0S',
    //   'exit': '',
    //   // Add timestamp for tracking
    //   'last_updated': new Date().toISOString()
    // };

    // const handleWebViewMessage = (event: any) => {
    //   try {
    //     const data = JSON.parse(event.nativeEvent.data);
    //     console.log('Received from WebView:', data.type, data);

    //     switch (data.type) {
    //       case 'SCORM_API_READY':
    //         console.log('SCORM API Ready with config:', data.config);
    //         console.log('Available data structure:', data.dataStructure);

    //         // Send initial CMI data with enhanced structure
    //         webviewRef.current?.postMessage(JSON.stringify({
    //           type: 'INIT_SCORM_DATA',
    //           cmiData: {
    //             ...initialCMIData,
    //             // Add session start time
    //             'session_start': new Date().toISOString()
    //           },
    //           success: true
    //         }));
    //         break;

    //       case 'REQUEST_INITIAL_DATA':
    //       case 'REQUEST_INITIAL_CMI_DATA':
    //         console.log('Sending initial CMI data to WebView');
    //         webviewRef.current?.postMessage(JSON.stringify({
    //           type: 'INIT_SCORM_DATA',
    //           cmiData: initialCMIData,
    //           timestamp: new Date().toISOString()
    //         }));
    //         break;

    //       case 'SCORM_INIT_DIRECT':
    //         console.log('SCORM Initialized with config:', data.config);
    //         // You might want to save this initialization event
    //         // saveSCORMEvent(userId, courseId, 'initialized', data.config);
    //         break;

    //       case 'SCORM_GET_DIRECT':
    //         console.log(`SCORM Get: ${data.parameter} = ${data.value}`);
    //         // Log the source if available (useful for debugging)
    //         if (data.source) {
    //           console.log(`Source: ${data.source}`);
    //         }
    //         // If debug data is available, you might want to store it
    //         if (data.allData && __DEV__) {
    //           console.log('All SCORM data:', data.allData);
    //         }
    //         break;

    //       case 'SCORM_SET_DIRECT':
    //         console.log(`SCORM Set: ${data.parameter} = ${data.value}`);

    //         // Handle specific parameters with special logic
    //         if (data.parameter === 'completion_status' || data.parameter === 'lesson_status') {
    //           console.log(`Course completion status changed to: ${data.value}`);
    //           // Update UI or trigger notifications
    //           // onCompletionStatusChange(data.value);
    //         }

    //         if (data.parameter === 'location' || data.parameter === 'lesson_location') {
    //           console.log(`User navigated to: ${data.value}`);
    //           // Track user progress through content
    //           // onLocationChange(data.value);
    //         }

    //         if (data.parameter.includes('score')) {
    //           console.log(`Score updated: ${data.parameter} = ${data.value}`);
    //           // Handle score changes
    //           // onScoreUpdate(data.parameter, data.value);
    //         }

    //         // Save to database (uncomment when ready)
    //         // await saveSCORMData(userId, courseId, data.parameter, data.value);
    //         break;

    //       case 'SCORM_COMMIT_DATA':
    //         console.log('SCORM Commit Data received:', Object.keys(data.cmiData || {}).length, 'parameters');

    //         if (data.cmiData) {
    //           // Process and save all CMI data
    //           console.log('CMI Data to save:', data.cmiData);

    //           // Extract important values for quick access
    //           const completionStatus = data.cmiData.completion_status || data.cmiData.lesson_status;
    //           const location = data.cmiData.location || data.cmiData.lesson_location;
    //           const score = data.cmiData['score.raw'] || data.cmiData.score_raw;

    //           console.log('Key values - Status:', completionStatus, 'Location:', location, 'Score:', score);

    //           // Save all data (uncomment when ready)
    //           // await saveAllCMIData(userId, courseId, data.cmiData);
    //         }
    //         break;

    //       case 'SCORM_COMMIT_DIRECT':
    //         console.log('SCORM Direct Commit received');
    //         if (data.data) {
    //           console.log('Commit data keys:', Object.keys(data.data));
    //           // Process the committed data
    //           // await saveAllCMIData(userId, courseId, data.data);
    //         }
    //         break;

    //       case 'COMPLETION_STATUS':
    //         console.log(`Completion Status Update: ${data.status} (source: ${data.source})`);

    //         // Handle completion status changes
    //         if (data.status === 'completed' || data.status === 'passed') {
    //           console.log('🎉 Course completed successfully!');
    //           // Show completion UI, send notifications, etc.
    //           // onCourseCompleted(data.status);
    //         }

    //         if (data.suspendData) {
    //           console.log('Suspend data included:', data.suspendData.substring(0, 100) + '...');
    //         }
    //         break;

    //       case 'SCORM_SCORE_UPDATE':
    //         console.log(`Score Update: ${data.parameter} = ${data.value}`);

    //         if (data.scores) {
    //           console.log('All scores:', {
    //             raw: data.scores.raw,
    //             max: data.scores.max,
    //             min: data.scores.min,
    //             scaled: data.scores.scaled
    //           });

    //           // Handle score thresholds or achievements
    //           const rawScore = parseFloat(data.scores.raw);
    //           const maxScore = parseFloat(data.scores.max);

    //           if (rawScore && maxScore) {
    //             const percentage = (rawScore / maxScore) * 100;
    //             console.log(`Score percentage: ${percentage.toFixed(1)}%`);

    //             // Trigger achievements or notifications based on score
    //             // if (percentage >= 80) onHighScoreAchieved(percentage);
    //           }
    //         }
    //         break;

    //       case 'SCORM_NAVIGATION':
    //         console.log(`Navigation: ${data.parameter} = ${data.value}`);

    //         if (data.location) {
    //           console.log(`Current location: ${data.location}`);
    //           // Update progress indicators
    //           // updateProgressIndicator(data.location);
    //         }

    //         // Track navigation patterns for analytics
    //         // trackNavigation(userId, courseId, data.parameter, data.value);
    //         break;

    //       case 'SCORM_INTERACTION':
    //         console.log(`Interaction: ${data.parameter} = ${data.value}`);

    //         // Track user interactions for engagement metrics
    //         // trackInteraction(userId, courseId, data.parameter, data.value);
    //         break;

    //       case 'SCORM_STATUS_CHANGE':
    //         console.log(`Status changed to: ${data.value}`);
    //         if (data.previousStatus) {
    //           console.log(`Previous status: ${data.previousStatus}`);
    //         }
    //         // Handle status change UI updates
    //         // onStatusChange(data.value, data.previousStatus);
    //         break;

    //       case 'CONTENT_LOADED':
    //         console.log('SCORM Content loaded successfully');
    //         // Hide loading spinner, enable interactions
    //         // setContentLoaded(true);
    //         // setIsLoading(false);
    //         break;

    //       case 'CONTENT_ERROR':
    //         console.error('SCORM Content Error:', data.message);
    //         if (data.details) {
    //           console.error('Error details:', data.details);
    //         }
    //         // Show error message to user
    //         // showErrorMessage(data.message);
    //         break;

    //       case 'LOG':
    //         // Handle debug logs from WebView
    //         if (data.level === 'error') {
    //           console.error('WebView Log:', data.message);
    //         } else if (data.level === 'warn') {
    //           console.warn('WebView Log:', data.message);
    //         } else {
    //           console.log('WebView Log:', data.message);
    //         }
    //         break;

    //       case 'ERROR':
    //         console.error('WebView Error:', data.message);
    //         if (data.stack) {
    //           console.error('Error stack:', data.stack);
    //         }
    //         // Handle critical errors
    //         // showCriticalError(data.message);
    //         break;

    //       // Handle any custom events from your SCORM content
    //       case 'CUSTOM_EVENT':
    //         console.log('Custom event received:', data.eventName, data.eventData);
    //         // Handle custom events specific to your content
    //         // handleCustomEvent(data.eventName, data.eventData);
    //         break;

    //       default:
    //         console.log('Unhandled message type:', data.type);
    //         // Log unhandled messages for debugging
    //         if (__DEV__) {
    //           console.log('Full message data:', data);
    //         }
    //     }
    //   } catch (error) {
    //     console.error('Error handling WebView message:', error);
    //     console.error('Raw message data:', event.nativeEvent.data);

    //     // You might want to send error feedback to the WebView
    //     webviewRef.current?.postMessage(JSON.stringify({
    //       type: 'MESSAGE_PROCESSING_ERROR',
    //       error: error.message,
    //       originalData: event.nativeEvent.data
    //     }));
    //   }
    // };

    // // Helper function to send messages to WebView with error handling
    // const sendToWebView = (message: any) => {
    //   try {
    //     webviewRef.current?.postMessage(JSON.stringify(message));
    //   } catch (error) {
    //     console.error('Failed to send message to WebView:', error);
    //   }
    // };

    // // Helper function to update SCORM data in WebView
    // const updateSCORMData = (parameter: string, value: any) => {
    //   sendToWebView({
    //     type: 'UPDATE_SCORM_DATA',
    //     parameter: parameter,
    //     value: value,
    //     timestamp: new Date().toISOString()
    //   });
    // };

    // // Helper function to request current SCORM status
    // const requestSCORMStatus = () => {
    //   sendToWebView({
    //     type: 'REQUEST_SCORM_STATUS'
    //   });
    // };

    // // Export helper functions for use in other components
    // export { sendToWebView, updateSCORMData, requestSCORMStatus };

    // Sample initial CMI data - in real app, this would come from your database/API
    const initialCMIData = {
      learner_id: '123456',
      learner_name: 'siri bhandya',
      completion_status: 'incomplete',
      success_status: 'unknown',
      location: '',
      credit: 'credit',
      entry: 'ab-initio',
      mode: 'normal',
      suspend_data: '',
      total_time: 'PT0H0M0S',
      progress_measure: null,
      'score.scaled': null,
      'score.raw': null,
      'score.max': null,
      'score.min': null,
    };

    const handleWebViewMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        console.log('Received from WebView:', data.type, data);

        switch (data.type) {
          case 'SCORM_API_READY':
            console.log('SCORM API Ready. Success:', data.success);
            if (data.success) {
              console.log('Has SCORM Again:', data.hasScormAgain);
              console.log('Has SCORM 2004:', data.hasScorm2004);
              console.log('Data Structure:', data.dataStructure);

              // Send initial CMI data to populate SCORM Again
              webviewRef.current?.postMessage(
                JSON.stringify({
                  type: 'INIT_SCORM_DATA',
                  cmiData: initialCMIData,
                }),
              );
            } else {
              console.error('SCORM API initialization failed:', data.error);
              // Handle initialization failure
            }
            break;

          case 'REQUEST_INITIAL_DATA':
          case 'REQUEST_INITIAL_CMI_DATA':
            console.log('Sending initial CMI data to WebView');
            webviewRef.current?.postMessage(
              JSON.stringify({
                type: 'INIT_SCORM_DATA',
                cmiData: initialCMIData,
              }),
            );
            break;

          case 'SCORM_INIT_DIRECT':
            console.log('SCORM Initialized. Success:', data.success);
            if (data.success) {
              console.log('SCORM initialization successful:', data.message);
              // Handle successful initialization
            } else {
              console.error('SCORM initialization failed:', data.error);
              // Handle initialization failure
            }
            break;

          case 'SCORM_GET_DIRECT':
            console.log(
              `SCORM Get: ${data.parameter} = ${data.value}. Success: ${data.success}`,
            );
            if (!data.success) {
              console.error('SCORM Get failed:', data.error);
            }
            break;

          case 'SCORM_SET_DIRECT':
            console.log(
              `SCORM Set: ${data.parameter} = ${data.value}. Success: ${data.success}`,
            );
            if (data.success) {
              // Here you would typically save to your database
              // await saveSCORMData(userId, courseId, data.parameter, data.value);
              console.log('SCORM data set successfully');
            } else {
              console.error('SCORM Set failed:', data.error);
              // Handle set failure
            }
            break;

          case 'SCORM_COMMIT_DATA':
            console.log('SCORM Commit Data:', data.cmiData);

            // Here you would save all CMI data to your database
            // await saveAllCMIData(userId, courseId, data.cmiData);
            break;

          case 'SCORM_COMMIT_DIRECT':
            console.log('SCORM Commit. Success:', data.success);
            if (data.success) {
              console.log('SCORM commit successful:', data.message);
              // Handle successful commit
            } else {
              console.error('SCORM commit failed:', data.error);
              // Handle commit failure
            }
            break;

          case 'SCORM_FINISH_DIRECT':
            console.log('SCORM Finish. Success:', data.success);
            if (data.success) {
              console.log('SCORM session finished successfully:', data.message);
              console.log('Final data:', data.finalData);
              // Handle successful finish
            } else {
              console.error('SCORM finish failed:', data.error);
              // Handle finish failure
            }
            break;

          case 'COMPLETION_STATUS':
            console.log(
              'Completion Status:',
              data.status,
              'Success:',
              data.success,
            );
            if (data.success) {
              console.log('Completion status updated from:', data.source);
              // Handle completion status update
            } else {
              console.error('Completion status update failed:', data.error);
            }
            break;

          case 'SCORM_SCORE_UPDATE':
            console.log(
              'Score Update:',
              data.parameter,
              '=',
              data.value,
              'Success:',
              data.success,
            );
            if (data.success) {
              console.log('All scores:', data.scores);
              // Handle score update
            } else {
              console.error('Score update failed:', data.error);
            }
            break;

          case 'SCORM_NAVIGATION':
            console.log(
              'Navigation:',
              data.parameter,
              '=',
              data.value,
              'Success:',
              data.success,
            );
            if (data.success) {
              console.log('Current location:', data.location);
              // Handle navigation
            } else {
              console.error('Navigation failed:', data.error);
            }
            break;

          case 'SCORM_STATUS_CHANGE':
            console.log('Status Change:', data.value, 'Success:', data.success);
            if (data.success) {
              console.log('Previous status:', data.previousStatus);
              // Handle status change
            } else {
              console.error('Status change failed:', data.error);
            }
            break;

          case 'SCORM_INTERACTION':
            console.log('Interaction:', data.parameter, '=', data.value);
            break;

          case 'CONTENT_LOADED':
            console.log('SCORM Content loaded successfully');
            break;

          case 'ERROR':
            console.error('WebView Error:', data.message);
            if (data.source) {
              console.error('Error source:', data.source, 'Line:', data.line);
            }
            break;

          // Handle legacy SCORM-again messages (for backward compatibility)
          case 'SCORM_INIT':
            console.log('SCORM 1.2 Init. Success:', data.success);
            if (!data.success) {
              console.error('SCORM 1.2 init failed:', data.error);
            }
            break;

          case 'SCORM_COMMIT':
            console.log('SCORM 1.2 Commit. Success:', data.success);
            if (!data.success) {
              console.error('SCORM 1.2 commit failed:', data.error);
            }
            break;

          case 'SCORM_FINISH':
            console.log('SCORM 1.2 Finish. Success:', data.success);
            if (!data.success) {
              console.error('SCORM 1.2 finish failed:', data.error);
            }
            break;

          case 'SCORM_2004_INIT':
            console.log('SCORM 2004 Init. Success:', data.success);
            if (!data.success) {
              console.error('SCORM 2004 init failed:', data.error);
            }
            break;

          case 'SCORM_2004_COMMIT':
            console.log('SCORM 2004 Commit. Success:', data.success);
            if (!data.success) {
              console.error('SCORM 2004 commit failed:', data.error);
            }
            break;

          case 'SCORM_2004_FINISH':
            console.log('SCORM 2004 Finish. Success:', data.success);
            if (!data.success) {
              console.error('SCORM 2004 finish failed:', data.error);
            }
            break;

          default:
            console.log('Unhandled message type:', data.type);
        }
      } catch (error) {
        console.error('Error handling WebView message:', error);
      }
    };

    // const handleWebViewMessage = (event:any) => {
    //   try {
    //     const data = JSON.parse(event.nativeEvent.data);
    //     console.log('Received from WebView:', data.type, data);

    //     switch (data.type) {
    //       case 'SCORM_API_READY':
    //         console.log('SCORM API Ready. Has SCORM Again:', data.hasScormAgain);
    //         // Send initial CMI data to populate SCORM Again
    //         webviewRef.current?.postMessage(JSON.stringify({
    //           type: 'INIT_SCORM_DATA',
    //           cmiData: initialCMIData
    //         }));
    //         break;

    //       case 'REQUEST_INITIAL_DATA':
    //       case 'REQUEST_INITIAL_CMI_DATA':
    //         console.log('Sending initial CMI data to WebView');
    //         webviewRef.current?.postMessage(JSON.stringify({
    //           type: 'INIT_SCORM_DATA',
    //           cmiData: initialCMIData
    //         }));
    //         break;

    //       case 'SCORM_INIT_DIRECT':
    //         console.log('SCORM Initialized. Success:', data.success);
    //         break;

    //       case 'SCORM_GET_DIRECT':
    //         console.log(`SCORM Get: ${data.parameter} = ${data.value} (source: ${data.source})`);
    //         break;

    //       case 'SCORM_SET_DIRECT':
    //         console.log(`SCORM Set: ${data.parameter} = ${data.value}`);
    //         // Here you would typically save to your database
    //         // await saveSCORMData(userId, courseId, data.parameter, data.value);
    //         break;

    //       case 'SCORM_COMMIT_DATA':
    //         console.log('SCORM Commit Data:', data.cmiData);
    //         // Here you would save all CMI data to your database
    //         // await saveAllCMIData(userId, courseId, data.cmiData);
    //         break;

    //       case 'SCORM_COMMIT_DIRECT':
    //         console.log('SCORM Commit. Success:', data.success);
    //         break;

    //       case 'SCORM_COMPLETION':
    //         console.log('Completion Status:', data.value);
    //         break;

    //       case 'SCORM_SCORE_UPDATE':
    //         console.log('Score Update:', data.parameter, '=', data.value);
    //         break;

    //       case 'SCORM_NAVIGATION':
    //         console.log('Navigation:', data.parameter, '=', data.value);
    //         break;

    //       case 'SCORM_INTERACTION':
    //         console.log('Interaction:', data.parameter, '=', data.value);
    //         break;

    //       case 'CONTENT_LOADED':
    //         console.log('SCORM Content loaded successfully');
    //         break;

    //       case 'ERROR':
    //         console.error('WebView Error:', data.message);
    //         break;

    //       default:
    //         console.log('Unhandled message type:', data.type);
    //     }
    //   } catch (error) {
    //     console.error('Error handling WebView message:', error);
    //   }
    // };
    if (!webViewUrl) return null;
    return (
      <View style={styles.webViewContainer}>
        <ScrollView>
          {scromModalVisible && (
            <LottieView
              source={IMAGES.ConfettiAnimation}
              loop={false}
              autoPlay={true}
              style={styles.confettiBackground}
            />
          )}
          <RNImage source={IMAGES.expandImage} style={styles.listItemImage} />
          <WebView
            ref={webviewRef}
            source={{uri: webViewUrl}}
            style={{flex: 1, height: scale(400), marginTop: scale(10)}}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.error('WebView error:', nativeEvent);
            }}
            onHttpError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.error(
                'HTTP error:',
                nativeEvent.statusCode,
                'URL:',
                nativeEvent.url,
              );
            }}
            onLoadStart={() => console.log('WebView loading started')}
            onLoadEnd={() => console.log('WebView loading finished')}
          />
        </ScrollView>
      </View>
    );
  };

  const ScromButtonBottomView = () => {
    return (
      <RNButton
        title={STRINGS.next}
        textColor={COLORS.WHITE}
        loading={scromButtonLoading}
        style={{width: '95%'}}
        disabled={disabled}
        backgroundColor={COLORS.SECONDARY}
        //disabled={isControlsDisabled && !isVideoCompleted}
        onPress={scromNextButtonFunction}
      />
    );
  };

  const ButtonBottomView = () => {
    const [showButton, setShowButton] = useState(true);
    useEffect(() => {
      if (!showButton) {
        const timer = setTimeout(() => setShowButton(true), 1000);
        return () => clearTimeout(timer);
      }
    }, [showButton]);
    const handleNextButtonPress = () => {
      nextButtonFunction();
      setShowButton(false);
      setFullScreenVideoState(false);
      setIsVideoCompleted(false);
      setIsPaused(false);
    };
    if (materialProgressLoading || !showButton) return null;
    const isVideoType = types === tutorialTypes.Video;
    const isControlsDisabled =
      isVideoType && coursePlayData?.isVideoControlsEnabled === false;
    return (
      <RNButton
        title={STRINGS.next}
        textColor={COLORS.WHITE}
        style={{width: '95%'}}
        backgroundColor={COLORS.SECONDARY}
        disabled={isControlsDisabled && !isVideoCompleted}
        onPress={handleNextButtonPress}
      />
    );
  };

  const LevelUpModalSecond = () => {
    return (
      //onDismiss={() => setModalVisible(!modalVisible)}
      <RNModal
        style={{backgroundColor: '#F0F0F8'}}
        transparent
        visible={levelModalVisible}>
        <View
          style={{
            width: scale(280),
            paddingHorizontal: 10,
            backgroundColor: '#F0F0F8',
            paddingVertical: 20,
            alignItems: 'center',
          }}>
          <RNImage
            source={IMAGES.BudgesReal}
            style={{width: scale(60), height: scale(60)}}
          />
          <RNText
            style={{marginTop: 20}}
            large
            textColor={COLORS.TEXTCOLOR}
            bold>
            Leveled Up
          </RNText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              width: '95%',
              padding: 10,
              backgroundColor: '#E9E9F7',
              paddingHorizontal: scale(30),
              paddingVertical: scale(15),
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <RNImage
                source={IMAGES.trophyStarLeaderBoard}
                style={{width: 15, height: 13}}
              />
              <RNText
                style={{paddingTop: 5}}
                small
                textColor={COLORS.TEXTCOLOR}>
                Level
              </RNText>
              <RNText style={{paddingTop: 5}} small textColor={'#4284F4'} bold>
                1
              </RNText>
            </View>
            {VerticalDottedSeparator()}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <RNImage
                source={IMAGES.boltLeaderBoard}
                style={{width: 15, height: 13}}
              />
              <RNText
                style={{paddingTop: 5}}
                small
                textColor={COLORS.TEXTCOLOR}>
                Points
              </RNText>
              <RNText style={{paddingTop: 5}} small textColor={'#4284F4'} bold>
                200
              </RNText>
            </View>
            {VerticalDottedSeparator()}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <RNImage
                source={IMAGES.medalLeaderBoard}
                style={{width: 15, height: 13}}
              />
              <RNText
                style={{paddingTop: 5}}
                small
                textColor={COLORS.TEXTCOLOR}>
                Badge
              </RNText>
              <RNText style={{paddingTop: 5}} small textColor={'#4284F4'} bold>
                Bronze I
              </RNText>
            </View>
          </View>
          <RNButton
            textColor={COLORS.WHITE}
            title={'Close'}
            textStyle={{fontWeight: '300', padding: 5}}
            minHeightButton={true}
            style={{
              marginTop: scale(25),
              marginBottom: scale(0),
              width: scale(250),
              padding: 5,
            }}
            backgroundColor={'#5453EE'}
            onPress={() => setLevelModalVisible(false)}
          />
        </View>
      </RNModal>
    );
  };

  const VerticalDottedSeparator = () => (
    <View
      style={{
        height: scale(30),
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: scale(8),
      }}>
      {[...Array(6)].map((_, index) => (
        <View
          key={index}
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#DDD',
            marginVertical: 2,
          }}
        />
      ))}
    </View>
  );

  const scromHeaderGamificationView = () => {
    // Using useRef for animation value
    const progressAnim = useRef(new Animated.Value(0)).current;

    const totalMaterials =
      scromChapterByData?.courseGamificationPoints *
        storeCourseItemData?.chapterCount || 0;
    const earnedPoints = getUserGamificationPoints?.earnedPoints || 0;

    const progressBarData =
      totalMaterials > 0
        ? Math.min(Math.max(earnedPoints / totalMaterials, 0), 1)
        : 0;

    //const totalMaterialCount = scromChapterByData?.courseGamificationPoints * storeCourseItemData?.chapterCount;
    //const gettingPoints = totalMaterialCount / scromChapterByData?.chapters?.length;
    //const earnedPoints = gettingPoints * scromCurrentChapterIndex;

    // const progressBarData = totalMaterialCount > 0
    //   ? Math.min(Math.max(earnedPoints / totalMaterialCount, 0), 1)
    //   : 0;

    const animatedLeft = (progressAnim as any).interpolate({
      inputRange: [0, 1],
      outputRange: [0, scale(150)],
      extrapolate: 'clamp',
    });
    useEffect(() => {
      (Animated as any)
        .timing(progressAnim, {
          toValue: progressBarData,
          duration: 500,
          useNativeDriver: false,
        })
        .start();
    }, [progressBarData]);

    return (
      <View style={styles.headerGamificationStyle}>
        <View style={styles.gamificationSecondPointStyle}>
          <RNText small textColor={COLORS.BORDER_COLOR}>
            Chapter {scromCurrentChapterIndex + 1}/
            {scromChapterByData?.chapters?.length}
          </RNText>
          {progressBarData > 0.2 ? (
            <RNText
              style={{marginTop: scale(15), left: scale(40)}}
              textColor="#9398A4"
              small>
              {0}
            </RNText>
          ) : null}
          <View style={{marginRight: scale(20)}}>
            <Progress.Bar
              height={10}
              borderWidth={0}
              color="#4284F4"
              unfilledColor="#F1F6FF"
              progress={progressBarData}
              width={scale(150)}
            />
            {/* <View style={{flexDirection:"row", justifyContent:"space-between"}}>
             {progressBarData > 0.1 ?
           <RNText style={{ top: 10 }} textColor="#9398A4" small>
             {0}
           </RNText>:null} */}

            <Animated.View
              style={{
                position: 'absolute',
                left: animatedLeft, // Move dynamically
                bottom: 0, // Place below bar
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RNImage
                source={IMAGES.gamificationPointImage}
                style={{width: 15, height: 15, right: scale(20)}}
              />
              <RNText
                style={{right: scale(20)}}
                textColor={COLORS.TEXTCOLOR}
                small>
                {earnedPoints}
              </RNText>
            </Animated.View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: scale(7),
                left: scale(5),
                //left: totalMaterials === 0 ? scale(10) : scale(20)
              }}>
              <RNText textColor="#9398A4" small />
              <RNText textColor="#9398A4" small>
                {progressBarData > 0.7 ? '' : totalMaterials}
              </RNText>
            </View>
            {/* </View> */}
          </View>
        </View>
      </View>
    );
  };

  const headerGamificationView = () => {
    // Using useRef for animation value
    const progressAnim = useRef(new Animated.Value(0)).current;

    const totalMaterials = countMaterials() || 0;
    const earnedPoints = getUserGamificationPoints?.earnedPoints || 0;

    const progressBarData =
      totalMaterials > 0
        ? Math.min(Math.max(earnedPoints / totalMaterials, 0), 1)
        : 0;

    const animatedLeft = (progressAnim as any).interpolate({
      inputRange: [0, 1],
      outputRange: [0, scale(150)],
      extrapolate: 'clamp',
    });

    useEffect(() => {
      (Animated as any)
        .timing(progressAnim, {
          toValue: progressBarData,
          duration: 500,
          useNativeDriver: false,
        })
        .start();
    }, [progressBarData]);

    return (
      <View style={styles.headerGamificationStyle}>
        <View style={styles.gamificationSecondPointStyle}>
          <RNText small textColor={COLORS.BORDER_COLOR}>
            Chapter 0{currentChapterIndex}/0
            {coursePlayData?.chapters?.length || 0}
          </RNText>
          {progressBarData > 0.2 ? (
            <RNText
              style={{marginTop: scale(15), left: scale(35)}}
              textColor="#9398A4"
              small>
              {0}
            </RNText>
          ) : null}
          <View style={{marginRight: scale(20)}}>
            <Progress.Bar
              height={10}
              borderWidth={0}
              color="#4284F4"
              unfilledColor="#F1F6FF"
              progress={progressBarData}
              width={scale(150)}
            />
            {/* <View style={{flexDirection:"row", justifyContent:"space-between"}}>
              {progressBarData > 0.1 ?
            <RNText style={{ top: 10 }} textColor="#9398A4" small>
              {0}
            </RNText>:null} */}

            <Animated.View
              style={{
                position: 'absolute',
                left: animatedLeft, // Move dynamically
                bottom: 0, // Place below bar
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RNImage
                source={IMAGES.gamificationPointImage}
                style={{width: 15, height: 15, right: scale(20)}}
              />
              <RNText
                style={{right: scale(20)}}
                textColor={COLORS.TEXTCOLOR}
                small>
                {earnedPoints}
              </RNText>
            </Animated.View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: scale(7),
                left: scale(10),
              }}>
              <RNText textColor="#9398A4" small />
              <RNText textColor="#9398A4" small>
                {progressBarData > 0.7 ? '' : totalMaterials}
              </RNText>
            </View>
            {/* </View> */}
          </View>
        </View>
      </View>
    );
  };

  return (
    <RNContainer
      style={[styles.container, fullScreenVideoState && {flex: 1}]}
      back
      onBack={() => onGoBackFunction()}
      title={
        coursePlayData?.title?.trimEnd().length > 27
          ? coursePlayData?.title.trimEnd().slice(0, 27) + '...'
          : coursePlayData?.title
      }
      bottomChildren={scromData ? ScromButtonBottomView() : ButtonBottomView()}
      scroll
      showsVerticalScrollIndicator={false}
      titleMarginRight
      hideBackgroundImage
      Points={undefined}>
      <View style={{width: '95%', alignSelf: 'center'}}>
        {scromData ? scromHeaderGamificationView() : headerGamificationView()}
        {scromData ? ScromView() : MainView()}
      </View>
      {FinshKnowledgeModal()}
      {ScromFinshKnowledgeModal()}
      {FinshKnowledgeModalSecond()}
      {LevelUpModalSecond()}
    </RNContainer>
  );
};

export default CourseTutorial;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
    //flex: 1,
    width: '105%',
    alignSelf: 'center',
  },
  textContainer: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
  },
  textContainer1: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(0),
  },
  webViewContainer: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    width: '100%',
    alignSelf: 'center',
  },
  webView: {
    height: scale(195),
    width: 375,
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
  },
  videoContainer: {
    paddingHorizontal: scale(0),
    paddingVertical: scale(10),
  },
  video: {
    width: '100%',
  },
  youtubeContainer: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(20),
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 1,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
  },
  controlButton: {
    marginHorizontal: 10,
  },
  courseButtonStyle1: {
    marginTop: scale(25),
    width: '87%',
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
  courseButtonStyle: {
    marginTop: scale(7),
    width: '87%',
  },
  headerGamificationStyle: {
    width: '100%',
    padding: 10,
    backgroundColor: COLORS.WHITE,
    marginBottom: scale(20),
    marginTop: scale(3),
    borderWidth: 0.2,
    borderColor: '#D0CFCF',
  },
  gamificationSecondPointStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  webview: {
    flex: 1,
  },
  AnimatedImage: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginTop: scale(20),
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: COLORS.WHITE,
    paddingVertical: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  confettiBackground: {
    // position: 'absolute',

    width: '100%',
    height: '100%',
  },
  badgeAnimation: {
    width: 80,
    height: 82,
    marginTop: 10,
    alignSelf: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  fullScreenWebView: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: COLORS.TRANSPARENT,
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  fullscreenWebView: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  fullScreenWebview: {flex: 1},
  listItemImage: {
    height: 20,
    width: 20,
    marginLeft: scale(280),
    //marginLeft: scale(15)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(500),
    backgroundColor: COLORS.WHITE,
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(500),
    backgroundColor: COLORS.WHITE,
    padding: 20,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
