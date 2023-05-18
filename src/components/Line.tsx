import {StyleSheet, View, ViewStyle} from 'react-native';
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
  rotate180?: boolean;
  style?: ViewStyle;
  lineColor?: string;
  strength?: number;
}
export default function Line({
  lengthPercentage = 100,
  vertical = false,
  style,
  rotate180 = false,
  lineColor = constants.colors.GREY,
  strength = 2,
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
          width: strength,
          ...(rotate180 && {transform: [{rotate: '180deg'}]}),
        }
      : {
          ...(rotate180 && {transform: [{rotate: '180deg'}]}),

          width: width.value + '%',
          height: strength,
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
  const endAnimation = () => {
    animation.value = withTiming(0, {
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
        {backgroundColor: lineColor},
        rotate180 && {alignSelf: 'flex-end'},
        // vertical
        //   ? {
        //       width: strength,
        //     }
        //   : {height: strength},

        animatedStyle,
        style,
      ]}></Animated.View>
  );
}

const styles = StyleSheet.create({
  line: {
    // backgroundColor: constants.colors.GREY,
  },
});
