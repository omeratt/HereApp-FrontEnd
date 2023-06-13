import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated as rnAnimated,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import {useNavigation} from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, {
  FadeInRight,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  withSpring,
  FadeOut,
  FadeIn,
} from 'react-native-reanimated';
import {
  ExpandingDot,
  LiquidLike,
  SlidingDot,
} from 'react-native-animated-pagination-dots';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import AnimatedTyping from '../components/TypeWriter';
import {useAppDispatch} from '../app/hooks';
import {setFocus} from '../app/Reducers/User/screensSlice';
const {colors, rf, Fonts} = constants;
const ICON_SIZE = constants.HEIGHT * (29.25 / 896);
const paddingHorizontal = constants.WIDTH * (20.37 / 414);
const paddingVertical = constants.HEIGHT * (22 / 896);
const stupidSvgSize = constants.HEIGHT * (353 / 896);
const stupidSvgTxtWidth = constants.WIDTH * (347 / 414);
const stupidSvgSubtitleWidth = constants.WIDTH * (236 / 414);
const marginDownFromBackToTxt = constants.HEIGHT * (90 / 896);
const marginDownFromTxtToTxt = constants.HEIGHT * (30 / 896);
const StupidAspectRatio = 224 / 299;
const StupidTxtAspectRatio = 347 / 235;
const PAGINATION_SIZE = 16;
const TimeTips = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const opacityValue = useSharedValue(1);
  const bgcSharedValue = useSharedValue(0);
  const borderWidthSharedValue = useSharedValue(0);
  const scrollX = React.useRef(new rnAnimated.Value(0)).current;

  const goBack = React.useCallback(() => {
    return navigation.goBack();
  }, [navigation]);
  const navToMenu = React.useCallback(() => {
    return navigation.navigate('Menu' as never);
  }, []);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const subscribe = navigation.addListener('focus', e => {
      dispatch(setFocus({timeTips: true}));
    });
    return subscribe;
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {nativeEvent} = e;
    const {x} = nativeEvent.contentOffset;
    const index = x / (constants.WIDTH - paddingHorizontal * 2);
    scrollX.setValue(x);

    borderWidthSharedValue.value = index;
    bgcSharedValue.value = index;
    opacityValue.value = 1 - index;
    setCurrentIndex(Math.round(index));
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        bgcSharedValue.value,
        [0, 1],
        [colors.GREEN, colors.OFF_WHITE],
        undefined,
        {gamma: 6},
      ),
    };
  });
  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    [],
  );
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        onPress={navToMenu}
        style={{
          alignSelf: 'flex-end',
        }}>
        <SVG.HamburgerFixed
          stroke={constants.colors.BLACK}
          width={constants.WIDTH * 0.115}
          height={constants.WIDTH * 0.115}
        />
      </TouchableOpacity>

      <Animated.View
        style={{
          borderWidth: borderWidthSharedValue,
          borderRadius: 30,
          borderColor: colors.UNDER_LINE,
          width: '100%',
          height: constants.HEIGHT * (680 / 896),
          marginTop: '3%',
        }}>
        <FlashList
          data={[
            {component: Intro},
            {component: Content, content: textPart1},
            {component: Content, content: textPart2},
          ]}
          renderItem={props => {
            return <props.item.component {...props} />;
          }}
          keyExtractor={keyExtractor}
          onScroll={handleScroll}
          horizontal
          initialScrollIndex={0}
          pagingEnabled
          extraData={{currentIndex}}
          estimatedItemSize={constants.WIDTH - paddingHorizontal * 1}
        />
        <Animated.Text
          style={[
            styles.swipeText,
            {
              position: 'absolute',
              bottom: PAGINATION_SIZE * 2.5,
              alignSelf: 'center',
              opacity: opacityValue,
            },
          ]}>
          Swipe for reading
        </Animated.Text>
        <ExpandingDot
          data={[1, 2, 3]}
          activeDotColor={colors.GREEN}
          scrollX={scrollX}
          containerStyle={{
            bottom: PAGINATION_SIZE,
            position: 'absolute',
          }}
          inActiveDotColor={currentIndex ? colors.OFF_WHITE : colors.GREEN}
          dotStyle={{
            width: PAGINATION_SIZE,
            height: PAGINATION_SIZE,
            borderRadius: PAGINATION_SIZE / 2,
            borderColor: constants.colors.BLACK,
            borderWidth: 1,
          }}
          inActiveDotOpacity={1}
          expandingDotWidth={30}
        />
        {/* </View> */}
      </Animated.View>
      <TouchableOpacity onPress={goBack}>
        <SVG.XBtnFixed
          stroke={constants.colors.BLACK}
          style={{alignSelf: 'center', marginTop: '5%'}}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const Intro = () => {
  return (
    <View style={{width: constants.WIDTH - paddingHorizontal * 2}}>
      <Animated.View entering={SlideInLeft.duration(1200)}>
        <SVG.TimeTips
          style={styles.svgMargins}
          // height={353}
          // width={stupidSvgWidth}
          height={stupidSvgSize}
          // width={stupidSvgWidth}
        />
      </Animated.View>
    </View>
  );
};
const Content = ({item, index, extraData}: ListRenderItemInfo<any>) => {
  const {currentIndex} = extraData;
  const {content} = item;
  return (
    <View style={styles.contentView}>
      {currentIndex > 0 && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          {/* <View style={{flexDirection: 'row'}}> */}
          <Text
            style={[
              styles.typeWriterText,
              {
                fontFamily: Fonts.text_medium,
                marginBottom: '6.5%',
              },
            ]}
            adjustsFontSizeToFit
            textBreakStrategy="balanced">
            About time and how can we use it better
          </Text>

          <AnimatedTyping
            text={[content]}
            style={styles.typeWriterText}
            cursorStyle={styles.typeWriterCursorText}
            cursorColor={colors.GREEN}
          />
        </Animated.View>
      )}
    </View>
  );
};
export default TimeTips;
const styles = StyleSheet.create({
  typeWriterText: {
    fontFamily: Fonts.text,
    fontSize: 15,
    color: colors.BLACK,
    lineHeight: rf(23),
  },
  swipeText: {
    fontFamily: Fonts.text,
    fontSize: rf(15),
    color: colors.BLACK,
  },
  typeWriterCursorText: {
    color: colors.GREEN,
    fontSize: 24,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: constants.colors.GREEN,
    paddingHorizontal,
    paddingVertical,
  },
  svgMargins: {
    marginTop: marginDownFromBackToTxt,
    marginBottom: marginDownFromTxtToTxt,
  },
  contentView: {
    width: constants.WIDTH - paddingHorizontal * 2,
    height: constants.HEIGHT * (670 / 896) - PAGINATION_SIZE * 2,
    paddingHorizontal: constants.WIDTH * (40 / 896),
    paddingVertical: constants.HEIGHT * (11 / 414),
  },
});

const textPart1 =
  'Time is a valuable resource that often slips away unnoticed. Just like attention deficit disorder (ADD) can hinder focus, poor time management leads to inefficiency. Prioritize tasks, set clear goals, and create a schedule. Minimize distractions to optimize productivity and make the most of your time. Time can feel subjective, either rushing by or dragging on. Practice mindfulness to ground yourself in the present moment. Incorporate breaks and leisure activities for balance. Reflect on past time usage, set goals, and take actionable steps to improve time management. Make each moment count';

const textPart2 =
  "By consciously managing your time, you gain control over how you invest your moments. Embrace the power of intentionality and make deliberate choices aligned with your priorities. Regularly assess your progress and make adjustments to your schedule and goals. Remember, it's not just about being busy, but being purposeful. Be mindful of the present, appreciating the richness of each passing second. Take breaks to rejuvenate and recharge, fueling your productivity and creativity. Find harmony between work and leisure, allowing yourself to indulge in activities that bring joy and fulfillment. With focused effort and a mindful approach, you can unlock the true potential of time and live a more balanced, fulfilling life.";
