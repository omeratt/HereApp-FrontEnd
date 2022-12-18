import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';

interface props {
  size: number;
  fill?: string;
  borderColor?: string;
}
export default function CircleCheckBox({size, fill, borderColor}: props) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderColor: borderColor ? borderColor : constants.colors.GREY,
          backgroundColor: fill ? fill : constants.colors.OFF_WHITE,
          borderRadius: size / 2,

          elevation: 5,
        },
      ]}></View>
  );
}

const styles = StyleSheet.create({
  circle: {
    // borderRadius: 9999,
    borderWidth: 1,
    borderColor: constants.colors.GREY,

    // width: '0%',
    // height: '0%',
    // flex: 0.00000000000001,
    // borderRadius: 99999,
  },
});
