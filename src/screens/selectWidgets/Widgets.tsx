import {
  FlatList,
  FlatListProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import constants from '../../assets/constants';
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
import Line from '../../components/Line';
import SVG from '../../assets/svg';
import {useNavigation} from '@react-navigation/native';
import {gap} from '../../components/BallonTxt';
import WidgetBox from './WidgetBox';
import SelectWidgetsTitle from './SelectWidgetsTitle';
const {Fonts, HEIGHT, WIDTH, rf, colors} = constants;
const paddingBottom = HEIGHT * (44 / 896);
const paddingTop = HEIGHT * (73 / 896);
const paddingHorizontal = WIDTH * (39 / 414);
const svgWidth = WIDTH * (261 / 414);
const svgAspectRatio = 261 / 132;

export default function Widgets() {
  const list = constants.OnBoardingList;
  const nav = useNavigation();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const SetSelectedItems = useCallback((item: string) => {
    setSelectedItems(prev => {
      if (prev.includes(item)) return prev.filter(e => e !== item);
      return [...prev, item];
    });
  }, []);

  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    [],
  );
  const goHome = useCallback(() => {
    nav.navigate('HomePage' as never);
  }, [nav]);

  return (
    <View style={styles.container}>
      <SelectWidgetsTitle />

      <View style={styles.flatListContainer}>
        <FlatList
          data={list}
          renderItem={item => {
            return (
              <WidgetBox
                txt={item.item.txt}
                SetSelectedItems={SetSelectedItems}
                index={item.index}
                selectedItems={selectedItems}
              />
            );
          }}
          keyExtractor={keyExtractor}
          style={styles.flatList}
          // contentContainerStyle={{
          //   // width: '100%',
          //   flex: 1,
          //   backgroundColor: 'red',
          // }}
          numColumns={2}
          // columnWrapperStyle={{marginBottom: -14 + gap}}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity onPress={goHome} style={styles.doneContainer}>
        <SVG.GreenDoneButton fill={colors.OFF_WHITE} />
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

  bottomContainer: {
    height: '76.2277%',
    // backgroundColor: 'red',
  },
  flatListContainer: {
    height: constants.HEIGHT * 0.5654822412481163,
    justifyContent: 'center',
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  doneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
