import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import Line from './Line';
import SwitchToggle from 'react-native-switch-toggle';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ZERO} from '../screens/AuthModal';
import {useAddTaskMutation} from '../app/api/taskApi';
import DatePickerModal from './DatePickerModal';
import {formatStringToDate} from './WeeklyCalender';
const DEFAULT_FLEX = {
  PUSH: 1,
  SET_TIME_CONTENT: 1,
  SET_TIME: 1,
  DAY_AND_TIME: 1,
  TODAY: 1,
  REPEAT: 1,
  DESCRIPTION: 1,
  NOTE: 3,
};
const OPENED_FLEX = {
  PUSH: 2.5,
  SET_TIME_CONTENT: 2.5,
  SET_TIME: 2.5,
  TODAY: 2.5,
  DAY_AND_TIME: 2.5,
  REPEAT: 2.5,
  DESCRIPTION: 2.5,
  NOTE: 3,
};
const containerStyle = {
  width: 65,
  height: 30,
  borderRadius: 25,
  padding: 3,
  borderWidth: 1,
  borderColor: constants.colors.UNDER_LINE,
};
const circleStyle = {
  width: 25,
  height: 25,
  borderRadius: 12.5,
  borderWidth: 1,
  borderColor: constants.colors.UNDER_LINE,
};
const subToggleContainerStyle = {
  width: 47,
  height: 22,
  borderRadius: 25,
  padding: 3,
  borderWidth: 1,
  borderColor: constants.colors.UNDER_LINE,
};
const subToggleCircleStyle = {
  width: 18,
  height: 18,
  borderRadius: 12.5,
  borderWidth: 1,
  borderColor: constants.colors.UNDER_LINE,
};
type tabType =
  | 'PUSH'
  | 'SET_TIME'
  | 'SET_TIME_CONTENT'
  | 'TODAY'
  | 'DAY_AND_TIME'
  | 'REPEAT'
  | 'DESCRIPTION'
  | 'NOTE';
interface props {
  closeModal: any;
  targetDate: Date;
  setTargetDate: React.Dispatch<React.SetStateAction<string>>;
}
const NewTask: React.FC<props> = ({closeModal, targetDate, setTargetDate}) => {
  const ref = useRef<any>();

  const AnimateStyle = (tab: tabType) => {
    return useAnimatedStyle(() => {
      return {flex: flex[tab].line.value};
    });
  };
  const EveryContainerStyle = (tab: tabType) => {
    return useAnimatedStyle(() => {
      return {flex: flex[tab].space.value};
    });
  };
  const descInputAnimation = useSharedValue(1);

  // const descOpacity = useDerivedValue(() => {
  //   return interpolate(descInputAnimation.value, [0, 1], [0, 1]);
  // });

  const descriptionAnimateOpenStyle = useAnimatedStyle(() => {
    return {
      opacity: 0,
    };
  });
  // const [isModalVisible, setModalVisible] = useState(true);
  const [timeOn, setTimeOn] = useState(false);
  const [todayOn, setTodayOn] = useState(false);
  const [dayAndTimeOn, setDayAndTimeOn] = useState(false);
  const [repeatOn, setRepeatOn] = useState(false);
  const [descriptionOn, setDescriptionOn] = useState(false);
  const [pushOn, setPushOn] = useState(false);
  const [noteOn, setNoteOn] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [todayOpen, setTodayOpen] = useState(false);
  const [dayAndTimeOpen, setDayAndTimeOpen] = useState(false);
  const [repeatOpen, setRepeatOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [pushOpen, setPushOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
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
  const flex = {
    PUSH: {
      line: useSharedValue(DEFAULT_FLEX.PUSH),
      space: useSharedValue(ZERO),
    },
    SET_TIME_CONTENT: {
      line: useSharedValue(DEFAULT_FLEX.SET_TIME_CONTENT),
      space: useSharedValue(ZERO),
    },
    SET_TIME: {
      line: useSharedValue(DEFAULT_FLEX.SET_TIME),
      space: useSharedValue(ZERO),
    },
    TODAY: {
      line: useSharedValue(DEFAULT_FLEX.TODAY),
      space: useSharedValue(ZERO),
    },
    DAY_AND_TIME: {
      line: useSharedValue(DEFAULT_FLEX.DAY_AND_TIME),
      space: useSharedValue(ZERO),
    },
    REPEAT: {
      line: useSharedValue(DEFAULT_FLEX.REPEAT),
      space: useSharedValue(ZERO),
    },
    DESCRIPTION: {
      line: useSharedValue(DEFAULT_FLEX.DESCRIPTION),
      space: useSharedValue(ZERO),
    },
    NOTE: {
      line: useSharedValue(DEFAULT_FLEX.NOTE),
      space: useSharedValue(ZERO),
    },
  };

  const open = (tabName: tabType) => {
    TABS[tabName].setStateOn(!TABS[tabName].stateIsOn);
    TABS[tabName].setStateOpen(!TABS[tabName].stateIsOn);

    //OPEN TAB
    if (!TABS[tabName].stateIsOn) {
      closeAllExcept(tabName);
      if (tabName === 'TODAY') {
        flex['SET_TIME'].line.value = withTiming(4.5, {
          duration: 300,
        });
        flex['SET_TIME'].space.value = withTiming(4.5, {
          duration: 300,
        });
        flex['NOTE'].line.value = withTiming(1.2, {
          duration: 300,
        });
      } else if (tabName === 'DAY_AND_TIME') {
        flex['TODAY'].line.value = withTiming(1, {
          duration: 300,
        });
        flex['TODAY'].space.value = withTiming(1, {
          duration: 300,
        });
        flex['SET_TIME'].line.value = withTiming(4.5, {
          duration: 300,
        });
        flex['SET_TIME'].space.value = withTiming(4.5, {
          duration: 300,
        });
        flex['NOTE'].line.value = withTiming(1.2, {
          duration: 300,
        });
        flex[tabName].line.value = withTiming(10, {
          duration: 300,
        });
      } else {
        flex[tabName].line.value = withTiming(OPENED_FLEX[tabName], {
          duration: 300,
        });
      }
      flex[tabName].space.value = withTiming(1.7, {
        duration: 300,
      });
      if (tabName == 'DESCRIPTION')
        descInputAnimation.value = withTiming(100, {duration: 300});
    }
    //CLOSE TAB
    else {
      if (tabName === 'TODAY' && TABS['DAY_AND_TIME'].stateIsOpen) {
        flex['TODAY'].line.value = withTiming(1, {
          duration: 300,
        });
        flex['TODAY'].space.value = withTiming(1, {
          duration: 300,
        });
        flex['SET_TIME'].line.value = withTiming(4.5, {
          duration: 300,
        });
        flex['SET_TIME'].space.value = withTiming(4.5, {
          duration: 300,
        });
        flex['NOTE'].line.value = withTiming(1.2, {
          duration: 300,
        });
        flex[tabName].line.value = withTiming(10, {
          duration: 300,
        });
      } else if (tabName === 'TODAY' || tabName === 'DAY_AND_TIME') {
        console.log('asdasdas', tabName);

        flex['SET_TIME'].line.value = withTiming(2.5, {
          duration: 300,
        });
        flex['SET_TIME'].space.value = withTiming(1.7, {
          duration: 300,
        });
        flex['NOTE'].line.value = withTiming(3, {
          duration: 300,
        });
      }
      TABS[tabName].close(tabName);
    }
  };
  const handleNamePress = (tabName: tabType) => {
    TABS[tabName].setStateOpen(!TABS[tabName].stateIsOpen);
    //OPEN TAB
    if (!TABS[tabName].stateIsOpen) {
      closeAllExcept(tabName);
      if (tabName === 'TODAY' || tabName === 'DAY_AND_TIME') {
        flex['SET_TIME'].line.value = withTiming(4.5, {
          duration: 300,
        });
        flex['SET_TIME'].space.value = withTiming(4.5, {
          duration: 300,
        });
        flex['NOTE'].line.value = withTiming(1.2, {
          duration: 300,
        });
      }
      flex[tabName].line.value = withTiming(OPENED_FLEX[tabName], {
        duration: 300,
      });
      flex[tabName].space.value = withTiming(1.7, {
        duration: 300,
      });
    }
    //CLOSE TAB
    else {
      if (tabName === 'TODAY' || tabName === 'DAY_AND_TIME') {
        flex['SET_TIME'].line.value = withTiming(2.5, {
          duration: 300,
        });
        flex['SET_TIME'].space.value = withTiming(1.7, {
          duration: 300,
        });
        flex['NOTE'].line.value = withTiming(3, {
          duration: 300,
        });
      }
      TABS[tabName].close(tabName);
    }
  };

  const close = (tab: string) => {
    flex[tab as tabType].line.value = withTiming(DEFAULT_FLEX[tab as tabType], {
      duration: 300,
    });
    flex[tab as tabType].space.value = withTiming(ZERO, {
      duration: 300,
    });
  };
  const TABS = {
    SET_TIME_CONTENT: {
      open,
      close,
      stateIsOn: repeatOn,
      setStateOn: setRepeatOn,
      stateIsOpen: repeatOpen,
      setStateOpen: setRepeatOpen,
    },
    SET_TIME: {
      open,
      close,
      stateIsOn: timeOn,
      setStateOn: setTimeOn,
      stateIsOpen: timeOpen,
      setStateOpen: setTimeOpen,
    },
    TODAY: {
      open,
      close,
      stateIsOn: todayOn,
      setStateOn: setTodayOn,
      stateIsOpen: todayOpen,
      setStateOpen: setTodayOpen,
    },
    DAY_AND_TIME: {
      open,
      close,
      stateIsOn: dayAndTimeOn,
      setStateOn: setDayAndTimeOn,
      stateIsOpen: dayAndTimeOpen,
      setStateOpen: setDayAndTimeOpen,
    },
    REPEAT: {
      open,
      close,
      stateIsOn: repeatOn,
      setStateOn: setRepeatOn,
      stateIsOpen: repeatOpen,
      setStateOpen: setRepeatOpen,
    },
    DESCRIPTION: {
      open,
      close,
      stateIsOn: descriptionOn,
      setStateOn: setDescriptionOn,
      stateIsOpen: descriptionOpen,
      setStateOpen: setDescriptionOpen,
    },
    PUSH: {
      open,
      close,
      stateIsOn: pushOn,
      setStateOn: setPushOn,
      stateIsOpen: pushOpen,
      setStateOpen: setPushOpen,
    },
    NOTE: {
      open,
      close,
      stateIsOn: noteOn,
      setStateOn: setNoteOn,
      stateIsOpen: noteOpen,
      setStateOpen: setNoteOpen,
    },
  };
  const closeAllTabs = () => {
    for (const [key, tab] of Object.entries(TABS)) {
      tab.close(key);
    }
  };
  const closeAllExcept = (tabName: string) => {
    for (const [key, tab] of Object.entries(TABS)) {
      if (key != tabName) {
        if (
          !(
            (tabName === 'TODAY' || tabName === 'DAY_AND_TIME') &&
            (key as tabType) === 'SET_TIME'
          )
        ) {
          tab.close(key as tabType);
          tab.setStateOpen(false);
        }
      }
    }
  };
  const scrollToInput = (reactNode: any) => {
    // Add a 'scroll' ref to your ScrollView
    console.log(ref.current?.scrollToPosition, reactNode);
    // reactNative
    // ref.current?.scrollToFocusedInput(reactNode);

    // ref.current?.scrollToPosition(0, 0);
    // reactNode;
  };
  Keyboard.addListener('keyboardDidHide', () => {
    taskNameInputRef?.current?.blur();
  });
  Keyboard.addListener('keyboardDidHide', () => {
    taskDescriptionInputRef?.current?.blur();
  });

  const TodayTab = () => {
    return (
      <>
        <Animated.View
          style={[
            styles.flexOneAndJustifyCenter,
            // {backgroundColor: 'blue'},
            AnimateStyle('SET_TIME'),
          ]}>
          <Animated.View style={[styles.textAndToggleContainer]}>
            <View style={styles.TxtAndToggleInSetTime}>
              <SwitchToggle
                switchOn={!todayOn}
                onPress={() => {
                  open('TODAY');
                }}
                backgroundColorOff={constants.colors.BGC}
                backgroundColorOn={constants.colors.OFF_WHITE}
                circleColorOff={constants.colors.GREEN}
                circleColorOn={constants.colors.GREEN}
                containerStyle={subToggleContainerStyle}
                circleStyle={subToggleCircleStyle}
              />
              <TouchableOpacity onPress={() => open('TODAY')}>
                {/* <TouchableOpacity onPress={() => handleNamePress('TODAY')}> */}
                <Text style={[styles.subSectionTxt]}>Today</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {todayOpen && (
            <Animated.View
              style={[styles.EveryContainer, EveryContainerStyle('TODAY')]}>
              <Animated.View style={[styles.dateContainer]}>
                <Text style={{color: 'black'}}>{'targetDate'}</Text>
              </Animated.View>
            </Animated.View>
          )}
        </Animated.View>
      </>
    );
  };

  const DayAndTimeTab = () => {
    return (
      <Animated.View
        style={[styles.flexOneAndJustifyCenter, AnimateStyle('DAY_AND_TIME')]}>
        <Animated.View style={styles.textAndToggleContainer}>
          <View style={styles.TxtAndToggleInSetTime}>
            <SwitchToggle
              switchOn={!dayAndTimeOn}
              onPress={() => {
                open('DAY_AND_TIME');
              }}
              backgroundColorOff={constants.colors.BGC}
              backgroundColorOn={constants.colors.OFF_WHITE}
              circleColorOff={constants.colors.GREEN}
              circleColorOn={constants.colors.GREEN}
              containerStyle={subToggleContainerStyle}
              circleStyle={subToggleCircleStyle}
            />

            <TouchableOpacity
              onPress={() => {
                open('DAY_AND_TIME');
              }}>
              {/* <TouchableOpacity onPress={() => handleNamePress('DAY_AND_TIME')}> */}
              <Text style={[styles.subSectionTxt]}>Day and time</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {dayAndTimeOpen && (
          <Animated.View
            style={[styles.EveryContainer, EveryContainerStyle('SET_TIME')]}>
            <Animated.View style={[styles.dateContainer]}>
              <Text style={{color: 'black'}}>{'targetDate'}</Text>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
    );
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Animated.View style={styles.container}>
        <Animated.View style={styles.realContainer}>
          <View style={styles.newTask}>
            <Text style={styles.headLineTxt}>New Task</Text>
            <View style={[styles.newTaskTitleInputContainer]}>
              <TextInput
                ref={taskNameInputRef}
                maxLength={19}
                onChangeText={val => setTaskName(val)}
                placeholder="Name"
                placeholderTextColor={constants.colors.GREY}
                selectionColor={constants.colors.GREEN}
                cursorColor={constants.colors.GREEN}
                style={styles.newTaskTitleInput}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>
          <View style={{flex: 6.3}}>
            <Animated.View
              style={[styles.description, AnimateStyle('DESCRIPTION')]}>
              <Line
                strength={1}
                lengthPercentage={100}
                lineColor={constants.colors.UNDER_LINE}
                rotate180
              />
              <View style={[styles.description]}>
                <Animated.View style={styles.descriptionContainer}>
                  <TouchableOpacity
                    onPress={() => handleNamePress('DESCRIPTION')}>
                    <Text style={[styles.sectionTxt]}>Description</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              <Animated.View
                style={[
                  styles.EveryContainer,
                  EveryContainerStyle('DESCRIPTION'),
                ]}>
                {descriptionOpen && (
                  <Animated.View style={[styles.descriptionInputContainer]}>
                    <TextInput
                      numberOfLines={4}
                      multiline
                      onChangeText={val => setDescription(val)}
                      selectionColor={constants.colors.GREEN}
                      cursorColor={constants.colors.GREEN}
                      style={[styles.descriptionInput]}
                      autoFocus
                      defaultValue={description}
                      ref={taskDescriptionInputRef}
                    />
                  </Animated.View>
                )}
              </Animated.View>
            </Animated.View>
            <Animated.View
              style={[
                styles.flexOneAndJustifyCenter,
                AnimateStyle('SET_TIME'),
              ]}>
              <Line
                strength={1}
                lengthPercentage={100}
                rotate180
                lineColor={constants.colors.UNDER_LINE}
              />
              <Animated.View style={styles.textAndToggleContainer}>
                <View style={styles.textAndToggle}>
                  <SwitchToggle
                    switchOn={!timeOn}
                    onPress={() => {
                      open('SET_TIME');
                    }}
                    backgroundColorOff={constants.colors.BGC}
                    backgroundColorOn={constants.colors.OFF_WHITE}
                    circleColorOff={constants.colors.GREEN}
                    circleColorOn={constants.colors.GREEN}
                    containerStyle={containerStyle}
                    circleStyle={circleStyle}
                  />
                  <TouchableOpacity onPress={() => handleNamePress('SET_TIME')}>
                    <Text style={[styles.sectionTxt]}>Set Time</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.EveryContainer,
                  EveryContainerStyle('SET_TIME'),
                ]}>
                {timeOpen && (
                  <>
                    <Line
                      strength={1}
                      lengthPercentage={100}
                      lineColor={constants.colors.UNDER_LINE}
                    />
                    <Animated.View style={[styles.setTimeSubContainer]}>
                      <TodayTab />
                      <DayAndTimeTab />
                      {/* <DateSelect
                    handleList={datesList}
                    setHandleList={setDatesList}
                  /> */}
                    </Animated.View>
                  </>
                )}
              </Animated.View>
            </Animated.View>
            {/* @@@@ REPEAT @@@@ */}

            <Animated.View style={[styles.push, AnimateStyle('PUSH')]}>
              <Line
                strength={1}
                lengthPercentage={100}
                lineColor={constants.colors.UNDER_LINE}
              />
              <Animated.View style={styles.textAndToggleContainer}>
                <View style={styles.textAndToggle}>
                  <SwitchToggle
                    switchOn={!pushOn}
                    onPress={() => {
                      open('PUSH');
                    }}
                    backgroundColorOff={constants.colors.BLACK}
                    backgroundColorOn={constants.colors.OFF_WHITE}
                    circleColorOff={constants.colors.GREEN}
                    circleColorOn={constants.colors.GREEN}
                    containerStyle={containerStyle}
                    circleStyle={circleStyle}
                  />

                  <TouchableOpacity onPress={() => handleNamePress('PUSH')}>
                    <Text style={[styles.sectionTxt]}>Push it for me</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <Animated.View
                style={[styles.EveryContainer, EveryContainerStyle('PUSH')]}>
                <Text style={[styles.sectionTxt, {fontSize: 12}]}>
                  times date ...
                </Text>
              </Animated.View>
            </Animated.View>
            <Animated.View style={[styles.note, AnimateStyle('NOTE')]}>
              <Line
                strength={1}
                lengthPercentage={100}
                lineColor={constants.colors.UNDER_LINE}
              />
              <View style={styles.noteTxtContainer}>
                <Text style={[styles.sectionTxt]}>Notes</Text>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        <TouchableOpacity onPress={submit} style={styles.buttonContainer}>
          <SVG.DoneButton
            fill={constants.colors.BLACK}
            width="100%"
            height="100%"
          />
        </TouchableOpacity>
        <DatePickerModal
          isOpen={TABS['DAY_AND_TIME'].stateIsOpen || TABS['TODAY'].stateIsOpen}
          date={targetDate}
          // date={formatStringToDate(targetDate)}
          dateFormat={TABS['DAY_AND_TIME'].stateIsOpen ? 'datetime' : 'time'}
          setDate={setTargetDate}
        />
      </Animated.View>
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
    height: '73.09375%',
    width: '100%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
  },
  newTask: {flex: 1.6, padding: '5.2%'},
  headLineTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.paragraph,
    // fontWeight: '700',
    fontSize: 30,
  },
  newTaskTitleInputContainer: {
    // backgroundColor: constants.colors.BLACK,
    height: '80%',
    width: '62%',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  newTaskTitleInput: {
    // backgroundColor: constants.colors.GREEN,
    height: '45%',
    padding: 5,
    color: constants.colors.BGC,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    alignItems: 'center',
    textAlignVertical: 'center',
    fontFamily: constants.Fonts.text,
  },
  textAndToggle: {
    // padding: '5.2%',
    paddingRight: '5.2%',
    paddingLeft: '5.2%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    height: '100%',
  },

  textAndToggleContainer: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'yellow',
  },
  flexOneAndJustifyCenter: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  sectionTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text,
    fontSize: 16,
  },
  subSectionTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text,
    fontSize: 12,
  },
  repeat: {flex: 2.5},
  description: {flex: 1, justifyContent: 'center'},
  descriptionContainer: {
    paddingRight: '5.2%',
    paddingLeft: '5.2%',
    justifyContent: 'center',
  },
  descriptionInputContainer: {
    // backgroundColor: constants.colors.BLACK,
    // height: '70%',
    width: '100%',
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  descriptionInput: {
    // backgroundColor: constants.colors.GREEN,
    height: '90%',
    paddingRight: 15,
    paddingLeft: 15,
    color: constants.colors.BGC,
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: constants.colors.UNDER_LINE,
    textAlignVertical: 'top',
  },
  dateContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  push: {
    flex: 1.2,
    // alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  share: {flex: 1},
  note: {flex: 2.5},
  noteTxtContainer: {
    padding: '5.2%',
  },
  buttonContainer: {
    // backgroundColor: 'blue',
    width: '35%',
    height: '10%',
  },
  doneButton: {},
  EveryContainer: {
    paddingRight: '5.5%',
    paddingLeft: '5.2%',
  },
  TxtAndToggleInSetTime: {
    // padding: '5.2%',
    // paddingRight: '5.2%',
    paddingLeft: '5.2%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    // height: '100%',
  },
  setTimeSubContainer: {
    // alignSelf: 'flex-end',

    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingVertical: '5%',
    // backgroundColor: 'red',
  },
});
