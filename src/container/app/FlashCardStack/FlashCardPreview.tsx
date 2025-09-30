import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { RNActionSheet, RNButton, RNContainer, RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import * as Progress from 'react-native-progress';
import { SCREEN_NAMES } from '../../../config';
import { _onPressNavigate, convertDateIntoDay } from '../../../utils/commonFunction';
import { useDispatch } from 'react-redux';
import { flashcardPreviewSelector } from './module/reducer';
import { flashcardPreviewDetailsFailAction, flashcardPreviewDetailsRequestAction } from './module/action';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useFocusEffect } from '@react-navigation/native';


function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const FlashCardPreview: React.FC = (props: any) => {
  const hasParamData = props?.route?.params?.data || [];
  const { flashcardPreviewDetailsData, previewisLoading } = flashcardPreviewSelector();
  //const [flashCardListDataState, setFlashCardListDataState] = useEffect<any>([])
  const [flashCardListDataState, setFlashCardListDataState] = useState<any>([])
  
  const dispatch = useDispatch();
  const ActionSheetRef: any = useRef(null);

  const _onPressChangeProfileName = () => {
    ActionSheetRef?.current?.show();
  };

  // useEffect(() => {
  //   getFlashCardPreviewDetailsFunction();
  // }, [props])

  useFocusEffect(
    useCallback(() => {
      clearStates();
      getFlashCardPreviewDetailsFunction();
      return () => {
      };
    }, [])
  );

  const getFlashCardPreviewDetailsFunction = () => {
    let body = {
      id: hasParamData?.id || "",
      assignedDate: hasParamData?.assignedDate
    }
    dispatch(flashcardPreviewDetailsRequestAction({ body }));
  }

  useEffect(() => {
    if(flashcardPreviewDetailsData){
      setFlashCardListDataState(flashcardPreviewDetailsData)
    }
  },[flashcardPreviewDetailsData])

  const clearStates = () => {
    dispatch(flashcardPreviewDetailsFailAction())
    setFlashCardListDataState([]);
  }

  console.log(hasParamData, "hasParamDatahasParamData")

  const PreviewMainView = () => {
    const playedTime = flashCardListDataState?.userProgress?.playedTime || 0;
    const duration = flashCardListDataState?.userProgress?.duration || 0;

    //const progressData = hasParamData?.status === "COMPLETED" ? 1 : playedTime && duration ? (playedTime / duration) * 0.5 : 0;
    //const progressPercentage = hasParamData?.status === "COMPLETED" ? 100 : playedTime && duration ? Math.floor((playedTime / duration) * 50) : 0;
    const flashcardProgressData = flashCardListDataState?.userProgress?.status === "COMPLETED" ? 1 : (playedTime / duration) * 0.5;
    const flashcardProgressPercentage = flashCardListDataState?.userProgress?.status === "COMPLETED" ? 100 : (playedTime / duration) * 50;
    const roundedPercentage2 = Math.round(flashcardProgressPercentage * 10) / 10; // This gives 65.6
    const flashFinalPercentage = roundedPercentage2 % 1 >= 0.5 ? Math.ceil(roundedPercentage2) : Math.floor(roundedPercentage2);
    const today = formatDate();

    console.log(flashCardListDataState?.userProgress?.duration, duration, flashcardProgressData, flashFinalPercentage, "hello worldd")

    return (
      //IMAGES.flashCardBackgroundImage
      <><View style={styles.imageContainer}>
        {hasParamData?.bannerImageUrl ?
          <RNImage resizeMode="Cover" source={{ uri: hasParamData?.bannerImageUrl }} style={styles.image} />
          :
          <RNText style={{ top: 140 }} TextAlignCenter large textColor={COLORS.BORDER_COLOR}>No Image URL Found</RNText>}
      </View>

        <View style={styles.cardMainView}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <RNText textColor={COLORS.TEXTCOLOR} style={[styles.cardTitle, { maxWidth: "70%" }]} bold large>{flashCardListDataState?.title || ""}</RNText>
            {
              hasParamData.dueDate.split('T')[0] < today && hasParamData.status?.toLowerCase() !== 'completed' ?
                <View style={{ backgroundColor: COLORS.RED, padding: 3, paddingHorizontal: 10, borderRadius: 5, marginRight: 10 }}>
                  <RNText TextAlignCenter small textColor={COLORS.WHITE}>Overdue</RNText>
                </View>
                :
                hasParamData.status?.toLowerCase() == 'completed' && hasParamData?.isPassed != null && hasParamData?.isPassed !== undefined ?
                  <View style={{ backgroundColor: hasParamData?.isPassed ? COLORS.GREEN : COLORS.RED, padding: 3, paddingHorizontal: 10, borderRadius: 5, marginRight: 10 }}>
                    <RNText TextAlignCenter small textColor={COLORS.WHITE}>{hasParamData?.isPassed ? "Passed" : "Failed"}</RNText>
                  </View>
                  : null
            }
          </View>
          <View style={styles.progressContainer}>
            <Progress.Bar
              borderWidth={0}
              color="#4284F4"
              unfilledColor={"#EEEEEE"}
              progress={flashcardProgressData || !Number.isNaN(flashcardProgressData) ? flashcardProgressData : 0} width={scale(235)} />
            <RNText style={styles.progressText} bold small>{!Number.isNaN(flashFinalPercentage) || flashFinalPercentage ? flashFinalPercentage : 0}%</RNText>
          </View>

          <View style={styles.infoContainer}>

          <View style={styles.infoRow}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Status</RNText>
              {!flashCardListDataState?.userProgress?.status ?
                <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                :
                <RNText style={{textTransform:"capitalize"}} textColor={COLORS.TEXTCOLOR} semiBold medium>{flashCardListDataState?.userProgress?.status == "NOT_STARTED" ? "Not Started" : flashCardListDataState?.userProgress?.status == "IN_PROGRESS" ? "In Progress" : flashCardListDataState?.userProgress?.status == "COMPLETED" ? "Completed" : flashCardListDataState?.userProgress?.status.toLowerCase()}</RNText>
              }
            </View>

            <View style={styles.infoRow}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Enrollment Date</RNText>
              {!hasParamData?.assignedDate ?
                <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                :
                <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{convertDateIntoDay(hasParamData?.assignedDate)?.newConvertDate || ""}</RNText>
              }
            </View>

            <View style={styles.infoRow}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Due Date</RNText>
              {!hasParamData?.dueDate ?
                <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                :
                <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{convertDateIntoDay(hasParamData?.dueDate)?.newConvertDate || ""}</RNText>
              }
            </View>

            <View style={styles.infoRow}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Total Gamification Points</RNText>
              {!flashCardListDataState?.gamificationPoints && flashCardListDataState?.gamificationPoints !== 0 ?
                <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                :
                <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{flashCardListDataState?.gamificationPoints * flashCardListDataState?.cardsCount}</RNText>
              }
            </View>

            <View style={styles.infoRow}>
              <RNText textColor={COLORS.BORDER_COLOR} medium>Department</RNText>
              {!flashCardListDataState?.department ?
                <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                :
                <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{flashCardListDataState?.department || ""}</RNText>
              }
            </View>

            {hasParamData?.lastViewedDate === "0001-01-01T00:00:00" ? null :
              <View style={[styles.infoRow, { paddingVertical: 10 }]}>
                <RNText textColor={COLORS.BORDER_COLOR} medium>Last View Date</RNText>
                {!hasParamData?.lastViewedDate ?
                  <ShimmerPlaceHolder duration={2000} style={{ width: 100, height: 15 }} />
                  :
                  <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{convertDateIntoDay(hasParamData?.lastViewedDate)?.newConvertDate || ""}</RNText>
                }
              </View>}
          </View>
        </View>
      </>
    )
  }

  const FlashCardDescrption = () => {
    //const truncatedText = flashCardListDataState?.shortDescription?.length > 150 ? flashCardListDataState?.shortDescription?.slice(0, 250) + '...' : flashCardListDataState?.shortDescription || "";
    //console.log(flashCardListDataState?.shortDescription, "flashCardListDataState?.shortDescription")
    const truncate = (str: any, max: any) => {
      if (str?.length <= max) return str;
      return str?.slice(0, max).trim() + '...';
    };

    return (
      <View style={{ paddingVertical: 30, paddingHorizontal: 30 }}>
        <RNText textColor={COLORS.TEXTCOLOR} bold large>About Flashcard</RNText>
        <RNText style={{ marginTop: scale(5) }} textColor={"#575757"} medium>
          {truncate(flashCardListDataState?.shortDescription, 150)}
        </RNText>
        <Pressable onPress={_onPressChangeProfileName} style={{ flexDirection: "row", justifyContent: "flex-end", marginRight: scale(12) }}>
          <RNText textColor={COLORS.BORDER_COLOR} medium>{flashCardListDataState?.shortDescription?.length > 150 ? "Read More" : ""}</RNText>
        </Pressable>
      </View>
    )
  }

  const FlashcardDiscrptionSheet = () => { //ActionSheetRef?.current?.hide();
    return (
      <RNActionSheet ActionSheetRef={ActionSheetRef}>
        <RNImage source={IMAGES.ActionSheetIcon} style={{ alignSelf: "center", width: scale(50) }} />
        <View style={styles.actionsheet}>
          <RNText bold extraLarge>About Flashcard</RNText>
          <RNText style={{ padding: 5, marginTop: scale(10) }} textColor='#575757' medium>{flashCardListDataState?.longDescription || ""}</RNText>
        </View>
      </RNActionSheet>
    )
  }

  const flashCardCountView = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 30, paddingVertical: 20, marginTop: "-7%" }}>
          <RNText textColor={COLORS.TEXTCOLOR} bold large>Flashcard</RNText>
        </View>
        <View style={styles.cardMainView1}>
          <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>Flashcard</RNText>
          <RNText textColor={COLORS.TEXTCOLOR} medium>{flashCardListDataState?.cardsCount || 0} {flashCardListDataState?.cardsCount == 1 ? "Card" : "Cards"}</RNText>
        </View>
      </>
    )
  }

  const ButtonView = () => {
    return (
      <RNButton
        onPress={() => {
          if (flashCardListDataState?.userProgress?.status == "CANCELLED") {
            console.log("canel")
          }
          else {
            _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
              screen: SCREEN_NAMES.MainFlashCard,
              params: {
                data: hasParamData,
                gamificationData: flashCardListDataState
              },
            })
          }
        }
        }
        textColor={flashCardListDataState?.userProgress?.status == "IN_PROGRESS" ? COLORS.PRIMARY : flashCardListDataState?.userProgress?.status == "COMPLETED" ? COLORS.PRIMARY : flashCardListDataState?.userProgress?.status == "CANCELLED" ? COLORS.PRIMARY : COLORS.WHITE}
        title={flashCardListDataState?.userProgress?.status == "IN_PROGRESS" ? STRINGS.continue :flashCardListDataState?.userProgress?.status == "COMPLETED" ? "Completed (Replay)" : flashCardListDataState?.userProgress?.status == "CANCELLED" ? "Cancelled" : STRINGS.start}
        backgroundColor={flashCardListDataState?.userProgress?.status == "IN_PROGRESS" ? COLORS.DULLBUTTONCOLOR : flashCardListDataState?.userProgress?.status == "COMPLETED" ? COLORS.DULLBUTTONCOLOR : flashCardListDataState?.userProgress?.status == "CANCELLED" ? COLORS.DULLBUTTONCOLOR : COLORS.SECONDARY}
        style={{ width: "96%" }}
      />
    )
  }

  return (
    <RNContainer
      style={styles.container}
      back={true}
      onBack={() => _onPressNavigate(SCREEN_NAMES.Home)}
      title={STRINGS.flashcardPreview}
      titleMarginRight={true}
      scroll
      showsVerticalScrollIndicator={false}
      bottomChildren={ButtonView()}
      hideBackgroundImage Points={undefined}>
      {PreviewMainView()}
      {FlashCardDescrption()}
      {flashCardCountView()}
      {FlashcardDiscrptionSheet()}
    </RNContainer>
  );
};

export default FlashCardPreview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
    width: "106%",
    alignSelf: "center"
  },
  imageContainer: {
    width: '106%',
    alignSelf: "center",
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cardMainView: {
    width: "87%",
    marginTop: "-14%",
    alignSelf: "center",
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 20,
    elevation: COLORS.ELEVATION,
    position: "relative",
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,
  },
  cardTitle: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
  },
  progressContainer: {
    flexDirection: 'row',
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    padding: scale(6),
    justifyContent: "space-between"
  },
  progressText: {
    //marginLeft: scale(20),
  },
  infoContainer: {
    marginTop: scale(7),
    marginBottom: scale(10),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
  },
  actionsheet: {
    //height: "0%",
    padding: 20,
    justifyContent: 'space-evenly'
  },
  cardMainView1: {
    width: "87%",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW_COLOR,
    borderRadius: 5,
    elevation: COLORS.ELEVATION,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "android" ? 0 : 1,
    shadowRadius: Platform.OS === "android" ? 0 : 3.84,

  },
});



// import React, { useEffect, useRef } from 'react';
// import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
// import { RNActionSheet, RNButton, RNContainer, RNImage, RNText } from '../../../Common';
// import { COLORS, IMAGES, STRINGS } from '../../../constants';
// import { scale } from 'react-native-size-matters';
// import * as Progress from 'react-native-progress';
// import { SCREEN_NAMES } from '../../../config';
// import { _onPressNavigate, convertDateIntoDay } from '../../../utils/commonFunction';
// import { useDispatch } from 'react-redux';
// import { flashcardPreviewSelector } from './module/reducer';
// import { flashcardPreviewDetailsRequestAction } from './module/action';
// import LinearGradient from 'react-native-linear-gradient';
// import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
// const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
// import ShimmerPlaceholder from 'react-native-shimmer-placeholder';


// function formatDate(date = new Date()) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

// const FlashCardPreview: React.FC = (props: any) => {
//   const hasParamData = props?.route?.params?.data || [];
//   const { flashCardListDataState, previewisLoading } = flashcardPreviewSelector();
//   const dispatch = useDispatch();
//   const ActionSheetRef: any = useRef(null);

//   const _onPressChangeProfileName = () => {
//     ActionSheetRef?.current?.show();
//   };

//   useEffect(() => {
//     getFlashCardPreviewDetailsFunction();
//   }, [])

//   const getFlashCardPreviewDetailsFunction = () => {
//     let body = {
//       id: hasParamData?.id || "",
//       assignedDate: hasParamData?.assignedDate
//     }
//     dispatch(flashcardPreviewDetailsRequestAction({ body }));
//   }

//   const PreviewMainView = () => {
//     const playedTime = hasParamData?.playedTime ?? 0;
//     const duration = hasParamData?.duration ?? 0;

//     //const progressData = hasParamData?.status === "COMPLETED" ? 1 : playedTime && duration ? (playedTime / duration) * 0.5 : 0;
//     //const progressPercentage = hasParamData?.status === "COMPLETED" ? 100 : playedTime && duration ? Math.floor((playedTime / duration) * 50) : 0;
//     const flashcardProgressData = hasParamData?.status === "COMPLETED" ? 1 : playedTime && duration ? (playedTime / duration) * 0.5 : 0;
//     const flashcardProgressPercentage = hasParamData?.status === "COMPLETED" ? 100 : playedTime && duration ? (playedTime / duration) * 50 : 0;
//     const roundedPercentage2 = Math.round(flashcardProgressPercentage * 10) / 10; // This gives 65.6
//     const flashFinalPercentage = roundedPercentage2 % 1 >= 0.5 ? Math.ceil(roundedPercentage2) : Math.floor(roundedPercentage2);
//     const today = formatDate();

//     return (
//       //IMAGES.flashCardBackgroundImage
//       <><View style={styles.imageContainer}>
//         {hasParamData?.bannerImageUrl ?
//           <RNImage resizeMode="Cover" source={{ uri: hasParamData?.bannerImageUrl }} style={styles.image} />
//           :
//           <RNText style={{ top: 140 }} TextAlignCenter large textColor={COLORS.BORDER_COLOR}>No Image URL Found</RNText>}
//       </View>

//         <View style={styles.cardMainView}>
//           <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//             <RNText textColor={COLORS.TEXTCOLOR} style={[styles.cardTitle, { maxWidth: "70%" }]} bold large>{flashCardListDataState?.title || ""}</RNText>
//             {
//               hasParamData.dueDate.split('T')[0] < today && hasParamData.status?.toLowerCase() !== 'completed' ?
//                 <View style={{ backgroundColor: COLORS.RED, padding: 3, paddingHorizontal: 10, borderRadius: 5, marginRight: 10 }}>
//                   <RNText TextAlignCenter small textColor={COLORS.WHITE}>Overdue</RNText>
//                 </View>
//                 :
//                 hasParamData.status?.toLowerCase() == 'completed' && hasParamData?.isPassed != null && hasParamData?.isPassed !== undefined ?
//                   <View style={{ backgroundColor: hasParamData?.isPassed ? COLORS.GREEN : COLORS.RED, padding: 3, paddingHorizontal: 10, borderRadius: 5, marginRight: 10 }}>
//                     <RNText TextAlignCenter small textColor={COLORS.WHITE}>{hasParamData?.isPassed ? "Passed" : "Failed"}</RNText>
//                   </View>
//                   : null
//             }
//           </View>
//           <View style={styles.progressContainer}>
//             <Progress.Bar
//               borderWidth={0}
//               color="#4284F4"
//               unfilledColor={"#EEEEEE"}
//               progress={flashcardProgressData} width={scale(235)} /> 
//             <RNText style={styles.progressText} bold small>{flashFinalPercentage}%</RNText>
//           </View>

//           <View style={styles.infoContainer}>
//             <View style={styles.infoRow}>
//               <RNText textColor={COLORS.BORDER_COLOR} medium>Assigned Date</RNText>
//               {!hasParamData?.assignedDate ?
//                 <ShimmerPlaceHolder style={{ width: 100, height: 15 }} />
//                 :
//                 <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{convertDateIntoDay(hasParamData?.assignedDate)?.newConvertDate || ""}</RNText>
//               }
//             </View>

//             <View style={styles.infoRow}>
//               <RNText textColor={COLORS.BORDER_COLOR} medium>Due Date</RNText>
//               {!hasParamData?.dueDate ?
//                 <ShimmerPlaceholder style={{ width: 100, height: 15 }} />
//                 :
//                 <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{convertDateIntoDay(hasParamData?.dueDate)?.newConvertDate || ""}</RNText>
//               }
//             </View>

//             <View style={styles.infoRow}>
//               <RNText textColor={COLORS.BORDER_COLOR} medium>Department</RNText>
//               {!flashCardListDataState?.department ?
//                 <ShimmerPlaceholder style={{ width: 100, height: 15 }} />
//                 :
//                 <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{flashCardListDataState?.department || ""}</RNText>
//               }
//             </View>

//             {hasParamData?.lastViewedDate === "0001-01-01T00:00:00" ? null :
//               <View style={[styles.infoRow, { paddingVertical: 10 }]}>
//                 <RNText textColor={COLORS.BORDER_COLOR} medium>Last View Date</RNText>
//                 {!hasParamData?.lastViewedDate ?
//                   <ShimmerPlaceholder style={{ width: 100, height: 15 }} />
//                   :
//                   <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>{convertDateIntoDay(hasParamData?.lastViewedDate)?.newConvertDate || ""}</RNText>
//                 }
//               </View>}

//           </View>
//         </View>
//       </>
//     )
//   }

//   const FlashCardDescrption = () => {
//     //const truncatedText = flashCardListDataState?.shortDescription?.length > 150 ? flashCardListDataState?.shortDescription?.slice(0, 250) + '...' : flashCardListDataState?.shortDescription || "";
//     //console.log(flashCardListDataState?.shortDescription, "flashCardListDataState?.shortDescription")
//     const truncate = (str: any, max: any) => {
//       if (str?.length <= max) return str;
//       return str?.slice(0, max).trim() + '...';
//     };

//     return (
//       <View style={{ paddingVertical: 30, paddingHorizontal: 30 }}>
//         <RNText textColor={COLORS.TEXTCOLOR} bold large>About Flashcard</RNText>
//         <RNText style={{ marginTop: scale(5) }} textColor={"#575757"} medium>
//           {truncate(flashCardListDataState?.shortDescription, 150)}
//         </RNText>
//         <Pressable onPress={_onPressChangeProfileName} style={{ flexDirection: "row", justifyContent: "flex-end", marginRight: scale(12) }}>
//           <RNText textColor={COLORS.BORDER_COLOR} medium>{flashCardListDataState?.shortDescription?.length > 150 ? "Read More" : ""}</RNText>
//         </Pressable>
//       </View>
//     )
//   }

//   const FlashcardDiscrptionSheet = () => { //ActionSheetRef?.current?.hide();
//     return (
//       <RNActionSheet ActionSheetRef={ActionSheetRef}>
//         <RNImage source={IMAGES.ActionSheetIcon} style={{ alignSelf: "center", width: scale(50) }} />
//         <View style={styles.actionsheet}>
//           <RNText bold extraLarge>About Flashcard</RNText>
//           <RNText style={{ padding: 5, marginTop: scale(10) }} textColor='#575757' medium>{flashCardListDataState?.longDescription || ""}</RNText>
//         </View>
//       </RNActionSheet>
//     )
//   }

//   const flashCardCountView = () => {
//     return (
//       <>
//         <View style={{ paddingHorizontal: 30, paddingVertical: 20, marginTop: "-7%" }}>
//           <RNText textColor={COLORS.TEXTCOLOR} bold large>Flashcard</RNText>
//         </View>
//         <View style={styles.cardMainView1}>
//           <RNText textColor={COLORS.TEXTCOLOR} semiBold medium>Flashcard</RNText>
//           <RNText textColor={COLORS.TEXTCOLOR} medium>{flashCardListDataState?.cardsCount || 0} Cards</RNText>
//         </View>
//       </>
//     )
//   }

//   const ButtonView = () => {
//     return (
//       <RNButton
//         onPress={() => {
//           if (hasParamData?.status == "CANCELLED") {
//             console.log("canel")
//           }
//           else {
//             _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
//               screen: SCREEN_NAMES.MainFlashCard,
//               params: {
//                 data: hasParamData,
//               },
//             })
//           }
//         }
//         }
//         textColor={hasParamData?.status == "IN_PROGRESS" ? COLORS.PRIMARY : hasParamData?.status == "COMPLETED" ? COLORS.PRIMARY : hasParamData?.status == "CANCELLED" ? COLORS.PRIMARY : COLORS.WHITE}
//         title={hasParamData?.status == "IN_PROGRESS" ? STRINGS.continue : hasParamData?.status == "COMPLETED" ? "Completed (Replay)" : hasParamData?.status == "CANCELLED" ? "Cancelled" : STRINGS.start}
//         backgroundColor={hasParamData?.status == "IN_PROGRESS" ? COLORS.DULLBUTTONCOLOR : hasParamData?.status == "COMPLETED" ? COLORS.DULLBUTTONCOLOR : hasParamData?.status == "CANCELLED" ? COLORS.DULLBUTTONCOLOR : COLORS.SECONDARY}
//         style={{ width: "96%" }}
//       />
//     )
//   }

//   //   return (
// //     <RNContainer
// //       style={styles.container}
// //       back={true}
// //       title={STRINGS.flashcardPreview}
// //       titleMarginRight={true}
// //       scroll
// //       showsVerticalScrollIndicator={false}
// //       bottomChildren={ButtonView()}
// //       hideBackgroundImage>
// //       {PreviewMainView()}
// //       {FlashCardDescrption()}
// //       {flashCardCountView()}
// //       {FlashcardDiscrptionSheet()}
// //     </RNContainer>
// //   );
// // };

//   return (
//     <RNContainer
//       style={styles.container}
//       back={true}
//       title={STRINGS.flashcardPreview}
//       titleMarginRight={true}
//       scroll
//       showsVerticalScrollIndicator={false}
//       bottomChildren={ButtonView()}
//       Points={undefined}
//       hideBackgroundImage>
//       {PreviewMainView()}
//       {FlashCardDescrption()}
//       {flashCardCountView()}
//       {FlashcardDiscrptionSheet()}
//     </RNContainer>
//   );
// };

// export default FlashCardPreview;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
//     width: "106%",
//     alignSelf: "center"
//   },
//   imageContainer: {
//     width: '106%', // Full width
//     alignSelf: "center",
//     aspectRatio: 16 / 9, // Set aspect ratio to maintain image's aspect ratio
//   },
//   image: {
//     width: '100%', // Ensure image fills the entire container width
//     height: '100%', // Ensure image fills the entire container height
//     resizeMode: 'contain', // Scale image to fit inside the container without cropping
//   },
//   cardMainView: {
//     width: "87%",
//     marginTop: "-14%",
//     alignSelf: "center",
//     backgroundColor: COLORS.WHITE,
//     shadowColor: COLORS.SHADOW_COLOR,
//     borderRadius: 20,
//     elevation: COLORS.ELEVATION,
//     position: "relative",
//     shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
//     shadowOpacity: Platform.OS === "android" ? 0 : 1,
//     shadowRadius: Platform.OS === "android" ? 0 : 3.84,
//   },
//   cardTitle: {
//     paddingVertical: scale(15),
//     paddingHorizontal: scale(20),
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     paddingVertical: scale(5),
//     paddingHorizontal: scale(20),
//     alignItems: 'center',
//     padding: scale(6),
//     justifyContent:"space-between"
//   },
//   progressText: {
//     //marginLeft: scale(20),
//   },
//   infoContainer: {
//     marginTop: scale(7),
//     marginBottom: scale(10),
//   },
//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: scale(10),
//     paddingHorizontal: scale(20),
//   },
//   actionsheet: {
//     //height: "0%",
//     padding: 20,
//     justifyContent: 'space-evenly'
//   },
//   cardMainView1: {
//     width: "87%",
//     alignSelf: "center",
//     justifyContent: "space-between",
//     flexDirection: "row",
//     backgroundColor: COLORS.WHITE,
//     shadowColor: COLORS.SHADOW_COLOR,
//     borderRadius: 5,
//     elevation: COLORS.ELEVATION,
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     shadowOffset: Platform.OS === "android" ? { width: 0, height: 0 } : { width: 0, height: 2 },
//     shadowOpacity: Platform.OS === "android" ? 0 : 1,
//     shadowRadius: Platform.OS === "android" ? 0 : 3.84,

//   },
// });

