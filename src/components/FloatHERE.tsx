import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {memo, useEffect} from 'react';
import constants from '../assets/constants';

import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
const {colors, rf, WIDTH, HEIGHT, Fonts} = constants;
const config = {
  mass: 25,
  damping: 20,
  overshootClamping: true,
  stiffness: 100,
  restSpeedThreshold: 0.01,
};
interface IFloatHERE {
  onPress: () => void;
}
const FloatHERE: React.FC<IFloatHERE> = ({onPress}) => {
  const sharedYValue = useSharedValue(0);
  const sharedXValue = useSharedValue(7);
  const sharedOpacity = useSharedValue(2);

  useEffect(() => {
    // sharedYValue.value = withRepeat(withSpring(-5, config), -1, true);
    // sharedYValue.value = withRepeat(withTiming(-5, {duration: 1000}), -1, true);
    // sharedXValue.value = withRepeat(withSpring(15, config), -1, true);
    sharedOpacity.value = withRepeat(
      withTiming(0.5, {duration: 800}),
      -1,
      true,
    );
  }, []);
  return (
    <Animated.View
      style={[styles.container, {transform: [{translateY: sharedYValue}]}]}
      entering={FadeIn}
      exiting={FadeOut}>
      <TouchableOpacity onPress={onPress}>
        <Animated.Text style={[styles.text, {opacity: sharedOpacity}]}>
          H
          <Animated.Text
            style={{
              color: colors.GREEN,
              textShadowRadius: 15,
              textShadowColor: colors.BGC,
            }}>
            E
          </Animated.Text>
          RE
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default memo(FloatHERE);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    // backgroundColor: 'grey',
  },
  text: {
    fontFamily: Fonts.text_medium,
    color: colors.BGC,
    fontSize: rf(28),
    textAlign: 'right',
    // textAlignVertical: 'bottom',
  },
});
