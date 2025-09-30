import {put, takeEvery} from 'redux-saga/effects';
import {
    getGamificationAllLeaderboardRequestAction,
    getGamificationAllLeaderboardSuccessAction,
    getGamificationAllLeaderboardFailAction,
    getGamificationMonthLeaderboardRequestAction,
    getGamificationMonthLeaderboardSuccessAction,
    getGamificationMonthLeaderboardFailAction
} from './action';
import {STRINGS} from '../../../../constants';
import {get, post, del} from '../../../../utils/api';
import {ENDPOINT} from '../../../../config';

function* gamificationAllLeaderboardRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
 try {
     const response: any = yield post(ENDPOINT.GetUserGamificationLeaderboard, payload?.body, false);
     console.log('response = ', response);
     if (response && response?.status === true) {
        yield put(getGamificationAllLeaderboardSuccessAction(response?.data));
     } else {
       yield put(getGamificationAllLeaderboardFailAction());
     }
   } catch (error) {
     yield put(getGamificationAllLeaderboardFailAction());
     console.log(error)
   }
}

function* gamificationMonthLeaderboardRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
    try {
        const response: any = yield post(ENDPOINT.GetUserGamificationLeaderboard, payload?.body, false);
        console.log('response = ', response);
        if (response && response?.status === true) {
           yield put(getGamificationMonthLeaderboardSuccessAction(response?.data));
        } else {
          yield put(getGamificationMonthLeaderboardFailAction());
        }
      } catch (error) {
        yield put(getGamificationMonthLeaderboardFailAction());
        console.log(error)
      }
}

function* sagaLeaderboard() {
  yield takeEvery(getGamificationAllLeaderboardRequestAction, gamificationAllLeaderboardRequest);
  yield takeEvery(getGamificationMonthLeaderboardRequestAction, gamificationMonthLeaderboardRequest);
}
export default sagaLeaderboard;
