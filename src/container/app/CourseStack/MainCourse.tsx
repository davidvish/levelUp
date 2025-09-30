import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { RNButton, RNContainer, RNImage, RNText } from '../../../Common';
import { _onPressNavigate } from '../../../utils/commonFunction';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import { SCREEN_NAMES } from '../../../config';
import { useDispatch } from 'react-redux';
import { scromChapterSelector } from './module/reducer';
import { coursePlayFailAction, coursePlayRequestAction, getScormChaptersByCourseRequestAction, scromPlayFailAction, scromPlayRequestAction, startExamRequestAction, updateMaterialRequestAction } from './module/action';
import { homeScreenSelector } from '../Home/module/reducer';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { BackgroundImage } from 'react-native-elements/dist/config';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { number } from 'yup';
import { store } from '../../../redux/Store';
import { storeCourseItemDataOnNavigationClear } from '../Home/module/action';
import RNModal from '../../../Common/Modal/Modal';
import { CondtionClearAction } from '../PathStack/module/action';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const screenWidth = Dimensions.get('window').width;

// const formatDuration = (minutes: any) => {
//   const hours = Math.floor(minutes / 60);
//   const remainingMinutes = minutes % 60;
//   const seconds = Math.floor((minutes * 60) % 60);

//   if (remainingMinutes > 0) {
//     return `${hours}h ${remainingMinutes}m`;
//   } else {
//     return `${remainingMinutes}m ${seconds}s`;
//   }
// };

const secondFormatDuration = (seconds: number | undefined | null): string => {
  if (seconds == null) return '0m';
  const totalSeconds = Math.floor(Number(seconds));
  if (totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  const adjustedMinutes = remainingSeconds >= 30 ? minutes + 1 : minutes;
  if (hours > 0) {
    return `${hours}h ${adjustedMinutes}m`;
  } else if (totalSeconds < 60) {
    return `0m ${totalSeconds}s`;
  } else {
    return `0h ${adjustedMinutes}m`;
  }
}

const MainCourse = (props: any) => {
  const { storeCourseItemData } = homeScreenSelector();
  const { coursePlayData, coursePlayLoading, scromPlayData, scromPlayLoading, scromChapterByData, scromChapterLoading } = scromChapterSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [inprogressData, setInprogressData] = useState<any>([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);



  // useEffect(() => {
  //   coursePlayFunction();
  //   scromChapterFunction();
  //   //updateMaterialsProgress();
  //   //scromPlayFunction();
  // }, []);

  const hasAllClearState = () => {
    setIsDataFetched(false);
    setLoading(false)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Clear the state
      await Promise.all([
        dispatch(coursePlayFailAction()),
        dispatch(scromPlayFailAction()),
        dispatch(storeCourseItemDataOnNavigationClear()),
      ]);

      // Clear any other state if necessary
      hasAllClearState();

      // Manually navigate to the next screen after clearing state
      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setIsDataFetched(false);
      dispatch(coursePlayFailAction())
      dispatch(scromPlayFailAction())
      if (storeCourseItemData?.resourceType === "COURSE" || storeCourseItemData?.blockType === "COURSE") {
        coursePlayFunction();
      } else {
        scromChapterFunction();
      }
      return () => {
        // Cleanup logic here, if any
      };
    }, [storeCourseItemData])
  );

  const coursePlayFunction = useCallback(() => {
    const { id, assignedDate } = storeCourseItemData;
    if (id && assignedDate) {
      const body = { id, assignedDate };
      dispatch(coursePlayRequestAction({ body }));
    }
  }, [dispatch, storeCourseItemData]);

  const scromChapterFunction = useCallback(() => {
    const { id, assignedDate } = storeCourseItemData;
    if (id && assignedDate) {
      const body = { id, assignedDate };
      dispatch(getScormChaptersByCourseRequestAction({ body }));
    }
  }, [dispatch, storeCourseItemData]);

  useEffect(() => {
    if (!coursePlayLoading && !scromChapterLoading) {
      setIsDataFetched(true);
    }
  }, [coursePlayLoading, scromChapterLoading]);

  // const updateMaterialsProgress = () => {
  //   if (!coursePlayData?.chapters || coursePlayData.chapters.length === 0) {
  //     console.log("Course play data is empty or chapters are not available");
  //     return;
  //   }

  //   const allChaptersCompleted = coursePlayData.chapters.map((chapter: any) => chapter?.materials || []);
  //   const hasFilterMaterial = allChaptersCompleted.flatMap((materials: any, chapterIndex: number) => 
  //     materials.map((material : any, materialIndex: number) => {
  //       if (material?.userMaterialProgress?.status === "in_progress") {
  //         return { material };
  //       }
  //       return null;
  //     }).filter((item: any): item is { material: any } => item !== null)
  //   );

  //   if (hasFilterMaterial.length > 0) {
  //     setInprogressData(hasFilterMaterial[0]);
  //   } else {
  //     console.log("No in-progress materials found");
  //     setInprogressData([]);
  //   }
  // }

  const updateMaterialsProgress = useCallback(() => {
    if (!coursePlayData?.chapters || coursePlayData?.chapters?.length === 0) {
      console.log("Course play data is empty or chapters are not available");
      return;
    }


    //Check if all chapters are completed
    const allChaptersCompleted = coursePlayData.chapters.every(
      (chapter: any) => chapter?.userChapterProgress?.status === "COMPLETED"
    );



    if (allChaptersCompleted && coursePlayData?.userProgress?.status === "COMPLETED") {
      // Navigate to the tutorial with the first chapter's first material
      const firstChapterFirstMaterial = coursePlayData.chapters[0]?.materials[0];
      if (firstChapterFirstMaterial) {
        _onPressNavigate(SCREEN_NAMES.CourseStack, {
          screen: SCREEN_NAMES.CourseTutorial,
          params: {
            materialData: firstChapterFirstMaterial,
            hasParamData: storeCourseItemData
          },
        });
        setIsDataFetched(false);
        return;
      }
    }

    if (allChaptersCompleted && coursePlayData?.userProgress?.status === "IN_PROGRESS") {
      // Get the last chapter
      const lastChapter = coursePlayData?.chapters?.[coursePlayData.chapters.length - 1];

      if (lastChapter) {
        if (lastChapter?.kcExam) {
          _onPressNavigate(SCREEN_NAMES.CourseStack, {
            screen: SCREEN_NAMES.CourseKnowladgeCheck,
            params: {
              kcData: lastChapter.kcExam,
              hasParamData: storeCourseItemData
            },
          });
        } else {
          setModalVisible(true)
          // _onPressNavigate(SCREEN_NAMES.CourseStack, {
          //   screen: SCREEN_NAMES.CourseTutorial,
          //   params: {
          //     materialData: lastChapter?.materials?.[lastChapter.materials.length - 1],
          //     hasParamData: storeCourseItemData
          //   },
          // });
        }

        setIsDataFetched(false); // Resetting data fetch state
        return;
      }
    }

    // Check if any chapter has a kcExam with IN_PROGRESS status
    const inProgressKcExam = coursePlayData.chapters.find((chapter: any) =>
      chapter.kcExam?.userProgress?.status === "IN_PROGRESS"
    );

    if (inProgressKcExam) {
      _onPressNavigate(SCREEN_NAMES.CourseStack, {
        screen: SCREEN_NAMES.CourseKnowladgeCheck,
        params: {
          kcData: inProgressKcExam.kcExam,
          hasParamData: storeCourseItemData
        },
      });
      setIsDataFetched(false);
      return;
    }

    const allMaterials = coursePlayData.chapters.flatMap((chapter: any) => chapter.materials || []);

    // Check if all materials are NOT_STARTED
    const allNotStarted = allMaterials.every((material: any) =>
      material?.userMaterialProgress?.status === "NOT_STARTED"
    );

    if (allNotStarted) {
      // If all materials are NOT_STARTED, navigate with the first material
      _onPressNavigate(SCREEN_NAMES.CourseStack, {
        screen: SCREEN_NAMES.CourseTutorial,
        params: {
          materialData: allMaterials[0],
          hasParamData: storeCourseItemData
        },
      });
    } else {
      // Find the first in_progress material
      const inProgressMaterial = allMaterials.find((material: any) =>
        material?.userMaterialProgress?.status === "in_progress"
      );

      if (inProgressMaterial) {
        // If an in_progress material is found, navigate with it
        _onPressNavigate(SCREEN_NAMES.CourseStack, {
          screen: SCREEN_NAMES.CourseTutorial,
          params: {
            materialData: inProgressMaterial,
            hasParamData: storeCourseItemData
          },
        });
      } else {
        // Check if all materials are COMPLETED
        const allCompleted = allMaterials.every((material: any) =>
          material?.userMaterialProgress?.status === "COMPLETED"
        );
        if (allCompleted) {
          console.log("All materials are completed");
          // You can add any additional logic here for when all materials are completed
        } else {
          // Find the first NOT_STARTED material
          const firstNotStartedMaterial = allMaterials.find((material: any) =>
            material?.userMaterialProgress?.status === "NOT_STARTED"
          );

          if (firstNotStartedMaterial) {
            _onPressNavigate(SCREEN_NAMES.CourseStack, {
              screen: SCREEN_NAMES.CourseTutorial,
              params: {
                materialData: firstNotStartedMaterial,
                hasParamData: storeCourseItemData
              },
            });
          } else {
            console.log("Unexpected state: No NOT_STARTED materials found, but not all are completed");
          }
        }
      }
    }
    setIsDataFetched(false);
  }, [coursePlayData, storeCourseItemData]);

  useEffect(() => {
    if (isDataFetched &&
      coursePlayData &&
      coursePlayData.chapters &&
      coursePlayData.chapters.length > 0 &&
      coursePlayData.chapters.some((chapter: any) => chapter.materials && chapter.materials.length > 0)) {
      updateMaterialsProgress();
    } else {
      console.log("Waiting for complete course play data...");
    }
  }, [coursePlayData, isDataFetched, updateMaterialsProgress]);

  const startExamFunction = () => {
    // setLoading(true);
    if (coursePlayData?.exam || coursePlayData?.exam?.id) {
      let body = {
        id: coursePlayData?.exam?.id || ""
      }
      const callback = (res: any) => {
        // setLoading(false);
        setModalVisible(false);
        if (res !== 'error') {
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

  const replayFunction = () => {
    setModalVisible(false);
    const allMaterials = coursePlayData.chapters.flatMap((chapter: any) => chapter.materials || []);
    _onPressNavigate(SCREEN_NAMES.CourseStack, {
      screen: SCREEN_NAMES.CourseTutorial,
      params: {
        materialData: allMaterials[0],
        hasParamData: storeCourseItemData
      },
    });
  }

  const scromFunction = (item: any) => {
    console.log(item)
    _onPressNavigate(SCREEN_NAMES.CourseStack, {
      screen: SCREEN_NAMES.CourseTutorial,
      params: {
        scromData: item,
      },
    })
  }

  const materialItemClickData = (materialsItem: any, storeCourseItemData: any) => {
    //dispatch(coursePlayFailAction())
    _onPressNavigate(SCREEN_NAMES.CourseStack, {
      screen: SCREEN_NAMES.CourseTutorial,
      params: {
        materialData: materialsItem,
        hasParamData: storeCourseItemData
      },
    })
    // if(materialsItem?.userMaterialProgress?.status === "in_progress" || materialsItem?.userMaterialProgress?.status === "completed") {
    //   _onPressNavigate(SCREEN_NAMES.CourseStack, {
    //     screen: SCREEN_NAMES.CourseTutorial,
    //     params: {
    //       materialData: materialsItem,
    //       hasParamData: storeCourseItemData
    //     },
    //   })
    // }
    // else {
    //   let body = {
    //   body: {
    //     playedTime: materialsItem?.userMaterialProgress?.playedTime || "",
    //     status: "completed",
    //   },
    //   materialId: materialsItem?.userMaterialProgress?.userMaterialMappingId || ""
    // }
    // const callback = (res: any) => {
    //     _onPressNavigate(SCREEN_NAMES.CourseStack, {
    //       screen: SCREEN_NAMES.CourseTutorial,
    //       params: {
    //         materialData: materialsItem,
    //         hasParamData: storeCourseItemData
    //       },
    //     })
    // }
    // dispatch(updateMaterialRequestAction({ body, callback }))

  }

  const checkExamConditions = () => {
    const allChaptersCompleted = coursePlayData?.chapters?.length > 0
      ? coursePlayData.chapters.every((item: any) => item?.userChapterProgress?.status === "COMPLETED")
      : false;

    const retriesExceeded = coursePlayData?.exam?.remainingRetries === 0;
    //const inProgress = coursePlayData?.userProgress?.status === "IN_PROGRESS";
    return (retriesExceeded || !allChaptersCompleted);
  };

  const scromMainView = () => {
    return (
      <View>
        <RNText style={[styles.firstMainText, { paddingTop: scale(20) }]} textColor={COLORS.TEXTCOLOR} bold extraLarge>
          {'Chapter'}
        </RNText>

        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: scale(10), }}
          data={scromChapterByData?.chapters || []}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              onPress={() => scromFunction(item)}
              style={[styles.listItemContainer, { justifyContent: 'space-between' }]}>
              <View style={styles.flexDirection}>
                {item?.status === "NOT_STARTED" ?
                  <RNImage source={IMAGES.fileLinesImage} style={styles.listItemImage} />
                  :
                  item?.status === "completed" ?
                    <RNImage source={IMAGES.checkCircleImage} style={styles.listItemImage} />
                :
                <RNImage source={IMAGES.circlePlay} style={styles.listItemImage} />}
                <RNText style={styles.listItemText} textColor={COLORS.TEXTCOLOR} medium>
                  {item?.title || ""}
                </RNText>
              </View>
            </Pressable>
          )} />
      </View>
    )
  }

  const mainView = () => (
    <>
      {coursePlayLoading ?
        <>
          <ShimmerPlaceHolder duration={2000} style={[styles.firstMainText, { height: scale(30) }]} />
          <ShimmerPlaceHolder duration={2000} style={{ marginTop: 20, width: "100%", height: 50, BackgroundColor: "red" }} />
          <ShimmerPlaceHolder duration={2000} style={{ marginTop: 10, width: "100%", height: 50, BackgroundColor: "red" }} />
        </>
        :
        <View>
          <RNText style={[styles.firstMainText, { paddingTop: scale(20) }]} textColor={COLORS.TEXTCOLOR} bold large>
            {coursePlayData?.title || ''}
          </RNText>

          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={coursePlayData?.chapters || []}
            renderItem={({ item, index }) => (
              <>
                <View style={styles.courseViewSmallText}>
                  <RNText style={{ top: 1, width: "70%" }} textColor={COLORS.GRAYTEXTCOLOR} medium>
                    {item?.title || ''}
                  </RNText>
                  <View style={styles.courseViewSmallCircle} />
                  <RNImage source={IMAGES.clockGray} style={styles.clockImage} />
                  <RNText style={{ left: 5, top: 1 }} textColor={COLORS.GRAYTEXTCOLOR} medium>
                    {secondFormatDuration(item?.duration)}
                  </RNText>
                </View>

                {item?.materials?.length > 0 &&
                  item?.materials?.map((materialsItem: any, materialsIndex: any) => {
                    const isFirstMaterial = index === 0 && materialsIndex === 0;
                    const isClickable =
                      coursePlayData?.isVideoControlsEnabled === true ||
                      (materialsItem?.userMaterialProgress?.status === "in_progress" ||
                        materialsItem?.userMaterialProgress?.status === "completed" ||
                        (coursePlayData?.isVideoControlsEnabled === false && materialsItem?.userMaterialProgress?.status === "NOT_STARTED" && isFirstMaterial));

                    return (
                      <Pressable
                        disabled={!isClickable}
                        key={materialsIndex}
                        onPress={() =>
                          // _onPressNavigate(SCREEN_NAMES.CourseStack, {
                          //   screen: SCREEN_NAMES.CourseTutorial,
                          //   params: {
                          //     materialData: materialsItem,
                          //     hasParamData: storeCourseItemData
                          //   },
                          // })
                          materialItemClickData(materialsItem, storeCourseItemData)
                        }
                        style={[styles.listItemContainer, { justifyContent: 'space-between' }]}>
                        <View style={styles.flexDirection}>
                          {materialsItem?.userMaterialProgress?.status == "NOT_STARTED" ? null :
                            <RNImage source={materialsItem?.userMaterialProgress?.status == "completed" ? IMAGES.circleCheckRegular : IMAGES.circlePlay} style={styles.listItemImage} />
                          }
                          <RNText style={[styles.listItemText]} textColor={COLORS.TEXTCOLOR} medium>
                            {materialsItem?.title.length > 20
                              ? materialsItem?.title.slice(0, 30) + '...'
                              : materialsItem?.title || ''}
                          </RNText>
                        </View>
                        <View style={styles.listItemClock}>
                          <RNImage source={IMAGES.clockGray} style={styles.clockImage} />
                          <RNText style={{ left: 5, top: 1 }} textColor={COLORS.GRAYTEXTCOLOR} medium>
                            {secondFormatDuration(materialsItem?.duration)}
                          </RNText>
                        </View>
                      </Pressable>
                    )
                  })}

                {item?.kcExam && (
                  <Pressable
                    onPress={() =>
                      _onPressNavigate(SCREEN_NAMES.CourseStack, {
                        screen: SCREEN_NAMES.CourseKnowladgeCheck,
                        params: {
                          kcData: item?.kcExam,
                          hasParamData: storeCourseItemData
                        },
                      })
                    }
                    style={[styles.listItemContainer, { marginTop: scale(5), justifyContent: 'space-between' }]}>
                    <View style={styles.flexDirection}>
                      {item?.kcExam?.userProgress?.status == "NOT_STARTED" || item?.kcExam?.userProgress?.status == "IN_PROGRESS" ? null :
                        <RNImage source={IMAGES.circleCheckRegular} style={styles.listItemImage} />
                      }
                      <RNText style={styles.listItemText} textColor={COLORS.TEXTCOLOR} medium>
                        Knowledge Check
                      </RNText>
                    </View>
                    <View style={styles.listItemClock}>
                      <RNImage source={IMAGES.clipboardListCheckGray} style={styles.clockImage} />
                      <RNText style={{ left: 5, top: 1 }} textColor={COLORS.GRAYTEXTCOLOR} medium>
                        {item?.kcExam?.questionsCount || 0} Questions
                      </RNText>
                    </View>
                  </Pressable>
                )}
              </>
            )}
          />
        </View>
      }
    </>
  );

  const FinshKnowledgeModal = () => {
    return (
      <RNModal transparent visible={modalVisible}>
        <View style={{ width: "90%", paddingHorizontal: 10, backgroundColor: COLORS.WHITE, paddingVertical: 20 }}>
          <RNText style={{ marginTop: 5 }} large bold>You are almost there!</RNText>
          <RNText style={{ marginTop: 10 }} large>Would you like to proceed to the final exam or replay the course?</RNText>

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

  const ExamView = () => {
    return (
      coursePlayLoading ?
        <>
          <View style={{ marginTop: scale(50) }}>
            <ShimmerPlaceHolder duration={2000} style={[styles.firstMainText, { height: scale(30) }]} />
            <ShimmerPlaceHolder duration={2000} style={{ marginTop: 20, width: "100%", height: 50, BackgroundColor: "red" }} />
          </View>
        </>
        :
        <View>
          <RNText style={{ paddingHorizontal: scale(10), marginTop: scale(30) }} textColor={COLORS.GRAYTEXTCOLOR} large>Exam</RNText>
          <Pressable
            disabled={checkExamConditions()}
            onPress={startExamFunction}
            style={[styles.listItemContainer, { marginTop: scale(10), justifyContent: "space-between" }]}>
            <View style={{ flexDirection: "row" }}>
              <RNImage source={IMAGES.clipboardListCheckBlue} style={styles.listItemImage} />
              <RNText style={styles.listItemText} textColor={COLORS.TEXTCOLOR} medium>{coursePlayData?.exam?.questionsCount} Questions</RNText>
            </View>
            <View style={styles.listItemClock}>
              {checkExamConditions() ?
                <RNImage source={IMAGES.lockKeyhole} style={styles.clockImage} /> : null}
              <RNImage source={IMAGES.arrowRotateRight} style={styles.clockImage} />
              <RNText style={{ left: 5, top: 1 }} textColor={COLORS.GRAYTEXTCOLOR} medium>{coursePlayData?.exam?.remainingRetries}/{coursePlayData?.exam?.retryAllowed}</RNText>
            </View>
          </Pressable>
        </View>

    )
  }

  const goBackFunction = () => {
    dispatch(CondtionClearAction())
    _onPressNavigate(SCREEN_NAMES.CourseStack, {
      screen: SCREEN_NAMES.CoursePreview
    })
  }

  return (
    <RNContainer
      style={{ backgroundColor: COLORS.MAINBACKGROUNDCOLOR }}
      back={true}
      title={""}
      onBack={() => goBackFunction()}
      titleMarginRight={true}
      scroll
      showsVerticalScrollIndicator={false}
      hideBackgroundImage Points={undefined}>
      {loading ?
        <ActivityIndicator style={{ padding: 15 }} size="small" color={COLORS.PRIMARY} />
        : null}
      {storeCourseItemData?.resourceType === "SCORM" ? scromMainView() : mainView()}
      {coursePlayData?.exam ? ExamView() : null}
      {FinshKnowledgeModal()}
    </RNContainer>
  );
};

export default MainCourse;

const styles = StyleSheet.create({
  courseViewSmallText: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: scale(10),
    paddingTop: scale(10)
  },
  courseViewSmallCircle: {
    width: 5,
    height: 5,
    borderRadius: 10,
    marginLeft: 10,
    backgroundColor: COLORS.GRAYTEXTCOLOR,
    top: 1
  },
  listItemContainer: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: scale(5),
    alignItems: "center",
    width: "100%",
    paddingVertical: scale(15),
    backgroundColor: COLORS.LIGHTBLUECOLOR,
  },
  listItemText: {
    left: 10
  },
  listItemClock: {
    flexDirection: "row",
    //marginLeft: scale(30), 
    marginRight: scale(15),
    alignItems: "center"
  },
  listItemImage: {
    height: 20,
    width: 20,
    marginLeft: scale(15)
  },
  firstMainText: {
    paddingHorizontal: scale(10),
    paddingTop: scale(10)
  },
  clockImage: {
    height: 14,
    width: 14,
    marginLeft: scale(9),
    top: 1
  },
  flexDirection: {
    flexDirection: "row"
  },
  courseButtonStyle1: {
    marginTop: scale(25),
    width: "87%",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
  courseButtonStyle: {
    marginTop: scale(7),
    width: "87%"
  },
});
