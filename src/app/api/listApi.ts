import {ListsType} from '../../assets/constants';
import {userApi} from './userApi';

export const listsApi = userApi.injectEndpoints({
  endpoints: builder => ({
    getLists: builder.query({
      query: () => 'list/categories',
      providesTags: ['Lists'],
      transformResponse: (response: any, meta, arg) => {
        return response.data as ListsType[];
      },
    }),
    addCategory: builder.mutation({
      query: category => ({
        url: 'list/category',
        method: 'POST',
        body: category,
        credentials: 'include',
      }),
      invalidatesTags: ['Lists'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
    addListTitle: builder.mutation({
      query: title => ({
        url: 'list/title',
        method: 'POST',
        body: title,
        credentials: 'include',
      }),
      invalidatesTags: ['Lists'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetListsQuery,
  useAddCategoryMutation,
  useAddListTitleMutation,
} = listsApi;