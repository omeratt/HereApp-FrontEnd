import {StyleSheet, Text, Vibration, View} from 'react-native';
import React from 'react';
import constants from '../../assets/constants';
import Animated, {
  ZoomIn,
  runOnJS,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

interface Props {
  sliderHeight: number;
  sliderWidth: number;
}
const SliderPlay: React.FC<Props> = ({sliderHeight, sliderWidth}) => {
  const x = useSharedValue(0);
  const prevX = useSharedValue(0);
  const followX = useSharedValue(0);
  const tintWidth = React.useMemo(() => sliderWidth * 0.55, []);
  const vibrate = React.useCallback(() => {
    Vibration.vibrate(1);
  }, []);
  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => (prevX.value = x.value))
        .onChange(e => {
          if (e.translationX + prevX.value + tintWidth > sliderWidth) {
            x.value = withSpring(sliderWidth - tintWidth);
            if (followX.value !== sliderWidth - tintWidth) {
              followX.value = sliderWidth - tintWidth;
              runOnJS(vibrate)();
            }
          } else if (e.translationX + prevX.value < 0) {
            x.value = withSpring(0);
            if (followX.value !== 0) {
              followX.value = 0;
              runOnJS(vibrate)();
            }
          } else {
            followX.value = prevX.value + e.translationX;
            x.value = withSpring(prevX.value + e.translationX);
          }
        }),
    [],
  );
  return (
    <View
      style={[styles.container, {width: sliderWidth, height: sliderHeight}]}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          entering={ZoomIn.duration(500)}
          style={[styles.tint, {transform: [{translateX: x}]}]}
        />
      </GestureDetector>
    </View>
  );
};

export default SliderPlay;

const styles = StyleSheet.create({
  container: {
    borderColor: constants.colors.OFF_WHITE,
    borderWidth: 1,
    width: '60%',
    height: '40%',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  tint: {
    backgroundColor: constants.colors.GREEN,
    height: '100%',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    width: '55%',
  },
});
