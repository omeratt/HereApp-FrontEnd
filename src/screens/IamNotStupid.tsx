import {
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
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import AnimatedTyping from '../components/TypeWriter';
import {useAppDispatch} from '../app/hooks';
import {setFocus} from '../app/Reducers/User/screensSlice';
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
    // return navigation.navigate('HomePage' as never);
    return navigation.goBack();
  }, []);
  const navToMenu = React.useCallback(() => {
    return navigation.navigate('Menu' as never);
  }, []);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const subscribe = navigation.addListener('focus', e => {
      dispatch(setFocus({stupid: true}));
    });
    return subscribe;
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {nativeEvent} = e;
    const {x} = nativeEvent.contentOffset;
    const index = x / (constants.WIDTH - paddingHorizontal * 2);
    scrollX.setValue(x);
    if (index <= 1) borderWidthSharedValue.value = index;
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
          // backgroundColor: 'red',
          marginTop: '3%',
        }}>
        <FlashList
          data={[
            {component: Intro},
            {component: Content, text: string},
            {component: Content, text: ADHDDescription},
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
        <SVG.IAmNotStupid
          style={styles.svgMargins}
          height={stupidSvgWidth * StupidAspectRatio}
          width={stupidSvgWidth}
        />
      </Animated.View>
      <Animated.View entering={SlideInLeft.duration(1200)}>
        <SVG.StupidSubTitle width={stupidSvgSubtitleWidth} />
      </Animated.View>
    </View>
  );
};
const Content = ({item, index, extraData}: ListRenderItemInfo<any>) => {
  const {currentIndex} = extraData;
  return (
    <View style={styles.contentView}>
      {currentIndex > 0 && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          {/* <View style={{flexDirection: 'row'}}> */}
          <Text
            adjustsFontSizeToFit
            allowFontScaling={false}
            style={[
              styles.typeWriterText,
              {
                fontFamily: Fonts.text_medium,
                marginBottom: '6.5%',
              },
            ]}>
            Im not stupid
          </Text>

          <AnimatedTyping
            text={[item.text]}
            style={styles.typeWriterText}
            cursorStyle={styles.typeWriterCursorText}
            cursorColor={colors.GREEN}
          />
        </Animated.View>
      )}
    </View>
  );
};
export default IamNotStupid;
const styles = StyleSheet.create({
  typeWriterText: {
    fontFamily: Fonts.text,
    // fontSize: rf(13.00000156),
    fontSize: rf(18),
    // fontSize: 15,
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
.' + '\n';

const ADHDDescription =
  "Living with ADHD can be an overwhelming experience. The constant struggle to maintain focus, stay organized, and manage impulses can be frustrating. However, it's crucial to understand that individuals with ADHD are not stupid. In fact, their minds are often brimming with creativity, intuition, and unique perspectives. ADHD presents challenges, but it doesn't define intelligence. Our app aims to empower and support individuals with ADHD, providing tools to enhance productivity, improve time management, and celebrate the incredible strengths and abilities that come with neurodiversity." +
  '\n';
