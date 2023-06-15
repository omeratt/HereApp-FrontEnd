import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {CategoryListType} from '../../../assets/constants';

export interface ScreensState {
  home?: boolean;
  lists?: boolean;
  tasks?: boolean;
  playGround?: boolean;
  chat?: boolean;
  timeTips?: boolean;
  stupid?: boolean;
  settings?: boolean;
  widgets?: boolean;
  privacy?: boolean;
  termOfUse?: boolean;
}
// Define the initial state using that type
const initialState: ScreensState = {
  home: false,
  lists: false,
  tasks: false,
  playGround: false,
  chat: false,
  timeTips: false,
  stupid: false,
  settings: false,
  widgets: false,
  privacy: false,
  termOfUse: false,
};

export const screensSlice = createSlice({
  name: 'screens',
  initialState,
  reducers: {
    setFocus: (state, action: PayloadAction<ScreensState>) => {
      state = {...initialState, ...action.payload};
      return state;
    },
  },
});

export const {setFocus} = screensSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const screenSelector = (state: RootState) => state.reducer.screens;

export default screensSlice.reducer;
