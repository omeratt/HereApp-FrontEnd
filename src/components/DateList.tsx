import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';

const DatePicker: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [offset, setOffset] = useState(0);
  const [isNext, setIsNext] = useState<boolean>(false);

  useEffect(() => {
    // Generate the dates for the current week
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - currentDayOfWeek + i + offset,
        ),
      );
    }
    setDates(weekDates.reverse());
    // Set the initial selected date to today
    setSelectedDate(currentDate.toDateString());
  }, [offset]);

  const handleBackPress = () => {
    setIsNext(false);
    setOffset(offset - 7);
  };

  const handleNextPress = () => {
    setIsNext(true);
    setOffset(offset + 7);
  };

  return (
    <View style={{}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNextPress}>
          <Text style={styles.buttonText}>{'>'}</Text>
        </TouchableOpacity>
        {dates.map((date, index) => {
          const dateString = date.toDateString();
          return (
            <Animated.View
              key={dateString}
              exiting={
                isNext
                  ? SlideOutLeft.duration(100 * index)
                  : SlideOutRight.duration(100 * index)
              }
              entering={
                isNext
                  ? SlideInRight.duration(100 * index).delay(100)
                  : SlideInLeft.duration(100 * index).delay(100)
              }>
              <TouchableOpacity
                onPress={() => setSelectedDate(dateString)}
                style={[
                  styles.dateButton,
                  {
                    backgroundColor:
                      selectedDate === dateString ? 'green' : 'white',
                  },
                ]}>
                <Text style={[styles.dateText, {fontSize: screenWidth / 50}]}>
                  {dateString.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.buttonText}>{'<'}</Text>
        </TouchableOpacity>
      </View>
      {selectedDate ? (
        <Text style={styles.selectedDate}>Selected date: {selectedDate}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
  },
  dateButton: {
    borderRadius: 5,
    marginHorizontal: 5,
    padding: 10,
  },
  dateText: {
    fontSize: 20,
    color: 'black',
  },
  selectedDate: {
    fontSize: 20,
    marginTop: 20,
    color: 'black',
  },
});

export default DatePicker;
