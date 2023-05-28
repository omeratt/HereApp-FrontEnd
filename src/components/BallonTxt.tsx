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
  const isIndexEven = useMemo(() => index % 2 === 0, [index]);
  const isLastIndex = useMemo(() => {
    return listSize - 1 === index;
  }, [index, listSize]);
  const isSelected = useMemo(() => {
    return selected?.includes(id);
  }, [selected, id]);
  return (
    <>
      <Animated.View
        // layout={SequencedTransition.delay(1000)}
        entering={ZoomIn.duration(500).randomDelay()}
        exiting={ZoomOut.duration(500)}
        style={[
          styles.container,
          {
            ...(isLastIndex &&
              isIndexEven &&
              {
                // minWidth: '70%',
                // maxWidth: '80%',
                // alignSelf: 'flex-start',
                // flexGrow: 0,
                // paddingHorizontal: constants.WIDTH * 0.01,
              }),
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
    // minWidth: '70%',
    // maxWidth: '50%',
    // alignSelf: 'flex-start',
    flexGrow: 1,
    borderRadius: (constants.HEIGHT * (72 / 896)) / 2,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    backgroundColor: constants.colors.OFF_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    height: constants.HEIGHT * (72 / 896),
    marginVertical: 10,
    paddingHorizontal: '1%',
    // paddingHorizontal: constants.WIDTH * 0.05,
    elevation: 2,
    // marginRight: -50,
  },
  txt: {
    flex: 1,
    fontFamily: constants.Fonts.text,
    fontSize: 17,
    color: constants.colors.BLACK,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  highLightTxt: {
    color: constants.colors.GREEN,
  },
});
