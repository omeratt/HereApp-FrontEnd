import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {userApi} from '../../app/api/userApi';
import {store} from '../../app/store';
import {setFcm} from '../../app/Reducers/User/userSlice';

const useFcmTokenRefresh = () => {
  const isSignIn = store.getState().reducer.user.isSignIn;

  const listenToFCMTokenRefresh = () => {
    messaging().onTokenRefresh(async newToken => {
      const oldToken = store.getState().reducer.user.fcmToken;
      await store.dispatch(
        userApi.endpoints?.refreshFcmToken?.initiate({newToken, oldToken}),
      );
    });
  };

  const getFCMToken = async () => {
    const oldToken = store.getState().reducer.user.fcmToken;
    if (oldToken) return;
    messaging()
      .getToken()
      .then(async token => {
        await store.dispatch(userApi.endpoints?.setFcmToken?.initiate(token));
        store.dispatch(setFcm(token));
      })
      .catch(err => {
        console.log('Unable to retrieve token', err);
      });
  };

  useEffect(() => {
    if (!isSignIn) return;
    getFCMToken();
    listenToFCMTokenRefresh();
  }, [isSignIn]);
};

export default useFcmTokenRefresh;
