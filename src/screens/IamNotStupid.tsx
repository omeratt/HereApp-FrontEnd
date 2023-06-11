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
import React, {useCallback, useState} from 'react';
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
} from 'react-native-reanimated';
import {
  ExpandingDot,
  LiquidLike,
  SlidingDot,
} from 'react-native-animated-pagination-dots';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import AnimatedTyping from '../components/TypeWriter';
const {colors, rf, Fonts} = constants;
const ICON_SIZE = constants.HEIGHT * (29.25 / 896);
const paddingHorizontal = constants.WIDTH * (20.37 / 414);
const paddingVertical = constants.HEIGHT * (22 / 896);
const stupidSvgWidth = constants.WIDTH * (299 / 414);
const stupidSvgTxtWidth = constants.WIDTH * (347 / 414);
const stupidSvgSubtitleWidth = constants.WIDTH * (236 / 414);
const marginDownFromBackToTxt = constants.HEIGHT * (90 / 896);
const marginDownFromTxtToTxt = constants.HEIGHT * (30 / 896);
const StupidAspectRatio = 224 / 299;
const StupidTxtAspectRatio = 347 / 235;
const PAGINATION_SIZE = 16;
const IamNotStupid = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const opacityValue = useSharedValue(1);
  const bgcSharedValue = useSharedValue(0);
  const borderWidthSharedValue = useSharedValue(0);
  const scrollX = React.useRef(new rnAnimated.Value(0)).current;

  const goBack = React.useCallback(() => {
    return navigation.navigate('HomePage' as never);
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
        onPress={goBack}
        style={{
          // backgroundColor: 'red',
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
          data={[{component: Intro}, {component: Content}, {component: Intro}]}
          renderItem={props => {
            return <props.item.component {...props} />;
          }}
          keyExtractor={keyExtractor}
          onScroll={handleScroll}
          horizontal
          initialScrollIndex={0}
          pagingEnabled
          extraData={{currentIndex}}
          estimatedItemSize={constants.WIDTH - paddingHorizontal * 2}
        />
        {/* <View style={{backgroundColor: 'blue', height: 16}}> */}
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
      <SVG.XBtnFixed
        stroke={constants.colors.BLACK}
        style={{alignSelf: 'center', marginTop: '5%'}}
      />
    </Animated.View>
  );
};

const Intro = () => {
  return (
    <View style={{width: constants.WIDTH - paddingHorizontal * 2}}>
      <Animated.View entering={SlideInLeft.duration(1200)}>
        <SVG.IAmNotStupid
          style={styles.svgMargins}
          height={stupidSvgWidth * StupidAspectRatio}
          width={stupidSvgWidth}
        />
      </Animated.View>
      <Animated.View
        entering={
          SlideInLeft.duration(1200)
          //   .delay(500)
        }>
        <SVG.StupidSubTitle width={stupidSvgSubtitleWidth} />
      </Animated.View>
    </View>
  );
};
const Content = ({item, index, extraData}: ListRenderItemInfo<any>) => {
  const {currentIndex} = extraData;
  return (
    <View style={styles.contentView}>
      <Animated.View entering={SlideInLeft.duration(1200)}>
        {/* <View style={{flexDirection: 'row'}}> */}
        <Text
          style={[
            styles.typeWriterText,
            {
              fontFamily: Fonts.text_medium,
              marginBottom: '6.5%',
            },
          ]}>
          Im not stupid
        </Text>
        {currentIndex > 0 && (
          <AnimatedTyping
            text={[string]}
            style={styles.typeWriterText}
            cursorStyle={styles.typeWriterCursorText}
            cursorColor={colors.GREEN}
          />
        )}
      </Animated.View>
    </View>
  );
};
export default IamNotStupid;
const styles = StyleSheet.create({
  typeWriterText: {
    fontFamily: Fonts.text,
    fontSize: rf(14),
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
    // backgroundColor: 'red',
    // color: constants.colors.BGC,
    // fill: constants.colors.BGC,
  },
  contentView: {
    width: constants.WIDTH - paddingHorizontal * 2,
    // backgroundColor: 'red',
    height: constants.HEIGHT * (670 / 896) - PAGINATION_SIZE * 2,
    paddingHorizontal: constants.WIDTH * (40 / 896),
    paddingVertical: constants.HEIGHT * (11 / 414),
    // backgroundColor: 'yellow',
  },
});

const string =
  'Attention deficit disorder(ADD) is a term \
that is sometimes used for one of the \
presentations of attention-deficit \
hyperactivity disorder (ADHD). Attention deficit disorder(ADD) is a term \
that is sometimes used for one of the \
presentations of attention-deficit \
hyperactivity disorder (ADHD). \
Attention deficit disorder(ADD) is a term that is sometimes used for one of the presentations of attention-deficit \
hyperactivity disorder (ADHD). Attention deficit disorder(ADD) is a term \
that is sometimes used for one of the \
presentations of attention-deficit \
hyperactivity disorder (ADHD). Attention deficit disorder(ADD) is a term \
that is sometimes used for one of the \
presentations of attention-deficit \
hyperactivity disorder (ADHD). \
Attention deficit disorder(ADD) \
.';
