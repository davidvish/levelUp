import { call, put, takeEvery } from 'redux-saga/effects';
import {
  loginRequestAction,
  loginSuccessAction,
  logoutRequestAction,
  logoutSuccessAction,
  refreshTokenSuccessAction,
  socialGoogleLoginRequestAction,
  socialGoogleLoginSuccessAction,
  socialGoogleLoginFailAction,
  socialFacebookLoginRequestAction,
  socialFacebookLoginSuccessAction,
  socialFacebookLoginFailAction,
  socialMicrosoftLoginRequestAction,
  socialMicrosoftLoginSuccessAction,
  socialMicrosoftLoginFailAction,
  userExistRequestAction,
  LoggedTimeEntryRequestAction,
  refreshTokenRequestAction,
  refreshTokenFailAction,
  socialAppleRequestAction,
  socialAppleSuccessAction,
  socialAppleFailAction,
} from './action';
import { onLogout } from '../../../../utils/commonFunction';
import { STRINGS } from '../../../../constants';
import { post, get } from '../../../../utils/api';
import { ENDPOINT } from '../../../../config';
import { setAuthenticationToken, setUserId } from '../../../../utils/authentication';

function* loginRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.login, payload?.body, false);
    console.log('response = ', response);
    if (response && response?.status === true) {
      payload?.callback && payload?.callback(response);
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
      Toast.show(response?.message, { type: 'success' });
      yield call(setAuthenticationToken, response?.data?.accessToken);
      yield call(setUserId, response?.data?.id);
      yield put(loginSuccessAction(response?.data));
    } else {
      payload?.callback && payload?.callback('error');
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    Toast.show(error || error || STRINGS.apiError, { type: 'danger' });
    console.log(error)
  }
}

function* socialGoogleLoginRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.GoogleSignIn, payload?.body, false);
    console.log('response = ', response);
    if (response && response?.status === true) {
      payload?.callback && payload?.callback(response?.data);
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
      //Toast.show(response?.message, { type: 'success' });

       yield call(setAuthenticationToken, response?.data?.accessToken);
       yield call(setUserId, response?.data?.id);
       yield put(loginSuccessAction(response?.data));
    } else {
      payload?.callback && payload?.callback('error');
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    Toast.show(error || error || STRINGS.apiError, { type: 'danger' });
    console.log(error)
  }
}

function* socialAppleLoginRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.AppleLogin, payload?.body, false);
    console.log('response = ', response);
    if (response && response?.status === true) {
      payload?.callback && payload?.callback(response?.data);
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
      //Toast.show(response?.message, { type: 'success' });

       yield call(setAuthenticationToken, response?.data?.accessToken);
       yield call(setUserId, response?.data?.id);
       yield put(loginSuccessAction(response?.data));
    } else {
      payload?.callback && payload?.callback('error');
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    Toast.show(error || error || STRINGS.apiError, { type: 'danger' });
    console.log(error)
  }
}

function* userExistRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
      const response = yield get(`${ENDPOINT.IsCompanyExists}`);
      console.log('response examPlayRequest = ', response);
      if (response && response?.status == true) {
        payload?.callback && payload?.callback(response?.data);
        Toast.show("Successful login, welcome", { type: 'success' });
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


function* socialFacebookLoginRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.FacebookSignIn, payload?.body, false);
    console.log('response = ', response);
    if (response && response?.status === true) {
      payload?.callback && payload?.callback(response?.data);
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
      //Toast.show(response?.message, { type: 'success' });

      yield call(setAuthenticationToken, response?.data?.accessToken);
      yield call(setUserId, response?.data?.id);
      yield put(loginSuccessAction(response?.data));
    } else {
      payload?.callback && payload?.callback('error');
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    Toast.show(error || error || STRINGS.apiError, { type: 'danger' });
    console.log(error)
  }
}


function* socialMicrosoftLoginRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.MicrosoftSignIn, payload?.body, false);
    console.log('response = socialMicrosoftLoginRequest', response);
    if (response && response?.status === true) {
      payload?.callback && payload?.callback(response?.data);
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
      // Toast.show(response?.message, { type: 'success' });

      yield call(setAuthenticationToken, response?.data?.access_token);
      yield call(setUserId, response?.data?._id);
      yield put(loginSuccessAction(response?.data));
    } else {
      payload?.callback && payload?.callback('error');
      // Assuming Toast and Toast.show exist somewhere in your codebase
      // Replace with appropriate code for your environment
       Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}


function* LoggedTimeEntryRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.LoggedTimeEntry, payload?.body, false);
    console.log('response LoggedTimeEntryRequest = ', response);
    // if (response && response?.status === 'success') {
    //   //payload?.callback && payload?.callback(response);
    //   // Assuming Toast and Toast.show exist somewhere in your codebase
    //   // Replace with appropriate code for your environment
    //   // Toast.show(response?.message, { type: 'success' });
    //   // yield call(setAuthenticationToken, response?.body?.access_token);
    //   // yield call(setUserId, response?.body?._id);
    //   // yield put(loginSuccessAction(response?.body));
    // } else {
    //   payload?.callback && payload?.callback('error');
    //   // Assuming Toast and Toast.show exist somewhere in your codebase
    //   // Replace with appropriate code for your environment
    //   // Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    // }
  } catch (error) {
    //payload?.callback && payload?.callback('error');
    console.log(error)
  }
}


function* refreshTokenRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(ENDPOINT.RefreshToken, payload?.body, false);
    console.log('refreshTokenRequest = ', response);
    if (response && response?.status === true) {
      payload?.callback && payload?.callback(response);
      //Toast.show(response?.message, { type: 'success' });
      // yield call(setAuthenticationToken, response?.body?.access_token);
      // yield put(refreshTokenSuccessAction(response?.body));
    } else {
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* logoutRequest({ payload }: { payload: { callback?: () => void; } }): Generator<any, void, any> {
  try {
    // const response: any = yield post(ENDPOINT.logout);
    // console.log('response = ', response);
    // if (response && response?.success === "failure") {
    //   Toast.show(response?.message, { type: 'success' });
    yield put(logoutSuccessAction());
    yield call(onLogout);
    // } else {
    //   Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
    // }
  } catch (error) {
    console.log(error)
  }
}

function* sagaLogin(): Generator {
  yield takeEvery(loginRequestAction, loginRequest);
  yield takeEvery(logoutRequestAction, logoutRequest);
  yield takeEvery(socialGoogleLoginRequestAction, socialGoogleLoginRequest);
  yield takeEvery(socialAppleRequestAction, socialAppleLoginRequest);
  yield takeEvery(socialMicrosoftLoginRequestAction, socialMicrosoftLoginRequest);
  yield takeEvery(socialFacebookLoginRequestAction, socialFacebookLoginRequest);
  yield takeEvery(userExistRequestAction, userExistRequest);
  yield takeEvery(LoggedTimeEntryRequestAction, LoggedTimeEntryRequest);
  //yield takeEvery(socialLoginRequestAction, refreshTokenRequest);
  yield takeEvery(refreshTokenRequestAction, refreshTokenRequest);

}

export default sagaLogin;
