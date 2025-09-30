import {createAction} from '@reduxjs/toolkit';


export const getGamificationAllLeaderboardRequestAction : any = createAction(
  'request/getGamificationAllLeaderboardRequestAction',
);
export const getGamificationAllLeaderboardSuccessAction : any = createAction(
  'getGamificationAllLeaderboardSuccessAction',
);
export const getGamificationAllLeaderboardFailAction : any = createAction(
  'getGamificationAllLeaderboardFailAction',
);

export const getGamificationMonthLeaderboardRequestAction : any = createAction(
    'request/getGamificationMonthLeaderboardRequestAction',
  );
  export const getGamificationMonthLeaderboardSuccessAction : any = createAction(
    'getGamificationMonthLeaderboardSuccessAction',
  );
  export const getGamificationMonthLeaderboardFailAction : any = createAction(
    'getGamificationMonthLeaderboardFailAction',
  );