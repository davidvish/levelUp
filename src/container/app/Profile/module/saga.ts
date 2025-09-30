import {put, takeEvery} from 'redux-saga/effects';
import {
    profileNameRequestAction,
    profilePasswordRequestAction
} from './action';
import {STRINGS} from '../../../../constants';
import {get, post, del} from '../../../../utils/api';
import {ENDPOINT} from '../../../../config';

function* profileNameRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.UpdateUserProfile, payload?.body, false);
    console.log('response = ', response);
    if (response && response?.status === true) {
        payload?.callback && payload?.callback(response);
        Toast.show(response?.message, { type: 'success' });
    } else {
        payload?.callback && payload?.callback('error');
        Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    Toast.show(error || error || STRINGS.apiError, { type: 'danger' });
    console.log(error)
  }
}


function* profilePassordRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
    try {
      const response: any = yield post(ENDPOINT.ChangePassword, payload?.body, false);
      console.log('response = ', response);
      if (response && response?.status === true) {
          payload?.callback && payload?.callback(response);
          Toast.show(response?.message, { type: 'success' });
      } else {
          payload?.callback && payload?.callback('error');
          Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
      }
    } catch (error) {
      payload?.callback && payload?.callback('error');
      Toast.show(error || error || STRINGS.apiError, { type: 'danger' });
      console.log(error)
    }
  }

function* sagaAccount() {
  yield takeEvery(profileNameRequestAction, profileNameRequest);
  yield takeEvery(profilePasswordRequestAction, profilePassordRequest);
}
export default sagaAccount;
