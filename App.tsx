/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

// import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  I18nManager,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStack from './src/MainStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {persistor, store} from './src/app/store';
import {PersistGate} from 'redux-persist/integration/react';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import getWeeklyCalendar from './src/components/WeeklyCalender';
import {setDates} from './src/app/Reducers/User/userSlice';
I18nManager.forceRTL(true);
// I18nManager.swapLeftAndRightInRTL(true);
const App = () => {
  useEffect(() => {
    const dates = getWeeklyCalendar();
    store.dispatch(setDates(dates));
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <PersistGate persistor={persistor} loading={<Text>Loading...</Text>}>
          <Provider store={store}>
            <BottomSheetModalProvider>
              <MainStack />
            </BottomSheetModalProvider>
          </Provider>
        </PersistGate>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
