import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import DatePicker from 'react-native-date-picker';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import constants from '../assets/constants';
import {formatDate} from './WeeklyCalender';

interface DatePickerProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  dateFormat?: 'time' | 'date' | 'datetime';
  isOpen: boolean;
}
const DatePickerModal: React.FC<DatePickerProps> = ({
  isOpen,
  dateFormat,
  setDate,
  date,
}) => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleConfirm = () => {
    const formattedDate = formatDate(currentDate);
    setDate(formattedDate);
    close();
  };
  const handleChange = (date: Date) => {
    dateFormat === 'time' ? handleHoursChange(date) : setCurrentDate(date);
  };

  const handleHoursChange = (date: Date) => {
    const time = date.toLocaleTimeString();
    const [hours, minutes] = time.split(':');
    const fixedDate = new Date(date.setUTCHours(+hours, +minutes));
    setCurrentDate(fixedDate);
  };
  const cancelConfirm = () => {
    setCurrentDate(new Date());
    close();
  };

  React.useEffect(() => {
    isOpen ? open() : close();
  }, [isOpen]);

  const open = () => {
    bottomSheetModalRef.current?.present();
  };
  const close = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  // variables
  const snapPoints = useMemo(() => ['27%', '27%'], []);

  const ModalHeader = () => {
    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
          <Text style={styles.textBtn}>confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={cancelConfirm}>
          <Text style={styles.textBtn}>cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        onDismiss={cancelConfirm}
        snapPoints={snapPoints}
        stackBehavior="push"
        handleIndicatorStyle={{display: 'none'}}
        handleStyle={{
          backgroundColor: constants.colors.BGC,
        }}
        handleComponent={ModalHeader}
        backgroundStyle={{backgroundColor: constants.colors.BGC}}
        onChange={handleSheetChanges}>
        <View>
          <DatePicker
            date={date}
            mode={dateFormat}
            onDateChange={handleChange}
            fadeToColor={constants.colors.BGC}
            style={styles.datePicker}
            textColor={constants.colors.GREEN}
          />
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default DatePickerModal;

const styles = StyleSheet.create({
  btnContainer: {
    height: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '7.5%',
    alignItems: 'center',
  },
  btn: {
    height: '100%',
    justifyContent: 'center',
  },
  textBtn: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.GREEN,
    fontSize: 20,
  },
  datePicker: {
    backgroundColor: constants.colors.BGC,
    alignSelf: 'center',
    width: constants.WIDTH,
  },
});
