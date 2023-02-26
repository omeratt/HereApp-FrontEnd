import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import constants from '../../assets/constants';
import {login, logout} from '../Reducers/User/userSlice';
import {store} from '../store';
import CookieManager from '@react-native-cookies/cookies';
import {tasksApi} from './taskApi';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({baseUrl: constants.BASE_URL}),

  tagTypes: ['Users', 'Tasks', 'TasksByDate'],
  endpoints: builder => ({
    home: builder.query({
      query: () => '/',
    }),
    signup: builder.mutation(
      {
        query: user => ({
          url: 'signup',
          body: user,
          credentials: 'include',
          method: 'post',
        }),
        transformResponse: (response: any, meta, arg) => {
          return response.data;
        },
        // invalidatesTags: ['Users'],
        // providesTags:['Users']
      },

      //   providesTags: () => 'user',
    ),
    login: builder.mutation({
      query: user => ({
        url: 'login',
        body: user,
        credentials: 'include',
        method: 'post',
      }),
      transformResponse: async (response: any, meta, arg) => {
        store?.dispatch(
          login({...response.data, isSignIn: response?.data.signIn}),
        );
        // console.log(response, meta, arg);
        // console.log(meta);
        // console.log(arg);
        const {accessToken, refreshToken} = response.data;
        await CookieManager.set(
          constants.BASE_URL,
          {
            name: 'accessToken',
            value: accessToken,
            httpOnly: true,
          },
          true,
        );

        await CookieManager.set(
          constants.BASE_URL,
          {
            name: 'refreshToken',
            value: refreshToken,
            httpOnly: true,
          },
          true,
        );
        return response.data;
      },
      invalidatesTags: ['Users'],
      // providesTags:['Users']
    }),
    myProfile: builder.query({
      query: () => ({
        url: 'user/myProfile',
      }),
      transformResponse: (response: any) => {
        //   store?.dispatch(login(response.data));
        return response.data;
      },
      transformErrorResponse: (response: any) => {
        return response.data;
      },
      providesTags: ['Users'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'logout',
        credentials: 'include',
        method: 'post',
      }),
      transformResponse: (response: any, meta, arg) => {
        store?.dispatch(logout());
        CookieManager.clearAll();
        store?.dispatch(tasksApi.util.resetApiState());
        return response.data;
      },
      transformErrorResponse: (response: any, meta, arg) => {
        store?.dispatch(logout());
        CookieManager.clearAll();
        store?.dispatch(tasksApi.util.resetApiState());
        return response;
      },
      invalidatesTags: ['Users'],
    }),
  }),
});
export const {
  useSignupMutation,
  useLoginMutation,
  useMyProfileQuery,
  useLogoutMutation,
} = userApi;
