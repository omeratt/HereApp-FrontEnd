/**
 * @format
 */
import 'react-native-reanimated';
import 'react-native-gesture-handler'; // https://reactnavigation.org/docs/drawer-navigator#installation
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {
  handleNotification,
  onDisplayNotification,
} from './src/hooks/notification/utils';

messaging().setBackgroundMessageHandler(remoteMessage => {
  onDisplayNotification(remoteMessage);
  notifee.onBackgroundEvent(handleNotification);
});
AppRegistry.registerComponent(appName, () => App);
