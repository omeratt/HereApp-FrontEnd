import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import DatePicker from 'react-native-date-picker';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import constants from '../assets/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {getRealDate} from './WeeklyCalender';

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  dateFormat?: 'time' | 'date' | 'datetime';
  isOpen: boolean;
  minimumDate: Date;
  maximumDate: Date;
  isSetTimeRef: React.MutableRefObject<boolean>;
  setIsOpen?: (state: boolean) => void;
  targetDateHoursRef?: React.MutableRefObject<string>;
  bottomSheetModalRef?: React.RefObject<BottomSheetModalMethods>;
}

const currDate = new Date();
const DatePickerModal: React.FC<DatePickerProps> = ({
  isOpen,
  dateFormat,
  setDate,
  date,
  minimumDate,
  maximumDate,
  isSetTimeRef,
  targetDateHoursRef,
  bottomSheetModalRef,
  setIsOpen,
}) => {
  const [currentDate, setCurrentDate] = React.useState<Date>(date);
  const [hours, setHours] = React.useState<string>('');

  const handleConfirm = () => {
    if (dateFormat !== 'time') {
      setDate(currentDate);
      return close();
    }
    if (!hours) return close();
    setDate(currentDate);
    isSetTimeRef.current = true;
    close();
  };
  const handleChange = (date1: Date) => {
    let date = date1;

    if (dateFormat !== 'time' && hours) {
      const [_hours, minutes] = hours.split(':');

      date.setUTCHours(+_hours, +minutes);
    }
    dateFormat === 'time' ? handleHoursChange(date) : setCurrentDate(date);
  };

  const handleHoursChange = (date: Date) => {
    const time = date.toISOString();

    const [hours, minutes] = time.split('T')[1].split(':');
    const formattedTime = `${hours}:${minutes}`;
    setHours(formattedTime);
    if (targetDateHoursRef && targetDateHoursRef.current)
      targetDateHoursRef.current = formattedTime;

    currentDate.setUTCHours(+hours, +minutes);
  };
  const cancelConfirm = () => {
    setCurrentDate(date);
    close();
  };

  const close = () => {
    // setCurrentDate(date);
    setIsOpen?.(false);
    bottomSheetModalRef?.current?.dismiss();
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
    // console.log('handleSheetChanges', index);
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <Pressable
        onPress={cancelConfirm}
        {...props}
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          height: constants.HEIGHT,
          width: constants.WIDTH,
        }}
      />
    ),
    [],
  );
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        stackBehavior="push"
        handleIndicatorStyle={{display: 'none'}}
        handleStyle={{
          backgroundColor: constants.colors.BGC,
        }}
        handleComponent={ModalHeader}
        backdropComponent={renderBackdrop}
        backgroundStyle={{backgroundColor: constants.colors.BGC}}
        style={{paddingHorizontal: '8%'}}
        enablePanDownToClose={false}
        onChange={handleSheetChanges}>
        <View>
          <DatePicker
            date={date}
            timeZoneOffsetInMinutes={60000}
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
