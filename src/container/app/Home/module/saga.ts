import {call, put, takeEvery} from 'redux-saga/effects';
import {
  upcomingEventsFailAction, 
  upcomingEventsRequestAction, 
  upcomingEventsSuccessAction, 
  countinueLearningRequestAction,
  countinueLearningSuccessAction,
  countinueLearningFailAction,
  getUserEntitiesRequestAction,
  getUserEntitiesCourseSuccessAction,
  getUserEntitiesFlashCardSuccessAction,
  getUserEntitiesPathSuccessAction,
  getUserEntitiesFailAction,
  barChartRequestAction,
  barChartSuccessAction,
  barChartFailAction,
  pieChartRequestAction,
  pieChartSuccessAction,
  pieChartFailAction,
  getProfileRequestAction,
  getProfileSuccessAction,
  getProfileFailAction,
  watchHistoryDeleteRequestAction,
  watchHistoryDeleteSuccessAction,
  getGamificationPointRequestAction,
  getGamificationPointSuccessAction,
  getGamificationPointFailAction,
  getSettingsSuccessAction,
  getSettingsFailAction,
  getSettingsRequestAction,
  //refreshTokenSuccessAction
} from './action';
import {STRINGS} from '../../../../constants';
import {get, post, del} from '../../../../utils/api';
import {ENDPOINT} from '../../../../config';
import { setAuthenticationToken } from '../../../../utils/authentication';

function* upcomingEventRequest({ payload }: { payload: { body: any }}): Generator<any, void, any> {
  try {
    const response = yield post(ENDPOINT.upcomingEvent, payload?.body, false);
    console.log('response = ', response);
    if (response && response?.status == true) {
      yield put(upcomingEventsSuccessAction(response?.data?.events));
    } else {
      yield put(upcomingEventsFailAction());
    }
  } catch (error) {
    yield put(upcomingEventsFailAction());
    console.log(error)
  }
}


// function* refreshTokenRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
//   try {
//     const response: any = yield post(ENDPOINT.RefreshToken, payload?.body, false);
//     console.log('response = ', response);
//     if (response && response?.status === true) {
//       payload?.callback && payload?.callback(response);
//       yield call(setAuthenticationToken, response?.body?.access_token);
//       yield put(refreshTokenSuccessAction(response?.body));
//     } else {
//       payload?.callback && payload?.callback('error');
//     }
//   } catch (error) {
//     payload?.callback && payload?.callback('error');
//     console.log(error)
//   }
// }


function* countinueLearningRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.continueLearning, payload?.body, false);
    console.log('response = ', response);
    if (response && response?.status === true) {
       yield put(countinueLearningSuccessAction(response?.data?.watchlist || []));
    } else {
      yield put(countinueLearningFailAction());
    }
  } catch (error) {
    yield put(countinueLearningFailAction());
    console.log(error)
  }
}


function* getUserEntitiesRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.getUserEntities, payload?.body, false);
    console.log('response getUserEntitiesRequest = ', response);
    if (response && response?.status === true) {
      yield put(getUserEntitiesCourseSuccessAction(response?.data?.courses || []));
      yield put(getUserEntitiesFlashCardSuccessAction(response?.data?.learningCards || []));
      yield put(getUserEntitiesPathSuccessAction(response?.data?.paths || []));
    } else {
      yield put(getUserEntitiesFailAction());
    }
  } catch (error) {
    yield put(getUserEntitiesFailAction());
    console.log(error)
  }
}


function* barChartApiRequest(): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetAllTrackCourseStatisticsByUser}`);
    console.log('response barChartApiRequest = ', response);
    if (response && response?.status == true) {
      yield put(barChartSuccessAction(response?.data));
    } else {
      yield put(barChartFailAction());
    }
  } catch (error) {
    yield put(barChartFailAction());
    console.log(error)
  }
}

function* pieChartApiRequest({ payload }: { payload: { body: any }}): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetUserTrackCourseMappingsByStatusPassFail}?type=${payload?.body?.type}`);
    console.log('response = ', response);
    if (response && response?.status == true) {
      yield put(pieChartSuccessAction(response?.data));
    } else {
      yield put(pieChartFailAction());
    }
  } catch (error) {
    yield put(pieChartFailAction());
    console.log(error)
  }
}

function* getProfileApiRequest(): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.getprofile}`);
    console.log('response = ', response);
    if (response && response?.status == true) {
      yield put(getProfileSuccessAction(response?.data));
    } else {
      yield put(getProfileFailAction());
    }
  } catch (error) {
    yield put(getProfileFailAction());
    console.log(error)
  }
}


function* watchHistoryDeleteApiRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield del(`${ENDPOINT.DeleteUserWatchHistory}/${payload?.body?.id}`);
    //console.log('response = ', response);
    if (response && response?.status == true) {
      payload?.callback && payload?.callback(response);
    } else {
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* gamificationPointApiRequest(): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetUserGamificationPopUpAndTotalPoints}`);
    console.log('response gamificationPointApiRequest = ', response);
    if (response && response?.status == true) {
      yield put(getGamificationPointSuccessAction(response?.data));
    } else {
      yield put(getGamificationPointFailAction());
    }
  } catch (error) {
    yield put(getGamificationPointFailAction());
    console.log(error)
  }
}

function* getSettingApiRequest(): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetSettings}`);
    console.log('response getSettingApiRequest = ', response);
    if (response && response?.status == true) {
      yield put(getSettingsSuccessAction(response?.data));
    } else {
      yield put(getSettingsFailAction());
    }
  } catch (error) {
    yield put(getSettingsFailAction());
    console.log(error)
  }
}

function* sagaHome() {
  yield takeEvery(upcomingEventsRequestAction, upcomingEventRequest);
  yield takeEvery(countinueLearningRequestAction, countinueLearningRequest);
  yield takeEvery(getUserEntitiesRequestAction, getUserEntitiesRequest);
  yield takeEvery(barChartRequestAction, barChartApiRequest);
  yield takeEvery(pieChartRequestAction, pieChartApiRequest);
  yield takeEvery(getProfileRequestAction, getProfileApiRequest);
  yield takeEvery(watchHistoryDeleteRequestAction, watchHistoryDeleteApiRequest);
  yield takeEvery(getGamificationPointRequestAction, gamificationPointApiRequest);
  yield takeEvery(getSettingsRequestAction, getSettingApiRequest);

}
export default sagaHome;
