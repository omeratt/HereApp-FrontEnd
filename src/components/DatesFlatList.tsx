import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import {DATE_WIDTH} from '../screens/Home';
import RenderDateItem from './RenderDateItem';
import {DateObject} from './WeeklyCalender';

interface Props {
  flashListRef: React.MutableRefObject<FlashList<DateObject> | null>;
  datePress: (dateItem: DateObject) => void;
  selectedScrollDate: Date;
  // SetDateHeader: (date: DateObject) => void;
  selectedFinalDate: Date;
  flatListData: DateObject[];
}
const DatesFlatList: React.FC<Props> = ({
  datePress,
  flashListRef,
  flatListData,
  // SetDateHeader,
  selectedFinalDate,
  selectedScrollDate,
}) => {
  const isCanExecuteOnMomentumEnd = React.useRef<boolean>(false);

  const canExecuteOnMomentumEnd = useCallback(() => {
    isCanExecuteOnMomentumEnd.current = true;
  }, []);
  const getCurrentIndex = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset} = event.nativeEvent;
    const width = DATE_WIDTH / 7;
    const index = Math.round(contentOffset.x / width);
    return index;
  };
  const onDragEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isCanExecuteOnMomentumEnd.current) return;
      const index = getCurrentIndex(e);
      const currentItem = flatListData[index];
      // console.log({currentItem,index});
      datePress(currentItem);
      isCanExecuteOnMomentumEnd.current = false;
    },
    [selectedScrollDate],
  );

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
      onScrollBeginDrag={canExecuteOnMomentumEnd}
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
