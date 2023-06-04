import notifee, {
  AndroidStyle,
  EventDetail,
  EventType,
} from '@notifee/react-native';

interface NotificationHandlersProps {
  handleSoldOrNotSoldEvent: (
    type?: EventType,
    detail?: EventDetail,
  ) => Promise<void>;
}

export const onDisplayNotification = async (remoteMessage: any) => {
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
