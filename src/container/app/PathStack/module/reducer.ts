import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
    GetAssignedPathDetailsV2RequestAction,
    GetAssignedPathDetailsV2SuccessAction,
    GetAssignedPathDetailsV2FailAction,
    AddUpdateLearnersToSlotRequestAction,
    AddUpdateLearnersToSlotSuccessAction,
    CondtionRequestAction,
    CondtionClearAction,
    CondtionExamRequestAction,
    CondtionExamClearAction
} from './action';

const initialState : any = {
    GetAssignedPathLoading: false,
    GetAssignedPathData: [],
    AddUpdateLearnersToSlotData: [],
    AddUpdateLearnersToSlotLoading : false,
    condtionCourseString : "",
    condtionExamString : "",
};
const pathReducer = createReducer(initialState, builder => {
  builder.addCase(GetAssignedPathDetailsV2RequestAction, (state, action) => {
    return {
      ...state,
      GetAssignedPathLoading: true,
    };
  });

  builder.addCase(GetAssignedPathDetailsV2SuccessAction, (state, action) => {
    return {
      ...state,
      GetAssignedPathData: action.payload,
      GetAssignedPathLoading: false
    };
  });

  builder.addCase(GetAssignedPathDetailsV2FailAction, (state, action) => {
    return {
      ...state,
      GetAssignedPathData: [],
      GetAssignedPathLoading: false,
    };
  });

  builder.addCase(AddUpdateLearnersToSlotRequestAction, (state, action) => {
    return {
      ...state,
      AddUpdateLearnersToSlotLoading: true,
    };
  });

  builder.addCase(AddUpdateLearnersToSlotSuccessAction, (state, action) => {
    return {
      ...state,
      AddUpdateLearnersToSlotData: action.payload,
      AddUpdateLearnersToSlotLoading: false
    };
  });

  builder.addCase(CondtionRequestAction, (state, action) => {
    return {
      ...state,
      condtionCourseString : action.payload,
    };
  });

  builder.addCase(CondtionClearAction, (state, action) => {
    return {
      ...state,
      condtionCourseString : "",
    };
  });

  builder.addCase(CondtionExamRequestAction, (state, action) => {
    return {
      ...state,
      condtionExamString : action.payload,
    };
  });

  builder.addCase(CondtionExamClearAction, (state, action) => {
    return {
      ...state,
      condtionExamString : "",
    };
  });
 
});
export default pathReducer;

export const pathSelector = () => {
  const {condtionExamString, condtionCourseString, GetAssignedPathLoading, GetAssignedPathData, AddUpdateLearnersToSlotLoading, AddUpdateLearnersToSlotData} =
    useSelector((state : any) => state.pathReducer);
  return {condtionExamString, condtionCourseString, GetAssignedPathLoading, GetAssignedPathData, AddUpdateLearnersToSlotLoading, AddUpdateLearnersToSlotData};
};
