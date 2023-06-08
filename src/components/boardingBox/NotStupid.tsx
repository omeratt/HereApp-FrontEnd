import {
  LayoutChangeEvent,
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
import Animated, {FadeInRight, SlideInLeft} from 'react-native-reanimated';
const ICON_SIZE = constants.HEIGHT * (29.25 / 896);
const paddingHorizontal = constants.WIDTH * (30.37 / 414);
const paddingVertical = constants.HEIGHT * (18 / 896);
const stupidSvgWidth = constants.WIDTH * (150 / 414);
const stupidSvgTxtWidth = constants.WIDTH * (347 / 414);
const StupidAspectRatio = 108 / 150;
const StupidTxtAspectRatio = 347 / 235;
const {rf, Fonts, colors} = constants;

interface INotStupid {
  height?: number;
  width?: number;
}
const NotStupid: React.FC<INotStupid> = ({width, height}) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const marginDownFromBackToTxt = (height || 108) * (90 / 896);
  const marginDownFromTxtToTxt = (height || 108) * (18 / 896);
  const navigation = useNavigation();
  const goBack = React.useCallback(() => {
    return navigation.navigate('HomePage' as never);
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const {height, width} = e.nativeEvent.layout;
    setIsFullScreen(height < width);
  };
  return (
    <Animated.ScrollView
      contentContainerStyle={{paddingVertical}}
      style={styles.container}
      fadingEdgeLength={150}
      onLayout={onLayout}
      scrollEnabled={isFullScreen}>
      <Animated.View
        entering={SlideInLeft.duration(1200)}
        style={{
          flexDirection: isFullScreen ? 'row-reverse' : 'column',
          justifyContent: isFullScreen ? 'space-between' : 'flex-start',
          overflow: 'visible',
          marginBottom: marginDownFromTxtToTxt,
        }}>
        {isFullScreen && (
          <TouchableOpacity onPress={goBack}>
            <AntDesign
              name="rightcircleo"
              color={constants.colors.BLACK}
              size={ICON_SIZE}
            />
          </TouchableOpacity>
        )}
        <SVG.IAmNotStupid
          height={stupidSvgWidth * StupidAspectRatio}
          width={stupidSvgWidth}
          // fill={constants.colors.BGC}
          // stroke={constants.colors.BGC}
          // color={constants.colors.BGC}
          style={{marginLeft: '-1.7%'}}
        />
      </Animated.View>
      <Animated.View
        style={{
          overflow: 'visible',
        }}
        entering={SlideInLeft.duration(1200)}>
        {isFullScreen ? (
          <SVG.IAmNotStupidTxt
            //   height={stupidSvgTxtWidth * StupidTxtAspectRatio}
            width={'100%'}
          />
        ) : (
          <View style={{alignSelf: 'flex-start'}}>
            <Text
              style={{
                fontFamily: Fonts.text,
                fontSize: rf(11),
                color: colors.BLACK,
              }}>
              Read about having ADHD
            </Text>
            <TouchableOpacity
              onPress={goBack}
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
  );
};

export default NotStupid;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    // backgroundColor: constants.colors.GREEN,
    paddingRight: '6.48%',
    paddingLeft: '5%',
    // paddingBottom: paddingHorizontal * 5,
    overflow: 'visible',
  },
});
