import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {Ref, RefObject, useEffect} from 'react';
import constants from '../assets/constants';
import TextInput from '../components/TextInput';
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

const ZERO = 0.00000000000000001;
const SPRING_CONFIG: WithSpringConfig = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
  mass: 130,
};
interface screenTxt {
  signIn: boolean;
  forgotTxt: string | undefined;
  buttonTxt: string;
  navigationTxt: string;
  bottomTxt: string;
}
const screenText: screenTxt[] = [
  {
    signIn: true,
    forgotTxt: 'Forgot Password ?',
    buttonTxt: 'Sign In',
    navigationTxt: 'Sign up',
    bottomTxt: "Don't have an account?",
  },
  {
    signIn: false,
    forgotTxt: undefined,
    buttonTxt: 'Sign Up',
    navigationTxt: 'Sign in',
    bottomTxt: 'Already have an account?',
  },
];
export default function SignIn() {
  const ref = React.useRef<FlatList>(null);
  const flex = useSharedValue(ZERO);
  const style = useAnimatedStyle(() => {
    return {flex: flex.value};
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      flex.value = withSpring(1.7, SPRING_CONFIG);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const goToSignUp = () => {
    ref.current?.scrollToIndex({index: 1, animated: true});
    flex.value = withSpring(5, {...SPRING_CONFIG, mass: 1});
  };
  const goToSignIn = () => {
    ref.current?.scrollToIndex({index: 0});

    flex.value = withSpring(1.7, {...SPRING_CONFIG, mass: 1});
  };

  const renderItem = ({item}: any) => (
    <Animated.View style={[styles.container, style]}>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={[{flexGrow: 2, alignItems: 'center'}]}>
        <TextInput placeholder="Email" keyboardType="email-address" />
        <TextInput secureTextEntry placeholder="Password" />
        {item.forgotTxt && (
          <View
            style={{marginTop: '10%', width: '70%', alignItems: 'flex-end'}}>
            <Text style={[styles.forgotPassword]}>{item.forgotTxt}</Text>
          </View>
        )}

        <View style={{marginTop: '10%'}}>
          <TouchableOpacity style={styles.button}>
            <Text style={[styles.text]}>{item.buttonTxt}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          {/* <TouchableOpacity>
    <SVG.DoneButton fill={constants.colors.BGC} />
</TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              item.signIn ? goToSignUp() : goToSignIn();
            }}>
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
        data={screenText}
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
    // flex: 1,
    width: constants.WIDTH,
    backgroundColor: constants.colors.OFF_WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  bottomContainer: {
    // marginTop: '5%',
    // backgroundColor: constants.colors.BGC,
    flex: 1,
    paddingBottom: '10%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '70%',
    flexDirection: 'row',
    // top: 0,
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
});
