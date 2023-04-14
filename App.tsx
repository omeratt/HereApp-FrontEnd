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
import React from 'react';
import {StyleSheet, Text} from 'react-native';

// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStack from './src/MainStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {persistor, store} from './src/app/store';
import {PersistGate} from 'redux-persist/integration/react';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const App = () => {
  return (
    <>
      <GestureHandlerRootView style={styles.container}>
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
  container: {
    flex: 1,
  },
});

export default App;
