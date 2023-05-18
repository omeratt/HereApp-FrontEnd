import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useMemo} from 'react';
import Animated, {
  SequencedTransition,
  ZoomIn,
  ZoomOut,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import constants from '../assets/constants';
import CheckBox from './CheckBox';
import {View} from 'react-native';

interface BallonProps {
  txt: string;
  index: number;
  listSize: number;
  id: string;
  isSelectOn?: boolean;
  selected?: string[];
  handleSelect?: (id: string) => void;
  onPress?: (index: number) => void;
  toggleSelectOnOff?: () => void;
}
export const gap = constants.WIDTH * 0.03;
const BallonTxt: React.FC<BallonProps> = ({
  txt,
  index,
  listSize,
  onPress,
  isSelectOn,
  id,
  handleSelect,
  selected,
  toggleSelectOnOff,
}) => {
  const text = 'This is some long text that should be truncated';
  const maxChars = 10;
  const progress = useSharedValue(0);
  const isIndexEven = index !== undefined && index % 2 === 0;
  const isLastIndex = useMemo(() => {
    return listSize - 1 === index;
  }, []);
  const isSelected = useMemo(() => {
    return selected?.includes(id);
  }, [selected]);
  return (
    <>
      <Animated.View
        layout={SequencedTransition}
        entering={ZoomIn.duration(500).randomDelay()}
        style={[
          styles.container,
          {
            ...(isLastIndex &&
              isIndexEven && {minWidth: '30%', maxWidth: '41%'}),
            marginRight: isIndexEven ? gap : 0,
            position: 'relative',
          },
        ]}>
        {isSelectOn === true && (
          <Animated.View
            entering={ZoomIn.duration(150)}
            exiting={ZoomOut.duration(150)}
            style={{
              position: 'absolute',
              left: 0,
              top: '-5%',
            }}>
            <CheckBox
              size={constants.WIDTH * 0.05}
              colorFill={constants.colors.GREEN}
              isFilled={isSelected}
              onPress={() => {
                handleSelect?.(id);
              }}
            />
          </Animated.View>
        )}
        <TouchableOpacity
          style={{}}
          onPress={
            isSelectOn ? () => handleSelect?.(id) : () => onPress?.(index)
          }
          onLongPress={() => (toggleSelectOnOff?.(), handleSelect?.(id))}>
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
    </>
  );
};

export default React.memo(BallonTxt);
// export default BallonTxt;

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
