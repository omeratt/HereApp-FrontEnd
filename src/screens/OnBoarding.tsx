import {
  FlatList,
  FlatListProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import constants from '../assets/constants';
import Animated, {
  Easing,
  FadeInLeft,
  SequencedTransition,
  ZoomIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Line from '../components/Line';
import SVG from '../assets/svg';
import {useNavigation} from '@react-navigation/native';
import {gap} from '../components/BallonTxt';
const styles1 = StyleSheet.create({
  container: {
    // maxWidth: '61%',
    // minWidth: '25%',
    minWidth: '30%',
    maxWidth: '60%',
    flexGrow: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: constants.colors.OFF_WHITE,
    backgroundColor: constants.colors.BGC,
    justifyContent: 'center',
    alignItems: 'center',
    height: constants.HEIGHT * 0.078125,
    marginVertical: '2%',
    // marginRight: '3.0%',
    paddingHorizontal: '5.8%',
    shadowColor: constants.colors.GREEN,
    elevation: 2.5,
  },
  txt: {
    flex: 1,
    fontFamily: constants.Fonts.text,
    fontSize: 14,
    color: constants.colors.OFF_WHITE,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  highLightTxt: {
    color: constants.colors.GREEN,
  },
});
interface BallonProps {
  txt: string;
  index: number;
  SetSelectedItems: (item: string) => void;
  selectedItems: string[];
}
export default function OnBoarding() {
  const list = constants.OnBoardingList;
  const nav = useNavigation();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const SetSelectedItems = useCallback((item: string) => {
    setSelectedItems(prev => {
      if (prev.includes(item)) return prev.filter(e => e !== item);
      return [...prev, item];
    });
  }, []);

  const goHome = useCallback(() => {
    nav.navigate('HomePage' as never);
  }, [nav]);
  const BallonTxt = useCallback(
    ({txt, index, selectedItems, SetSelectedItems}: BallonProps) => {
      const isTimeManagement = txt === 'Time management';
      const progress = useSharedValue(0);
      const isIndexEven = index !== undefined && index % 2 === 0;
      const animatedStyle = useAnimatedStyle(() => {
        return {
          borderColor: interpolateColor(
            progress.value,
            [0, 1],
            [constants.colors.OFF_WHITE, constants.colors.GREEN],
            undefined,
            {gamma: 6},
          ),
        };
      });
      return (
        <Animated.View
          layout={SequencedTransition}
          entering={ZoomIn.duration(500).randomDelay()}
          style={[
            animatedStyle,
            styles1.container,
            {...(isIndexEven && {marginRight: '3%'})},
            {paddingHorizontal: isTimeManagement ? 6 : '6.0%'},
          ]}>
          <TouchableOpacity
            // style={{width: '90%', height: '100%'}}
            onPress={() => {
              SetSelectedItems(txt);
              progress.value = withTiming(1 - progress.value, {duration: 450});
            }}>
            <Text
              numberOfLines={2}
              textBreakStrategy="balanced"
              // lineBreakMode="head"
              style={styles1.txt}>
              {txt}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [],
  );

  // const RenderItem = (item:FlatListProps<{ txt: string; }>)=>{
  //   return <BallonTxt txt={item.}/>
  // }

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInLeft.duration(700).delay(500)}
        style={styles.topContainer}>
        <Text
          numberOfLines={2}
          textBreakStrategy="balanced"
          style={styles.paragraphTxt}>
          Please select the words that
        </Text>
        <Text style={[styles.paragraphTxt, styles.highLightTxt]}>
          indicate a difficulty
        </Text>
        <View
          style={{
            alignSelf: 'flex-start',
          }}>
          <Text
            numberOfLines={4}
            style={[styles.paragraphTxt, {marginBottom: '5%'}]}>
            you have.
          </Text>
          <View>
            <Line
              lengthPercentage={100}
              strength={0.7}
              lineColor={constants.colors.OFF_WHITE}
            />
          </View>
        </View>
      </Animated.View>

      <View
        style={{
          height: constants.HEIGHT * 0.5654822412481163,
          justifyContent: 'center',
        }}>
        <FlatList
          data={list}
          renderItem={item => {
            return (
              <BallonTxt
                txt={item.item.txt}
                SetSelectedItems={SetSelectedItems}
                index={item.index}
                selectedItems={selectedItems}
              />
            );
          }}
          keyExtractor={item => item.txt}
          style={styles.wordsContainer}
          contentContainerStyle={{
            width: '100%',
            // height: constants.HEIGHT * 0.5654822412481163,
            // height: constants.HEIGHT * 0.554,
            // backgroundColor: 'blue',
          }}
          // contentContainerStyle={{width: '100%', paddingBottom: gap}}
          numColumns={2}
          // columnWrapperStyle={{marginBottom: -14 + gap}}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity
        onPress={goHome}
        style={{
          flex: 1, //wtf
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'red',
          // height: constants.HEIGHT * 0.12,
          // marginTop: 12,
        }}>
        <SVG.Continue />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.colors.BGC,
    paddingHorizontal: constants.WIDTH * 0.071449,

    paddingTop: constants.HEIGHT * 0.05915178571428571428571428571429,
    // paddingVertical: constants.HEIGHT * 0.05915178571428571428571428571429,
  },
  topContainer: {
    height: '23.7723%',
    width: '89%',
    // marginBottom: '7%',
  },
  paragraphTxt: {
    fontFamily: constants.Fonts.paragraph,
    fontSize: 32,
    lineHeight: 28,
    color: constants.colors.OFF_WHITE,
  },
  highLightTxt: {
    color: constants.colors.GREEN,
  },
  bottomContainer: {
    height: '76.2277%',
    // backgroundColor: 'red',
  },
  // wordsContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   // justifyContent: 'space-between',
  // },
  wordsContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',

    width: '100%',
    // height: constants.HEIGHT * 0.4654822412481163,
    // backgroundColor: 'cyan',
  },
});
