import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SwitchToggle from 'react-native-switch-toggle';
import constants from '../../assets/constants';
const WIDTH = constants.WIDTH * 0.6705314009661835748792270531401;
const ToggleButton = () => {
  const [isOn, toggle] = React.useState(false);
  const Toggle = React.useCallback(() => {
    toggle(!isOn);
  }, [isOn]);
  return (
    <SwitchToggle
      switchOn={isOn}
      onPress={Toggle}
      backgroundColorOff={'transparent'}
      backgroundColorOn={'transparent'}
      circleColorOn={'transparent'}
      circleColorOff={constants.colors.GREEN}
      duration={350}
      containerStyle={styles.toggleContent}
      circleStyle={styles.circleStyle}
    />
  );
};

export default ToggleButton;

const styles = StyleSheet.create({
  toggleContent: {
    width: WIDTH * 0.6,
    height: WIDTH * 0.25,
    borderRadius: 40,
    padding: 3,
    borderWidth: 1,
    borderColor: constants.colors.OFF_WHITE,
  },
  circleStyle: {
    width: WIDTH * 0.22,
    height: WIDTH * 0.22,
    borderRadius: (WIDTH * 0.22) / 2,
    borderWidth: 1,
    borderColor: constants.colors.OFF_WHITE,
  },
});
