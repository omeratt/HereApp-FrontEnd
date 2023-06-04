import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {useSetFcmTokenMutation, userApi} from '../../app/api/userApi';
import {store} from '../../app/store';
// import {useDispatch} from 'react-redux';

const useFcmTokenRefresh = () => {
  // const [setFcmToken, {isLoading, isError}] = store.;
  const listenToFCMTokenRefresh = () => {
    messaging().onTokenRefresh(async newToken => {
      await store.dispatch(userApi.endpoints?.setFcmToken?.initiate(newToken));
    });
  };

  const getFCMToken = async () => {
    messaging()
      .getToken()
      .then(async token => {
        await store.dispatch(userApi.endpoints?.setFcmToken?.initiate(token));
      })
      .catch(err => {
        console.log('Unable to retrieve token', err);
      });
  };

  useEffect(() => {
    getFCMToken();
  }, []);
};

export default useFcmTokenRefresh;
