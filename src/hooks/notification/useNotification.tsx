import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import useFcmTokenRefresh from './useFcmTokenRefresh';

const useNotification = () => {
  useFcmTokenRefresh();
  /* Handling Foreground and Background Push Notification */
  useEffect(() => {
    console.log('--------------------------------');
    requestPushNotificationsPermission();
    handleNotificationFromBackGroundOrQuitState();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage);
    });
    return () => {
      handleNotificationFromForegroundState();
      unsubscribe?.();
    };
  }, []);
  const onDisplayNotification = async (remoteMessage: any) => {
    console.log('on display', remoteMessage);
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: remoteMessage.data?.userRef || 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      },
    });
  };
  const hasPermission = async () => {
    return await messaging().hasPermission();
  };
  const handleNotificationFromForegroundState = () => {
    notifee.onForegroundEvent(async ({type, detail}) => {
      const navigateToScreen = detail.notification?.data?.screenName;
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          console.log('press event');
          //   store.dispatch(getNotifications());
          //   navigateToScreen && RootNavigation.navigate(navigateToScreen);
          console.log('User pressed notification', detail);
          break;
      }
    });
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
  const handleNotificationFromBackGroundOrQuitState = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      //   store.dispatch(getNotifications());
      //   remoteMessage?.data?.screenName &&
      //     RootNavigation.navigate(remoteMessage?.data?.screenName);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          //   setInitialRoute(remoteMessage?.data?.screenName); // e.g. "Settings"
        }
      });
  };
};

export default useNotification;
