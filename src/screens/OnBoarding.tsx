import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import constants, {OnBoardingList} from '../assets/constants';
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
import {useSetNewUserMutation} from '../app/api/userApi';
const styles1 = StyleSheet.create({
  container: {
    // maxWidth: '61%',
    // minWidth: '25%',
    // minWidth: '20%',
    maxWidth: '59%',
    flexGrow: 1,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'flex-start',
    height: constants.HEIGHT * 0.078125,
    marginVertical: '2%',
    // marginRight: '3.0%',
    // paddingHorizontal: '5.8%',
    shadowColor: constants.colors.GREEN,
    elevation: 2.5,
    backgroundColor: constants.colors.BGC,
    // borderColor: constants.colors.OFF_WHITE,
    // backgroundColor: 'red',
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
  txt: OnBoardingList;
  index: number;
  SetSelectedItems: (item: OnBoardingList) => void;
  selectedItems: OnBoardingList[];
}
export default function OnBoarding() {
  const list = constants.OnBoardingList;
  const nav = useNavigation();
  const [selectedItems, setSelectedItems] = useState<OnBoardingList[]>([]);
  const SetSelectedItems = useCallback((item: OnBoardingList) => {
    setSelectedItems(prev => {
      if (prev.includes(item)) return prev.filter(e => e !== item);
      return [...prev, item];
    });
  }, []);
  const [setNewUser, {isLoading, data}] = useSetNewUserMutation();

  const goHome = useCallback(() => {
    nav.navigate('HomePage' as never);
  }, [nav]);
  const handleSubmit = useCallback(() => {
    console.log(selectedItems);
    setNewUser(selectedItems);
    nav.navigate('HomePage' as never);
  }, [nav, selectedItems]);
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
              const isIncludeItem = selectedItems.includes(txt);
              if (selectedItems.length === 2 && !isIncludeItem) return;
              SetSelectedItems(txt);
              progress.value = withTiming(isIncludeItem ? 0 : 1, {
                duration: 250,
              });
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

      <TouchableOpacity onPress={handleSubmit} style={[styles.doneContainer]}>
        {isLoading ? (
          <ActivityIndicator color={constants.colors.UNDER_LINE} size={'small'} />
        ) : (
          <>
            <Text
              style={{
                color: constants.colors.OFF_WHITE,
                fontFamily: constants.Fonts.text,
                fontSize: constants.rf(18),
              }}>
              <Text style={{color: constants.colors.GREEN}}>
                {selectedItems.length}
              </Text>{' '}
              / 2
            </Text>
            <SVG.Continue />
          </>
        )}
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
  doneContainer: {
    flex: 1, //wtf
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
