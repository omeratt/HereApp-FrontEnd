import {login, logout} from '../Reducers/User/userSlice';
import {store} from '../store';
import CookieManager from '@react-native-cookies/cookies';
import {tasksApi} from './taskApi';
import {apiSlice} from './baseApi';
import {listsApi} from './listApi';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
export const userApi = apiSlice.injectEndpoints({
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
        return response.data;
      },
      invalidatesTags: [
        // 'TasksByDate',
        // 'Lists',
      ],
      // providesTags:['Users']
    }),
    loginWithGoogle: builder.mutation({
      query: () => ({
        url: 'google-login',
        credentials: 'include',
        method: 'post',
      }),
      transformResponse: async (response: any, meta, arg) => {
        store?.dispatch(
          login({...response.data, isSignIn: response?.data.signIn}),
        );
        return response.data;
      },
    }),
    setFcmToken: builder.mutation({
      query: token => ({
        url: 'user/fcmToken',
        body: {token},
        credentials: 'include',
        method: 'post',
      }),
      transformResponse: async (response: any, meta, arg) => {
        return response.data;
      },
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
      transformResponse: async (response: any, meta, arg) => {
        store?.dispatch(logout());
        await CookieManager.clearAll();
        store?.dispatch(tasksApi.util.resetApiState());
        store?.dispatch(listsApi.util.resetApiState());

        return response.data;
      },
      transformErrorResponse: async (response: any, meta, arg) => {
        store?.dispatch(logout());
        await CookieManager.clearAll();
        store?.dispatch(tasksApi.util.resetApiState());
        store?.dispatch(listsApi.util.resetApiState());
        if (auth()?.currentUser) await auth().signOut();
        if (await GoogleSignin.isSignedIn()) await GoogleSignin.signOut();
        return response;
      },
      invalidatesTags: ['Users'],
    }),
  }),
});
export const {
  useSignupMutation,
  useLoginMutation,
  useLoginWithGoogleMutation,
  useMyProfileQuery,
  useLogoutMutation,
  useSetFcmTokenMutation,
} = userApi;
