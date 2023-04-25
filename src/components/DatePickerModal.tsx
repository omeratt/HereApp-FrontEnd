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
    const realDate = new Date(
      currentDate.getTime() - currentDate.getTimezoneOffset() * 60000,
    );
    setDate(realDate);
    if (dateFormat !== 'time') return close();
    const [_hours, minutes] = hours.split(':');
    const fixedDate = new Date(currentDate.setUTCHours(+_hours, +minutes));
    setDate(fixedDate);
    isSetTimeRef.current = true;
    close();
  };
  const handleChange = (date1: Date) => {
    dateFormat === 'time' ? handleHoursChange(date1) : setCurrentDate(date1);
  };

  const handleHoursChange = (date: Date) => {
    const time = date.toLocaleTimeString();
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours}:${minutes}`;
    setHours(formattedTime);
    if (targetDateHoursRef && targetDateHoursRef.current)
      targetDateHoursRef.current = formattedTime;

    const fixedDate = new Date(currentDate.setUTCHours(+hours, +minutes));
    setCurrentDate(fixedDate);
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
