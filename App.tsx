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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Text} from 'react-native';

// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStack from './src/MainStack';
import {Provider} from 'react-redux';
import {persistor, store} from './src/app/store';
import {PersistGate} from 'redux-persist/integration/react';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Dimensions, StatusBar} from 'react-native';

const App = () => {
  // const insets = useSafeAreaInsets();
  // const navigationBarHeight = insets.bottom;
  // console.log({navigationBarHeight, insets});
  const screenHeight = Dimensions.get('screen').height;
  const windowHeight = Dimensions.get('window').height;
  const navbarHeight = screenHeight - windowHeight;
  console.log({navbarHeight});
  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 1}}>
          <GestureHandlerRootView style={styles.container}>
            <PersistGate
              persistor={persistor}
              loading={<Text>Loading...</Text>}>
              <Provider store={store}>
                <BottomSheetModalProvider>
                  <MainStack />
                </BottomSheetModalProvider>
              </Provider>
            </PersistGate>
          </GestureHandlerRootView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
