import {CategoryListType, ListType} from '../../assets/constants';
import {apiSlice} from './baseApi';

export const listsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMessages: builder.query({
      query: () => 'messages',
      providesTags: ['Messages'],
      transformResponse: (response: any, meta, arg) => {
        return response.data as IMessageValues[];
      },
    }),
    addOrEditMessage: builder.mutation({
      query: message => ({
        url: 'message',
        method: 'POST',
        body: message,
        credentials: 'include',
      }),
      invalidatesTags: ['Messages'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
    deleteMessages: builder.mutation({
      query: ids => ({
        url: 'messages',
        method: 'DELETE',
        body: {ids},
        credentials: 'include',
      }),
      invalidatesTags: ['Messages'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useAddOrEditMessageMutation,
  useDeleteMessagesMutation,
} = listsApi;
