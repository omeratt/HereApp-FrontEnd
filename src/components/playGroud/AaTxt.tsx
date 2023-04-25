import {Pressable, StyleSheet, Text, Vibration, View} from 'react-native';
import React from 'react';
import constants from '../../assets/constants';

const green = constants.colors.GREEN;
const offWhite = constants.colors.OFF_WHITE;
const height = constants.HEIGHT * 0.42075892857142857142857142857143;
const AaTxt = () => {
  const [color, setColor] = React.useState(true);
  const toggle = React.useCallback(() => {
    Vibration.vibrate(1);
    setColor(!color);
  }, [color]);
  return (
    <View style={[styles.fullSizeAndCenter]}>
      <Pressable android_disableSound style={[styles.center]} onPress={toggle}>
        <Text style={[styles.topATxt, {color: color ? offWhite : green}]}>
          a
        </Text>
      </Pressable>
      <Pressable android_disableSound onPress={toggle} style={[styles.center]}>
        <Text style={[styles.bottomATxt, {color: !color ? offWhite : green}]}>
          a
        </Text>
      </Pressable>
    </View>
  );
};

export default AaTxt;

const styles = StyleSheet.create({
  topATxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: constants.HEIGHT * 0.16,
    lineHeight: constants.HEIGHT * 0.16,
    paddingBottom: constants.HEIGHT * 0.01,
    textAlignVertical: 'center',
  },
  bottomATxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.GREEN,
    fontSize: constants.HEIGHT * 0.12,
    lineHeight: constants.HEIGHT * 0.12,
    paddingBottom: constants.HEIGHT * 0.01,
    textAlign: 'center',
  },
  fullSizeAndCenter: {
    height: height,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
