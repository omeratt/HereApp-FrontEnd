import {CategoryListType, ListType} from '../../assets/constants';
import {apiSlice} from './baseApi';

export const listsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getLists: builder.query({
      query: () => 'list/categories',
      providesTags: ['Lists'],
      transformResponse: (response: any, meta, arg) => {
        return response.data as CategoryListType[];
      },
    }),
    getPrioritizedLists: builder.query({
      query: () => 'list/prioritize',
      providesTags: ['PrioritizedLists'],
      transformResponse: (response: any, meta, arg) => {
        return response.data as ListType[];
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
    addListItem: builder.mutation({
      query: item => ({
        url: 'list/items',
        method: 'POST',
        body: item,
        credentials: 'include',
      }),
      invalidatesTags: ['Lists'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
    editListFlag: builder.mutation({
      query: item => ({
        url: 'list/flag',
        method: 'PUT',
        body: item,
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
  useGetPrioritizedListsQuery,
  useAddCategoryMutation,
  useAddListTitleMutation,
  useAddListItemMutation,
  useEditListFlagMutation,
} = listsApi;
