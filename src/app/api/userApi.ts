import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import constants from '../../assets/constants';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({baseUrl: 'localhost:3000/signup'}),
  tagTypes: ['user'],
  endpoints: builder => ({
    signup: builder.mutation(
      {
        query: (user: any) => ({
          url: '/',
          //   body: JSON.stringify(user),
          //   credentials: 'include',
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
        }),
        transformResponse: (response: any, meta, arg) => response.data,
      },

      //   providesTags: () => 'user',
    ),
    // setUser: builder.mutation({
    //     query: () => ({

    //     }),

    //     //   providesTags
    //   }),
  }),
});
export const {useSignupMutation} = userApi;

// import constants from '../../assets/constants';
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// // import { logOut} from '../../features/auth/authSlice';

// const baseQuery = fetchBaseQuery({
//   baseUrl: constants.baseUrl,
//   credentials: 'include',
// });

// const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result?.error?.status === 403) {
//     console.log('sending refresh token');
//     // send refresh token to get new access token
//     const refreshResult = await baseQuery('/refresh', api, extraOptions);
//     console.log(refreshResult);
//     // if (refreshResult?.data) {
//     //   const user = api.getState().auth.user;
//     //   // store the new token
//     //   api.dispatch(setCredentials({...refreshResult.data, user}));
//     //   // retry the original query with new access token
//     //   result = await baseQuery(args, api, extraOptions);
//     // } else {
//     //   api.dispatch(logOut());
//     // }
//   }

//   return result;
// };

// export const apiSlice = createApi({
//   baseQuery: baseQueryWithReAuth,
//   endpoints: builder => ({}),
// });
