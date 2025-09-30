import { takeEvery } from 'redux-saga/effects';
import { forgotPasswordRequestAction, resetPasswordRequestAction } from './action';
import { STRINGS } from '../../../../constants';
import { post } from '../../../../utils/api';
import { ENDPOINT } from '../../../../config';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects'; // Import put and call if they are used inside your saga

interface Payload {
  body: any; // Adjust the type of body according to your actual payload structure
  callback?: (response: any) => void; // Adjust the type of callback according to your requirements
}

function* forgotPasswordRequest({ payload }: { payload: Payload }): SagaIterator {
  try {
    const response = yield call(post, ENDPOINT.forgotPassword, payload?.body, false);
    console.log('response = ', response);
    if (response && response?.status == true) {
      payload?.callback && payload?.callback(response);
       Toast.show(response?.message, { type: 'success' });
    } else {
      payload?.callback && payload?.callback('error');
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error);
  }
}

function* resetPasswordRequest({ payload }: { payload: Payload }): SagaIterator {
  try {
    const response = yield call(post, ENDPOINT.resetPassword, payload?.body, false);
    console.log('response = ', response);
    if (response && response?.status == 'success') {
      payload?.callback && payload?.callback(response);
      Toast.show(response?.message, { type: 'success' });
    } else {
      payload?.callback && payload?.callback('error');
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error);
  }
}

function* sagaForgotPassword(): SagaIterator {
  yield takeEvery(forgotPasswordRequestAction, forgotPasswordRequest);
  yield takeEvery(resetPasswordRequestAction, resetPasswordRequest);
}

export default sagaForgotPassword;
