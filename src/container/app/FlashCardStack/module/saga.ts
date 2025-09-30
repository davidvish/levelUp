import { put, takeEvery } from 'redux-saga/effects';
import {
  flashcardPreviewDetailsRequestAction,
  flashcardPreviewDetailsSuccessAction,
  flashcardPreviewDetailsFailAction,
  studyPlayRequestAction,
  studyPlaySuccessAction,
  studyListRequestAction,
  studyListSuccessAction,
  studyListFailAction,
  practiceListRequestAction,
  practiceListSuccessAction,
  practiceListFailAction,
  AddUserAttempSuccessAction,
  AddUserAttempRequestAction,
  AddUserAttempFailAction,
  addUserAnsRequestAction,
  addUserAnsSuccessAction,
  addUserAnsFailAction,
  updateProgressRequestAction,
  updateProgressSuccessAction,
  revisitRequestAction,
  revisitSuccessAction,
  getRevisitRequestAction,
  getRevisitSuccessAction,
  getRevisitFailAction,
  playIncorrectSuccessAction,
  playIncorrectFailAction,
  playIncorrectRequestAction,
  practiceReportSuccessAction,
  practiceReportFailAction,
  practiceReportRequestAction
} from './action';
import { get, post, del, putMethod } from '../../../../utils/api';
import { ENDPOINT } from '../../../../config';
import { STRINGS } from '../../../../constants';

function* flashcardPreviewDetailsRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.courseDetails}/${payload?.body?.id || ""}/details?assignedDate=${payload?.body?.assignedDate}`);
    console.log('response flashcardPreviewDetailsRequest = ', response);
    if (response) {
      yield put(flashcardPreviewDetailsSuccessAction(response));
    }
  } catch (error) {
    yield put(flashcardPreviewDetailsFailAction());
    console.log(error)
  }
}

function* studyPlayRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.courseDetails}/${payload?.body?.id || ""}/play?assignedDate=${payload?.body?.assignedDate}`);
    console.log('response studyPlayRequest = ', response);
    if (response) {
      yield put(studyPlaySuccessAction(response));
      payload?.callback && payload?.callback(response);
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* studyListRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.flashCardList}/${payload?.body?.id || ""}/Study?assignedDate=${payload?.body?.assignedDate}`);
    console.log('response studyListRequest = ', response);
    if (response && response?.status == true) {
      yield put(studyListSuccessAction(response?.data));
    } else {
      yield put(studyListFailAction());
    }
  } catch (error) {
    yield put(studyListFailAction());
    console.log(error)
  }
}

function* addUserAtemRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(`${ENDPOINT.AddUserAttemp}/${payload?.body?.courseId}/${payload?.body?.assignedDate}`, false, false);
    console.log('response addUserAtemRequest = ', response);
    if (response && response?.status === true) {
      yield put(AddUserAttempSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
    } else {
      yield put(AddUserAttempFailAction());
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    yield put(AddUserAttempFailAction());
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* practiceListRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.flashCardList}/${payload?.body?.id || ""}/Practice?assignedDate=${payload?.body?.assignedDate}`);
    console.log('response practiceListRequest = ', response);
    if (response && response?.status == true) {
      yield put(practiceListSuccessAction(response?.data));
    } else {
      yield put(practiceListFailAction());
    }
  } catch (error) {
    yield put(practiceListFailAction());
    console.log(error)
  }
}


function* addUserAnsRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response: any = yield post(`${ENDPOINT.AddUserAnswer}`, payload?.body, false);
    console.log('response addUserAnsRequest = ', response);
    if (response && response?.status === true) {
      yield put(addUserAnsSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
    } else {
      yield put(addUserAnsFailAction());
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    yield put(addUserAnsFailAction());
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* updateProgressRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield putMethod(`${ENDPOINT.UpdateProgress}/${payload?.body?.updateId || ""}`, payload?.body?.body || [], false);
    console.log('response updateProgressRequest', response);
    if (response && response?.statusCode == 200) {
      yield put(updateProgressSuccessAction(response));
      payload?.callback && payload?.callback(response?.data);
    } else {
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}


function* revisitRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield post(`${ENDPOINT.AddCardToRevisitLater}`, payload?.body || [], false);
    console.log('response updateProgressRequest', response);
    if (response && response?.status == true) {
      yield put(revisitSuccessAction(response));
      payload?.callback && payload?.callback(response?.data);
    } else {
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}


function* getRevisitListRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetRevisitCards}/${payload?.body?.id || ""}`);
    console.log('response getRevisitListRequest = ', response);
    if (response && response?.status == true) {
      if (response?.data?.length != 0) {
        let data = {
          cards: response?.data || [],
          userProgress: null
        };
        yield put(getRevisitSuccessAction(data));
        payload?.callback && payload?.callback(data);
      }
      else {
        yield put(getRevisitFailAction());
        payload?.callback && payload?.callback('error');
      }
    } else {
      yield put(getRevisitFailAction());
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    yield put(getRevisitFailAction());
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* playIncorrectListRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetIncorrectUserAnswers}/${payload?.body?.id || ""}`);
    console.log('response playIncorrectListRequest = ', response);
    if (response && response?.status == true) {
      if (response?.data?.length != 0) {
        let data = {
          cards: response?.data || [],
          userProgress: null
        };
        yield put(playIncorrectSuccessAction(data));
        payload?.callback && payload?.callback(data);
      }
      else {
        Toast.show("Incorrect questions data not found!", { type: 'danger' });
        yield put(playIncorrectFailAction());
        payload?.callback && payload?.callback('error');
      }
    } else {
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
      yield put(playIncorrectFailAction());
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    Toast.show(error || error || STRINGS.apiError, { type: 'danger' });
    yield put(playIncorrectFailAction());
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}


function* practiceReportRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetPracticeReport}/${payload?.body?.id || ""}/${payload?.body?.assignedDate}`);
    console.log('response practiceReportRequest = ', response);
    if (response && response?.status == true) {
      yield put(practiceReportSuccessAction(response?.data));
    } else {
      yield put(practiceReportFailAction());
    }
  } catch (error) {
    yield put(practiceReportFailAction());
    console.log(error)
  }
}


function* sagaFlashcardPreview() {
  yield takeEvery(flashcardPreviewDetailsRequestAction, flashcardPreviewDetailsRequest);
  yield takeEvery(studyPlayRequestAction, studyPlayRequest);
  yield takeEvery(studyListRequestAction, studyListRequest);
  yield takeEvery(AddUserAttempRequestAction, addUserAtemRequest);
  yield takeEvery(practiceListRequestAction, practiceListRequest);
  yield takeEvery(addUserAnsRequestAction, addUserAnsRequest);
  yield takeEvery(updateProgressRequestAction, updateProgressRequest);
  yield takeEvery(revisitRequestAction, revisitRequest);
  yield takeEvery(getRevisitRequestAction, getRevisitListRequest);
  yield takeEvery(playIncorrectRequestAction, playIncorrectListRequest);
  yield takeEvery(practiceReportRequestAction, practiceReportRequest);
}
export default sagaFlashcardPreview;
