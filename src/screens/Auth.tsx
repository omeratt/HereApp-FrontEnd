import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import SVG from './../assets/svg';
import constants from '../assets/constants';
import {Dimensions} from 'react-native';
import AuthModal from './AuthModal';

export default function Auth() {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {/* <Text
          adjustsFontSizeToFit
          allowFontScaling
          numberOfLines={1}
          minimumFontScale={0.5}
          style={styles.Logo}>
          HERE
        </Text> */}
        <SVG.HereLogo width="70%" height="50%" />
      </View>
      <AuthModal />
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
    // marginRight: WIDTH / 10,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: constants.colors.BLACK,
  },
  Logo: {
    // height: '100%',
    // width: '5000%',
    // flex: 1,
    fontFamily: constants.Fonts.text,
    // fontSize: 55,
    color: constants.colors.OFF_WHITE,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'black',
  },
});
