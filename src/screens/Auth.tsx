import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import SVG from './../assets/svg';
import constants from '../assets/constants';
import {Dimensions} from 'react-native';
import AuthModal from './AuthModal';

const WIDTH = Dimensions.get('window').width;
export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <SVG.HereLogo width="200" height="200" />
      </View>
      {!isSignIn && <AuthModal />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: constants.colors.BGC,
  },
  topSection: {
    marginRight: WIDTH / 10,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: constants.colors.BGC,
  },
});
