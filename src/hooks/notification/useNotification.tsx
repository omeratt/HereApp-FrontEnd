import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import useFcmTokenRefresh from './useFcmTokenRefresh';
import {handleNotification, onDisplayNotification} from './utils';

const useNotification = () => {
  useFcmTokenRefresh();
  useEffect(() => {
    requestPushNotificationsPermission();
    const unsubscribe = messaging().onMessage(onDisplayNotification);
    handleNotificationFromForegroundState();
    return () => {
      unsubscribe?.();
    };
  }, []);

  const hasPermission = async () => {
    return await messaging().hasPermission();
  };
  const handleNotificationFromForegroundState = () => {
    console.log('handleNotificationFromForegroundState');
    notifee.onForegroundEvent(handleNotification);
  };
  const requestPushNotificationsPermission = async () => {
    const isHasPermission =
      (await hasPermission()) === messaging.AuthorizationStatus.AUTHORIZED;
    if (isHasPermission) return;
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };
};

export default useNotification;
