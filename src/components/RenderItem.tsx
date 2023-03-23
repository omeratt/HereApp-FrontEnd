import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import constants from '../assets/constants';
import {compareDates, DateObject} from './WeeklyCalender';
import {ListRenderItem} from '@shopify/flash-list';

export interface RenderItemProps {
  item: DateObject;
  selectedFinalDate: Date;
  topViewWidth?: number;
  onDatePress: (date: Date) => void;
}

const RenderItem: ListRenderItem<DateObject> | null | undefined = ({
  item,
  extraData,
}) => {
  const {selectedFinalDate, topViewWidth, onDatePress} = extraData;
  if (!topViewWidth) return <React.Fragment />;
  const itemDate = item.fullDate;
  const areDatesEqual = compareDates(selectedFinalDate, itemDate);
  const widthAndHeight = useMemo(() => {
    return topViewWidth && topViewWidth / 9;
  }, [topViewWidth]);
  return (
    <View
      onLayout={event => {
        const {x, y, width, height} = event.nativeEvent.layout;
        console.log({width, y});
        console.log({topViewWidth});
      }}
      style={[
        styles.dateContent,
        {
          width: topViewWidth && topViewWidth / 7,
        },
      ]}>
      <TouchableOpacity
        style={styles.datePress}
        onPress={() => {
          onDatePress?.(itemDate);
        }}>
        <Text style={styles.dateText}>{item.dayName}</Text>
        <View
          style={[
            styles.datePicker,
            {
              width: widthAndHeight,
              height: widthAndHeight,
              backgroundColor: areDatesEqual
                ? constants.colors.GREEN
                : 'transparent',
              elevation: areDatesEqual ? 5 : 0,
            },
          ]}>
          <Text style={[styles.dateText]}>{item.day}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(RenderItem);

const styles = StyleSheet.create({
  dateContent: {
    width: '30%',
    height: '80%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dateText: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
    fontSize: constants.WIDTH / 29,
    textAlign: 'center',
    marginBottom: 1,
  },
  datePicker: {
    borderRadius: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePress: {
    width: '100%',
    alignItems: 'center',
  },
});
