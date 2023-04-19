import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {
  PersistConfig,
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import userSlice from './Reducers/User/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userApi} from './api/userApi';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import {apiSlice} from './api/baseApi';
import {tasksApi} from './api/taskApi';
import {listsApi} from './api/listApi';
// ...

const persistConfig = {
  key: 'userReducer',
  storage: AsyncStorage,
  //   whiteList: ['name'],
  //   version: 1,
};

const userReducer = persistReducer(persistConfig, userSlice);
const rootReducer = combineReducers({user: userReducer});
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    reducer: rootReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware),
});
setupListeners(store.dispatch);
export let persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
