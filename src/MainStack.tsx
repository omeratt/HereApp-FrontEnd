import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Auth from './screens/Auth';
import Welcome from './screens/Welcome';
import {useMyProfileQuery} from './app/api/userApi';
import {useAppSelector} from './app/hooks';
import {selectIsSignIn} from './app/Reducers/User/userSlice';
import Home from './screens/Home';
import DateSelect from './components/DateSelect';
import DateList from './components/DateList';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const isSignIn = useAppSelector(selectIsSignIn);
  const {isError, isSuccess, isLoading, data, error, isFetching} =
    useMyProfileQuery(null);
  const [signIn, setSignIn] = useState(false);
  useEffect(() => {
    // if (isLoading) {
    if (isSuccess) {
      console.log('get profile success', data, isSignIn);
      // data.signIn && setSignIn(true);
    }
    if (isError) {
      console.log('get profile error', error, isSignIn);
      // setSignIn(false);
    }
    // }
    // console.log('error', data);
  }, [error, data]);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        {isSignIn ? (
          <>
            {/* <Stack.Screen
              name="DateList"
              component={DateList}
              options={{headerShown: false}}
            /> */}
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="HomePage"
              component={Home}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
