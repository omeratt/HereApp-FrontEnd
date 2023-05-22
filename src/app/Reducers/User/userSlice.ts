import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

// Define a type for the slice state
export interface UserState {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  isSignIn?: boolean;
  img?: string;
  tasks?: TaskType[];
  token?: string;
}
export interface TaskType {
  _id?: string;
  name?: string;
  done?: boolean;
  details?: string;
  push?: boolean;
  targetDate?: string;
  isSetTime?: boolean;
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
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // increment: state => {
    //   state.value += 1;
    // },
    // decrement: state => {
    //   state.value -= 1;
    // },
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUser: (state, action: PayloadAction<UserState>) => {
      state = {...state, ...action.payload};
      return state;
    },
    login: (state, action: PayloadAction<UserState>) => {
      state = {...state, ...action.payload};
      return state;
    },
    logout: state => {
      state = {...initialState};
      return state;
    },
  },
});

export const {setUser, login, logout} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.reducer.user;
export const selectUserToken = (state: RootState) => state.reducer.user.token;
export const selectIsSignIn = (state: RootState) => state.reducer.user.isSignIn;

export default userSlice.reducer;
