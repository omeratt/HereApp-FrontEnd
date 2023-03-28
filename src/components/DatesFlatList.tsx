import {FlashList} from '@shopify/flash-list';
import React, {memo} from 'react';
import constants from '../assets/constants';
import {DATE_WIDTH} from '../screens/Home';
import RenderDateItem from './RenderDateItem';
import {DateObject} from './WeeklyCalender';

interface Props {
  flashListRef: React.MutableRefObject<FlashList<DateObject> | null>;
  datePress: (date: Date) => void;
  FetchTasks: (date: Date) => void;
}
const DatesFlatList: React.FC<Props> = ({
  datePress,
  FetchTasks,
  flashListRef,
}) => {
  let prevDate: Date | undefined = selectedScrollDate;
  const handleViewableChange = useRef((item: any) => {
    item.viewableItems?.forEach((item: any) => {
      // console.log(item.index, item);
    });
    const itemsLength = item.viewableItems?.length;
    const currentViewableItemIndex = itemsLength <= 4 ? itemsLength - 1 : 4;
    const date = item.viewableItems[3]?.item;
    if (!date) return;
    prevDate = date.fullDate;
    SetDateHeader(date);
    setSelectedScrollDate(date.fullDate);
    // SetSelectedFinalDate(date.fullDate);
  });
  const onDragEnd = useCallback(() => {
    console.log(prevDate);
    if (!prevDate) return;
    prevDate = undefined;
    console.log(dateHeader?.fullDate);
    SetSelectedFinalDate(dateHeader?.fullDate);
    FetchTasks(selectedScrollDate);
  }, [selectedScrollDate]);

  const keyExtractor = useCallback(
    (item: DateObject, index: number) => item.fullDate.toLocaleString(),
    [],
  );
  return (
    <FlashList
      ref={flashListRef}
      keyExtractor={keyExtractor}
      renderItem={props => <RenderDateItem {...props} />}
      extraData={{
        selectedFinalDate,
        onDatePress: datePress,
      }}
      estimatedItemSize={DATE_WIDTH / 7}
      data={flatListData}
      onMomentumScrollEnd={onDragEnd}
      horizontal
      contentContainerStyle={{
        paddingHorizontal: constants.WIDTH / 2 + 2.7 - DATE_WIDTH / 7,
      }}
      // pagingEnabled
      // onViewableItemsChanged={handleViewableChange.current}
      // snapToAlignment={'center'}
      // initialScrollIndex={getIndexByKey(
      //   allDates,
      //   CURRENT_DATE.toLocaleDateString(),
      // )}
      snapToOffsets={snapToOffsets && snapToOffsets}
      decelerationRate={'fast'}
    />
  );
};

export default memo(DatesFlatList);
