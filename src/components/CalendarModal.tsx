import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import Modal from 'react-native-modal';
// import {Calendar} from 'react-native-calendars';
// import CalendarList from 'react-native-calendars/src/calendar-list/new';
import constants from '../assets/constants';
import {CalendarList, DateData} from 'react-native-calendars';

interface Props {
  visible: boolean;
  toggleCalendar: () => void;
  FetchTasks: (date: Date) => void;
  findDateAndScroll: (DateToCheck: Date) => void;
  dates?: any;
}
const CalendarModal: FC<Props> = ({
  visible,
  toggleCalendar,
  FetchTasks,
  findDateAndScroll,
}) => {
  const height = constants.HEIGHT * 0.4997776653990315251025047042269;
  const [date, setDate] = React.useState('');
  const onDayPress = React.useCallback((date: DateData) => {
    setDate(date.dateString);
    findDateAndScroll(new Date(date.dateString));
  }, []);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={toggleCalendar}
      style={{
        bottom: 0,
        margin: 0,
        position: 'absolute',
        width: constants.WIDTH,
        height: height,
        backgroundColor: 'transparent',
      }}>
      <View
        style={{
          height: 15,
          width: constants.WIDTH,
          backgroundColor: constants.colors.OFF_WHITE,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
        }}
      />
      <CalendarList
        calendarWidth={constants.WIDTH}
        calendarHeight={height}
        onDayPress={onDayPress}
        hideArrows={false}
        markedDates={{[date]: {selected: true}}}
        horizontal
        calendarStyle={{
          backgroundColor: constants.colors.OFF_WHITE,
        }}
        // getItemLayout={(data, index) => ({
        //   index,
        //   length: height,
        //   offset: height * index,
        // })}
        theme={{
          textDayFontFamily: constants.Fonts.text,
          backgroundColor: constants.colors.BGC,
          calendarBackground: constants.colors.OFF_WHITE,
          selectedDayBackgroundColor: constants.colors.GREEN,
          textMonthFontFamily: constants.Fonts.paragraph,
          textDayHeaderFontFamily: constants.Fonts.paragraph,
          // todayTextColor: constants.colors.GREY,
          todayTextColor: '#B9AB85',
          dayTextColor: constants.colors.BGC,
          selectedDayTextColor: constants.colors.BGC,
          arrowColor: constants.colors.UNDER_LINE,
          textSectionTitleColor: constants.colors.GREY,
        }}
        pagingEnabled
      />
    </Modal>
  );
};

export default React.memo(CalendarModal);

const styles = StyleSheet.create({});
