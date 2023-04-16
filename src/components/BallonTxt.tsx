import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useMemo} from 'react';
import Animated, {
  SequencedTransition,
  ZoomIn,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import constants from '../assets/constants';

interface BallonProps {
  txt: string;
  index: number;
  listSize: number;
  onPress?: (index: number) => void;
}
export const gap = constants.WIDTH * 0.03;
const BallonTxt: React.FC<BallonProps> = ({txt, index, listSize, onPress}) => {
  const text = 'This is some long text that should be truncated';
  const maxChars = 10;
  const progress = useSharedValue(0);
  const isIndexEven = index !== undefined && index % 2 === 0;
  const isLastIndex = useMemo(() => {
    return listSize - 1 === index;
  }, []);
  return (
    <Animated.View
      layout={SequencedTransition}
      entering={ZoomIn.duration(500).randomDelay()}
      style={[
        styles.container,
        {
          ...(isLastIndex && isIndexEven && {minWidth: '30%', maxWidth: '41%'}),
          marginRight: isIndexEven ? gap : 0,
        },
      ]}>
      <TouchableOpacity onPress={onPress && (() => onPress(index))}>
        <Text
          numberOfLines={1}
          // ellipsizeMode="tail"
          textBreakStrategy="balanced"
          style={styles.txt}>
          {/* {txt} */}
          {txt.length > maxChars ? `${txt.substring(0, maxChars)}...` : txt}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default BallonTxt;

const styles = StyleSheet.create({
  container: {
    // maxWidth: '50%',
    // minWidth: '32%',
    flexGrow: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    backgroundColor: constants.colors.OFF_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    height: constants.HEIGHT * (72 / 896),
    marginVertical: 10,
    paddingHorizontal: '1%',
    elevation: 2,
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
