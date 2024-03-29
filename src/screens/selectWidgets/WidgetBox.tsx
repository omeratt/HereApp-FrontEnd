import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated as rnAnimated,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Animated, {
  SequencedTransition,
  ZoomIn,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import constants from '../../assets/constants';
import CheckBox from '../../components/CheckBox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  ExpandingDot,
  LiquidLike,
  SlidingDot,
} from 'react-native-animated-pagination-dots';
import {FlashList} from '@shopify/flash-list';
import SVG from '../../assets/svg';
import {SvgProps} from 'react-native-svg';
import {ISvgElement} from './types';
const {Fonts, HEIGHT, WIDTH, rf, colors} = constants;
const containerHeight = HEIGHT * (182.88 / 896);
const containerWidth = WIDTH * (159.91 / 414);

const topHeight = containerHeight * (109.88 / 182.88);
// const topWidth = containerWidth * (160 / 414);

const BottomHeight = containerHeight - topHeight;
const PAGINATION_SIZE = 8;
const flatListWidth = WIDTH * 0.34444443384806317;
const flatListHeight = HEIGHT * 0.09238579067481956;

export interface WidgetBoxProps {
  //Top container
  topTitle?: string;
  topDate?: string;
  isArrow?: boolean;
  isCheckbox?: boolean;
  isFlatList?: boolean;
  onBoardingSvg?: React.FC<SvgProps>[];
  //bottom container
  bottomTitle?: string;
  bottomContent?: string;
  // rest render item props and handlers
  txt: string;
  index: number;
  SetSelectedItems: (item: string) => void;
  selectedItems: string[];
  svgElements?: ISvgElement[];
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const WidgetBox: React.FC<WidgetBoxProps> = ({
  txt,
  index,
  selectedItems,
  SetSelectedItems,
  bottomTitle,
  bottomContent,
  topTitle,
  topDate,
  isCheckbox,
  isArrow,
  isFlatList,
  onBoardingSvg,
  svgElements,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const progress = useSharedValue(0);
  const borderWidthValue = useSharedValue(0);
  const scrollX = React.useRef(new rnAnimated.Value(0)).current;
  const isIndexEven = index !== undefined && index % 2 === 0;
  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    [],
  );

  // const derivedBorderColor = useDerivedValue(() => {
  //   const selectedId = svgElements ? svgElements[currentIndex].title : txt;
  //   progress.value = withTiming(selectedItems.includes(selectedId) ? 0 : 1, {
  //     duration: 450,
  //   });
  //   return progress;
  // }, [selectedItems, currentIndex]);

  useEffect(() => {
    const selectedId = svgElements ? svgElements[currentIndex].title : txt;
    const isIncludeItem = selectedItems.includes(selectedId);

    progress.value = withTiming(isIncludeItem ? 1 : 0, {
      duration: 200,
    });
    borderWidthValue.value = withTiming(isIncludeItem ? 1 : 0, {
      duration: 200,
    });
  }, [selectedItems, currentIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.UNDER_LINE, colors.GREEN],
        // undefined,
      ),
      borderWidth: interpolate(borderWidthValue.value, [0, 1], [1, 3]),
    };
  });

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {nativeEvent} = e;
    const {x} = nativeEvent.contentOffset;
    const index = x / flatListWidth;
    scrollX.setValue(x * 2.78);
    setCurrentIndex(Math.round(index));
  };
  const handlePress = useCallback(() => {
    const selectedId = svgElements ? svgElements[currentIndex].title : txt;
    const isIncludeItem = selectedItems.includes(selectedId);
    if (selectedItems.length === 2 && !isIncludeItem) return;
    SetSelectedItems(selectedId);
  }, [
    progress.value,
    borderWidthValue.value,
    SetSelectedItems,
    txt,
    svgElements,
    currentIndex,
    selectedItems,
  ]);

  return (
    <AnimatedTouchableOpacity
      layout={SequencedTransition}
      entering={ZoomIn.duration(500).randomDelay()}
      style={[
        animatedStyle,
        styles.container,
        {...(isIndexEven && {marginRight: '3%'})},
      ]}
      onPress={handlePress}>
      {/* Top container */}
      <View style={styles.topContainer}>
        {topTitle && (
          <View style={styles.topTitleContainer}>
            <Text
              numberOfLines={1}
              textBreakStrategy="balanced"
              style={styles.txt}>
              {topTitle || 'Next task'}
            </Text>
            {isCheckbox && (
              <CheckBox
                size={16}
                isFilled={true}
                colorFill="transparent"
                borderColor={colors.OFF_WHITE}
                disabled
              />
            )}
          </View>
        )}
        {svgElements && (
          <>
            <FlatList
              data={svgElements}
              renderItem={props => {
                const aspectRatio = 65 / 68;
                return (
                  <Pressable
                    style={[styles.renderItemContainer, props.item.style]}
                    onPress={handlePress}
                    onStartShouldSetResponder={e => true}>
                    <props.item.Svg
                      height={props.item.height}
                      width={props.item.height * aspectRatio}
                    />
                  </Pressable>
                );
              }}
              // onLayout={e => {
              //   console.log(e.nativeEvent.layout.height / HEIGHT);
              // }}
              keyExtractor={keyExtractor}
              onScroll={handleScroll}
              horizontal
              initialScrollIndex={0}
              pagingEnabled
              extraData={{currentIndex}}
              getItemLayout={(item, index) => ({
                index,
                length: flatListWidth,
                offset: flatListWidth * index,
              })}
            />
            {svgElements.length > 1 && (
              <SlidingDot
                scrollX={scrollX}
                data={[1, 2]}
                containerStyle={styles.dotContainer}
                slidingIndicatorStyle={{
                  backgroundColor: colors.GREEN,
                }}
                dotStyle={styles.dotStyle}
                dotSize={PAGINATION_SIZE}
                marginHorizontal={PAGINATION_SIZE * 0.3}
              />
            )}
          </>
        )}

        {/* topFooter */}
        <View
          style={[
            styles.topFooterContainer,
            isArrow && svgElements && {flex: undefined, height: 12},
          ]}>
          <Text style={styles.topFooterText}>{topDate || ''}</Text>
          {isArrow && (
            <AntDesign name="right" color={colors.OFF_WHITE} size={12} />
          )}
        </View>
      </View>
      {/* Bottom container */}
      <Animated.View style={styles.bottomContainer}>
        <Text style={styles.bottomTitle}>
          {svgElements ? svgElements?.[currentIndex].title : bottomTitle || ''}
        </Text>
        <Text style={styles.bottomContent}>
          {svgElements
            ? svgElements?.[currentIndex].content
            : bottomContent || ''}
        </Text>
      </Animated.View>
    </AnimatedTouchableOpacity>
  );
};

export default WidgetBox;
const radius = 18;
const styles = StyleSheet.create({
  container: {
    height: containerHeight,
    width: containerWidth,
    flexGrow: 1,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    backgroundColor: constants.colors.BGC,
    shadowColor: constants.colors.GREEN,
    // elevation: 2.5,
    marginVertical: '2%',
  },
  topContainer: {
    width: '100%',
    height: topHeight,
    paddingVertical: '5%',
    paddingHorizontal: '8%',
    borderTopRightRadius: radius,
    borderTopLeftRadius: radius,
    // backgroundColor: 'cyan',
  },
  topTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topFooterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'flex-end',
  },
  topFooterText: {
    color: colors.OFF_WHITE,
    fontFamily: Fonts.text,
    fontSize: rf(8),
  },
  renderItemContainer: {
    height: HEIGHT * 0.09238579067481956,
    width: flatListWidth,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
  },
  txt: {
    flex: 1,
    fontFamily: constants.Fonts.text,
    fontSize: 14,
    color: constants.colors.OFF_WHITE,
    textAlign: 'left',
    // textAlignVertical: 'top',
  },
  highLightTxt: {
    color: constants.colors.GREEN,
  },
  bottomContainer: {
    // backgroundColor: 'rgba(255, 255, 255,0.7)',
    backgroundColor: colors.OFF_WHITE,
    // borderTopColor: colors.UNDER_LINE,
    // width: '100%',
    // height: BottomHeight,
    flex: 1,
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    // borderTopWidth: 1,
    borderBottomRightRadius: radius - 3,
    borderBottomLeftRadius: radius - 3,
  },
  bottomTitle: {
    fontFamily: constants.Fonts.text_medium,
    fontSize: rf(12),
    color: colors.BGC,
    textAlign: 'left',

    // textAlignVertical: 'center',
  },
  bottomContent: {
    fontFamily: constants.Fonts.text,
    fontSize: rf(10),
    color: colors.BGC,
    textAlign: 'left',
    lineHeight: rf(12.5),
    // textAlignVertical: 'center',
  },
  dotContainer: {
    bottom: PAGINATION_SIZE / 2,
    position: 'absolute',
  },
  dotStyle: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: colors.OFF_WHITE,
    marginRight: PAGINATION_SIZE * 0.3,
    marginLeft: PAGINATION_SIZE * 0.3,
  },
});
