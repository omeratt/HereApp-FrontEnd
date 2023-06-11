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
import React, {useState} from 'react';
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
    const index = Math.round(x / (constants.WIDTH - paddingHorizontal * 2));
    scrollX.setValue(x);

    if (index === 0) {
      borderWidthSharedValue.value = withSpring(0);
      bgcSharedValue.value = withSpring(0);
      // setCurrentIndex(0);
    } else {
      borderWidthSharedValue.value = withSpring(1);
      bgcSharedValue.value = withSpring(1);
    }
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
        }}>
        <FlashList
          data={[{component: Intro}, {component: Intro}, {component: Intro}]}
          renderItem={props => {
            return <props.item.component />;
          }}
          onScroll={handleScroll}
          horizontal
          pagingEnabled
          estimatedItemSize={constants.WIDTH - paddingHorizontal * 2}
        />

        <ExpandingDot
          data={[1, 2, 3]}
          activeDotColor={colors.GREEN}
          scrollX={scrollX}
          containerStyle={
            {
              // backgroundColor: 'transparent',
            }
          }
          inActiveDotColor={currentIndex ? colors.OFF_WHITE : colors.GREEN}
          dotStyle={{
            width: 16,
            height: 16,
            borderRadius: 8,
            marginHorizontal: 5,
            borderColor: constants.colors.BLACK,
            borderWidth: 1,
            opacity: 0,
          }}
          inActiveDotOpacity={1}
          expandingDotWidth={30}
        />
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

export default IamNotStupid;

const styles = StyleSheet.create({
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
});
