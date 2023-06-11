import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import constants from '../../assets/constants';
import SVG from '../../assets/svg';
import {useNavigation} from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, {
  FadeIn,
  FadeInRight,
  SlideInLeft,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import AnimatedTyping from '../TypeWriter';
const ICON_SIZE = constants.HEIGHT * (29.25 / 896);
const paddingVertical = constants.HEIGHT * (18 / 896);
const stupidSvgWidth = constants.WIDTH * (150 / 414);
const StupidAspectRatio = 108 / 150;
const {rf, Fonts, colors} = constants;
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
interface ITimeManage {
  height?: number;
  width?: number;
}
const TimeManage: React.FC<ITimeManage> = ({width, height}) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const opacity = useSharedValue(1);
  const zIndex = useSharedValue(1);
  const marginDownFromTxtToTxt = (height || 108) * (18 / 896);
  const navigation = useNavigation();
  const navigateToTimeTipsScreen = React.useCallback(() => {
    return navigation.navigate('TimeTips' as never);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY < stupidSvgWidth * StupidAspectRatio) {
      opacity.value = withSpring(1);
      return;
    }
    opacity.value = withSpring(0.3);
  };
  const onLayout = (e: LayoutChangeEvent) => {
    const {height, width} = e.nativeEvent.layout;
    setIsFullScreen(height < width);
  };
  return (
    <>
      {isFullScreen && (
        <AnimatedTouchableOpacity
          onPress={navigateToTimeTipsScreen}
          entering={FadeIn}
          style={{
            position: 'absolute',
            right: '6.48%',
            opacity,
            zIndex,
            top: paddingVertical,
          }}>
          <AntDesign
            name="rightcircleo"
            color={constants.colors.BLACK}
            size={ICON_SIZE}
          />
        </AnimatedTouchableOpacity>
      )}
      <Animated.ScrollView
        contentContainerStyle={{paddingVertical}}
        style={styles.container}
        fadingEdgeLength={150}
        onLayout={onLayout}
        onScroll={handleScroll}
        scrollEnabled={isFullScreen}>
        <Animated.View
          entering={SlideInLeft.duration(1200)}
          style={{
            // flexDirection: isFullScreen ? 'row-reverse' : 'column',
            // justifyContent: isFullScreen ? 'space-between' : 'flex-start',
            overflow: 'visible',
            marginBottom: marginDownFromTxtToTxt,
          }}>
          {/* {isFullScreen && (
            <TouchableOpacity onPress={goBack}>
              <AntDesign
                name="rightcircleo"
                color={constants.colors.BLACK}
                size={ICON_SIZE}
              />
            </TouchableOpacity>
          )} */}
          {/* <SVG.TimeTips
            height={stupidSvgWidth * StupidAspectRatio}
            width={stupidSvgWidth}
            style={{marginLeft: '-9.7%'}}
          /> */}
          <AnimatedTyping
            text={['About Time & How Can We Use It Better?']}
            cursorColor={constants.colors.GREEN}
            style={{
              color: colors.BLACK,
              fontFamily: Fonts.text_medium,
              fontWeight: 'bold',
              width: stupidSvgWidth,
              fontSize: rf(20),
            }}
          />
        </Animated.View>
        <Animated.View
          style={{
            overflow: 'visible',
          }}
          entering={SlideInLeft.duration(1200)}>
          {isFullScreen ? (
            <AnimatedTyping
              text={[
                'Value time, use it wisely. Prioritize, schedule, minimize distractions. Optimize productivity, achieve goals. Embrace mindfulness, make conscious choices. Time is precious, make it count.',
              ]}
              cursorColor={constants.colors.GREEN}
              style={{
                color: colors.UNDER_LINE,
                fontFamily: constants.Fonts.text,
              }}
            />
          ) : (
            <View style={{alignSelf: 'flex-start'}}>
              <AnimatedTyping
                text={['Read about manage time']}
                style={{
                  fontFamily: Fonts.text,
                  fontSize: rf(11),
                  color: colors.BLACK,
                }}
                cursorColor={constants.colors.GREEN}
              />
              <TouchableOpacity
                onPress={navigateToTimeTipsScreen}
                style={{alignSelf: 'flex-end', marginTop: ICON_SIZE / 2}}>
                <AntDesign
                  name="rightcircleo"
                  color={constants.colors.BLACK}
                  size={ICON_SIZE / 1.2}
                />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>
    </>
  );
};

export default TimeManage;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: constants.colors.GREEN,
    paddingRight: '6.48%',
    paddingLeft: '5%',
    // paddingBottom: paddingHorizontal * 5,
    overflow: 'visible',
    zIndex: -1,
  },
});
