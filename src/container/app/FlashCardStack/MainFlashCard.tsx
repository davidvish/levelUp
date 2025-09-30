import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { RNButton, RNContainer, RNText } from '../../../Common';
import { COLORS, STRINGS } from '../../../constants';
import { scale } from 'react-native-size-matters';
import StudyTabComponent from './component/StudyTab';
import PracticeTabComponent from './component/PracticeTab';
import RNModal from '../../../Common/Modal/Modal';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateProgressRequestAction } from './module/action';
import { _onPressGoBackNavigate, _onPressNavigate } from '../../../utils/commonFunction';
import Tts from 'react-native-tts';
import { coursePlayRequestAction, getUserGamificationPointsRequestAction } from '../CourseStack/module/action';
import { SCREEN_NAMES } from '../../../config';

const MainFlashCard: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const hasParamData = props?.route?.params?.data || [];
  const gamificationData = props?.route?.params?.gamificationData || [];
  const tabCondtion = props?.route?.params?.playIncorrect;
  const [activeTab, setActiveTab] = useState(tabCondtion ? 'Practice' : 'Study');
  const [modalVisible, setModalVisible] = useState(false);
  const [childData, setChildData] = useState<any>(null); // State to store data from child

  console.log(gamificationData, "gamificationDatagamificationData")
  const switchTab = (tab: string) => {
    Tts.stop();
    if (tab == "Study") {
      setModalVisible(true)
      //setActiveTab(tab);
    }
    else {
      //onUpdateProgressFunction();
      setActiveTab(tab);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Update the count when the screen is focused
      //setActiveTab("Study")
      setModalVisible(false)
      // Clean up function to run when the effect is removed
      return () => {
        // Perform any cleanup here if needed
      };
    }, []) // Dependency array ensures effect runs only when count changes
  );

  useEffect(() => {
   // coursePlayFunction();
    gamificationPointsFunction();
  }, [])

  const handleChildData = (data: any) => {
    setChildData(data);
  };

  const onBackFunction = () => {
    const body = {
      body: childData || [], // Use the data received from the child
      updateId: hasParamData?.id,
    };
    const callback = (res: any) => {
      if (res !== 'error') {
        // _onPressGoBackNavigate();
        _onPressNavigate(SCREEN_NAMES.FlashCardStack, {
          screen: SCREEN_NAMES.FlashCardPreview,
          params: {
            playIncorrect: true,
            data: hasParamData
          },
        })
      }
    };
    dispatch(updateProgressRequestAction({ body, callback }));
  };

  const onUpdateProgressFunction = () => {
    const body = {
      body: childData || [], // Use the data received from the child
      updateId: hasParamData?.id,
    };
    const callback = (res: any) => {
      if (res !== 'error') {
      }
    };
    dispatch(updateProgressRequestAction({ body, callback }));
  };

  const coursePlayFunction = () => {
    console.log("hello check againasas")
    const { id, assignedDate } = hasParamData;
    if (id && assignedDate) {
      const body = { id, assignedDate };
      dispatch(coursePlayRequestAction({ body }));
    }
  }

  const gamificationPointsFunction = () => {
    const { id, assignedDate } = hasParamData;
    if (id && assignedDate) {
      const body = { id, assignedDate };
      dispatch(getUserGamificationPointsRequestAction({ body }));
    }
  }

  const RestartCourseModal = () => {
    return (
      <RNModal transparent visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={{ paddingHorizontal: 10, backgroundColor: COLORS.WHITE, paddingVertical: 20, width: "80%" }}>
          <RNText style={{ marginTop: 5, }} large>Leave this page will erase all progress made on practice. Are you sure you want to leave?</RNText>

          <RNButton
            onPress={() => {
              setModalVisible(false);
              setActiveTab("Study");
            }}
            textColor={COLORS.SECONDARY}
            title={STRINGS.yes}
            minHeightButton={true}
            style={styles.restartButtonStyle}
            backgroundColor={COLORS.WHITE}
          />

          <RNButton
            onPress={() => setModalVisible(false)}
            textColor={COLORS.WHITE}
            title={STRINGS.no}
            minHeightButton={true}
            style={styles.restartButtonStyle}
            backgroundColor={COLORS.SECONDARY}
          />
        </View>
      </RNModal>
    );
  };

  const renderTab = (tab: string, title: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tabButton, isActive ? styles.activeTabButton : null]}
        onPress={() => switchTab(tab)}
      >
        <RNText medium textColor={isActive ? COLORS.WHITE : '#D7DFFF'}>{title}</RNText>
      </TouchableOpacity>
    );
  };

  return (
    <RNContainer
      style={styles.container}
      back={true}
      title={hasParamData?.title?.trimEnd().length > 27
        ? hasParamData?.title.trimEnd().slice(0, 27) + "..."
        : hasParamData?.title}
      //title={hasParamData?.title?.length > 27 ? hasParamData?.title?.slice(0, 27) + "..." : hasParamData?.title} 
      onBack={onBackFunction}
      //scroll
      //showsVerticalScrollIndicator={false}
      //bottomChildren={ButtonView()}
      hideBackgroundImage Points={undefined}>
      <ScrollView style={{ width: "106%", alignSelf: "center" }} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View style={styles.tabBar}>
          {renderTab('Study', 'Study')}
          {renderTab('Practice', 'Practice')}
        </View>
        <View style={styles.tabContent}>
          {activeTab === 'Study' ? <StudyTabComponent gamificationData={gamificationData} data={hasParamData} practiceOnPress={() => setActiveTab("Practice")} onChildDataChange={handleChildData} /> : <PracticeTabComponent gamificationData={gamificationData} data={hasParamData} tabCondtion={tabCondtion} />}
        </View>
      </ScrollView>
      {RestartCourseModal()}
    </RNContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY,
    flex: 0,
    alignSelf: 'center',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.WHITE,
  },
  activeTabButton: {
    borderBottomColor: COLORS.WHITE,
    borderBottomWidth: 3, // Added border width for active tab
  },
  tabContent: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  restartButtonStyle: {
    marginTop: scale(15),
    width: "87%",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
});

export default MainFlashCard;
