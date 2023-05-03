import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import React from 'react';
import CircleCheckBox from '../CircleCheckBox';
import constants from '../../assets/constants';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  ZoomIn,
  runOnJS,
  useSharedValue,
} from 'react-native-reanimated';

interface Props {
  viewHeight: number;
}
const TenCircles: React.FC<Props> = ({viewHeight}) => {
  const size = React.useMemo(
    () => viewHeight * 0.06801416089708934270417327915453,
    [],
  );
  const gap = React.useMemo(
    () => viewHeight * 0.02441533980921155891944681815804,
    [],
  );
  const paddingVertical = React.useMemo(
    () => viewHeight * 0.04708672677490800648750457787621,
    [],
  );
  const [selectedIndex, setSelectedIndex] = React.useState(6);
  const onPress = React.useCallback((index: number) => {
    vibrate();
    setSelectedIndex(index);
  }, []);
  const vibrate = React.useCallback(() => {
    Vibration.vibrate(1);
  }, []);
  const prevIndex = useSharedValue(6);
  const currentIndex = useSharedValue(6);
  const circles = new Array(10).fill(0);
  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onTouchesDown(e => {
          prevIndex.value = currentIndex.value;
          const index = Math.floor(e.allTouches[0].y / (size + gap));
          currentIndex.value = index;
          if (currentIndex.value !== prevIndex.value) runOnJS(onPress)(index);
        })
        .onChange(e => {
          prevIndex.value = currentIndex.value;
          const index = Math.floor(e.y / (size + gap));
          currentIndex.value = index;
          if (currentIndex.value !== prevIndex.value) runOnJS(onPress)(index);
        })
        .onTouchesUp(() => {
          runOnJS(vibrate)();
        }),
    [],
  );
  return (
    <View style={[styles.container, {paddingVertical}]}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={{flex: 1}}>
          {circles.map((val, index) => {
            return (
              <Animated.View
                entering={ZoomIn.randomDelay().duration(500)}
                key={index}>
                <Pressable
                  android_disableSound={true}
                  // onPress={() => onPress(index)}
                  style={[
                    {...(index !== circles.length - 1 && {marginBottom: gap})},
                  ]}>
                  <CircleCheckBox
                    notCheckedFillColor={constants.colors.BGC}
                    borderColor={constants.colors.OFF_WHITE}
                    fill={
                      selectedIndex === index
                        ? constants.colors.GREEN
                        : undefined
                    }
                    size={size}
                  />
                </Pressable>
              </Animated.View>
            );
          })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default TenCircles;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
});
