import { put, takeEvery } from 'redux-saga/effects';
import {
  getScormChaptersByCourseRequestAction,
  getScormChaptersByCourseSuccessAction,
  getScormChaptersByCourseFailAction,
  coursePlayRequestAction,
  coursePlaySuccessAction,
  coursePlayFailAction,
  scromPlayRequestAction,
  scromPlaySuccessAction,
  scromPlayFailAction,
  materialProgressRequestAction,
  materialProgressSuccessAction,
  materialProgressFailAction,
  updateMaterialRequestAction,
  examPlaySuccessAction,
  examPlayFailAction,
  examPlayRequestAction,
  examAddUserAttemptSuccessAction,
  examAddUserAttemptFailAction,
  examAddUserAttemptRequestAction,
  addKCResponseSuccessAction,
  addKCResponseFailAction,
  addKCResponseRequestAction,
  updateKCProgressRequestAction,
  updateKCProgressSuccessAction,
  updateKCProgressFailAction,
  startExamRequestAction,
  startExamSuccessAction,
  startExamFailAction,
  addExamResponseRequestAction,
  getExamResultSuccessAction,
  getExamResultFailAction,
  getExamResultRequestAction,
  getUserGamificationPointsFailAction,
  getUserGamificationPointsSuccessAction,
  getUserGamificationPointsRequestAction,
  getUserGamificationPopUpAndTotalPointsSuccessAction,
  getUserGamificationPopUpAndTotalPointsFailAction,
  getUserGamificationPopUpAndTotalPointsRequestAction,
  createEnrollmentRequestAction,
  createEnrollmentSuccessAction,
  createEnrollmentFailAction,
  AttestionQuestionSuccessAction,
  AttestionQuestionFailAction,
  AttestionQuestionRequestAction,
  SubmitAttestationRequestAction,
  SubmitAttestationSuccessAction,
  SubmitAttestationFailAction,
  GetAssignmentRequestAction,
  GetAssignmentSuccessAction,
  GetAssignmentFailAction,
  AssignmentSubmissionRequestAction,
  GetTimeOnAssignmentDetailSuccessAction,
  GetTimeOnAssignmentDetailFailAction,
  GetTimeOnAssignmentDetailRequestAction
} from './action';
import { get, post, del, putMethod } from '../../../../utils/api';
import { ENDPOINT } from '../../../../config';
import { STRINGS } from '../../../../constants';

function* scromChapterRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetScormChaptersByCourse}/${payload?.body?.id || ""}?assignedDate=${payload?.body?.assignedDate}`);
    console.log('response scromChapterRequest = ', response);
    if (response && response?.status == true) {
      yield put(getScormChaptersByCourseSuccessAction(response?.data));
    } else {
      yield put(getScormChaptersByCourseFailAction());
    }
  } catch (error) {
    yield put(getScormChaptersByCourseFailAction());
    console.log(error)
  }
}

function* coursePlayRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.courseDetails}/${payload?.body?.id || ""}/play?assignedDate=${payload?.body?.assignedDate}`);
    console.log('response coursePlayRequest = ', response);
    if (response) {
      yield put(coursePlaySuccessAction(response));
      payload?.callback && payload?.callback(response);
    }
  } catch (error) {
    yield put(coursePlayFailAction());
    // Toast.show(error || error || STRINGS.apiError, { type: 'danger' });
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* scromPlayRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.scromDetails}/${"d64a335b-26b3-482a-08b3-08dc53c31c03"}/play?assignedDate=${"2024-04-03T10:47:08.6614394"}`);
    console.log('response scromPlayRequest = ', response);
    if (response && response?.status == true) {
      yield put(scromPlaySuccessAction(response?.data));
    } else {
      yield put(scromPlayFailAction());
    }
  } catch (error) {
    yield put(scromPlayFailAction());
    console.log(error)
  }
}

function* materialProgressRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield putMethod(`${ENDPOINT.UpdateProgress}/${payload?.body?.updateId || ""}`, payload?.body?.body || [], false);
    console.log('response materialProgressRequest', response);
    if (response && response?.statusCode == 200) {
      yield put(materialProgressSuccessAction(response));
      //payload?.callback && payload?.callback(response?.data);
    } else {
      yield put(materialProgressFailAction());
      //payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    yield put(materialProgressFailAction());
    //payload?.callback && payload?.callback('error');
    console.log(error)
  }
}


function* updateMaterialRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield putMethod(`${ENDPOINT.materialprogress}/${payload?.body?.materialId || ""}`, payload?.body?.body || [], false);
    console.log('response updateMaterialRequest', response);
    if (response && response?.statusCode == 200) {
      payload?.callback && payload?.callback(response);
    } else {
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* examPlayRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.Exams}/${payload?.body?.EntityId}/play?assignedDate=${payload?.body?.assignedDate}`);
    console.log('response examPlayRequest = ', response);
    if (response && response?.status == true) {
      yield put(examPlaySuccessAction(response?.data));
    } else {
      yield put(examPlayFailAction());
    }
  } catch (error) {
    yield put(examPlayFailAction());
    console.log(error)
  }
}

function* examAddUserAttemptRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield post(`${ENDPOINT.ExamAddUserAttempt}`, payload?.body || [], false);
    console.log('response examAddUserAttemptRequest', response);
    if (response && response?.statusCode == 200) {
      yield put(examAddUserAttemptSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
    } else {
      // Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
      yield put(examAddUserAttemptFailAction());
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    // Toast.show(STRINGS.apiError, { type: 'danger' });
    yield put(examAddUserAttemptFailAction());
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* addKCResponseRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield post(`${ENDPOINT.AddKCResponse}/${payload?.body?.attemptId || ""}`, payload?.body?.body || [], false);
    console.log('response examAddUserAttemptRequest', response);
    if (response && response?.statusCode == 200) {
      yield put(addKCResponseSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
    } else {
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}


function* UpdateKCProgressRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield putMethod(`${ENDPOINT.UpdateKCProgress}/${payload?.body?.attemptId || ""}/${payload?.body?.assignedDate}`, false, false);
    console.log('response UpdateKCProgressRequest', response);
    if (response && response?.statusCode == 200) {
      yield put(updateKCProgressSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
    } else {
      yield put(updateKCProgressFailAction());
      // Toast.show(response?.message, { type: 'danger' });
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    yield put(updateKCProgressFailAction());
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}


function* startExamRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.Exams}/${payload?.body?.id || ""}`);
    console.log('response startExamRequest', response);
    if (response && response?.statusCode == 200) {
      yield put(startExamSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
    } else {
      yield put(startExamFailAction());
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    yield put(startExamFailAction());
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* addExamResponseRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield post(`${ENDPOINT.AddExamResponse}/${payload?.body?.attemptId || ""}`, payload?.body?.body || [], false);
    console.log('response addExamResponseRequest', response);
    if (response && response?.statusCode == 200) {
      payload?.callback && payload?.callback(response?.data);
    } else {
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    Toast.show(error || STRINGS.apiError, { type: 'danger' });
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* getExamResultRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetExamResult}/${payload?.body?.attemptId}/${payload?.body?.assignedDate}`);
    console.log('response getExamResultRequest = ', response);
    if (response && response?.status == true) {
      payload?.callback && payload?.callback(response?.data);
      //yield put(getExamResultSuccessAction(response?.data));
    } else {
      payload?.callback && payload?.callback('error');
      //yield put(getExamResultFailAction());
    }
  } catch (error) {
    payload?.callback && payload?.callback('error');
    //yield put(getExamResultFailAction());
    console.log(error)
  }
}

function* GamificationPointsApiRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetUserGamificationPointsByEntityAndAssignedDate}/${payload?.body?.id || ""}/${payload?.body?.assignedDate}`);
    console.log('response GamificationPointsApiRequest = ', response);
    if (response && response?.status == true) {
      yield put(getUserGamificationPointsSuccessAction(response?.data));
    } else {
      yield put(getUserGamificationPointsFailAction());
    }
  } catch (error) {
    yield put(getUserGamificationPointsFailAction());
    console.log(error)
  }
}

function* gamificationPopUpAndTotalPointsApiRequest(): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.GetUserGamificationPopUpAndTotalPoints}`);
    console.log('response gamificationPopUpAndTotalPointsApiRequest = ', response);
    if (response && response?.status == true) {
      yield put(getUserGamificationPopUpAndTotalPointsSuccessAction(response?.data));
    } else {
      yield put(getUserGamificationPopUpAndTotalPointsFailAction());
    }
  } catch (error) {
    yield put(getUserGamificationPopUpAndTotalPointsFailAction());
    console.log(error)
  }
}


function* createEnrollmentRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield post(`${ENDPOINT.createEnrollmentRequest}`, payload?.body || [], false);
    console.log('response createEnrollmentRequest', response);
    if (response && response?.statusCode == 200) {
      yield put(createEnrollmentSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
      Toast.show(response?.message, { type: 'success' });
    } else {
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
      yield put(createEnrollmentFailAction());
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    // Toast.show(STRINGS.apiError, { type: 'danger' });
    yield put(createEnrollmentFailAction());
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* attestationRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield get(`${ENDPOINT.AttestationQuestions}/${payload?.body?.id || ""}`);
    console.log('response attestationRequest', response);
    if (response && response?.statusCode == 200) { 
      yield put(AttestionQuestionSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
    } else {
      yield put(AttestionQuestionFailAction());
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    yield put(AttestionQuestionFailAction());
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}


function* submitAttQuestionsResponseRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {
  try {
    const response = yield post(`${ENDPOINT.SubmitAttestation}`, payload?.body || [], false);
    if (response && response?.statusCode == 200) {
      payload?.callback && payload?.callback(response?.data);
    } else {
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    Toast.show(error || STRINGS.apiError, { type: 'danger' });
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

/// getAssignment api saga ///
function* getAssignmentRequestAction({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {  
  try {
    const response = yield get(`${ENDPOINT.GetAssignment}/${payload?.body?.id || ""}`);
    if (response && response?.statusCode == 200) {
      yield put(GetAssignmentSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
    } else {
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
        yield put(GetAssignmentFailAction());
    Toast.show(error || STRINGS.apiError, { type: 'danger' });
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

/// GetTimeOnAssignmentDetail api saga ///
function* getTimeOnAssignmentDetailRequestAction({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {  
  try {
    const response = yield get(`${ENDPOINT.GetTimeOnAssignmentDetail}/${payload?.body?.id || ""}`);
    if (response && response?.statusCode == 200) {
      yield put(GetTimeOnAssignmentDetailSuccessAction(response?.data));
      payload?.callback && payload?.callback(response?.data);
    } else {
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
        yield put(GetTimeOnAssignmentDetailFailAction());
    Toast.show(error || STRINGS.apiError, { type: 'danger' });
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

/// AssignmentSubmission api saga ///
function* assignmentSubmissionResponseRequest({ payload }: { payload: { body: any; callback?: (response: any) => void; } }): Generator<any, void, any> {  
  console.log(payload?.body,'payload?.bodypayload?.bodypayload?.body');
  
  try {
    const response = yield post(`${ENDPOINT.AssignmentSubmission}`, payload?.body || [], false);
    console.log('response assignmentSubmissionResponseRequest', response);
    if (response && response?.statusCode == 200) {
      payload?.callback && payload?.callback(response?.data);
    } else {
      Toast.show(response?.message || response?.error_description || STRINGS.apiError, { type: 'danger' });
      payload?.callback && payload?.callback('error');
    }
  } catch (error) {
    Toast.show(error || STRINGS.apiError, { type: 'danger' });
    payload?.callback && payload?.callback('error');
    console.log(error)
  }
}

function* sagaCourseStack() {
  yield takeEvery(getScormChaptersByCourseRequestAction, scromChapterRequest);
  yield takeEvery(coursePlayRequestAction, coursePlayRequest);
  yield takeEvery(scromPlayRequestAction, scromPlayRequest);
  yield takeEvery(materialProgressRequestAction, materialProgressRequest);
  yield takeEvery(updateMaterialRequestAction, updateMaterialRequest);
  yield takeEvery(examPlayRequestAction, examPlayRequest);
  yield takeEvery(examAddUserAttemptRequestAction, examAddUserAttemptRequest);
  yield takeEvery(addKCResponseRequestAction, addKCResponseRequest);
  yield takeEvery(updateKCProgressRequestAction, UpdateKCProgressRequest);
  yield takeEvery(startExamRequestAction, startExamRequest);
  yield takeEvery(addExamResponseRequestAction, addExamResponseRequest);
  yield takeEvery(getExamResultRequestAction, getExamResultRequest);
  yield takeEvery(getUserGamificationPointsRequestAction, GamificationPointsApiRequest);
  yield takeEvery(getUserGamificationPopUpAndTotalPointsRequestAction, gamificationPopUpAndTotalPointsApiRequest);
  yield takeEvery(createEnrollmentRequestAction, createEnrollmentRequest);
  yield takeEvery(AttestionQuestionRequestAction, attestationRequest);
  yield takeEvery(SubmitAttestationRequestAction, submitAttQuestionsResponseRequest);
  yield takeEvery(GetAssignmentRequestAction, getAssignmentRequestAction);
  yield takeEvery(AssignmentSubmissionRequestAction, assignmentSubmissionResponseRequest);
  yield takeEvery(GetTimeOnAssignmentDetailRequestAction, getTimeOnAssignmentDetailRequestAction);

}
export default sagaCourseStack;