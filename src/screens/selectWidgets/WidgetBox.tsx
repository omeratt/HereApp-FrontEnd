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
import React, {useCallback, useState} from 'react';
import Animated, {
  SequencedTransition,
  ZoomIn,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
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
const {Fonts, HEIGHT, WIDTH, rf, colors} = constants;
const containerHeight = HEIGHT * (182.88 / 896);
const containerWidth = WIDTH * (159.91 / 414);

const topHeight = containerHeight * (109.88 / 182.88);
// const topWidth = containerWidth * (160 / 414);

const BottomHeight = containerHeight - topHeight;
const PAGINATION_SIZE = 8;
interface WidgetBoxProps {
  //Top container
  topTitle?: string;
  topDate?: string;
  topSvg?: SVGElement;
  isArrow?: boolean;
  isCheckbox?: boolean;
  isOnBoarding?: boolean;
  onBoardingSvg?: SVGElement[];
  //bottom container
  bottomTitle?: string;
  bottomContent?: string;
  // rest render item props and handlers
  txt: string;
  index: number;
  SetSelectedItems: (item: string) => void;
  selectedItems: string[];
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(View);
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
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const progress = useSharedValue(0);
  const scrollX = React.useRef(new rnAnimated.Value(0)).current;
  const isIndexEven = index !== undefined && index % 2 === 0;
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {nativeEvent} = e;
    const {x} = nativeEvent.contentOffset;
    const width = WIDTH * 0.34444443384806317;
    const index = x / (WIDTH * 0.34444443384806317);
    scrollX.setValue(x * 2.78);

    setCurrentIndex(Math.round(index));
  };
  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    [],
  );
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.UNDER_LINE, colors.GREEN],
        undefined,
      ),
      borderWidth: interpolate(progress.value, [0, 1], [1, 3], undefined),
    };
  });
  return (
    <AnimatedTouchableOpacity
      layout={SequencedTransition}
      entering={ZoomIn.duration(500).randomDelay()}
      style={[
        animatedStyle,
        styles.container,
        {...(isIndexEven && {marginRight: '3%'})},
      ]}
      // onPress={() => {
      //   SetSelectedItems(txt);
      //   progress.value = withTiming(1 - progress.value, {duration: 450});
      // }}
    >
      {/* Top container */}
      <View style={styles.topContainer}>
        {/* title */}
        {/* {topTitle && (
          <View style={styles.topTitleContainer}>
            <Text
              numberOfLines={1}
              textBreakStrategy="balanced"
              style={styles.txt}>
              {topTitle || 'Next task'}
            </Text>
            {true && (
              <CheckBox
                size={16}
                isFilled={true}
                colorFill="transparent"
                borderColor={colors.OFF_WHITE}
                disabled
              />
            )}
          </View>
        )} */}
        {/* <View style={{backgroundColor: 'red', flex: 1}}> */}
        <FlatList
          data={[1, 2]}
          renderItem={props => {
            return (
              <View
                style={{
                  // backgroundColor: 'red',
                  height: HEIGHT * 0.09238579067481956,
                  width: WIDTH * 0.34444443384806317,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <SVG.PizzaWidget
                  height={HEIGHT * 0.09238579067481956}
                  width={WIDTH * 0.34444443384806317}
                />
              </View>
            );
          }}
          onLayout={e => {
            console.log(e.nativeEvent.layout.height / HEIGHT);
          }}
          keyExtractor={keyExtractor}
          onScroll={handleScroll}
          horizontal
          initialScrollIndex={0}
          pagingEnabled
          extraData={{currentIndex}}
          getItemLayout={(item, index) => ({
            index,
            length: WIDTH * 0.34444443384806317,
            offset: WIDTH * 0.34444443384806317 * index,
          })}
          // get
        />
        <SlidingDot
          scrollX={scrollX}
          data={[1, 2]}
          containerStyle={{
            bottom: PAGINATION_SIZE,
            position: 'absolute',
            // justifyContent: 'space-between',
            // alignItems: 'center',
          }}
          slidingIndicatorStyle={{
            // flex: 1,
            // justifyContent: 'center',
            // alignItems: 'center',
            backgroundColor: colors.GREEN,
          }}
          dotStyle={{
            borderWidth: 1,
            backgroundColor: 'transparent',
            borderColor: colors.OFF_WHITE,
            // justifyContent: 'space-between',
            // alignItems: 'center',
            marginRight: PAGINATION_SIZE * 0.5,
            marginLeft: PAGINATION_SIZE * 0.5,
          }}
          // marginHorizontal={12}
          marginHorizontal={PAGINATION_SIZE * 0.5}
          // inActiveDotOpacity={1}
          // expandingDotWidth={PAGINATION_SIZE * 1.5}
        />
        {/* <ExpandingDot
          data={[1, 2]}
          activeDotColor={colors.GREEN}
          scrollX={scrollX}
          containerStyle={{
            bottom: PAGINATION_SIZE,
            position: 'absolute',
            // backgroundColor: 'grey',
            marginRight: 0,
            marginLeft: 0,
            marginHorizontal: 0,
          }}
          // inActiveDotColor={'transparent'}
          dotStyle={{
            width: PAGINATION_SIZE,
            height: PAGINATION_SIZE,
            borderRadius: PAGINATION_SIZE / 2,
            borderColor: constants.colors.OFF_WHITE,
            borderWidth: 1,
            marginRight: 0,
            marginLeft: 0,
            marginHorizontal: 0,
          }}
          inActiveDotOpacity={1}
          expandingDotWidth={PAGINATION_SIZE}
        /> */}
        {/* </View> */}
        {/* topFooter */}
        <View style={styles.topFooterContainer}>
          <Text style={styles.topFooterText}>{topDate || ''}</Text>
          {isArrow && (
            <AntDesign name="right" color={colors.OFF_WHITE} size={12} />
          )}
        </View>
      </View>
      {/* Bottom container */}
      <Animated.View
        style={[
          styles.bottomContainer,
          //   animatedStyle,
          //   {borderColor: colors.GREEN, borderWidth: 1},
        ]}>
        <Text style={styles.bottomTitle}>{bottomTitle || 'Tasks'}</Text>
        <Text style={styles.bottomContent}>
          {bottomContent || 'Follow your next task'}
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
});
