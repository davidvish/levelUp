import {all} from 'redux-saga/effects';
import sagaLogin from '../container/auth/Login/module/saga';
import sagaForgotPassword from '../container/auth/ForgotPassword/module/saga';
import sagaHome from '../container/app/Home/module/saga';
import sagaAccount from '../container/app/Profile/module/saga';
import sagaFlashcardPreview from '../container/app/FlashCardStack/module/saga';
import sagaCourseStack from '../container/app/CourseStack/module/saga';
import sagaPath from '../container/app/PathStack/module/saga';
import sagaUpcomingEventDetails from '../container/app/UpcomingEvents/module/saga';
import sagaAchivement from '../container/app/Achivements/module/saga';
import sagaLeaderboard from '../container/app/LeaderBoard/module/saga';

export default function* rootSaga() {
  yield all([sagaLogin(), sagaForgotPassword(), sagaHome(), sagaAccount(), sagaFlashcardPreview(), sagaCourseStack(), sagaPath(), sagaUpcomingEventDetails(), sagaAchivement(), sagaLeaderboard()]);
}
