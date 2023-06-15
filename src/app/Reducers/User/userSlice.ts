import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {CategoryListType} from '../../../assets/constants';

// Define a type for the slice state
export interface UserState {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  isSignIn?: boolean;
  img?: string;
  tasks?: TaskType[];
  categoriesList: CategoryListType[];
  token?: string;
  fcmToken?: string;
  isNewUser?: boolean;
}
export interface TaskType {
  _id?: string;
  name?: string;
  done?: boolean;
  details?: string;
  push?: boolean;
  targetDate?: string;
  isSetTime?: boolean;
  note?: string;
}

// Define the initial state using that type
const initialState: UserState = {
  _id: '',
  name: 'New User',
  email: '',
  password: '',
  img: undefined,
  isSignIn: false,
  token: '',
  fcmToken: '',
  categoriesList: [],
  isNewUser: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state = {...state, ...action.payload};
      return state;
    },
    login: (state, action: PayloadAction<any>) => {
      state = {...state, ...action.payload, ...action.payload.user};
      return state;
    },
    logout: state => {
      state = {...initialState};
      return state;
    },
    setCategoriesList: (state, action: PayloadAction<CategoryListType[]>) => {
      state = {...state, categoriesList: [...action.payload]};
      return state;
    },
    setFcm: (state, action: PayloadAction<string>) => {
      state = {...state, fcmToken: action.payload};
      return state;
    },
    setNewUser: (state, action: PayloadAction<boolean>) => {
      state = {...state, isNewUser: action.payload};
      return state;
    },
  },
});

export const {setUser, login, logout, setCategoriesList, setFcm, setNewUser} =
  userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.reducer.user;
export const selectUserToken = (state: RootState) => state.reducer.user.token;
export const selectUserFcmToken = (state: RootState) =>
  state.reducer.user.fcmToken;
export const selectIsSignIn = (state: RootState) => state.reducer.user.isSignIn;
export const selectIsNewUser = (state: RootState) =>
  state.reducer.user.isNewUser;
export const selectCategoriesList = (state: RootState) =>
  state.reducer.user.categoriesList;

export default userSlice.reducer;
