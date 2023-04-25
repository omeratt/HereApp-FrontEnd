import {StyleSheet} from 'react-native';
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
const ICON_SIZE = 20;
// const Stack = createNativeStackNavigator();
const Stack = createDrawerNavigator();

export default function MainStack() {
  const isSignIn = useAppSelector(selectIsSignIn);
  const drawerScreenOptions = {
    gestureEnabled: true,
    swipeEnabled: false,
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        id="MainStack"
        initialRouteName="Auth"
        screenOptions={{
          drawerPosition: 'left',
          drawerStyle: {
            backgroundColor: constants.colors.OFF_WHITE,
            width: '55%',
            height: '100%',
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 50,
          },
          drawerActiveBackgroundColor: constants.colors.GREEN,
          drawerActiveTintColor: constants.colors.BGC,
          drawerLabelStyle: styles.label,
        }}
        drawerContent={props => (
          <CustomDrawer {...props} isSignIn={isSignIn} />
        )}>
        {isSignIn ? (
          <>
            {/* <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerShown: false,
                drawerIcon: ({color, focused}) => (
                  <MaterialCommunityIcons
                    name={focused ? 'hand-wave' : 'hand-wave-outline'}
                    size={ICON_SIZE}
                    style={[styles.icon, {color}]}
                  />
                ),
              }}
            /> */}
            {/* <Stack.Screen
              name="OnBoarding"
              component={OnBoarding}
              options={{headerShown: false}}
            /> */}
            <Stack.Screen
              name="PlayGround"
              component={PlayGround}
              options={{
                swipeEnabled: false,
                headerShown: false,
                drawerIcon: ({color, focused}) => (
                  <Ionicons
                    name={focused ? 'home' : 'home-outline'}
                    size={ICON_SIZE}
                    style={[styles.icon, {color}]}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="HomePage"
              component={Home}
              options={{
                swipeEnabled: false,
                headerShown: false,
                drawerIcon: ({color, focused}) => (
                  <Ionicons
                    name={focused ? 'home' : 'home-outline'}
                    size={ICON_SIZE}
                    style={[styles.icon, {color}]}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="ListAndNotesStack"
              component={ListAndNotesNavigator}
              options={{
                swipeEnabled: false,
                headerShown: false,

                unmountOnBlur: true,
                drawerIcon: ({color, focused}) => (
                  <Ionicons
                    name={focused ? 'list' : 'ios-list-outline'}
                    size={ICON_SIZE}
                    style={[styles.icon, {color}]}
                  />
                ),
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
                drawerIcon: ({color, focused}) => (
                  <Ionicons
                    name={focused ? 'key-sharp' : 'key-outline'}
                    size={ICON_SIZE}
                    style={[styles.icon, {color}]}
                  />
                ),
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
    fontSize: 15,
    fontWeight: 'bold',
  },
});
