import {StyleSheet} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Auth from './screens/Auth';
import Welcome from './screens/Welcome';
import {useAppSelector} from './app/hooks';
import {selectIsSignIn} from './app/Reducers/User/userSlice';
import Home from './screens/Home';
import constants from './assets/constants';
import OnBoarding from './screens/OnBoarding';
import ListAndNotesNavigator from './Navigation/ListNavigation';
import PlayGround from './screens/PlayGround';
import Message from './screens/message/Message';
import Messages from './screens/message/Messages';
import Search from './screens/Search';
import AllMyTasks from './screens/task/AllMyTasks';
import IamNotStupid from './screens/IamNotStupid';
import useNotification from './hooks/notification/useNotification';
import Menu from './screens/Menu';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import TimeTips from './screens/TimeTips';
import Widgets from './screens/selectWidgets/Widgets';
const Stack = createNativeStackNavigator();

export default function MainStack() {
  useNotification();

  const isSignIn = useAppSelector(selectIsSignIn);

  const screenOptions =
    (freezeOnBlur = true) =>
    (): NativeStackNavigationOptions => ({
      headerShown: false,
      freezeOnBlur,
    });

  return (
    <NavigationContainer>
      <Stack.Navigator
        id="MainStack"
        initialRouteName="Auth"
        screenOptions={screenOptions()}>
        {isSignIn ? (
          <>
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={screenOptions()}
            />
            <Stack.Screen
              name="OnBoarding"
              component={OnBoarding}
              options={screenOptions()}
            />
            <Stack.Screen
              name="HomePage"
              component={Home}
              options={screenOptions(false)}
            />
            <Stack.Screen
              name="PlayGround"
              component={PlayGround}
              options={screenOptions()}
            />

            <Stack.Screen
              name="IamNotStupid"
              component={IamNotStupid}
              options={screenOptions()}
            />
            <Stack.Screen
              name="TimeTips"
              component={TimeTips}
              options={screenOptions()}
            />
            <Stack.Screen
              name="Messages"
              component={Messages}
              options={screenOptions()}
            />
            <Stack.Screen
              name="Message"
              component={Message}
              options={screenOptions()}
            />
            <Stack.Screen
              name="AllMyTasks"
              component={AllMyTasks}
              options={screenOptions()}
            />
            <Stack.Screen
              name="ListAndNotesStack"
              component={ListAndNotesNavigator}
              options={screenOptions()}
            />
            <Stack.Screen
              name="Search"
              component={Search}
              options={screenOptions()}
            />
            <Stack.Screen
              name="Menu"
              component={Menu}
              options={screenOptions(false)}
            />
            <Stack.Screen
              name="Widgets"
              component={Widgets}
              options={screenOptions()}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={screenOptions()}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {position: 'absolute', right: '5%'},
  label: {
    fontFamily: constants.Fonts.text,
    fontSize: 20,
    marginTop: -constants.HEIGHT * 0.015 - constants.HEIGHT * 0.015 * 0.2,
    color: constants.colors.OFF_WHITE,
    textAlign: 'center',
    backgroundColor: 'red',
    // alignSelf: 'center',
    width: constants.WIDTH,
    marginLeft: 10,

    // flex: 1,
    // fontWeight: 'bold',
  },
});
