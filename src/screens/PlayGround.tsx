import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import Line from '../components/Line';
import Pizza from '../components/playGroud/Pizza';
import AaTxt from '../components/playGroud/AaTxt';

const bottomContainerHeight =
  constants.HEIGHT * 0.7271205357142 -
  constants.HEIGHT * 0.42075892857142857142857142857143;
const pizzaSize = bottomContainerHeight * 0.68406593406593406593406593406593;
const PlayGround = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.topSubContainer}>
          <View style={styles.leftTopContainer}>
            <TouchableOpacity
              style={styles.fullSizeAndCenter}
              onPress={() => {}}>
              <SVG.PlayGroundX width={'80%'} />
            </TouchableOpacity>
            <Line vertical />
          </View>
          <View style={styles.rightTopContainer}>
            <SVG.PlayHere width={'87%'} />
          </View>
        </View>
        <Line />
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.rowAndCenter}>
          <View style={styles.middleLeftContainer}>
            <View style={styles.middleLeftTopContainer}>
              <View style={styles.middleLeftTopLeftContainer}></View>
              <View style={styles.middleLeftTopRightContainer}>
                <View style={styles.rowAndCenter}>
                  <Line vertical />

                  <AaTxt />
                </View>
              </View>
            </View>
            <Line />
            <View style={styles.middleLeftBottomContainer}>
              <Pizza size={pizzaSize} />
            </View>
          </View>
          <Line vertical />
          <View style={styles.middleRightContainer}></View>
        </View>
        <Line />
      </View>
      <View style={[styles.bottomContainer, styles.rowAndCenter]}>
        <View style={styles.bottomLeftContainer}></View>
        <Line vertical />
        <View style={styles.bottomRightContainer}></View>
      </View>
    </View>
  );
};

export default PlayGround;

const styles = StyleSheet.create({
  topATxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: constants.HEIGHT * 0.16,
  },
  bottomATxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.GREEN,
    fontSize: constants.HEIGHT * 0.14,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: constants.colors.BGC,
  },
  topContainer: {
    width: '100%',
  },
  topSubContainer: {
    height: constants.HEIGHT * 0.1171875,
    width: '100%',
    flexDirection: 'row',
  },
  leftTopContainer: {
    width: '12.077%',
    flexDirection: 'row',
  },
  rightTopContainer: {
    width: `${100 - 12.077}%`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    height: constants.HEIGHT * 0.7271205357142,
    width: '100%',
    // flexDirection: 'row',
    // backgroundColor: 'blue',
  },
  middleLeftContainer: {
    width: constants.WIDTH * 0.7294685990338164251207729468599,
    height: '100%',
    // backgroundColor: 'cyan',
  },
  middleLeftTopContainer: {
    height: constants.HEIGHT * 0.42075892857142857142857142857143,
    width: '100%',
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  middleLeftTopLeftContainer: {
    width: (constants.WIDTH * 0.7294685990338164251207729468599) / 2,
    height: '100%',
    // backgroundColor: 'red',
  },
  middleLeftTopRightContainer: {
    width: (constants.WIDTH * 0.7294685990338164251207729468599) / 2,
    height: '100%',
    // backgroundColor: 'blue',
  },
  middleLeftBottomContainer: {
    height: bottomContainerHeight,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  middleRightContainer: {
    // backgroundColor: 'cyan',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {},
  bottomLeftContainer: {
    width: constants.WIDTH * 0.7294685990338164251207729468599,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRightContainer: {
    // backgroundColor: 'cyan',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullSizeAndCenter: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAndCenter: {width: '100%', height: '100%', flexDirection: 'row'},
});
