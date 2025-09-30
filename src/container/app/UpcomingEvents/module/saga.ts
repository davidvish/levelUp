import {put, takeEvery} from 'redux-saga/effects';
import {
    upcomingEventDetailsRequestAction,
    upcomingEventDetailsSuccessAction,
    upcomingEventDetailsFailAction
} from './action';
import {get, post, del} from '../../../../utils/api';
import {ENDPOINT} from '../../../../config';

function* upcomingEventDetailsRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.upcomingEventDetails}/${payload?.body?.id}`);
    console.log('upcomingEventDetailsRequest = ', response);
    if (response && response?.status === true) {
        yield put(upcomingEventDetailsSuccessAction(response?.data));
    } else {
        yield put(upcomingEventDetailsFailAction());
    }
  } catch (error) {
    yield put(upcomingEventDetailsFailAction());
    console.log(error)
  }
}

function* sagaUpcomingEventDetails() {
  yield takeEvery(upcomingEventDetailsRequestAction, upcomingEventDetailsRequest);
}
export default sagaUpcomingEventDetails;
