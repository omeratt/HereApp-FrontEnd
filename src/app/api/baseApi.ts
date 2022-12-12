import constants from '../../assets/constants';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import { logOut} from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: constants.BASE_URL,
  credentials: 'include',
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log('sending refresh token');
    // send refresh token to get new access token
    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    console.log(refreshResult);
    // if (refreshResult?.data) {
    //   const user = api.getState().auth.user;
    //   // store the new token
    //   api.dispatch(setCredentials({...refreshResult.data, user}));
    //   // retry the original query with new access token
    //   result = await baseQuery(args, api, extraOptions);
    // } else {
    //   api.dispatch(logOut());
    // }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: builder => ({}),
});
