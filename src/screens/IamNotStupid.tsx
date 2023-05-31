import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import {useNavigation} from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, {FadeInRight, SlideInLeft} from 'react-native-reanimated';
const ICON_SIZE = constants.HEIGHT * (29.25 / 896);
const paddingHorizontal = constants.WIDTH * (30.37 / 414);
const paddingVertical = constants.HEIGHT * (22 / 896);
const stupidSvgWidth = constants.WIDTH * (299 / 414);
const stupidSvgTxtWidth = constants.WIDTH * (347 / 414);
const marginDownFromBackToTxt = constants.HEIGHT * (90 / 896);
const marginDownFromTxtToTxt = constants.HEIGHT * (30 / 896);
const StupidAspectRatio = 224 / 299;
const StupidTxtAspectRatio = 347 / 235;

const IamNotStupid = () => {
  const navigation = useNavigation();
  const goBack = React.useCallback(() => {
    return navigation.navigate('HomePage' as never);
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <AntDesign
          name="leftcircle"
          color={constants.colors.BLACK}
          size={ICON_SIZE}
        />
      </TouchableOpacity>
      <Animated.View entering={SlideInLeft.duration(1200)}>
        <SVG.IAmNotStupid
          style={styles.svgMargins}
          height={stupidSvgWidth * StupidAspectRatio}
          width={stupidSvgWidth}
          // fill={constants.colors.BGC}
          // stroke={constants.colors.BGC}
          // color={constants.colors.BGC}
        />
      </Animated.View>
      <Animated.View
        entering={
          SlideInLeft.duration(1200)
          //   .delay(500)
        }>
        <SVG.IAmNotStupidTxt
          // height={stupidSvgTxtWidth * StupidTxtAspectRatio}
          width={stupidSvgTxtWidth}
        />
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
