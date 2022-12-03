import {StyleSheet, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
interface props {
  lengthPercentage?: number;
  vertical?: boolean;
  style?: {};
}
export default function Line({
  lengthPercentage = 100,
  vertical = false,
  style,
}: props) {
  const animation = useSharedValue(0);

  const width = useDerivedValue(() => {
    return interpolate(animation.value, [0, 1], [0, lengthPercentage]);
  });

  const height = useDerivedValue(() => {
    return interpolate(animation.value, [0, 1], [0, lengthPercentage]);
  });

  const animatedStyle = useAnimatedStyle(() => {
    const animatedConfig = vertical
      ? {
          height: height.value + '%',
          width: 2,
        }
      : {
          width: width.value + '%',
          height: 2,
        };
    return {
      ...animatedConfig,
    };
  });

  const startAnimation = () => {
    animation.value = withTiming(1, {
      duration: 2000,
    });
  };
  const inner = React.useCallback(() => {
    startAnimation();
  }, []);
  React.useEffect(() => {
    inner();
    return () => {
      animation.value = 0;
    };
  }, [inner]);

  return (
    <Animated.View
      style={[
        styles.line,
        vertical
          ? {
              width: 2,
            }
          : {height: 2},
        animatedStyle,
        style,
      ]}></Animated.View>
  );
}

const styles = StyleSheet.create({
  line: {
    backgroundColor: constants.colors.GREY,
  },
});
