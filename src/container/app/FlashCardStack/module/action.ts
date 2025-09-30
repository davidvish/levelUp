import {createAction} from '@reduxjs/toolkit';

export const flashcardPreviewDetailsRequestAction : any = createAction(
  'request/flashcardPreviewDetailsRequestAction',
);
export const flashcardPreviewDetailsSuccessAction : any = createAction(
  'flashcardPreviewDetailsSuccessAction',
);
export const flashcardPreviewDetailsFailAction : any = createAction(
  'flashcardPreviewDetailsFailAction',
);


//// play study api action ///

export const studyPlayRequestAction : any = createAction(
  'request/studyPlayRequestAction',
);
export const studyPlaySuccessAction : any = createAction(
  'studyPlaySuccessAction',
);

//// study list api action ///

export const studyListRequestAction : any = createAction(
  'request/studyListRequestAction',
);
export const studyListSuccessAction : any = createAction(
  'studyListSuccessAction',
);
export const studyListFailAction : any = createAction(
  'studyListFailAction',
);


//// AddUserAttemp api action ///

export const AddUserAttempRequestAction : any = createAction(
  'request/AddUserAttempRequestAction',
);
export const AddUserAttempSuccessAction : any = createAction(
  'AddUserAttempSuccessAction',
);

export const AddUserAttempFailAction : any = createAction(
  'AddUserAttempFailAction',
);

//// study list api action ///

export const practiceListRequestAction : any = createAction(
  'request/practiceListRequestAction',
);
export const practiceListSuccessAction : any = createAction(
  'practiceListSuccessAction',
);
export const practiceListFailAction : any = createAction(
  'practiceListFailAction',
);


//// Add user ans ///

export const addUserAnsRequestAction : any = createAction(
  'request/addUserAnsRequestAction',
);
export const addUserAnsSuccessAction : any = createAction(
  'addUserAnsSuccessAction',
);
export const addUserAnsFailAction : any = createAction(
  'addUserAnsFailAction',
);

//// UpdateProgress ///

export const updateProgressRequestAction : any = createAction(
  'request/updateProgressRequestAction',
);
export const updateProgressSuccessAction : any = createAction(
  'updateProgressSuccessAction',
);


//// Revisite letter ///

export const revisitRequestAction : any = createAction(
  'request/revisitRequestAction',
);
export const revisitSuccessAction : any = createAction(
  'revisitSuccessAction',
);


//// Get revisite data ///

export const getRevisitRequestAction : any = createAction(
  'request/getRevisitRequestAction',
);
export const getRevisitSuccessAction : any = createAction(
  'getRevisitSuccessAction',
);
export const getRevisitFailAction : any = createAction(
  'getRevisitFailAction',
);


//// Play incorect data ///

export const playIncorrectRequestAction : any = createAction(
  'request/playIncorrectRequestAction',
);
export const playIncorrectSuccessAction : any = createAction(
  'playIncorrectSuccessAction',
);
export const playIncorrectFailAction : any = createAction(
  'playIncorrectFailAction',
);

//// Practice result ///

export const practiceReportRequestAction : any = createAction(
  'request/practiceReportRequestAction',
);
export const practiceReportSuccessAction : any = createAction(
  'practiceReportSuccessAction',
);
export const practiceReportFailAction : any = createAction(
  'practiceReportFailAction',
);