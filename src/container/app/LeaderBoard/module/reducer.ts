import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
    getGamificationAllLeaderboardRequestAction,
    getGamificationAllLeaderboardSuccessAction,
    getGamificationAllLeaderboardFailAction,
    getGamificationMonthLeaderboardRequestAction,
    getGamificationMonthLeaderboardSuccessAction,
    getGamificationMonthLeaderboardFailAction
} from './action';

const initialState = {
  gamificationAllLeaderboardData:[],
  gamificationAllLeaderboardLoading:false,
  gamificationMonthLeaderboardData:[],
  gamificationMonthLeaderboardLoading:false
};
const leaderboardReducer = createReducer(initialState, builder => {
  builder.addCase(getGamificationAllLeaderboardRequestAction, (state, action) => {
    return {
      ...state,
      gamificationAllLeaderboardLoading: true,
    };
  });
  builder.addCase(getGamificationAllLeaderboardSuccessAction, (state, action) => {
    return {
      ...state,
      gamificationAllLeaderboardData: action.payload,
      gamificationAllLeaderboardLoading: false,
    };
  });

  builder.addCase(getGamificationAllLeaderboardFailAction, (state, action) => {
    return {
      ...state,
      gamificationAllLeaderboardData: [],
      gamificationAllLeaderboardLoading: false,
    };
  });

  builder.addCase(getGamificationMonthLeaderboardRequestAction, (state, action) => {
    return {
      ...state,
      gamificationMonthLeaderboardLoading: true,
    };
  });
  builder.addCase(getGamificationMonthLeaderboardSuccessAction, (state, action) => {
    return {
      ...state,
      gamificationMonthLeaderboardData: action.payload,
      gamificationMonthLeaderboardLoading: false,
    };
  });

  builder.addCase(getGamificationMonthLeaderboardFailAction, (state, action) => {
    return {
      ...state,
      gamificationMonthLeaderboardData: [],
      gamificationMonthLeaderboardLoading: false,
    };
  });
});
export default leaderboardReducer;

export const leaderboardSelector = () => {
  const {gamificationMonthLeaderboardData, gamificationMonthLeaderboardLoading, gamificationAllLeaderboardLoading, gamificationAllLeaderboardData} =
    useSelector((state : any) => state.leaderboardReducer);
  return {gamificationMonthLeaderboardData, gamificationMonthLeaderboardLoading, gamificationAllLeaderboardLoading, gamificationAllLeaderboardData};
};
