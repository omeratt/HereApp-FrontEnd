import {StyleSheet, Text} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Auth from './screens/Auth';
import Welcome from './screens/Welcome';
import {useMyProfileQuery} from './app/api/userApi';
import {useAppSelector} from './app/hooks';
import {selectIsSignIn} from './app/Reducers/User/userSlice';
import Home from './screens/Home';
import {createDrawerNavigator} from '@react-navigation/drawer';
import constants from './assets/constants';
import CustomDrawer from './Navigation/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OnBoarding from './screens/OnBoarding';
import ListAndNotesNavigator from './Navigation/ListNavigation';
import {useGetListsQuery} from './app/api/listApi';
import PlayGround from './screens/PlayGround';
import Message from './screens/message/Message';
import Messages from './screens/message/Messages';
import Search from './screens/Search';
import AllMyTasks from './screens/task/AllMyTasks';
import IamNotStupid from './screens/IamNotStupid';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const ICON_SIZE = 20;
// const Stack = createNativeStackNavigator();
const Stack = createDrawerNavigator();
export default function MainStack() {
  const insets = useSafeAreaInsets();
  const navigationBarHeight = insets.bottom;
  console.log({navigationBarHeight, insets});
  const isSignIn = useAppSelector(selectIsSignIn);
  const drawerScreenOptions = {
    gestureEnabled: true,
    swipeEnabled: false,
  };
  const Label = React.useCallback(
    ({isFocused, label}: {label: string; isFocused: boolean}) => {
      return (
        <Text
          style={[
            styles.label,
            {
              color: isFocused
                ? constants.colors.GREEN
                : constants.colors.OFF_WHITE,
            },
          ]}>
          {label}
        </Text>
      );
    },
    [],
  );
  const StupidLabel = React.useCallback(({isFocused}: {isFocused: boolean}) => {
    return (
      <Text
        style={[
          styles.label,
          {
            color: isFocused
              ? constants.colors.GREEN
              : constants.colors.OFF_WHITE,
          },
        ]}>
        {'I AM '}
        <Text
          style={[
            styles.label,
            {fontFamily: constants.Fonts.italic, color: constants.colors.GREEN},
          ]}>
          {'NOT'}
        </Text>
        {' Stupid'}
      </Text>
    );
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        id="MainStack"
        initialRouteName="Auth"
        screenOptions={{
          // swipeEnabled: true,

          // unmountOnBlur: true,
          drawerPosition: 'left',
          drawerStyle: {
            backgroundColor: constants.colors.BGC,
            width: constants.WIDTH,
            height: constants.HEIGHT,
          },

          drawerActiveBackgroundColor: 'transparent',
          drawerActiveTintColor: constants.colors.GREEN,

          // drawerLabelStyle: styles.label,
        }}
        drawerContent={props => (
          <CustomDrawer {...props} isSignIn={isSignIn} />
        )}>
        {isSignIn ? (
          <>
            <Stack.Screen
              name="OnBoarding"
              component={OnBoarding}
              options={{
                headerShown: false,
                drawerItemStyle: {display: 'none'},
              }}
            />
            <Stack.Screen
              name="HomePage"
              component={Home}
              options={{
                swipeEnabled: false,
                headerShown: false,
                drawerLabel(props) {
                  return <Label label={'Home'} isFocused={props.focused} />;
                },
              }}
            />
            <Stack.Screen
              name="PlayGround"
              component={PlayGround}
              options={{
                swipeEnabled: false,
                headerShown: false,
                drawerLabel(props) {
                  return (
                    <Label label={'PlayGround'} isFocused={props.focused} />
                  );
                },
              }}
            />

            <Stack.Screen
              name="IamNotStupid"
              component={IamNotStupid}
              options={{
                unmountOnBlur: true,
                swipeEnabled: false,
                headerShown: false,

                drawerLabel(props) {
                  return <StupidLabel isFocused={props.focused} />;
                },
              }}
            />
            <Stack.Screen
              name="Messages"
              component={Messages}
              options={{
                swipeEnabled: false,
                headerShown: false,
                unmountOnBlur: true,
                drawerLabel(props) {
                  return (
                    <Label
                      label={'Message To My Self'}
                      isFocused={props.focused}
                    />
                  );
                },
              }}
            />
            <Stack.Screen
              name="Message"
              component={Message}
              options={{
                swipeEnabled: false,
                headerShown: false,
                drawerItemStyle: {display: 'none'},
                unmountOnBlur: true,
              }}
            />
            <Stack.Screen
              name="AllMyTasks"
              component={AllMyTasks}
              options={{
                swipeEnabled: false,
                headerShown: false,
                drawerLabel(props) {
                  return (
                    <Label label={'All My Tasks'} isFocused={props.focused} />
                  );
                },
              }}
            />
            <Stack.Screen
              name="ListAndNotesStack"
              component={ListAndNotesNavigator}
              options={{
                swipeEnabled: false,
                headerShown: false,
                drawerLabel(props) {
                  return <Label label={'Lists'} isFocused={props.focused} />;
                },
                unmountOnBlur: true,
              }}
            />
            <Stack.Screen
              name="Search"
              component={Search}
              options={{
                swipeEnabled: false,
                headerShown: false,
                drawerLabel(props) {
                  return <Label label={'Search'} isFocused={props.focused} />;
                },
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{
                headerShown: false,
                // drawerIcon: ({color, focused}) => (
                //   <Ionicons
                //     name={focused ? 'key-sharp' : 'key-outline'}
                //     size={ICON_SIZE}
                //     style={[styles.icon, {color}]}
                //   />
                // ),
              }}
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
    // fontWeight: 'bold',
  },
});
