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
    [userApi.reducerPath]: userApi.reducer,
    reducer: rootReducer,

    // comments: commentsReducer,
    // users: usersReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
      immutableCheck: false,
    }).concat(userApi.middleware),
});
setupListeners(store.dispatch);
export let persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
