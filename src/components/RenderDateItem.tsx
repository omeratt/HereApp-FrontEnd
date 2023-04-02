import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import constants from '../assets/constants';
import {compareDates, DateObject} from './WeeklyCalender';
import {ListRenderItem} from '@shopify/flash-list';
import {DATE_WIDTH} from '../screens/Home';
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

export interface RenderItemProps {
  item: DateObject;
  selectedFinalDate: Date;
  topViewWidth?: number;
  onDatePress: (date: DateObject) => void;
}

const RenderDateItem: ListRenderItem<DateObject> | null | undefined = ({
  item,
  extraData,
  index,
}) => {
  const {selectedFinalDate, onDatePress, scrollX, lastScrollX} = extraData;
  const itemDate = item.fullDate;
  const areDatesEqual = compareDates(selectedFinalDate, itemDate);
  const widthAndHeight = useMemo(() => {
    return DATE_WIDTH / 9;
  }, [DATE_WIDTH]);
  const onPress = useCallback(() => {
    onDatePress?.(item);
  }, [item.fullDate]);

  const inputRange = [
    (DATE_WIDTH / 7) * (index - 3) - DATE_WIDTH / 7 / 2,
    (DATE_WIDTH / 7) * (index - 2) - DATE_WIDTH / 7 / 2,
    (DATE_WIDTH / 7) * (index - 1) - DATE_WIDTH / 7 / 2,
    0 - DATE_WIDTH / 7 / 2,
    0,
    0 + DATE_WIDTH / 7 / 2,
    (DATE_WIDTH / 7) * (index + 1) + DATE_WIDTH / 7 / 2,
    (DATE_WIDTH / 7) * (index + 2) + DATE_WIDTH / 7 / 2,
    (DATE_WIDTH / 7) * (index + 3) + DATE_WIDTH / 7 / 2,
  ];

  const enteringBackGroundAnimation =
    lastScrollX.value === scrollX.value
      ? new FadeInUp().duration(350).easing(Easing.elastic(1.3))
      : lastScrollX.value < scrollX.value
      ? new FadeInLeft().duration(350).easing(Easing.elastic(1.3))
      : new FadeInRight().duration(350).easing(Easing.elastic(1.3));
  const animatedStyles = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 0.7, 0.95, 1, 1, 1, 0.95, 0.7, 0.5],
    );
    return {
      transform: [{scale}],
    };
  });

  const AnimatedGreenBackGround = () => {
    return (
      <Animated.View
        entering={enteringBackGroundAnimation}
        exiting={FadeOut}
        style={[
          {
            position: 'absolute',
            width: widthAndHeight,
            height: widthAndHeight,
            borderRadius: 500,
            elevation: 5,
            backgroundColor: constants.colors.GREEN,
          },
        ]}
      />
    );
  };
  return (
    <Animated.View
      style={[
        styles.dateContent,
        {
          width: DATE_WIDTH / 7,
          alignItems: 'center',
        },
        animatedStyles,
      ]}>
      <TouchableOpacity style={styles.datePress} onPress={onPress}>
        <Text style={styles.dateText}>{item.dayName}</Text>
        <View
          style={[
            styles.datePicker,
            {
              width: widthAndHeight,
              height: widthAndHeight,
            },
          ]}>
          {areDatesEqual && <AnimatedGreenBackGround />}
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
