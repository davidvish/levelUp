import {createAction} from '@reduxjs/toolkit';

export const GetAssignedPathDetailsV2RequestAction : any = createAction(
  'request/GetAssignedPathDetailsV2RequestAction',
);
export const GetAssignedPathDetailsV2SuccessAction : any = createAction(
  'GetAssignedPathDetailsV2SuccessAction',
);
export const GetAssignedPathDetailsV2FailAction : any = createAction(
  'GetAssignedPathDetailsV2FailAction',
);


export const AddUpdateLearnersToSlotRequestAction : any = createAction(
  'request/AddUpdateLearnersToSlotRequestAction',
);
export const AddUpdateLearnersToSlotSuccessAction : any = createAction(
  'AddUpdateLearnersToSlotSuccessAction',
);

export const CondtionRequestAction : any = createAction(
  'request/CondtionRequestAction',
);
export const CondtionClearAction : any = createAction(
  'CondtionClearAction',
);

export const CondtionExamRequestAction : any = createAction(
  'request/CondtionExamRequestAction',
);
export const CondtionExamClearAction : any = createAction(
  'CondtionExamClearAction',
);