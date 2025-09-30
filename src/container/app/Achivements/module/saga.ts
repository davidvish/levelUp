import {put, takeEvery} from 'redux-saga/effects';
import {
    getGamificationBadgesRequestAction,
    getGamificationBadgesSuccessAction,
    getGamificationBadgesFailAction,
    getGamificationAchivementRequestAction,
    getGamificationAchivementSuccessAction,
    getGamificationAchivementFailAction,
    getGamificationLevelsSuccessAction,
    getGamificationLevelsFailAction,
    getGamificationLevelsRequestAction
} from './action';
import {STRINGS} from '../../../../constants';
import {get, post, del} from '../../../../utils/api';
import {ENDPOINT} from '../../../../config';

function* gamificationBadgesApiRequest(): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetAllBadges}`);
    console.log('response gamificationBadgesApiRequest = ', response);
    if (response && response?.status == true) {
      yield put(getGamificationBadgesSuccessAction(response?.data));
    } else {
      yield put(getGamificationBadgesFailAction());
    }
  } catch (error) {
    yield put(getGamificationBadgesFailAction());
    console.log(error)
  }
}

function* gamificationachivementApiRequest(): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetMyAchievements}`);
    console.log('response gamificationachivementApiRequest = ', response);
    if (response && response?.status == true) {
      yield put(getGamificationAchivementSuccessAction(response?.data));
    } else {
      yield put(getGamificationAchivementFailAction());
    }
  } catch (error) {
    yield put(getGamificationAchivementFailAction());
    console.log(error)
  }
}

function* gamificationLevelsApiRequest(): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetAllLevels}`);
    console.log('response gamificationLevelsApiRequest = ', response);
    if (response && response?.status == true) {
      yield put(getGamificationLevelsSuccessAction(response?.data));
    } else {
      yield put(getGamificationLevelsFailAction());
    }
  } catch (error) {
    yield put(getGamificationLevelsFailAction());
    console.log(error)
  }
}

function* sagaAchivement() {
  yield takeEvery(getGamificationBadgesRequestAction, gamificationBadgesApiRequest);
  yield takeEvery(getGamificationAchivementRequestAction, gamificationachivementApiRequest);
  yield takeEvery(getGamificationLevelsRequestAction, gamificationLevelsApiRequest);
}
export default sagaAchivement;
