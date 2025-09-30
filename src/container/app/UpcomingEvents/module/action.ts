import {createAction} from '@reduxjs/toolkit';

export const upcomingEventDetailsRequestAction : any = createAction(
  'request/upcomingEventDetailsRequestAction',
);
export const upcomingEventDetailsSuccessAction : any = createAction(
  'upcomingEventDetailsSuccessAction',
);
export const upcomingEventDetailsFailAction : any = createAction(
  'upcomingEventDetailsFailAction',
);