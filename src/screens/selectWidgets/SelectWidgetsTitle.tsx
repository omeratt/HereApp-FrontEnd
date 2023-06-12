import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import constants from '../../assets/constants';
import Animated, {FadeInLeft} from 'react-native-reanimated';
import Line from '../../components/Line';
const {Fonts, HEIGHT, WIDTH, rf, colors} = constants;

const SelectWidgetsTitle = () => {
  return (
    <Animated.View
      entering={FadeInLeft.duration(700).delay(500)}
      style={styles.topContainer}>
      <Text
        numberOfLines={1}
        textBreakStrategy="balanced"
        style={styles.paragraphTxt}>
        Select up to
      </Text>
      <Text
        numberOfLines={1}
        textBreakStrategy="balanced"
        style={styles.paragraphTxt}>
        two widgets that
      </Text>
      <Text style={[styles.paragraphTxt, styles.highLightTxt]}>
        helps you <Text style={styles.paragraphTxt}>in your</Text>
      </Text>
      <View
        style={{
          alignSelf: 'flex-start',
        }}>
        <Text
          numberOfLines={4}
          style={[styles.paragraphTxt, {marginBottom: '5%'}]}>
          home page
        </Text>
        <View>
          <Line
            lengthPercentage={100}
            strength={0.7}
            lineColor={constants.colors.OFF_WHITE}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default SelectWidgetsTitle;

const styles = StyleSheet.create({
  topContainer: {
    height: '23.7723%',
    width: '89%',
    // marginBottom: '7%',
  },
  paragraphTxt: {
    fontFamily: Fonts.paragraph,
    fontSize: 32,
    lineHeight: 28,
    color: colors.OFF_WHITE,
  },
  highLightTxt: {
    color: colors.GREEN,
  },
});
