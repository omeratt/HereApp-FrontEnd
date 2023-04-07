import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

import React, {useRef} from 'react';
import Line from './Line';
import constants from '../assets/constants';

const openModeSize = constants.HEIGHT * 0.18;
const closeModeSize = constants.HEIGHT * 0.09;
const Notes = () => {
  const itemHeight = useRef<number>(closeModeSize);
  const animatedHeight = useSharedValue(itemHeight.current);

  const handlePress = () => {
    const height =
      itemHeight.current === openModeSize ? closeModeSize : openModeSize;
    animatedHeight.value = withTiming(height, {
      duration: 100,
    });
    itemHeight.current = height;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  }, [animatedHeight.value, itemHeight]);

  return (
    <Animated.View style={[styles.note, animatedStyle]}>
      <Line
        strength={1}
        rotate180
        lengthPercentage={100}
        lineColor={constants.colors.UNDER_LINE}
        style={{elevation: 1}}
      />
      <TouchableOpacity onPress={handlePress} style={[styles.noteTxtContainer]}>
        <Text style={[styles.sectionTxt]}>Note</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Notes;

const styles = StyleSheet.create({
  note: {
    width: '100%',
    borderColor: constants.colors.UNDER_LINE,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  noteTxtContainer: {
    padding: '5.2%',
  },
  sectionTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text,
    fontSize: 18,
  },
});
