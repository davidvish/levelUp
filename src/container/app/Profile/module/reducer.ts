import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
    profileNameRequestAction,
    profilePasswordRequestAction
} from './action';

const initialState : any = {
  isAccountLoading: false,
};
const accountReducer = createReducer(initialState, builder => {
  builder.addCase(profileNameRequestAction, (state, action) => {
    return {
      ...state,
      isAccountLoading: false,
    };
  });

  builder.addCase(profilePasswordRequestAction, (state, action) => {
    return {
      ...state,
      isAccountLoading: false,
    };
  });
 
});
export default accountReducer;

export const accountSelector = () => {
  const {isAccountLoading} =
    useSelector((state : any) => state.accountReducer);
  return {isAccountLoading};
};
