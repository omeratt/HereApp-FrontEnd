import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import constants from '../assets/constants';
import {compareDates, DateObject} from './WeeklyCalender';
import {ListRenderItem} from '@shopify/flash-list';
import {DATE_WIDTH} from '../screens/Home';

export interface RenderItemProps {
  item: DateObject;
  selectedFinalDate: Date;
  topViewWidth?: number;
  onDatePress: (date: DateObject) => void;
}

const RenderDateItem: ListRenderItem<DateObject> | null | undefined = ({
  item,
  extraData,
}) => {
  const {selectedFinalDate, onDatePress} = extraData;
  const itemDate = item.fullDate;
  const areDatesEqual = compareDates(selectedFinalDate, itemDate);
  const widthAndHeight = useMemo(() => {
    return DATE_WIDTH / 9;
  }, [DATE_WIDTH]);
  const onPress = useCallback(() => {
    onDatePress?.(item);
  }, [item.fullDate]);
  return (
    <View
      style={[
        styles.dateContent,
        {
          width: DATE_WIDTH / 7,
          // backgroundColor: 'cyan',
          alignItems: 'center',
          // borderColor: 'white',
          // borderWidth: 0.4,
        },
      ]}>
      <TouchableOpacity style={styles.datePress} onPress={onPress}>
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

export default React.memo(RenderDateItem);

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
