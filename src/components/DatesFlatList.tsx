import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useMemo} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent, Vibration} from 'react-native';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {DATE_WIDTH} from '../screens/Home';
import RenderDateItem from './RenderDateItem';
import {DateObject} from './WeeklyCalender';
import constants from '../assets/constants';

interface Props {
  flashListRef: any;
  datePress: (dateItem: DateObject) => void;
  selectedScrollDate: Date;
  selectedFinalDate: Date;
  flatListData: DateObject[];
  sharedX: SharedValue<number>;
  sharedDatesIndex: SharedValue<number>;
}
const DatesFlatList: React.FC<Props> = ({
  datePress,
  flashListRef,
  flatListData,
  selectedFinalDate,
  selectedScrollDate,
  sharedX,
  sharedDatesIndex,
}) => {
  const isCanExecuteOnMomentumEnd = React.useRef<boolean>(false);
  const scrollX = useSharedValue(0);
  const lastScrollX = useSharedValue(0);
  const canExecuteOnMomentumEnd = useCallback(() => {
    lastScrollX.value = scrollX.value;

    isCanExecuteOnMomentumEnd.current = true;
  }, []);
  const getCurrentIndex = (xPosition: number) => {
    const width = DATE_WIDTH / 7;
    const index = Math.round(xPosition / width);
    return index;
  };
  const onDragEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isCanExecuteOnMomentumEnd.current) return;
      const index = getCurrentIndex(e.nativeEvent.contentOffset.x);
      const currentItem = flatListData[index];
      datePress(currentItem);
      isCanExecuteOnMomentumEnd.current = false;
    },
    [selectedScrollDate],
  );

  const keyExtractor = useCallback(
    (item: unknown, index: number) =>
      (item as DateObject).fullDate.toLocaleString(),
    [],
  );

  const renderItem = useCallback(
    (props: any) => <RenderDateItem {...props} />,
    [],
  );
  const AnimatedFlashList = useMemo(
    () => Animated.createAnimatedComponent(FlashList),
    [],
  );

  // const shouldVibrate = useSharedValue(false);
  const last = useSharedValue(0);

  // const handleVibration = (i: number) => {
  //   Vibration.vibrate(1);
  //   shouldVibrate.value = false;
  // };

  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: ({contentOffset: {x: value}}) => {
      'worklet';
      const width = DATE_WIDTH / 7;
      last.value = scrollX.value;
      scrollX.value = value;
      const curI = Math.round(scrollX.value / width);
      const lastI = Math.round(last.value / width);
      // console.log('first');
      // scrollX.value = (TASK_CONTAINER_WIDTH - curI - sharedX.value) * width;
      // flashListRef.current.scrollToOffset({offset:})
      // sharedX.value = (width * curI - value) * TASK_CONTAINER_WIDTH;
      // console.log((width * curI - value) * TASK_CONTAINER_WIDTH);
      if (curI !== lastI) {
        sharedDatesIndex.value = curI;
        // sharedX.value = 0;
        // runOnJS(handleVibration)(curI);
      }
    },
  });

  return (
    <AnimatedFlashList
      ref={flashListRef}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      scrollEventThrottle={1}
      extraData={{
        selectedFinalDate,
        onDatePress: datePress,
        scrollX,
        lastScrollX,
      }}
      onScroll={animatedScrollHandler}
      bounces={true}
      onScrollBeginDrag={canExecuteOnMomentumEnd}
      onMomentumScrollEnd={onDragEnd}
      estimatedItemSize={DATE_WIDTH / 7}
      data={flatListData}
      horizontal
      contentContainerStyle={{
        paddingHorizontal: DATE_WIDTH * 0.5 - DATE_WIDTH / 7 / 2,
      }}
      snapToInterval={DATE_WIDTH / 7}
      pagingEnabled
      snapToAlignment={'start'}
    />
  );
};

export default memo(DatesFlatList);
