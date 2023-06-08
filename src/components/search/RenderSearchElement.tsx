import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Animated, {
  FadeInUp,
  FadeOutUp,
  SequencedTransition,
} from 'react-native-reanimated';
import {getTimeFromDateString} from '../WeeklyCalender';
import constants from '../../assets/constants';
import {ISearchElement} from './types';
import {ListRenderItem} from '@shopify/flash-list';
const {HEIGHT, WIDTH} = constants;
const paddingVertical = HEIGHT * (45 / 896);
const lineHeight = 24;
const maxWidth = '45%';

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
interface SearchElementProps {
  navigateByType: (index: number) => void;
  isMsg?: boolean;
  isTask?: boolean;
  data?: ISearchElement;
}

const RenderSearchElement: ListRenderItem<SearchElementProps> = ({
  item,
  index,
}) => {
  const {navigateByType, isMsg, isTask, data} = item;
  const {name, description} = data || {name: '', description: ''};
  return (
    <TouchableOpacity
      //   style={{minHeight: 13, minWidth: 13}}
      key={index}
      onPress={() => navigateByType(index)}>
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
};

export default RenderSearchElement;

const styles = StyleSheet.create({
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
