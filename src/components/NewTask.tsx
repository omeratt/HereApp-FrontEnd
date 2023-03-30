import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import Line from './Line';
import SwitchToggle from 'react-native-switch-toggle';
import {useAddTaskMutation} from '../app/api/taskApi';
import DatePickerModal from './DatePickerModal';
import Notes from './Notes';
import SetTimeContent from './SetTimeContent';

interface props {
  closeModal: any;
  targetDate: Date;
  setTargetDate: React.Dispatch<React.SetStateAction<string>>;
}
type DateFormat = 'datetime' | 'date' | 'time';
const NewTask: React.FC<props> = ({closeModal, targetDate, setTargetDate}) => {
  const [pushOn, setPushOn] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const dateTypeRef = useRef<DateFormat>('datetime');
  const [taskName, setTaskName] = useState<string>();
  const [description, setDescription] = useState<string>();

  const [AddTask, {isLoading, data, isSuccess, isError, error}] =
    useAddTaskMutation();

  const taskNameInputRef = React.useRef<TextInput>(null);
  const taskDescriptionInputRef = React.useRef<TextInput>(null);
  const submit = async () => {
    try {
      if (!description || !taskName) return;
      closeModal();
      const data = await AddTask({
        name: taskName,
        details: description,
        targetDate,
      }).unwrap();
      console.log(data);
      setDescription('');
      setTaskName('');
    } catch (err) {
      console.log('error from signup', err);
    }
  };

  Keyboard.addListener('keyboardDidHide', () => {
    taskNameInputRef?.current?.blur();
  });
  Keyboard.addListener('keyboardDidHide', () => {
    taskDescriptionInputRef?.current?.blur();
  });

  const openCloseDatePicker = useCallback(
    (dateType: DateFormat = 'datetime') => {
      setDatePickerOpen(prev => !prev);
      dateTypeRef.current = dateType;
    },
    [setDatePickerOpen, dateTypeRef],
  );
  console.log({c: dateTypeRef.current});
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
                style={[styles.subSectionTxt, {color: constants.colors.GREY}]}>
                Push it for me
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [pushOnPress, pushOn]);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={[styles.realContainer]}>
          <View style={styles.header}>
            <TextInput
              ref={taskNameInputRef}
              maxLength={19}
              onChangeText={setTaskName}
              placeholder="New task"
              placeholderTextColor={constants.colors.UNDER_LINE}
              selectionColor={constants.colors.GREEN}
              cursorColor={constants.colors.GREEN}
              style={styles.newTaskTitleInput}
              onSubmitEditing={Keyboard.dismiss}
            />
            {/* </View> */}
          </View>
          <View style={{flex: 8}}>
            <View style={[styles.descriptionContainer]}>
              <Line
                strength={1}
                lengthPercentage={100}
                lineColor={constants.colors.UNDER_LINE}
                rotate180
              />
              <View style={[styles.descriptionContent]}>
                <View style={[styles.description]}>
                  <TouchableOpacity
                    onPress={() => taskDescriptionInputRef?.current?.focus()}
                    style={{marginVertical: '2%'}}>
                    <Text style={[styles.sectionTxt]}>Description</Text>
                  </TouchableOpacity>
                  <Line
                    strength={0.8}
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
            <View style={[styles.flexOneAndJustifyCenter, {flex: 3}]}>
              <Line
                strength={1}
                lengthPercentage={100}
                rotate180
                lineColor={constants.colors.UNDER_LINE}
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
                    strength={1}
                    lengthPercentage={100}
                    rotate180
                    lineColor={constants.colors.UNDER_LINE}
                  />
                </View>
              </View>
              <View
                style={[
                  styles.EveryContainer,
                  {paddingHorizontal: 0, paddingLeft: '6%'},
                ]}>
                <View style={[styles.setTimeSubContainer]}>
                  <SetTimeContent
                    title={'Frequency'}
                    buttonTxt={'Every day'}
                    onPress={openCloseDatePicker}
                  />
                  <SetTimeContent
                    title={'TimeOfDay'}
                    buttonTxt={'20:40'}
                    onPress={openCloseDatePicker}
                    dateFormat={'time'}
                  />
                  <SetTimeContent
                    title={'StartDate'}
                    buttonTxt={'17 april 2023'}
                    onPress={openCloseDatePicker}
                  />
                  {PushForMe}
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1, width: '100%'}}>
          <Notes />
        </View>
        <TouchableOpacity onPress={submit} style={styles.buttonContainer}>
          <SVG.DoneButton
            fill={constants.colors.BLACK}
            width="100%"
            height="100%"
          />
        </TouchableOpacity>
        <DatePickerModal
          isOpen={datePickerOpen}
          date={targetDate}
          dateFormat={dateTypeRef.current}
          setDate={setTargetDate}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: constants.WIDTH,
    height: '100%',
    backgroundColor: constants.colors.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '3.2%',
  },
  realContainer: {
    height: '63.09375%',
    width: '100%',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 0,
  },
  header: {flex: 1, padding: '3%'},
  newTaskTitleInput: {
    flex: 1,
    borderWidth: 0,
    fontSize: 30,
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
  descriptionContainer: {flex: 2, justifyContent: 'center'},
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
  EveryContainer: {
    flex: 1,
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
