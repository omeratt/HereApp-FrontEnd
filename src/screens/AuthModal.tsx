import {ListRenderItem, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import constants from '../assets/constants';
import {TouchableOpacity} from 'react-native';
import SVG from '../assets/svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  WithSpringConfig,
  withSpring,
} from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const ZERO = 0.00000000000000001;
export const SPRING_CONFIG: WithSpringConfig = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
  mass: 130,
};
interface RenderItemProps {
  navigationTxt?: string;
  bottomTxt?: string;
  nextPage: () => void;
  component?: JSX.Element;
}

export default function AuthModal() {
  const ref = React.useRef<FlatList>(null);
  const flex = useSharedValue(ZERO);
  const style = useAnimatedStyle(() => {
    return {flex: flex.value};
  });
  const transformValue = (toValue: number, duration: number = 130) => {
    flex.value = withSpring(toValue, {...SPRING_CONFIG, mass: duration});
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      transformValue(1.7);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const goToSignUp = () => {
    ref.current?.scrollToIndex({index: 1, animated: true});
    transformValue(5, 1.5);
  };
  const goToSignIn = () => {
    ref.current?.scrollToIndex({index: 0});
    transformValue(1.7, 1.5);
  };

  const hideScreen = () => {
    transformValue(ZERO, 1.5);
  };
  const ErrTxt = ({txt, touched}: {txt: any; touched: boolean}) => {
    if (touched && txt) {
      return (
        <View
          style={{
            alignItems: 'flex-end',
            width: '70%',
            padding: '1%',
          }}>
          <Text style={[styles.errors]}>{txt}</Text>
        </View>
      );
    } else null;
  };
  const screenData: RenderItemProps[] = [
    {
      navigationTxt: 'Sign up',
      component: <SignInForm hideScreen={hideScreen} ErrTxt={ErrTxt} />,
      bottomTxt: "Don't have an account?",
      nextPage: goToSignUp,
    },
    {
      navigationTxt: 'Sign in',
      component: <SignUpForm hideScreen={hideScreen} ErrTxt={ErrTxt} />,
      bottomTxt: 'Already have an account?',
      nextPage: goToSignIn,
    },
  ];

  const renderItem: ListRenderItem<RenderItemProps> = ({item}) => (
    <Animated.View style={[styles.container, style]}>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={[{flexGrow: 2, alignItems: 'center'}]}>
        {item.component}
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={item.nextPage}>
            <Text style={[styles.text, {color: constants.colors.UNDER_LINE}]}>
              {item.navigationTxt}
            </Text>
          </TouchableOpacity>
          <Text style={styles.text}>{item.bottomTxt} </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
  return (
    <Animated.View style={[styles.flatList, style]}>
      <FlatList
        ref={ref}
        renderItem={renderItem}
        data={screenData}
        horizontal
        inverted
        scrollEnabled={false}
        pagingEnabled></FlatList>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    width: constants.WIDTH,
  },
  flatList: {
    width: constants.WIDTH,
    backgroundColor: constants.colors.OFF_WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    paddingBottom: '10%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '70%',
    flexDirection: 'row',
  },
  button: {
    borderRadius: 20,
    borderWidth: 0.9,
    borderColor: constants.colors.UNDER_LINE,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: constants.colors.BGC,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
  },
  forgotPassword: {
    color: constants.colors.BGC,
    paddingLeft: '1%',
    fontSize: 13,
  },
  errors: {
    color: 'red',
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '400',
  },
});
