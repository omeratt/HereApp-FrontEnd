import {ListRenderItem, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import constants from '../assets/constants';
import {TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  WithSpringConfig,
  withSpring,
} from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

export const ZERO = 0.00000000000000001;
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

const AuthModal: React.FC = () => {
  const [emailFromSignUp, setEmailFromSignUp] = useState('');
  const navigation = useNavigation();
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
  const navigateTo = (screen: string) => () => {
    navigation.navigate(screen as never);
  };

  const hideScreen = () => {
    transformValue(ZERO, 1.5);
  };
  const ErrTxt = useMemo(
    () =>
      ({txt, touched}: {txt: any; touched: boolean}) => {
        if (touched && txt) {
          return (
            <View style={styles.errTxtContainer}>
              <Text style={[styles.errors]}>{txt}</Text>
            </View>
          );
        } else null;
      },
    [],
  );
  const screenData: RenderItemProps[] = [
    {
      //TODO: loading
      navigationTxt: 'Sign up',
      component: (
        <SignInForm
          hideScreen={hideScreen}
          ErrTxt={ErrTxt}
          emailFromSignUp={emailFromSignUp}
        />
      ),
      bottomTxt: "Don't have an account?",
      nextPage: goToSignUp,
    },
    {
      //TODO: loading
      navigationTxt: 'Sign in',
      component: (
        <SignUpForm
          hideScreen={hideScreen}
          ErrTxt={ErrTxt}
          goToSignIn={goToSignIn}
          setEmailFromSignUp={setEmailFromSignUp}
        />
      ),
      bottomTxt: 'Already have an account?',
      nextPage: goToSignIn,
    },
  ];

  const renderItem: ListRenderItem<RenderItemProps> = ({item, index}) => (
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
        {index === 0 && (
          <Text
            style={[
              styles.text,
              {fontSize: 12, color: constants.colors.UNDER_LINE},
            ]}
            allowFontScaling={false}
            adjustsFontSizeToFit
            textBreakStrategy="balanced">
            By signing in, you agree to the{' '}
            <Text onPress={navigateTo('TermOfUse')} style={styles.boldText}>
              Terms of Use
            </Text>{' '}
            and confirm that you have read the{' '}
            <Text onPress={navigateTo('Privacy')} style={styles.boldText}>
              Privacy Policy
            </Text>
          </Text>
        )}
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
        pagingEnabled
      />
    </Animated.View>
  );
};

export default React.memo(AuthModal);

const styles = StyleSheet.create({
  container: {
    width: constants.WIDTH,
    paddingBottom: '2%',
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
    flexDirection: 'row-reverse',
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
  boldText: {
    fontFamily: constants.Fonts.text,
    // fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: 'black',
    textAlign: 'justify',
  },
  text: {
    color: constants.colors.BGC,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
    fontFamily: constants.Fonts.text,
    lineHeight: 20,
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
  errTxtContainer: {
    alignItems: 'flex-start',
    width: '70%',
    padding: '1%',
  },
});
