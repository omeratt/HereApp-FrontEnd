import {SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import Pizza from '../components/playGround/Pizza';
import AaTxt from '../components/playGround/AaTxt';
import Cube from '../components/playGround/Cube';
import TenCircles from '../components/playGround/TenCircles';
import SliderPlay from '../components/playGround/SliderPlay';
import ToggleButton from '../components/playGround/ToggleButton';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {BackHandler} from 'react-native';

const topViewHeight = constants.HEIGHT * 0.15625;
const middleViewHeight = constants.HEIGHT * 0.63996651785714285714285714285714;
const pizzaAndCubeViewWidth =
  constants.WIDTH * 0.6705314009661835748792270531401;
const pizzaAndCubeViewHeight = constants.HEIGHT * 0.2734375;
const pizzaAndCubeSize =
  pizzaAndCubeViewHeight * 0.68406593406593406593406593406593;
const realWidth = constants.WIDTH * 0.94444444444444444444444444444444;
const realHeight = constants.HEIGHT * 0.9485;
const sliderHeight = (middleViewHeight - 2 * pizzaAndCubeViewHeight) * 0.4;
const sliderWidth = pizzaAndCubeViewWidth * 0.6;
const PlayGround = () => {
  const nav = useNavigation();
  const openDrawer = React.useCallback(() => {
    nav.navigate('Menu' as never);
  }, []);
  const goHome = React.useCallback(() => {
    nav.navigate('HomePage' as never);
  }, []);
  const [threeRender, setThreeRender] = React.useState(false);
  // const [isActive, setIsActive] = React.useState(false);
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setIsActive(true);
  //   }, 400);
  // });
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        goHome();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        subscription.remove();
      };
    }, []),
  );
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={styles.container}>
        <View style={styles.realContainer}>
          <View style={styles.topContainer}>
            <View style={styles.topTopContainer}>
              <SVG.XBtn
                onPress={goHome}
                width={constants.WIDTH * 0.115}
                height={constants.WIDTH * 0.115}
              />
              <SVG.HamburgerBtn
                onPress={openDrawer}
                width={constants.WIDTH * 0.115}
                height={constants.WIDTH * 0.115}
              />
            </View>
            <View style={styles.topBottomContainer}>
              <SVG.PlayHere width={'62.56%'} />
            </View>
          </View>
          <View style={styles.middleContainer}>
            <View style={styles.middleLeftContainer}>
              <View style={styles.pizzaAndCubeContainer}>
                {!threeRender && <Pizza size={pizzaAndCubeSize} />}
              </View>
              <View style={styles.pizzaAndCubeContainer}>
                {/* {isActive &&  */}
                <Cube setThreeRender={setThreeRender} />
                {/* } */}
              </View>
              <View style={styles.middleLeftBottomContainer}>
                {!threeRender && (
                  <SliderPlay
                    sliderHeight={sliderHeight}
                    sliderWidth={sliderWidth}
                  />
                )}
              </View>
            </View>
            <View style={styles.middleRightContainer}>
              {!threeRender && <TenCircles viewHeight={middleViewHeight} />}
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.bottomLeftContainer}>
              {!threeRender && <ToggleButton />}
            </View>
            <View style={styles.bottomRightContainer}>
              {!threeRender && <AaTxt />}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PlayGround;

const styles = StyleSheet.create({
  realContainer: {
    height: constants.HEIGHT * 0.93,
    width: constants.WIDTH * 0.95,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: constants.colors.OFF_WHITE,
  },
  container: {
    // paddingVertical: '5%',
    height: constants.HEIGHT,
    width: constants.WIDTH,
    backgroundColor: constants.colors.BGC,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    height: topViewHeight,
    width: '100%',
    borderBottomColor: constants.colors.OFF_WHITE,
    borderBottomWidth: 1,
  },
  topTopContainer: {
    width: '100%',
    height: '35%',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  topBottomContainer: {
    width: '100%',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
  middleContainer: {
    height: middleViewHeight,
    width: realWidth,
    borderBottomColor: constants.colors.OFF_WHITE,
    borderBottomWidth: 1,
    flexDirection: 'row',
    // backgroundColor: 'blue',
  },
  pizzaAndCubeContainer: {
    height: pizzaAndCubeViewHeight,
    // width: pizzaAndCubeViewHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: constants.colors.OFF_WHITE,
    borderBottomWidth: 1,
    // backgroundColor: 'red',
  },
  middleLeftContainer: {
    width: pizzaAndCubeViewWidth,
    height: '100%',
    // backgroundColor: 'red',
    borderRightColor: constants.colors.OFF_WHITE,
    borderRightWidth: 1,
  },
  middleRightContainer: {
    height: '100%',
    width: realWidth - pizzaAndCubeViewWidth,
  },
  middleLeftBottomContainer: {
    height: middleViewHeight - 2 * pizzaAndCubeViewHeight,
    width: pizzaAndCubeViewWidth,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  bottomContainer: {
    // height: realHeight - middleViewHeight - topViewHeight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // backgroundColor: 'cyan',
  },
  bottomLeftContainer: {
    width: pizzaAndCubeViewWidth,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: constants.colors.OFF_WHITE,
    borderRightWidth: 1,
    // backgroundColor: 'cyan',
  },
  bottomRightContainer: {
    // backgroundColor: 'cyan',
    width: realWidth - pizzaAndCubeViewWidth,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
