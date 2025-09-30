import {put, takeEvery} from 'redux-saga/effects';
import {
    GetAssignedPathDetailsV2RequestAction,
    GetAssignedPathDetailsV2SuccessAction,
    GetAssignedPathDetailsV2FailAction,
    AddUpdateLearnersToSlotRequestAction
} from './action';
import {get, post, del} from '../../../../utils/api';
import {ENDPOINT} from '../../../../config';

function* GetAssignedPathRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetAssignedPathDetailsV2}/${payload?.body?.id}`);
    console.log('GetAssignedPathRequest = ', response);
    if (response && response?.status === true) {
        yield put(GetAssignedPathDetailsV2SuccessAction(response?.data));
    } else {
        yield put(GetAssignedPathDetailsV2FailAction());
    }
  } catch (error) {
    yield put(GetAssignedPathDetailsV2FailAction());
    console.log(error)
  }
}

function* AddUpdateLearnersToSlotRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.AddUpdateLearnersToSlot, payload?.body, false);
    console.log('response AddUpdateLearnersToSlotRequest = ', response);
    if (response && response?.status === true) {
        payload?.callback && payload?.callback(response);
    } else {
        payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* sagaPath() {
  yield takeEvery(GetAssignedPathDetailsV2RequestAction, GetAssignedPathRequest);
  yield takeEvery(AddUpdateLearnersToSlotRequestAction, AddUpdateLearnersToSlotRequest);
}
export default sagaPath;
