import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import constants from '../assets/constants';
import {compareDates, DateObject} from './WeeklyCalender';
import {ListRenderItem} from '@shopify/flash-list';
import {DATE_WIDTH} from '../screens/Home';
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface RenderItemProps {
  item: DateObject;
  selectedFinalDate: Date;
  topViewWidth?: number;
  onDatePress: (date: Date) => void;
}

const RenderDateItem: ListRenderItem<DateObject> | null | undefined = ({
  item,
  index,
  extraData,
}) => {
  const {selectedFinalDate, onDatePress, realIndex} = extraData;
  const itemDate = item.fullDate;
  const height = useSharedValue('80%');
  const areDatesEqual = compareDates(selectedFinalDate, itemDate);
  const isRealIndex = realIndex === index;
  const animatedHeight = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });
  useEffect(() => {
    // height.value = '80%';
    runOnUI(() => {
      if (isRealIndex) {
        console.log(item.fullDate);
        height.value = withTiming('90%', {duration: 300});
        console.log(height.value);
      }
    })();
    return () => {
      runOnUI(() => {
        height.value = withTiming('80%', {duration: 300});
      })();
    };
  }, [isRealIndex]);
  const widthAndHeight = useMemo(() => {
    return DATE_WIDTH / 9;
  }, []);
  return (
    <Animated.View
      style={[
        styles.dateContent,
        {
          width: DATE_WIDTH / 7,
          // height: height.value,
          backgroundColor: 'brown',
          // borderColor: 'white',
          // borderWidth: 1,
          // height: '80%',
          // height: height.value,
          padding: 0,
          margin: 0,
        },
        animatedHeight,
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
              backgroundColor: isRealIndex
                ? constants.colors.GREEN
                : 'transparent',
              elevation: isRealIndex ? 5 : 0,
            },
          ]}>
          <Text style={[styles.dateText]}>{item.day}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
