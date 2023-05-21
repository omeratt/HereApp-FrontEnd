import {apiSlice} from './baseApi';

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTasks: builder.query({
      query: () => 'tasks',
      // providesTags: ['Tasks'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
    getTasksByDate: builder.query({
      query: (date: Date) => {
        return {
          url: 'tasks/date',
          method: 'POST',
          body: {date},
        };
      },
      providesTags: ['TasksByDate'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
    getNextTasksByDate: builder.query({
      query: (date: Date) => {
        return {
          url: 'tasks/nextTask',
          method: 'POST',
          body: {date},
        };
      },
      // providesTags: ['TasksByDate'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
    deleteTask: builder.mutation({
      query: id => ({
        url: `task/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['TasksByDate'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
    addTask: builder.mutation({
      query: task => ({
        url: 'task',
        method: 'POST',
        body: task,
        credentials: 'include',
      }),
      invalidatesTags: ['TasksByDate'],
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTasksByDateQuery,
  useGetNextTasksByDateQuery,
} = tasksApi;
