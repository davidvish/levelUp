import {combineReducers} from 'redux';
import loginReducer from '../container/auth/Login/module/reducer';
import homeScreenReducer from '../container/app/Home/module/reducer';
import accountReducer from '../container/app/Profile/module/reducer';
import FlashCardPreviewReducer from '../container/app/FlashCardStack/module/reducer';
import CourseStackReducer from '../container/app/CourseStack/module/reducer';
import pathReducer from '../container/app/PathStack/module/reducer';
import upcomingEventDetailsReducer from '../container/app/UpcomingEvents/module/reducer';
import achivementReducer from '../container/app/Achivements/module/reducer';
import leaderboardReducer from '../container/app/LeaderBoard/module/reducer';
//import basicSettingsReducer from '../container/auth/OnBoardings/module/BasicSettings/reducer';
const appReducer = combineReducers({
  loginReducer: loginReducer,
  leaderboardReducer:leaderboardReducer,
 // basicSettingsReducer: basicSettingsReducer,
 homeScreenReducer: homeScreenReducer,
 accountReducer: accountReducer,
 FlashCardPreviewReducer: FlashCardPreviewReducer,
 CourseStackReducer: CourseStackReducer,
 pathReducer: pathReducer,
 upcomingEventDetailsReducer: upcomingEventDetailsReducer,
 achivementReducer:achivementReducer
});
export default appReducer;
