import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import Animated, {
  Easing,
  FadeInLeft,
  SequencedTransition,
  ZoomIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import constants from '../assets/constants';

interface BallonProps {
  txt: string;
  index: number;
  SetSelectedItems?: (item: string) => void;
  selectedItems: string[];
}

const BallonTxt: React.FC<BallonProps> = ({
  txt,
  index,
  selectedItems,
  SetSelectedItems,
}) => {
  //   const isTimeManagement = txt === 'Time management';
  const text = 'This is some long text that should be truncated';
  const maxChars = 9;

  const isTimeManagement = false;
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [constants.colors.OFF_WHITE, constants.colors.GREEN],
        undefined,
        {gamma: 6},
      ),
    };
  });
  return (
    <Animated.View
      layout={SequencedTransition}
      entering={ZoomIn.duration(500).randomDelay()}
      style={[
        animatedStyle,
        styles.container,
        {paddingHorizontal: isTimeManagement ? 6 : '7.22%'},
      ]}>
      <TouchableOpacity
        onPress={() => {
          SetSelectedItems?.(txt);
          progress.value = withTiming(1 - progress.value, {duration: 450});
        }}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          textBreakStrategy="highQuality"
          style={styles.txt}>
          {txt.length > maxChars ? `${text.substring(0, maxChars)}...` : txt}
        </Text>
        {/* <Text numberOfLines={2} textBreakStrategy="balanced" style={styles.txt}>
          {txt}
        </Text> */}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default BallonTxt;

const styles = StyleSheet.create({
  container: {
    maxWidth: '61%',
    minWidth: '25%',
    flexGrow: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    // backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    height: '9%',
    marginVertical: '2%',
    marginRight: '3.0%',
    // paddingHorizontal: '5.8%',
    shadowColor: constants.colors.GREEN,
    // elevation: 2.5,
  },
  txt: {
    flex: 1,
    fontFamily: constants.Fonts.text,
    fontSize: 20,
    color: constants.colors.BLACK,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  highLightTxt: {
    color: constants.colors.GREEN,
  },
});
