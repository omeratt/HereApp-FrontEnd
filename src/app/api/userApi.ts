import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import constants from '../../assets/constants';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({baseUrl: constants.baseUrl}),
  endpoints: builder => ({
    getUser: builder.query({
      query: () => 'user',

      //   providesTags
    }),
    // setUser: builder.mutation({
    //     query: () => ({

    //     }),

    //     //   providesTags
    //   }),
  }),
});
export const {useGetUserQuery} = userApi;
