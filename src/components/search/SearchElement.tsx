import {StyleSheet, Text, View} from 'react-native';

import React from 'react';
import constants from '../../assets/constants';
import {ISearchElementProps} from './types';
import {getTimeFromDateString} from '../WeeklyCalender';
import Animated, {
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  SequencedTransition,
} from 'react-native-reanimated';
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

const SearchElement: React.FC<ISearchElementProps> = ({items, title}) => {
  //   if (!items) return <Animated.View exiting={FadeOutUp} entering={FadeInUp} />;
  const isTask = React.useMemo(() => title === 'TASKS', [title]);
  const isMsg = React.useMemo(() => title === 'MESSAGE TO MYSELF', [title]);

  return (
    <Animated.View
      style={styles.container}
      layout={SequencedTransition}
      entering={FadeInUp}
      exiting={FadeOutUp}>
      <Text style={styles.titleTxt}>{title}</Text>
      {items?.map(({data: {description, name}}, index) => {
        return (
          <View style={styles.txtContainer} key={index}>
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
          </View>
        );
      })}
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
