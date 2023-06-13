import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
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
import {SvgProps} from 'react-native-svg';
import {ISvgElement} from './types';
import {
  useGetWidgetsQuery,
  useUpdateWidgetsMutation,
} from '../../app/api/userApi';
import {setFocus} from '../../app/Reducers/User/screensSlice';
import {useAppDispatch} from '../../app/hooks';
const {Fonts, HEIGHT, WIDTH, rf, colors} = constants;
const paddingBottom = HEIGHT * (44 / 896);
const paddingTop = HEIGHT * (73 / 896);
const paddingHorizontal = WIDTH * (39 / 414);
const svgWidth = WIDTH * (261 / 414);
const svgAspectRatio = 261 / 132;

interface IFlatListProps {
  //Top container
  topTitle?: string;
  topDate?: string;
  isArrow?: boolean;
  isCheckbox?: boolean;
  isFlatList?: boolean;
  onBoardingSvg?: React.FC<SvgProps>[];
  svgDimensions?: {};
  svgElements?: ISvgElement[];
  //bottom container
  bottomTitle?: string;
  bottomContent?: string;
  // rest render item props and handlers
  id: string;
}

const svgElements: ISvgElement[] = [
  {
    Svg: SVG.PizzaWidget,
    content: 'Concentration games',
    height: HEIGHT * 0.08238579067481956,
    width: WIDTH * 0.34444443384806317,
    title: 'PlayGround | pizza',
  },
  {
    Svg: SVG.ToggleWidget,
    content: 'Concentration games',
    height: HEIGHT * 0.09938579067481956,
    width: WIDTH * 0.34444443384806317,
    title: 'PlayGround | toggle',
  },
];

const flatListData: IFlatListProps[] = [
  {
    id: 'Playground',
    isFlatList: true,
    onBoardingSvg: [SVG.PizzaWidget, SVG.ToggleWidget],
    svgElements,
  },
  {
    id: 'Im not stupid',
    svgElements: [
      {
        // 65 83
        Svg: SVG.ImNotStupidGreen,
        height: HEIGHT * 0.09938579067481956,
        width: WIDTH * 0.34444443384806317,
        content: 'read about adhd and how its effects your life',
        title: 'Im not stupid',
        style: {
          // backgroundColor: 'red',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: '2%',
          zIndex: 1,
        },
      },
    ],
    isArrow: true,
  },
  {
    id: 'Next task',
    topTitle: 'Next task',
    isCheckbox: true,
    topDate: 'Mar 24,2023',
    bottomContent: 'Follow your next task',
  },
  {
    id: 'Last message',
    topTitle: 'Last message',
    isArrow: true,
    topDate: 'Mar 24,2023',
    bottomTitle: 'Chat',
    bottomContent: 'Write messages or notes to yourself',
  },
];

export default function Widgets() {
  const list = constants.OnBoardingList;
  const navigation = useNavigation();
  const [updateWidgets, {isLoading}] = useUpdateWidgetsMutation();
  const {
    data: widgetsData,
    error: WidgetsFetchError,
    isLoading: isWidgetsLoading,
    isFetching: isWidgetFetching,
  } = useGetWidgetsQuery(null);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    widgetsData || [],
  );
  const SetSelectedItems = useCallback((item: string) => {
    setSelectedItems(prev => {
      if (prev.includes(item)) return prev.filter(e => e !== item);
      return [...prev, item];
    });
  }, []);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const subscribe = navigation.addListener('focus', e => {
      dispatch(setFocus({widgets: true}));
    });
    return () => {
      subscribe();
    };
  }, []);

  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    [],
  );
  const goHome = useCallback(() => {
    navigation.navigate('HomePage' as never);
  }, [navigation]);
  const handleSubmit = async () => {
    //TODO: server fetching
    if (selectedItems.length !== 0) await updateWidgets(selectedItems);
    goHome();
  };
  return (
    <View style={styles.container}>
      <SelectWidgetsTitle />

      <View style={styles.flatListContainer}>
        <FlatList
          data={flatListData}
          renderItem={item => {
            return (
              <WidgetBox
                txt={item.item.id}
                SetSelectedItems={SetSelectedItems}
                index={item.index}
                selectedItems={selectedItems}
                isFlatList={item.item.isFlatList}
                onBoardingSvg={item.item.onBoardingSvg}
                bottomContent={item.item.bottomContent}
                bottomTitle={item.item.bottomTitle}
                isCheckbox={item.item.isCheckbox}
                isArrow={item.item.isArrow}
                topDate={item.item.topDate}
                topTitle={item.item.topTitle}
                svgElements={item.item.svgElements}
              />
            );
          }}
          keyExtractor={keyExtractor}
          style={styles.flatList}
          // contentContainerStyle={{
          //   // width: '100%',
          //   // flex: 1,
          //   backgroundColor: 'red',
          // }}
          numColumns={2}
          // columnWrapperStyle={{marginBottom: -14 + gap}}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity onPress={handleSubmit} style={[styles.doneContainer]}>
        {isLoading ? (
          <ActivityIndicator color={colors.GREEN} size={'small'} />
        ) : (
          <>
            <Text
              style={{
                color: constants.colors.OFF_WHITE,
                fontFamily: constants.Fonts.text,
                fontSize: constants.rf(18),
              }}>
              <Text style={{color: colors.GREEN}}>{selectedItems.length}</Text>{' '}
              / 2
            </Text>
            <SVG.GreenDoneButton fill={colors.OFF_WHITE} />
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
