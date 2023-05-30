import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import {useNavigation} from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
const ICON_SIZE = constants.HEIGHT * (29.25 / 896);
const paddingHorizontal = constants.WIDTH * (30.37 / 414);
const paddingVertical = constants.HEIGHT * (22 / 896);
const stupidSvgWidth = constants.WIDTH * (299 / 414);
const stupidSvgTxtWidth = constants.WIDTH * (347 / 414);
const marginDownFromBackToTxt = constants.HEIGHT * (90 / 896);
const marginDownFromTxtToTxt = constants.HEIGHT * (20 / 896);
const StupidAspectRatio = 299 / 283;
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
      <SVG.IAmNotStupid
        style={styles.svgMargins}
        height={stupidSvgWidth * StupidAspectRatio}
        width={stupidSvgWidth}
      />
      <SVG.IAmNotStupidTxt
        // height={stupidSvgTxtWidth * StupidTxtAspectRatio}
        width={stupidSvgTxtWidth}
      />
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
  },
});
