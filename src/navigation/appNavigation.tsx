import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAMES } from '../config';
import {
  Achivement,
  AttestationExam,
  CountinueSeeAllView,
  CourseAIExam,
  CourseAIExamFinish,
  CourseAIExamStart,
  CourseAssignment,
  CourseKnowladgeCheck,
  CoursePreview,
  CourseSeeAllView,
  CourseTutorial,
  FlashCardFinish,
  FlashCardPreview,
  FlashCardSeeAllView,
  Home,
  LeaderBoard,
  MainCourse,
  MainFlashCard,
  MainPath,
  PathSeeAllView,
  Profile,
  UpcomingEventDetails,
  UpcomingEvents,
  VideoShowingFullScreen,
} from '../container/app';

const Stack = createNativeStackNavigator();

const modalType: any = {
  animation: 'slide_from_bottom',
  headerShown: false
};

const modalOptions = {
  animation: 'slide_from_bottom',
  headerShown: false,
  presentation: 'modal'
};
const defaultOptions: any = {
  headerShown: false,
  animation: 'slide_from_right'
};

const FlashCardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name={SCREEN_NAMES.MainFlashCard} component={MainFlashCard} />
      <Stack.Screen name={SCREEN_NAMES.FlashCardPreview} component={FlashCardPreview} />
      <Stack.Screen name={SCREEN_NAMES.FlashCardFinish} component={FlashCardFinish} />
    </Stack.Navigator>
  );
};

const CourseStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name={SCREEN_NAMES.CoursePreview} component={CoursePreview} />
      <Stack.Screen name={SCREEN_NAMES.MainCourse} component={MainCourse} />
      <Stack.Screen name={SCREEN_NAMES.CourseTutorial} component={CourseTutorial} />
      <Stack.Screen name={SCREEN_NAMES.CourseKnowladgeCheck} component={CourseKnowladgeCheck} />
      <Stack.Screen name={SCREEN_NAMES.CourseAIExamStart} component={CourseAIExamStart} />
      <Stack.Screen name={SCREEN_NAMES.CourseAIExam} component={CourseAIExam} />
      <Stack.Screen name={SCREEN_NAMES.AttestationExam} component={AttestationExam} />
      <Stack.Screen name={SCREEN_NAMES.CourseAssignment} component={CourseAssignment} />
      <Stack.Screen name={SCREEN_NAMES.CourseAIExamFinish} component={CourseAIExamFinish} />
      <Stack.Screen name={SCREEN_NAMES.VideoShowingFullScreen} component={VideoShowingFullScreen} />

    </Stack.Navigator>
  );
};

const PathStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name={SCREEN_NAMES.MainPath} component={MainPath} />
    </Stack.Navigator>
  );
};

const AppNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAMES.Home}
      screenOptions={defaultOptions}>

      <Stack.Screen name={SCREEN_NAMES.Home} component={Home} />
      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.Profile}
        component={Profile}
      />
      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.UpcomingEvents}
        component={UpcomingEvents}
      />
      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.UpcomingEventDetails}
        component={UpcomingEventDetails}
      />

      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.FlashCardStack}
        component={FlashCardStack}
      />

      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.CourseStack}
        component={CourseStack}
      />

      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.PathStack}
        component={PathStack}
      />
      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.CountinueSeeAllView}
        component={CountinueSeeAllView}
      />
      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.CourseSeeAllView}
        component={CourseSeeAllView}
      />
      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.FlashCardSeeAllView}
        component={FlashCardSeeAllView}
      />
      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.PathSeeAllView}
        component={PathSeeAllView}
      />

      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.Achivement}
        component={Achivement}
      />

      <Stack.Screen
        options={defaultOptions}
        name={SCREEN_NAMES.LeaderBoard}
        component={LeaderBoard}
      />
    </Stack.Navigator>
  );
};
export default AppNavigation;
