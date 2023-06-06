/**
 * @format
 */
import 'react-native-reanimated';
import 'react-native-gesture-handler'; // https://reactnavigation.org/docs/drawer-navigator#installation
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {
  handleNotification,
  onDisplayNotification,
} from './src/hooks/notification/utils';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await onDisplayNotification(remoteMessage);
  // return false;
});
notifee.onBackgroundEvent(handleNotification);
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   await onDisplayNotification(remoteMessage);
//   console.log('--------------------------------', remoteMessage);
//   // return false;
//   notifee.onBackgroundEvent(async ({type, detail}) => {
//     const {notification} = detail;
//     console.log({notification});
//     if (Platform.OS === 'android' && notification?.id) {
//       // HACK
//       // This prevents duplicate notifications from being sent to android
//       // at the cost of the notification not going to the correct route
//       await notifee.cancelNotification(notification.id);
//     }
//     if (type === EventType.PRESS && notification?.id) {
//       // setNotificationDataReceived(notification?.data);
//       await notifee.cancelNotification(notification?.id);
//     }
//   });
//   return false;
// });
AppRegistry.registerComponent(appName, () => App);
