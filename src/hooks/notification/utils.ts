import notifee, {
  AndroidImportance,
  EventDetail,
  EventType,
} from '@notifee/react-native';
import {ACTION, INotifeeHandler} from './types';
import {tasksApi} from '../../app/api/taskApi';
import {store} from '../../app/store';

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

const handleActionPress = async (action?: string, detail?: EventDetail) => {
  const _id = detail?.notification?.data?.taskId;
  switch (action) {
    case ACTION.DONE:
      await store.dispatch(
        tasksApi.endpoints?.addOrEditTask?.initiate({_id, done: true}),
      );
      break;
    case ACTION.DISMISS:
      await store.dispatch(
        tasksApi.endpoints?.addOrEditTask?.initiate({_id, notified: true}),
      );

      break;
  }
};

export const onDisplayNotification = async (remoteMessage: any) => {
  await notifee.displayNotification({
    title: remoteMessage.data?.title,
    body: remoteMessage.data?.body,
    data: remoteMessage.data,
    android: {
      channelId: 'Here - default',
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
