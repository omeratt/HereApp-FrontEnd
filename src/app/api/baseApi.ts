import {QueryReturnValue} from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import constants from '../../assets/constants';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {logout} from '../Reducers/User/userSlice';
import CookieManager from '@react-native-cookies/cookies';
import {tasksApi} from './taskApi';
import {listsApi} from './listApi';

const baseQuery = fetchBaseQuery({
  baseUrl: constants.BASE_URL,
  credentials: 'include',
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  const urlStr = args.url ? args.url : args;
  const status = result.meta?.response?.status;
  const method = result.meta?.request.method;
  if (status === 200) {
    const message = formatSuccess(
      result.meta?.response?.status,
      urlStr,
      method!,
    );
    console.log(message);
    // if (urlStr === 'tasks/date') console.log(result.data);
  }
  if (status === 401) {
    console.log(formatError(result?.error, urlStr, 31, method!));
    api.dispatch(logout());
    await CookieManager.clearAll();
    api.dispatch(tasksApi.util.resetApiState());
    api.dispatch(listsApi.util.resetApiState());
  }
  if (status === 400) {
    console.log(formatError(result?.error, urlStr, 31, method!));
  }
  // if (result.data?.refresh) {
  // const {accessToken, refreshToken, status} = result.data.refresh;
  const responseCookies = result.meta?.response?.headers.get('Set-Cookie');
  // console.log(responseCookies);
  if (!responseCookies) return result;
  const [firstPart, secondPart] = responseCookies.split('HttpOnly,');

  if (!firstPart || !secondPart) return result;
  const accessPart = firstPart
    .split(';')
    .map(token => token.replace('HttpOnly', '').trim());
  const refreshPart = secondPart
    .split(';')
    .map(cookie => cookie.replace('HttpOnly', '').trim());

  const accessToken: {[key: string]: string} = {};
  const refreshToken: {[key: string]: string} = {};
  for (const part of accessPart) {
    const [key, value] = part.trim().split('=');
    accessToken[key] = value;
  }
  for (const part of refreshPart) {
    const [key, value] = part.trim().split('=');
    refreshToken[key] = value;
  }
  await CookieManager.set(constants.BASE_URL, {
    name: 'accessToken',
    value: accessToken['accessToken'],
    // domain: constants.BASE_URL,
    expires: accessToken['Expires'],
    httpOnly: true,
  }).then(success => {
    console.log('CookieManager accessToken Set =>', success);
  });
  await CookieManager.set(constants.BASE_URL, {
    name: 'refreshToken',
    value: refreshToken['refreshToken'],
    // domain: constants.BASE_URL,
    expires: refreshToken['Expires'],
    httpOnly: true,
  })
    .then(success => {
      console.log('CookieManager refreshToken Set =>', success);
    })
    .catch(r => console.log(r));
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  reducerPath: 'apiSlice',

  tagTypes: ['Users', 'Tasks', 'TasksByDate', 'Lists', 'PrioritizedLists'],
  endpoints: builder => ({}),
});

function formatError(
  err: any,
  urlStr: any,
  color: number = 31,
  method: string,
) {
  const message = `\nerror with message: \u001b[${color}m${err.data?.message}\u001b[0m`;
  const status = `\nstatus: \u001b[${color}m${err?.status}\u001b[0m`;
  const methodStr = `\u001b[${91}m${method}\u001b[0m`;
  const url = `\nfrom url: ${methodStr} \u001b[${color}m${urlStr}\u001b[0m`;
  return message + status + url;
}
function formatSuccess(
  statusCode: any,
  urlStr: any,
  method: string,
  color: number = 32,
) {
  const status = `{status: \u001b[${color}m${statusCode}\u001b[0m, `;
  const methodStr = `\u001b[${91}m${method}\u001b[0m`;
  const url = `from url: ${methodStr} \u001b[${color}m${urlStr}\u001b[0m}`;
  return status + url;
}
