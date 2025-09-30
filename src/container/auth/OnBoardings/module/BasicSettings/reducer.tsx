import {createReducer} from '@reduxjs/toolkit';
import {useSelector} from 'react-redux';
import {
  fontSizeChangeSuccess
} from './action';

const initialState = {
  fontSize: 0
};
const basicSettingsReducer = createReducer(initialState, builder => {
  builder.addCase(fontSizeChangeSuccess, (state, action) => {
    return {
      ...state,
      fontSize: action.payload
    };
  });
});
export default basicSettingsReducer;

export const basicSettingsSelector = () => {
  const {fontSize} =
    useSelector((state : any) => state.basicSettingsReducer);
  // const currency = basicSettingsData?.currency?.sign || "$";

  return {
    fontSize
  };
};
