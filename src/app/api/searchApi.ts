import {ISearchResult} from '../../components/search/types';
import {apiSlice} from './baseApi';

export const searchApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    search: builder.query({
      query: params => ({
        url: 'search',
        params,
      }),
      providesTags: ['Search'],
      transformResponse: (response: any, meta, arg) => {
        return response.data as ISearchResult;
      },
    }),
  }),
});

export const {useSearchQuery} = searchApi;
