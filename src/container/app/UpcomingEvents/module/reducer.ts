import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
  upcomingEventDetailsRequestAction,
  upcomingEventDetailsSuccessAction,
  upcomingEventDetailsFailAction
} from './action';

const initialState : any = {
  upcomingEventDetailsLoading: false,
  upcomingEventDetailsData: []
};
const upcomingEventDetailsReducer = createReducer(initialState, builder => {
  builder.addCase(upcomingEventDetailsRequestAction, (state, action) => {
    return {
      ...state,
      upcomingEventDetailsLoading: true,
    };
  });

  builder.addCase(upcomingEventDetailsSuccessAction, (state, action) => {
    return {
      ...state,
      upcomingEventDetailsData: action.payload,
      upcomingEventDetailsLoading: false
    };
  });

  builder.addCase(upcomingEventDetailsFailAction, (state, action) => {
    return {
      ...state,
      upcomingEventDetailsData: [],
      upcomingEventDetailsLoading: false,
    };
  });
 
});
export default upcomingEventDetailsReducer;

export const upcomingEventDetailsSelector = () => {
  const {upcomingEventDetailsData, upcomingEventDetailsLoading} =
    useSelector((state : any) => state.upcomingEventDetailsReducer);
  return {upcomingEventDetailsData, upcomingEventDetailsLoading};
};
