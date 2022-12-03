import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import Line from '../components/Line';
import SVG from '../assets/svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function Welcome() {
  const slide = useSharedValue(-260);

  const transformValue = () => {
    slide.value = withTiming(0, {
      duration: 2700,
      easing: Easing.out(Easing.exp),
    });
  };
  const style = useAnimatedStyle(() => {
    return {transform: [{translateX: slide.value}]};
  });
  React.useEffect(() => {
    transformValue();
    return () => {
      slide.value = -260;
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={[styles.cubeContainer, {height: '11.2%'}]}>
        <View
          style={{
            alignItems: 'flex-end',
            width: '21%',
          }}>
          <Line vertical />
        </View>
        <View style={styles.firstLine}>
          <Line />
        </View>
      </View>
      <View style={[styles.cubeContainer, {height: '12%'}]}>
        <View style={styles.secondLine}>
          <Line lengthPercentage={79} />
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: '30.3%',
          flexDirection: 'row',
        }}>
        <View style={{width: '21%', alignItems: 'flex-end'}}>
          <Line vertical />
        </View>
        <Animated.View
          style={[
            {
              width: '79%',
              height: '115%',
              justifyContent: 'center',
              alignItems: 'center',
              // opacity: 0.5,
              // transform: [{translateX: -260}],
            },
            style,
          ]}>
          <SVG.Hi width={220} height={220} />
        </Animated.View>
      </View>

      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          width: '79%',
          height: '23.6%',
        }}>
        <Line vertical lengthPercentage={77} />
      </View>
      <View style={[styles.cubeContainer, {height: '8.8%'}]}>
        <View style={styles.thirdLine}>
          <Line lengthPercentage={79} />
        </View>
      </View>

      <View style={[styles.cubeContainer, {height: '8.8%'}]}>
        <View style={styles.fourthLine}>
          <Line lengthPercentage={79} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    backgroundColor: constants.colors.BGC,
  },
  cubeContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  firstLine: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  secondLine: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  thirdLine: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  fourthLine: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
});
