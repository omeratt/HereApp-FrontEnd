import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useState} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import {DATE_WIDTH} from '../screens/Home';
import RenderDateItem from './RenderDateItem';
import {DateObject} from './WeeklyCalender';

interface Props {
  flashListRef: React.MutableRefObject<FlashList<DateObject> | null>;
  datePress: (date: Date) => void;
  FetchTasks: (date: Date) => void;
  selectedScrollDate: any;
  setSelectedFinalDate: any;
  selectedFinalDate: any;
  flatListData: any;
  dateHeader: any;
}
const DatesFlatList: React.FC<Props> = ({
  datePress,
  FetchTasks,
  flashListRef,
  flatListData,
  selectedFinalDate,
  selectedScrollDate,
  setSelectedFinalDate,
  dateHeader,
}) => {
  const getCurrentIndex = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset} = event.nativeEvent;
    const width = DATE_WIDTH / 7;
    const index = Math.round(contentOffset.x / width);
    return index;
  };
  let prevDate: Date | undefined = selectedScrollDate;
  const onDragEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      console.log(getCurrentIndex(e));
      if (!prevDate) return;
      prevDate = undefined;
      console.log(dateHeader?.fullDate);
      setSelectedFinalDate(dateHeader?.fullDate);
      FetchTasks(selectedScrollDate);
    },
    [selectedScrollDate],
  );
  // const onDragEnd = useCallback(
  //   (e: NativeSyntheticEvent<NativeScrollEvent>) => {
  //     const {contentOffset} = e.nativeEvent;
  //     const width = DATE_WIDTH / 7;
  //     const index = Math.round(contentOffset.x / width);
  //     console.log(index);
  //     if (!prevDate) return;
  //     console.log({prevDate});
  //     prevDate = undefined;
  //     // console.log(dateHeader?.fullDate);
  //     // dateHeader?.fullDate && setSelectedFinalDate(dateHeader.fullDate);
  //     // SetSelectedFinalDate(selectedScrollDate);
  //     // datePress(selectedScrollDate.current);
  //     // runOnJS(FetchTasks)(selectedScrollDate);
  //     // FetchTasks(selectedScrollDate);
  //     // datePress(selectedScrollDate.current);
  //   },
  //   [selectedScrollDate],
  // );
  const keyExtractor = useCallback(
    (item: DateObject, index: number) => item.fullDate.toLocaleString(),
    [],
  );

  const renderItem = useCallback(
    (props: any) => <RenderDateItem {...props} />,
    [],
  );

  return (
    <FlashList
      ref={flashListRef}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      extraData={{
        selectedFinalDate,
        onDatePress: datePress,
      }}
      estimatedItemSize={DATE_WIDTH / 7}
      data={flatListData}
      onMomentumScrollEnd={onDragEnd}
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
