import notifee, {
  AndroidImportance,
  EventDetail,
  EventType,
} from '@notifee/react-native';
import {ACTION, INotifeeHandler} from './types';

export const handleNotification = async ({type, detail}: INotifeeHandler) => {
  switch (type) {
    case EventType.DISMISSED:
      console.log('dismiss notification');
      break;
    case EventType.ACTION_PRESS:
      handleActionPress(detail.pressAction?.id, detail);
      break;
  }
};

const handleActionPress = (action?: string, detail?: EventDetail) => {
  switch (action) {
    case ACTION.DONE:
      //TODO: FETCH SET AS DONE:TRUE
      console.log('should trigger done action');
      break;
    case ACTION.DISMISS:
      console.log('should trigger dismiss action');
      //TODO: FETCH SET AS NOTIFIED:TRUE
      break;
  }
};

export const onDisplayNotification = async (remoteMessage: any) => {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: remoteMessage.data.channelId || 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title: remoteMessage.data?.title,
    body: remoteMessage.data?.body,
    data: remoteMessage.data,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      actions: [
        {
          title: '✅ Done',
          pressAction: {id: 'done'},
        },
        {
          title: '❌ Dismiss',
          pressAction: {id: 'dismiss'},
        },
        {
          title: '⏰ Remind me later',
          pressAction: {id: 'remind me later'},
        },
      ],
    },
  });
};
