/**
 * @format
 */
import 'react-native-reanimated';
import 'react-native-gesture-handler'; // https://reactnavigation.org/docs/drawer-navigator#installation
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
