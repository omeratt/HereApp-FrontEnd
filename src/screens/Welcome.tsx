import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import constants from '../assets/constants';
import Line from '../components/Line';
import SVG from '../assets/svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {logout, selectUser, setUser} from '../app/Reducers/User/userSlice';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {RootState} from '../app/store';
import {useLogoutMutation} from '../app/api/userApi';
import {useNavigation} from '@react-navigation/native';

export default function Welcome() {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  // const user = useAppSelector(selectUser);
  // console.log(user);
  const slide = useSharedValue(-260);

  const transformValue = () => {
    slide.value = withTiming(0, {
      duration: 2700,
      easing: Easing.out(Easing.exp),
    });
  };
  const style = useAnimatedStyle(() => {
    return {transform: [{translateX: slide.value}]};
  });
  React.useEffect(() => {
    transformValue();
    return () => {
      slide.value = 260;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.cubeContainer,
          {height: '11.2%'},
          {transform: [{rotateY: '180deg'}]},
        ]}>
        <View
          style={{
            alignItems: 'flex-end',
            width: '21%',
          }}>
          <Line vertical />
        </View>
        <View style={styles.firstLine}>
          <Line />
        </View>
      </View>
      <View style={[styles.cubeContainer, {height: '12%'}]}>
        <View style={[styles.secondLine, {alignItems: 'flex-end'}]}>
          <Line lengthPercentage={79} />
        </View>
      </View>
      <View
        style={[
          {
            width: '100%',
            height: '30.3%',
            flexDirection: 'row',
          },
          {transform: [{rotateY: '180deg'}]},
        ]}>
        <View style={{width: '21%', alignItems: 'flex-end'}}>
          <Line vertical />
        </View>
        <Animated.View
          style={[
            {
              width: '79%',
              height: '135%',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              // backgroundColor: 'blue',
              paddingRight: '8%',
              // paddingTop: '7%',
              // display: 'flex',
            },
            style,
          ]}>
          <View
            style={{
              // height: '100%',
              // backgroundColor: 'white',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              // marginBottom: '30%',
              transform: [{rotateY: '180deg'}],
            }}>
            <SVG.Hi width={210} height={220} />
          </View>
          <TouchableOpacity
            style={{
              height: '20%',
              width: 150,
              // backgroundColor: 'red',
              // justifyContent: 'flex-start',
              alignItems: 'flex-start',
              // marginLeft: '30%',
              transform: [
                {translateX: 8},
                // {translateY: 10},
                {rotateY: '180deg'},
              ],
            }}
            onPress={() => {
              navigate.navigate('OnBoarding' as never);
            }}>
            <SVG.StartButton viewBox="0 0 200 200" width={150} height={150} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          width: '21.5%',
          height: '23.6%',
          // backgroundColor: 'red',
          // transform:[{rotateY:'180deg'}]
        }}>
        <Line vertical lengthPercentage={45} />
      </View>
      <View style={[styles.cubeContainer, {height: '8.8%'}]}>
        <View style={styles.thirdLine}>
          <Line lengthPercentage={79} style={{alignSelf: 'flex-end'}} />
        </View>
      </View>

      <View style={[styles.cubeContainer, {height: '8.8%'}]}>
        <View style={[styles.fourthLine, {alignItems: 'flex-start'}]}>
          <Line lengthPercentage={79} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    backgroundColor: constants.colors.BGC,
  },
  cubeContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  firstLine: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  secondLine: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  thirdLine: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  fourthLine: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
});
