import {createAction} from '@reduxjs/toolkit';


//// gamification Badges information /////
export const getGamificationBadgesRequestAction : any = createAction(
  'request/getGamificationBadgesRequestAction',
);
export const getGamificationBadgesSuccessAction : any = createAction(
  'getGamificationBadgesSuccessAction',
);
export const getGamificationBadgesFailAction : any = createAction(
  'getGamificationBadgesFailAction',
);

//// get my achivement information /////
export const getGamificationAchivementRequestAction : any = createAction(
  'request/getGamificationAchivementRequestAction',
);
export const getGamificationAchivementSuccessAction : any = createAction(
  'getGamificationAchivementSuccessAction',
);
export const getGamificationAchivementFailAction : any = createAction(
  'getGamificationAchivementFailAction',
);

//// gamification Levels information /////
export const getGamificationLevelsRequestAction : any = createAction(
  'request/getGamificationLevelsRequestAction',
);
export const getGamificationLevelsSuccessAction : any = createAction(
  'getGamificationLevelsSuccessAction',
);
export const getGamificationLevelsFailAction : any = createAction(
  'getGamificationLevelsFailAction',
);