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
import {FlashList} from '@shopify/flash-list';
import TypeWriter from 'react-native-typewriter';

const {colors} = constants;
const ICON_SIZE = constants.HEIGHT * (29.25 / 896);
const paddingHorizontal = constants.WIDTH * (30.37 / 414);
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
  const prevIndexValue = useSharedValue(0);
  const bgcSharedValue = useSharedValue(0);
  const borderWidthSharedValue = useSharedValue(0);
  const scrollX = React.useRef(new rnAnimated.Value(0)).current;

  const goBack = React.useCallback(() => {
    return navigation.navigate('HomePage' as never);
  }, []);
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {nativeEvent} = e;
    const {x} = nativeEvent.contentOffset;
    // const index = Math.round(x / (constants.WIDTH - paddingHorizontal * 2));
    const index = x / (constants.WIDTH - paddingHorizontal * 2);
    scrollX.setValue(x);

    // if (index === 0) {
    //   borderWidthSharedValue.value = withSpring(0);
    //   bgcSharedValue.value = withSpring(0);
    //   // setCurrentIndex(0);
    // } else {
    //   borderWidthSharedValue.value = withSpring(1);
    //   bgcSharedValue.value = withSpring(1);
    // }
    borderWidthSharedValue.value = index;
    bgcSharedValue.value = index;
    setCurrentIndex(index);
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
      <TouchableOpacity onPress={goBack} style={{alignItems: 'flex-end'}}>
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
          height: constants.HEIGHT * (670 / 896),
          backgroundColor: 'yellow',
        }}>
        <FlashList
          data={[{component: Intro}, {component: Content}, {component: Intro}]}
          renderItem={props => {
            return <props.item.component />;
          }}
          keyExtractor={keyExtractor}
          onScroll={handleScroll}
          horizontal
          initialScrollIndex={0}
          pagingEnabled
          estimatedItemSize={constants.WIDTH - paddingHorizontal * 2}
        />
        {/* <View style={{backgroundColor: 'blue', height: 16}}> */}
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
const Content = () => {
  return (
    <View style={styles.contentView}>
      <Animated.View entering={SlideInLeft.duration(1200)}>
        <View style={{flexDirection: 'row'}}>
          <TypeWriter
            typing={1}
            // loop
            // speed={200}
            // delay={40}
            // textArray={[string]}
            // textStyle={styles.typeWriterText}
            // cursorStyle={styles.typeWriterCursorText}
          >
            <Text style={styles.typeWriterText}>{string}</Text>
          </TypeWriter>
          <Text style={styles.typeWriterCursorText}>|</Text>
        </View>
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
export default IamNotStupid;

const styles = StyleSheet.create({
  typeWriterText: {
    color: 'black',
    fontSize: 24,
  },
  typeWriterCursorText: {
    color: 'green',
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
    paddingHorizontal: constants.HEIGHT * (40 / 896),
    paddingVertical: constants.WIDTH * (31 / 414),
  },
});

const string =
  "Attention deficit disorder(ADD) is a term \
that is sometimes used for one of the \
presentations of attention-deficit \
hyperactivity disorder (ADHD). Attention deficit disorder(ADD) is a term \
that is sometimes used for one of the \
presentations of attention-deficit \
hyperactivity disorder (ADHD). \
.Attention deficit disorder(ADD) is a term that is sometimes used for one of the presentations of attention-deficit \
hyperactivity disorder (ADHD). Attention deficit disorder(ADD) is a term \
that is sometimes used for one of the \
presentations of attention-deficit \
hyperactivity disorder (ADHD). Attention deficit disorder(ADD) is a term \
that is sometimes used for one of the \
presentations of attention-deficit \
hyperactivity disorder (ADHD). \
.Attention deficit disorder(ADD) \
.'.";
