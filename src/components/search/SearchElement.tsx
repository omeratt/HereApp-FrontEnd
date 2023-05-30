import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import React, {useCallback, useMemo, useRef} from 'react';
import constants, {CategoryListType} from '../../assets/constants';
import {
  IListSearchResult,
  IMessageSearchResult,
  ISearchElementProps,
  ITaskSearchResult,
} from './types';
import {getTimeFromDateString} from '../WeeklyCalender';
import Animated, {
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  SequencedTransition,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/core';
import {useAppSelector} from '../../app/hooks';
import {
  TaskType,
  selectCategoriesList,
} from '../../app/Reducers/User/userSlice';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import NewTask from '../NewTask';
const {HEIGHT, WIDTH} = constants;
const paddingVertical = HEIGHT * (45 / 896);

const options: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
};
const formatDate = (date: Date) =>
  date
    .toLocaleDateString('en', options)
    .replace(/\./g, '/')
    .replace(/(\d{2})(\/)(\d{2})(\/)(\d{2})/g, '$1 / $3 / $5');

const SearchElement: React.FC<ISearchElementProps> = ({
  items,
  title,
  setSelectedTask,
  openTaskModal,
}) => {
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
      console.log({categoryId, categoryIndex, listIndex});
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
  const navToTask = React.useCallback((index: number) => {
    const task = (items as ITaskSearchResult[])[index];
    setSelectedTask?.(task);
    openTaskModal?.();
  }, []);
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
    [isList, isMsg, isTask],
  );

  return (
    <Animated.View
      style={styles.container}
      layout={SequencedTransition}
      entering={FadeInUp}
      exiting={FadeOutUp}>
      <Text style={styles.titleTxt}>{title}</Text>
      {items?.map(({data: {description, name}}, index) => {
        return (
          <TouchableOpacity key={index} onPress={() => navigateByType(index)}>
            <Animated.View
              layout={SequencedTransition}
              entering={FadeInUp}
              exiting={FadeOutUp}
              style={styles.txtContainer}>
              <Text numberOfLines={1} style={styles.dataName}>
                {isMsg ? formatDate(new Date(name)) : name}
              </Text>
              {!isTask ? (
                <Text numberOfLines={1} style={styles.dataDesc}>
                  {description}
                </Text>
              ) : (
                <View style={styles.taskDateContainer}>
                  <Text numberOfLines={1} style={styles.taskDate}>
                    {formatDate(new Date(description))}
                  </Text>
                  <Text numberOfLines={1} style={styles.taskDate}>
                    {getTimeFromDateString(description, false, true)}
                  </Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
      {/* Task Modal */}
    </Animated.View>
  );
};

export default SearchElement;
const lineHeight = 24;
const maxWidth = '45%';
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingVertical,
  },
  titleTxt: {
    fontFamily: constants.Fonts.text,
    // fontWeight: '800',
    color: constants.colors.UNDER_LINE,
    fontSize: 12,
    lineHeight,
    // backgroundColor: 'cyan',
    textAlign: 'left',
  },
  dataName: {
    fontFamily: constants.Fonts.text,
    fontWeight: '800',
    color: constants.colors.OFF_WHITE,
    fontSize: 12,
    lineHeight,
    maxWidth,
    paddingLeft: 1.5,
  },
  dataDesc: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: 12,
    lineHeight,
    maxWidth,
    textAlign: 'left',
    width: maxWidth,
  },
  taskDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '45%',
  },
  taskDate: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: 12,
    lineHeight,
    textAlign: 'left',
  },
  txtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
