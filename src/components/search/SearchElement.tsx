import {StyleSheet, Text} from 'react-native';

import React, {useCallback, useState} from 'react';
import constants from '../../assets/constants';
import {
  IListSearchResult,
  IMessageSearchResult,
  ISearchElementProps,
  ITaskSearchResult,
} from './types';
import Animated, {
  FadeInUp,
  FadeOutUp,
  SequencedTransition,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/core';
import {useAppSelector} from '../../app/hooks';
import {selectCategoriesList} from '../../app/Reducers/User/userSlice';
import {FlashList} from '@shopify/flash-list';
import RenderSearchElement from './RenderSearchElement';
const {HEIGHT, WIDTH} = constants;
const paddingVertical = HEIGHT * (45 / 896);
const RENDER_ITEM_SIZE = HEIGHT * 0.03690529039246393;
const FLASH_LIST_WIDTH = WIDTH - WIDTH * ((80 / 896) * 2);
const SearchElement: React.FC<ISearchElementProps> = ({
  items = [],
  title,
  setSelectedTask,
  openTaskModal,
  flashListHeight = 0,
}) => {
  const numbersOfItemsPerHeight = RENDER_ITEM_SIZE / flashListHeight;
  const isTask = React.useMemo(() => title === 'TASKS', [title]);
  const isMsg = React.useMemo(() => title === 'MESSAGE TO MYSELF', [title]);
  const isList = React.useMemo(() => title === 'LIST & NOTES', [title]);
  const navigation = useNavigation();
  const categoriesList = useAppSelector(selectCategoriesList);
  const findCategoryIndex = (categoryId: string) => {
    const listIndex = categoriesList.findIndex(list => list._id === categoryId);
    return listIndex;
  };
  const findListIndexInCategory = (categoryIndex: number, listId: string) => {
    const listIndex = categoriesList[categoryIndex]?.lists?.findIndex(
      list => list._id === listId,
    );
    return listIndex;
  };
  const navigateToList = React.useCallback(
    (indexOfSearch: number) => {
      const categoryId = (items as IListSearchResult[])[indexOfSearch]
        .category!;
      const listId = (items as IListSearchResult[])[indexOfSearch]._id;
      const categoryIndex = findCategoryIndex(categoryId);
      const listIndex = findListIndexInCategory(categoryIndex, listId);
      navigation.navigate(
        'ListAndNotesStack' as never,
        {
          screen: 'CreateOrEditList' as never,
          params: {categoryIndex, listIndex, navFromHome: false} as never,
        } as never,
      );
    },
    [categoriesList],
  );
  const navToEditMessage = React.useCallback((index: number) => {
    const msg = (items as IMessageSearchResult[])[index];
    navigation.navigate(
      'Message' as never,
      {messageRouteProp: msg, navFromSearch: true} as never,
    );
  }, []);
  const navToTask = React.useCallback(
    (index: number) => {
      const task = (items as ITaskSearchResult[])[index];
      setSelectedTask?.(task);
      openTaskModal?.();
    },
    [items],
  );
  const navigateByType = React.useCallback(
    (index: number) => {
      if (isList) {
        return navigateToList(index);
      }
      if (isMsg) {
        return navToEditMessage(index);
      }
      if (isTask) return navToTask(index);
    },
    [isList, isMsg, isTask, items],
  );
  const keyExtractor = useCallback(
    (item: unknown, index: number) => index.toString(),
    [],
  );
  const renderItem = React.useCallback(
    (props: any) => {
      const item = {...props.item, navigateByType, isMsg, isTask};
      return <RenderSearchElement {...props} item={item} />;
    },
    [items],
  );
  const [visibleItems, setVisibleItems] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const loadMoreItems = useCallback(() => {
    if (visibleItems * currentPage >= items.length) return;
    setCurrentPage(prevPage => prevPage + 1);
  }, [currentPage]);
  return (
    <Animated.View
      style={[
        styles.container,
        {
          ...(flashListHeight > 0 && {
            // height: (flashListHeight * flashListHeight) / items.length,
            flex: 1,
            maxHeight: Math.min(
              flashListHeight / 2,
              items.length * RENDER_ITEM_SIZE + paddingVertical * 2,
            ),
          }),
        },
      ]}
      layout={SequencedTransition}
      entering={FadeInUp}
      exiting={FadeOutUp}>
      <Text style={styles.titleTxt}>{title}</Text>
      {items && flashListHeight > 0 && (
        <FlashList
          fadingEdgeLength={100}
          data={items.slice(0, visibleItems * currentPage) as any}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          // estimatedListSize={{
          //   height: RENDER_ITEM_SIZE * items.length,
          //   width: FLASH_LIST_WIDTH,
          // }}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={1.0}
          estimatedItemSize={RENDER_ITEM_SIZE}
        />
      )}
    </Animated.View>
  );
};

//🗣️Are you HERE? "check your email"

export default SearchElement;
const lineHeight = 24;
const styles = StyleSheet.create({
  container: {
    // paddingVertical,
    paddingTop: paddingVertical,
    width: FLASH_LIST_WIDTH,
    // height: 15,
    // flex: 1,
  },
  titleTxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.UNDER_LINE,
    fontSize: 12,
    lineHeight,
    textAlign: 'left',
  },
});
