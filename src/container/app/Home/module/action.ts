import {createAction} from '@reduxjs/toolkit';

export const upcomingEventsRequestAction : any = createAction(
  'request/upcomingEventsRequestAction',
);
export const upcomingEventsSuccessAction : any = createAction(
  'upcomingEventsSuccessAction',
);
export const upcomingEventsFailAction : any = createAction(
  'upcomingEventsFailAction',
);


//// countinue learning/////
export const countinueLearningRequestAction : any = createAction(
  'request/countinueLearningRequestAction',
);
export const countinueLearningSuccessAction : any = createAction(
  'countinueLearningSuccessAction',
);
export const countinueLearningFailAction : any = createAction(
  'countinueLearningFailAction',
);


//// GetUserEntities /////
export const getUserEntitiesRequestAction : any = createAction(
  'request/getUserEntitiesRequestAction',
);
export const getUserEntitiesCourseSuccessAction : any = createAction(
  'getUserEntitiesCourseSuccessAction',
);
export const getUserEntitiesFlashCardSuccessAction : any = createAction(
  'getUserEntitiesFlashCardSuccessAction',
);
export const getUserEntitiesPathSuccessAction : any = createAction(
  'getUserEntitiesPathSuccessAction',
);
export const getUserEntitiesFailAction : any = createAction(
  'getUserEntitiesFailAction',
);


//// Bar Chart /////
export const barChartRequestAction : any = createAction(
  'request/barChartRequestAction',
);
export const barChartSuccessAction : any = createAction(
  'barChartSuccessAction',
);
export const barChartFailAction : any = createAction(
  'barChartFailAction',
);


//// Pie Chart /////
export const pieChartRequestAction : any = createAction(
  'request/pieChartRequestAction',
);
export const pieChartSuccessAction : any = createAction(
  'pieChartSuccessAction',
);
export const pieChartFailAction : any = createAction(
  'pieChartFailAction',
);


//// profile information /////
export const getProfileRequestAction : any = createAction(
  'request/getProfileRequestAction',
);
export const getProfileSuccessAction : any = createAction(
  'getProfileSuccessAction',
);
export const getProfileFailAction : any = createAction(
  'getProfileFailAction',
);


//// Watch history delete /////
export const watchHistoryDeleteRequestAction : any = createAction(
  'request/watchHistoryDeleteRequestAction',
);
export const watchHistoryDeleteSuccessAction : any = createAction(
  'watchHistoryDeleteSuccessAction',
);

//// store course item data onnavigation ////

export const storeCourseItemDataOnNavigationAction : any = createAction(
  'storeCourseItemDataOnNavigationAction',
);

export const storeCourseItemDataOnNavigationClear : any = createAction(
  'storeCourseItemDataOnNavigationClear',
);

//// store course item data onnavigation ////

export const storePathItemDataOnNavigationAction : any = createAction(
  'storePathItemDataOnNavigationAction',
);

export const storePathItemDataOnNavigationClear : any = createAction(
  'storePathItemDataOnNavigationClear',
);

//// gamification point information /////
export const getGamificationPointRequestAction : any = createAction(
  'request/getGamificationPointRequestAction',
);
export const getGamificationPointSuccessAction : any = createAction(
  'getGamificationPointSuccessAction',
);
export const getGamificationPointFailAction : any = createAction(
  'getGamificationPointFailAction',
);

//// gamification point information /////
export const getSettingsRequestAction : any = createAction(
  'request/getSettingsRequestAction',
);
export const getSettingsSuccessAction : any = createAction(
  'getSettingsSuccessAction',
);
export const getSettingsFailAction : any = createAction(
  'getSettingsFailAction',
);


export const refreshTokenRequestAction: any = createAction('request/refreshTokenRequestAction');
export const refreshTokenSuccessAction: any = createAction('refreshTokenSuccessAction');


export const getTokenExpireResponseSuccessAction : any = createAction(
  'getTokenExpireResponseSuccessAction',
);
export const getTokenExpireResponseFailAction : any = createAction(
  'getTokenExpireResponseFailAction',
);