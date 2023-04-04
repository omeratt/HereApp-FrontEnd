import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import DatePicker from 'react-native-date-picker';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import constants from '../assets/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  dateFormat?: 'time' | 'date' | 'datetime';
  isOpen: boolean;
  minimumDate: Date;
  maximumDate: Date;
}

const currDate = new Date();
const DatePickerModal: React.FC<DatePickerProps> = ({
  isOpen,
  dateFormat,
  setDate,
  date,
  minimumDate,
  maximumDate,
}) => {
  const [currentDate, setCurrentDate] = React.useState<Date>(currDate);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleConfirm = () => {
    setDate(currentDate);
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
    setCurrentDate(currentDate);
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
  const snapPoints = useMemo(() => ['37%', '37%'], []);

  const ModalHeader = () => {
    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={cancelConfirm}>
          <MaterialCommunityIcons name="close" style={styles.textBtn} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
          <Text style={styles.textBtn}>Done</Text>
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
        // onDismiss={cancelConfirm}
        snapPoints={snapPoints}
        stackBehavior="push"
        handleIndicatorStyle={{display: 'none'}}
        handleStyle={{
          backgroundColor: constants.colors.BGC,
        }}
        handleComponent={ModalHeader}
        backgroundStyle={{backgroundColor: constants.colors.BGC}}
        style={{paddingHorizontal: '8%'}}
        onChange={handleSheetChanges}>
        <View>
          <DatePicker
            date={date}
            mode={dateFormat}
            onDateChange={handleChange}
            fadeToColor={constants.colors.BGC}
            style={[styles.datePicker]}
            textColor={constants.colors.OFF_WHITE}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
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
    alignItems: 'center',
    marginBottom: '10%',
  },
  btn: {
    height: '100%',
    justifyContent: 'center',
    marginTop: '2%',
    marginHorizontal: '2%',
  },
  textBtn: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.GREEN,
    fontSize: 15,
  },
  datePicker: {
    backgroundColor: constants.colors.BGC,
    alignSelf: 'center',
    width: constants.WIDTH,
  },
});
