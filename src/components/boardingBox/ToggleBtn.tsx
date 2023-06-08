import {StyleSheet, ViewStyle} from 'react-native';
import React, {useEffect} from 'react';
import SwitchToggle from 'react-native-switch-toggle';
import constants from '../../assets/constants';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
const WIDTH = constants.WIDTH * 0.6705314009661835748792270531401;

interface ToggleBtnProps {
  height?: number;
  width?: number;
}

const ToggleBtn: React.FC<ToggleBtnProps> = ({height = 0, width = 0}) => {
  const [isOn, toggle] = React.useState(false);
  const isFullScreen = React.useMemo(() => {
    const tempH = height;
    const tempW = width;

    if (tempH < tempW) {
      const temp = height;
      height = width;
      width = temp;
    }
    return tempH < tempW;
  }, [height, width, isOn]);
  const translateValue = useSharedValue('0deg');
  const Toggle = React.useCallback(() => {
    toggle(!isOn);
  }, [isOn]);
  useEffect(() => {
    translateValue.value = withSpring(isFullScreen ? '0deg' : '90deg');
  }, [isFullScreen, isOn]);

  const toggleContent: ViewStyle = {
    width: height * (4.55 / 6),
    height: width * 0.35,
    borderRadius: 999,
    padding: height * (4.55 / 6) * 0.04,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
  };
  const fullScreenContent: ViewStyle = {
    width: height * (4.55 / 6),
    height: width * 0.45,
    borderRadius: 999,
    padding: height * (4.55 / 6) * 0.02,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
  };
  const circleStyle: ViewStyle = {
    width: isFullScreen ? width * 0.4 : width * 0.3,
    height: isFullScreen ? width * 0.4 : width * 0.3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
  };
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{rotateZ: translateValue}],
        // ...(!isFullScreen && {transform: [{rotateZ: translateValue}]}),
      }}>
      <SwitchToggle
        switchOn={isOn}
        onPress={Toggle}
        backgroundColorOff={'transparent'}
        backgroundColorOn={'transparent'}
        circleColorOn={'transparent'}
        circleColorOff={constants.colors.GREEN}
        duration={350}
        containerStyle={isFullScreen ? fullScreenContent : toggleContent}
        circleStyle={circleStyle}
      />
    </Animated.View>
  );
};

export default ToggleBtn;

const styles = StyleSheet.create({
  toggleContent: {
    width: WIDTH * 0.6,
    height: WIDTH * 0.25,
    borderRadius: 40,
    padding: 3,
    borderWidth: 1,
    borderColor: constants.colors.OFF_WHITE,
    backgroundColor: 'grey',
  },
  circleStyle: {
    width: WIDTH * 0.22,
    height: WIDTH * 0.22,
    borderRadius: (WIDTH * 0.22) / 2,
    borderWidth: 1,
    borderColor: constants.colors.OFF_WHITE,
  },
});
