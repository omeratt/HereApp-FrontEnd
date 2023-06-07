import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import useFcmTokenRefresh from './useFcmTokenRefresh';
import {handleNotification, onDisplayNotification} from './utils';

const useNotification = () => {
  useFcmTokenRefresh();
  useEffect(() => {
    createChannel();
    const unsubscribe = messaging().onMessage(onDisplayNotification);
    handleNotificationFromForegroundState();
    return () => {
      unsubscribe?.();
    };
  }, []);

  const createChannel = async () => {
    const isHasPermission = await requestPushNotificationsPermission();
    if (!isHasPermission) return;

    await notifee.createChannel({
      id: 'Here - default',
      name: 'Here - default',
      importance: AndroidImportance.HIGH,
    });
  };
  const hasPermission = async () => {
    return await messaging().hasPermission();
  };
  const handleNotificationFromForegroundState = () => {
    notifee.onForegroundEvent(handleNotification);
  };
  const requestPushNotificationsPermission = async () => {
    const isHasPermission =
      (await hasPermission()) === messaging.AuthorizationStatus.AUTHORIZED;
    if (isHasPermission) return true;
    const setting = await notifee.requestPermission();
    if (
      setting.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      setting.authorizationStatus === AuthorizationStatus.PROVISIONAL
    ) {
      return true;
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log('Authorization status:', authStatus);
    return enabled;
  };
};

export default useNotification;
