import {createAction} from '@reduxjs/toolkit';

export const getScormChaptersByCourseRequestAction : any = createAction(
  'request/getScormChaptersByCourseRequestAction',
);
export const getScormChaptersByCourseSuccessAction : any = createAction(
  'getScormChaptersByCourseSuccessAction',
);
export const getScormChaptersByCourseFailAction : any = createAction(
  'getScormChaptersByCourseFailAction',
);

//// play course api action ///

export const coursePlayRequestAction : any = createAction(
  'request/coursePlayRequestAction',
);
export const coursePlaySuccessAction : any = createAction(
  'coursePlaySuccessAction',
);
export const coursePlayFailAction : any = createAction(
  'coursePlayFailAction',
);


//// play scrom api action ///

export const scromPlayRequestAction : any = createAction(
  'request/scromPlayRequestAction',
);
export const scromPlaySuccessAction : any = createAction(
  'scromPlaySuccessAction',
);
export const scromPlayFailAction : any = createAction(
  'scromPlayFailAction',
);


//// materialprogress api action ///

export const materialProgressRequestAction : any = createAction(
  'request/materialProgressRequestAction',
);
export const materialProgressSuccessAction : any = createAction(
  'materialProgressSuccessAction',
);
export const materialProgressFailAction : any = createAction(
  'materialProgressFailAction',
);


//// update materialprogress api action /// 

export const updateMaterialRequestAction : any = createAction(
  'request/updateMaterialRequestAction',
);
export const updateMaterialSuccessAction : any = createAction(
  'updateMaterialSuccessAction',
);


//// exam user attempt api action ///

export const examAddUserAttemptRequestAction : any = createAction(
  'request/examAddUserAttemptRequestAction',
);
export const examAddUserAttemptSuccessAction : any = createAction(
  'examAddUserAttemptSuccessAction',
);
export const examAddUserAttemptFailAction : any = createAction(
  'examAddUserAttemptFailAction',
);


//// exam play api action ///

export const examPlayRequestAction : any = createAction(
  'request/examPlayRequestAction',
);
export const examPlaySuccessAction : any = createAction(
  'examPlaySuccessAction',
);
export const examPlayFailAction : any = createAction(
  'examPlayFailAction',
);


//// AddKCResponse api action ///

export const addKCResponseRequestAction : any = createAction(
  'request/addKCResponseRequestAction',
);
export const addKCResponseSuccessAction : any = createAction(
  'addKCResponseSuccessAction',
);
export const addKCResponseFailAction : any = createAction(
  'addKCResponseFailAction',
);

//// UpdateKCProgress api action ///

export const updateKCProgressRequestAction : any = createAction(
  'request/updateKCProgressRequestAction',
);
export const updateKCProgressSuccessAction : any = createAction(
  'updateKCProgressSuccessAction',
);
export const updateKCProgressFailAction : any = createAction(
  'updateKCProgressFailAction',
);


//// Exams start screen api action ///

export const startExamRequestAction : any = createAction(
  'request/startExamRequestAction',
);
export const startExamSuccessAction : any = createAction(
  'startExamSuccessAction',
);
export const startExamFailAction : any = createAction(
  'startExamFailAction',
);


//// AddExamResponse api action ///

export const addExamResponseRequestAction : any = createAction(
  'request/addExamResponseRequestAction',
);
export const addExamResponseSuccessAction : any = createAction(
  'addExamResponseSuccessAction',
);


//// Get Exam result api action ///

export const getExamResultRequestAction : any = createAction(
  'request/getExamResultRequestAction',
);
export const getExamResultSuccessAction : any = createAction(
  'getExamResultSuccessAction',
);
export const getExamResultFailAction : any = createAction(
  'getExamResultFailAction',
);

/// getUserGamificationPoints ///
export const getUserGamificationPointsRequestAction : any = createAction(
  'request/getUserGamificationPointsRequestAction',
);
export const getUserGamificationPointsSuccessAction : any = createAction(
  'getUserGamificationPointsSuccessAction',
);
export const getUserGamificationPointsFailAction : any = createAction(
  'getUserGamificationPointsFailAction',
);

/// getUserGamificationPoints ///
export const getUserGamificationPopUpAndTotalPointsRequestAction : any = createAction(
  'request/getUserGamificationPopUpAndTotalPointsRequestAction',
);
export const getUserGamificationPopUpAndTotalPointsSuccessAction : any = createAction(
  'getUserGamificationPopUpAndTotalPointsSuccessAction',
);
export const getUserGamificationPopUpAndTotalPointsFailAction : any = createAction(
  'getUserGamificationPopUpAndTotalPointsFailAction',
);


export const gamificationBooleanSuccessAction : any = createAction(
  'gamificationBooleanSuccessAction',
);
export const gamificationBooleanFailAction : any = createAction(
  'gamificationBooleanFailAction',
);


/// createEnrollmentRequest ///
export const createEnrollmentRequestAction : any = createAction(
  'request/createEnrollmentRequestAction',
);
export const createEnrollmentSuccessAction : any = createAction(
  'createEnrollmentSuccessAction',
);
export const createEnrollmentFailAction : any = createAction(
  'createEnrollmentFailAction',
);


export const AttestionQuestionRequestAction : any = createAction(
  'request/AttestionQuestionRequestAction',
);
export const AttestionQuestionSuccessAction : any = createAction(
  'AttestionQuestionSuccessAction',
);
export const AttestionQuestionFailAction : any = createAction(
  'AttestionQuestionFailAction',
);


export const SubmitAttestationRequestAction : any = createAction(
  'request/SubmitAttestationRequestAction',
);
export const SubmitAttestationSuccessAction : any = createAction(
  'SubmitAttestationSuccessAction',
);
export const SubmitAttestationFailAction : any = createAction(
  'SubmitAttestationFailAction',
);

/// getAssignment api action ///
export const GetAssignmentRequestAction : any = createAction(
  'request/GetAssignmentRequestAction',
);
export const GetAssignmentSuccessAction : any = createAction(
  'GetAssignmentSuccessAction',
);
export const GetAssignmentFailAction : any = createAction(
  'GetAssignmentFailAction',
);

/// getAssignment api action ///
export const GetTimeOnAssignmentDetailRequestAction : any = createAction(
  'request/GetTimeOnAssignmentDetailRequestAction',
);
export const GetTimeOnAssignmentDetailSuccessAction : any = createAction(
  'GetTimeOnAssignmentDetailSuccessAction',
);
export const GetTimeOnAssignmentDetailFailAction : any = createAction(
  'GetTimeOnAssignmentDetailFailAction',
);

/// getAssignment api action ///
export const AssignmentSubmissionRequestAction : any = createAction(
  'request/AssignmentSubmissionRequestAction',
);
export const AssignmentSubmissionSuccessAction : any = createAction(
  'AssignmentSubmissionSuccessAction',
);
export const AssignmentSubmissionFailAction : any = createAction(
  'AssignmentSubmissionFailAction',
);



