import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Auth from './screens/Auth';
import Welcome from './screens/Welcome';
import {useMyProfileQuery} from './app/api/userApi';
import {useAppSelector} from './app/hooks';
import {selectIsSignIn} from './app/Reducers/User/userSlice';
import Home from './screens/Home';
// import DateSelect from './components/DateSelect';
// import DateList from './components/DateList';
import {createDrawerNavigator} from '@react-navigation/drawer';
import constants from './assets/constants';
import CustomDrawer from './Navigation/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const ICON_SIZE = 20;
// const Stack = createNativeStackNavigator();
const Stack = createDrawerNavigator();

export default function MainStack() {
  const isSignIn = useAppSelector(selectIsSignIn);
  const {isError, isSuccess, isLoading, data, error, isFetching} =
    useMyProfileQuery(null);

  useEffect(() => {
    if (isSuccess) {
      console.log('get profile success', data, isSignIn);
    }
    if (isError) {
      console.log('get profile error', error, isSignIn);
    }
  }, [error, data]);
  return (
    <NavigationContainer>
      <Stack.Navigator
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
            <Stack.Screen
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
            />
            <Stack.Screen
              name="HomePage"
              component={Home}
              options={{
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
