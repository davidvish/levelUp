import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
    getGamificationBadgesRequestAction,
    getGamificationBadgesSuccessAction,
    getGamificationBadgesFailAction,
    getGamificationAchivementRequestAction,
    getGamificationAchivementSuccessAction,
    getGamificationAchivementFailAction,
    getGamificationLevelsRequestAction,
    getGamificationLevelsSuccessAction,
    getGamificationLevelsFailAction
} from './action';

const initialState = {
  gamificationBadgesData:[],
  gamificationBadgesLoading:false,
  gamificationachivementData:[],
  gamificationachivementLoading:false,
  gamificationLevelsData:[],
  gamificationLevelsLoading:false,
};
const achivementReducer = createReducer(initialState, builder => {
  builder.addCase(getGamificationBadgesRequestAction, (state, action) => {
    return {
      ...state,
      gamificationBadgesLoading: true,
    };
  });
  builder.addCase(getGamificationBadgesSuccessAction, (state, action) => {
    return {
      ...state,
      gamificationBadgesData: action.payload,
      gamificationBadgesLoading: false,
    };
  });

  builder.addCase(getGamificationBadgesFailAction, (state, action) => {
    return {
      ...state,
      gamificationBadgesData: [],
      gamificationBadgesLoading: false,
    };
  });

  builder.addCase(getGamificationAchivementRequestAction, (state, action) => {
    return {
      ...state,
      gamificationachivementLoading: true,
    };
  });
  builder.addCase(getGamificationAchivementSuccessAction, (state, action) => {
    return {
      ...state,
      gamificationachivementData: action.payload,
      gamificationachivementLoading: false,
    };
  });

  builder.addCase(getGamificationAchivementFailAction, (state, action) => {
    return {
      ...state,
      gamificationachivementData: [],
      gamificationachivementLoading: false,
    };
  });

  builder.addCase(getGamificationLevelsRequestAction, (state, action) => {
    return {
      ...state,
      gamificationLevelsLoading: true,
    };
  });
  builder.addCase(getGamificationLevelsSuccessAction, (state, action) => {
    return {
      ...state,
      gamificationLevelsData: action.payload,
      gamificationLevelsLoading: false,
    };
  });

  builder.addCase(getGamificationLevelsFailAction, (state, action) => {
    return {
      ...state,
      gamificationLevelsData: [],
      gamificationLevelsLoading: false,
    };
  });
});
export default achivementReducer;

export const achivementSelector = () => {
  const {gamificationLevelsData, gamificationLevelsLoading, gamificationachivementData, gamificationachivementLoading, gamificationBadgesData, gamificationBadgesLoading} =
    useSelector((state : any) => state.achivementReducer);
  return {gamificationLevelsData, gamificationLevelsLoading, gamificationachivementData, gamificationachivementLoading, gamificationBadgesData, gamificationBadgesLoading};
};
