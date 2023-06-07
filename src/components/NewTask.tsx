import {
  BackHandler,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import constants, {Frequency} from '../assets/constants';
import SVG from '../assets/svg';
import Line from './Line';
import SwitchToggle from 'react-native-switch-toggle';
import {useDeleteTaskMutation} from '../app/api/taskApi';
import DatePickerModal from './DatePickerModal';
import Notes from './Notes';
import SetTimeContent from './SetTimeContent';
import FrequencyPickerModal from './FrequencyPickerModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {TaskType} from '../app/Reducers/User/userSlice';
import {
  compareDates,
  getRealDate,
  getTimeFromDateString,
} from './WeeklyCalender';
import moment from 'moment';
import BottomSheetDeleteModal, {
  BottomSheetDeleteModalHandles,
} from './BottomSheetDeleteModal';
const realDate = new Date();
const hours = getTimeFromDateString(realDate.toISOString(), true, true);
const {min: minimumDate, max: maximumDate} = constants.Dates;
interface props {
  task?: TaskType;
  setTask?: React.Dispatch<React.SetStateAction<TaskType | undefined>>;
  closeModal: any;
  targetDate?: Date;
  setTargetDate?: (date: Date) => void;
  findDateAndScroll?: (DateToCheck: Date) => void;
  AddTask?: (args: any) => any;
}
type DateFormat = 'datetime' | 'date' | 'time';
const FreqData = [...constants.FreqList];
const currFreq = FreqData[0];
const NewTask: React.FC<props> = ({
  task,
  setTask,
  closeModal,
  targetDate,
  setTargetDate,
  findDateAndScroll,
  AddTask,
}) => {
  const [pushOn, setPushOn] = useState(task?.push ? task.push : false);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [freqPickerOpen, setFreqPickerOpen] = useState<boolean>(false);
  const [freq, setFreq] = useState<string>(currFreq);
  const dateTypeRef = useRef<DateFormat>('datetime');
  const [taskName, setTaskName] = useState<string>(task?.name || '');
  const [description, setDescription] = useState<string>(task?.details || '');
  const [startDate, setStartDate] = useState<Date>(
    task?.targetDate
      ? new Date(task?.targetDate)
      : getRealDate(targetDate, true),
  );
  const [endDate, setEndDate] = useState<Date>(startDate);

  // const isEndDate = useRef<boolean>(false);
  const [isEndDate, setIsEndDate] = useState<boolean>(false);
  const isSetTime = useRef<boolean>(false);

  const targetDateHoursRef = useRef<string>(
    task?.targetDate
      ? getTimeFromDateString(task?.targetDate, false, true)
      : hours,
  );

  const taskNameInputRef = React.useRef<TextInput>(null);
  const taskDescriptionInputRef = React.useRef<TextInput>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomDeleteSheetRef = useRef<BottomSheetDeleteModalHandles>(null);

  const [deleteTask] = useDeleteTaskMutation();

  const SetFreqPickerOpen = useCallback((state: boolean) => {
    setFreqPickerOpen(state);
  }, []);
  const SetFreq = useCallback((freq: string) => {
    setFreq(freq);
  }, []);
  const SetEndDate = useCallback((date: Date) => {
    setEndDate(date);
  }, []);

  React.useEffect(() => {
    return () => {
      setTask?.(undefined);
    };
  }, []);
  const submit = async () => {
    try {
      if (!description || !taskName) return;
      const areDatesEqual =
        startDate?.toISOString().split('T')[0] ===
        targetDate?.toISOString().split('T')[0];
      if (!areDatesEqual) {
        findDateAndScroll?.(startDate);
      }
      closeModal();
      const data = await AddTask?.({
        name: taskName,
        details: description,
        targetDate: startDate,
        frequency: freq,
        ...(endDate && freq !== 'None' && {endDate}),
        isSetTime: true,
        ...(task?._id && {_id: task._id}),
        push: pushOn,
      }).unwrap();
      setDescription('');
      setTaskName('');
    } catch (err) {
      console.log('error from add Task submit', err);
    }
  };

  React.useEffect(() => {
    taskNameInputRef?.current?.focus();
  }, []);

  /**
   * @param type which format to use in date picker
   * @param _isDateEnd should date picker use setTargetDate or setEndDate
   */
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        closeModal();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );
  const minimumEndDate = useMemo(() => {
    const freqArr = freq?.split?.(' ');
    const unit = freqArr[freqArr.length - 1];
    const amount = Frequency[freq as any];
    const fixedDate = moment(startDate);
    fixedDate.add(amount as any, unit as any);
    const diff = moment(endDate).diff(startDate, unit as any);
    if (diff >= +amount) return;
    setEndDate(fixedDate.toDate());
    return fixedDate.toDate();
  }, [freq, startDate, Frequency]);

  const openDeleteModal = React.useCallback(() => {
    bottomDeleteSheetRef.current?.openModal();
  }, []);

  const openCloseDatePicker = useCallback(
    (dateType: DateFormat = 'date', _isEndDate: boolean = false) => {
      if (datePickerOpen) bottomSheetModalRef.current?.dismiss();
      else bottomSheetModalRef.current?.present();
      setDatePickerOpen(prev => !prev);
      dateTypeRef.current = dateType;
      setIsEndDate(_isEndDate);
      // isEndDate.current = _isEndDate;
    },
    [setDatePickerOpen, dateTypeRef, datePickerOpen, setIsEndDate],
  );
  const openCloseFreqPicker = useCallback(
    (dateType: DateFormat = 'datetime') => {
      setFreqPickerOpen(prev => !prev);
    },
    [],
  );
  const handleDeletePress = useCallback(() => {
    task?._id && deleteTask(task._id);
    bottomDeleteSheetRef.current?.closeModal();
    closeModal();
    // bottomSheetModalRef.current?.dismiss();
  }, []);

  const pushOnPress = useCallback(() => {
    setPushOn(prev => !prev);
  }, []);
  const PushForMe = useMemo(() => {
    return (
      <View style={[styles.flexOneAndJustifyCenter]}>
        <View style={styles.textAndToggleContainer}>
          <View style={[styles.TxtAndToggleInSetTime, {paddingLeft: '8%'}]}>
            <SwitchToggle
              switchOn={pushOn}
              onPress={pushOnPress}
              backgroundColorOff={'transparent'}
              backgroundColorOn={'transparent'}
              circleColorOn={constants.colors.GREEN}
              circleColorOff={'transparent'}
              containerStyle={styles.toggleContent}
              circleStyle={styles.circleStyle}
            />
            <TouchableOpacity onPress={pushOnPress}>
              <Text
                style={[
                  styles.subSectionTxt,
                  {color: constants.colors.UNDER_LINE},
                ]}>
                Push it for me
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [pushOnPress, pushOn]);
  const formattedDate = useCallback((date: Date) => {
    const date1 = new Date(date.toISOString().split('T')[0]);
    const format = date1.toLocaleDateString('default', {
      month: 'long',
      year: '2-digit',
    });
    const day = date1.toLocaleDateString('default', {
      day: '2-digit',
    });
    const arr = format.split(' ');
    const fixedString = `${day} ${arr[0]}`;
    return fixedString;
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={[styles.realContainer]}>
            <View
              style={[
                styles.header,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <TextInput
                onPressOut={() => {
                  taskNameInputRef.current?.blur();
                  taskNameInputRef.current?.focus();
                }}
                ref={taskNameInputRef}
                maxLength={19}
                onChangeText={setTaskName}
                defaultValue={taskName}
                placeholder="New task"
                placeholderTextColor={constants.colors.UNDER_LINE}
                selectionColor={constants.colors.GREEN}
                cursorColor={constants.colors.GREEN}
                style={styles.newTaskTitleInput}
                onSubmitEditing={() => {
                  taskDescriptionInputRef.current?.focus();
                }}
              />
            </View>
            <View style={{flex: 2.5}}>
              <View style={[styles.descriptionContainer]}>
                <Line
                  strength={1}
                  lengthPercentage={100}
                  lineColor={constants.colors.UNDER_LINE}
                  rotate180
                  style={{elevation: 1}}
                />
                <View style={[styles.descriptionContent]}>
                  <View style={[styles.description]}>
                    <TouchableOpacity
                      onPress={() => taskDescriptionInputRef?.current?.focus()}
                      style={{marginVertical: '2%'}}>
                      <Text style={[styles.sectionTxt]}>Description</Text>
                    </TouchableOpacity>
                    <Line
                      strength={0.5}
                      lengthPercentage={100}
                      lineColor={constants.colors.UNDER_LINE}
                      rotate180
                    />
                  </View>
                  <View style={[styles.EveryContainer]}>
                    <View style={[styles.descriptionInputContainer]}>
                      <TextInput
                        numberOfLines={4}
                        multiline
                        onChangeText={setDescription}
                        selectionColor={constants.colors.GREEN}
                        cursorColor={constants.colors.GREEN}
                        style={styles.descriptionInput}
                        defaultValue={description}
                        ref={taskDescriptionInputRef}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.flexOneAndJustifyCenter, {flex: 2}]}>
                <Line
                  strength={1}
                  lengthPercentage={100}
                  rotate180
                  lineColor={constants.colors.UNDER_LINE}
                  style={{elevation: 1}}
                />
                <View
                  style={[
                    styles.textAndToggleContainer,
                    {justifyContent: 'flex-start'},
                  ]}>
                  <View
                    style={[
                      styles.textAndToggle,
                      {
                        alignItems: 'flex-start',
                      },
                    ]}>
                    <Text style={[styles.sectionTxt, {marginVertical: '2%'}]}>
                      Set Time
                    </Text>
                    <Line
                      strength={0.5}
                      lengthPercentage={100}
                      rotate180
                      lineColor={constants.colors.UNDER_LINE}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.EveryContainer,
                    {paddingHorizontal: 0, paddingLeft: '6%', flex: 1},
                  ]}>
                  <View style={[styles.setTimeSubContainer]}>
                    <SetTimeContent
                      title={'Frequency'}
                      buttonTxt={freq}
                      onPress={openCloseFreqPicker}
                    />
                    <SetTimeContent
                      title={'Time of day'}
                      buttonTxt={targetDateHoursRef.current}
                      onPress={openCloseDatePicker}
                      dateFormat={'time'}
                    />
                    <SetTimeContent
                      title={'Start date'}
                      buttonTxt={formattedDate(startDate)}
                      onPress={openCloseDatePicker}
                    />
                    {freq !== 'None' && (
                      <>
                        <SetTimeContent
                          title={'End Date'}
                          buttonTxt={formattedDate(endDate || startDate)}
                          onPress={() => openCloseDatePicker('date', true)}
                        />
                      </>
                    )}
                    {PushForMe}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{flex: 1, width: '100%'}}>
            <Notes />
          </View>
          {/* <View style={{flexDirection: 'row', flex: 1}}> */}
          <TouchableOpacity onPress={submit} style={styles.buttonContainer}>
            <SVG.DoneButton
              fill={constants.colors.BLACK}
              width="100%"
              height="100%"
            />
          </TouchableOpacity>
          {task?._id && (
            <TouchableOpacity style={styles.trashBtn}>
              <SVG.Trash height={35} onPress={openDeleteModal} />
            </TouchableOpacity>
          )}

          <DatePickerModal
            isOpen={datePickerOpen}
            date={isEndDate ? endDate : startDate}
            dateFormat={dateTypeRef.current}
            setDate={isEndDate ? SetEndDate : setStartDate}
            // setDate={isEndDate ? SetEndDate : setStartDate}
            minimumDate={
              isEndDate && minimumEndDate ? minimumEndDate : minimumDate
            }
            maximumDate={maximumDate}
            isSetTimeRef={isSetTime}
            targetDateHoursRef={targetDateHoursRef}
            bottomSheetModalRef={bottomSheetModalRef}
            setIsOpen={setDatePickerOpen}
          />
          <FrequencyPickerModal
            isOpen={freqPickerOpen}
            setFreq={SetFreq}
            data={FreqData}
            freq={freq}
            setIsOpen={SetFreqPickerOpen}
          />
          {task?._id && (
            <BottomSheetDeleteModal
              onDelete={handleDeletePress}
              ids={[task._id]}
              ref={bottomDeleteSheetRef}
              behavior="push"
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    width: constants.WIDTH,
    height: '100%',
    // flexGrow: 1,
    backgroundColor: constants.colors.OFF_WHITE,
    alignItems: 'center',
    paddingHorizontal: '3.2%',
  },
  realContainer: {
    height: '70.09375%',
    width: '100%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 0,
  },
  header: {flex: 0.4, paddingHorizontal: '3.2%'},
  newTaskTitleInput: {
    flex: 1,
    borderWidth: 0,
    fontSize: 26,
    color: constants.colors.BGC,
    alignItems: 'center',
    textAlignVertical: 'center',
    fontFamily: constants.Fonts.text,
  },
  textAndToggle: {
    paddingHorizontal: '5.2%',
    alignItems: 'center',
  },
  textAndToggleContainer: {
    justifyContent: 'center',
  },
  flexOneAndJustifyCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text,
    fontSize: 18,
  },
  subSectionTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text,
    fontSize: 12,
  },
  descriptionContainer: {flex: 1, justifyContent: 'center'},
  descriptionContent: {flex: 1, justifyContent: 'center'},
  description: {
    paddingHorizontal: '5.2%',
    justifyContent: 'center',
  },
  descriptionInputContainer: {
    width: '100%',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  descriptionInput: {
    height: '100%',
    color: constants.colors.BGC,
    textAlignVertical: 'top',
  },

  buttonContainer: {
    width: '35%',
    height: '11.6%',
  },
  trashBtn: {position: 'absolute', left: '10%', bottom: '4%'},
  EveryContainer: {
    flex: 1.5,
    paddingHorizontal: '5.2%',
  },
  TxtAndToggleInSetTime: {
    paddingLeft: '5.2%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  setTimeSubContainer: {
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    paddingVertical: '5%',
  },
  toggleContent: {
    width: 65,
    height: 28,
    borderRadius: 25,
    padding: 2,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
  },
  circleStyle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
  },
});
