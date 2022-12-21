import {
  findNodeHandle,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import Line from './Line';
import SwitchToggle from 'react-native-switch-toggle';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {SPRING_CONFIG, ZERO} from '../screens/AuthModal';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import DateSelect from './DateSelect';
import {useAddTaskMutation} from '../app/api/taskApi';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
const DEFAULT_FLEX = {
  PUSH: 1.2,
  ALL_DAY: 1,
  REPEAT: 1,
  DESCRIPTION: 1,
  NOTE: 1.3,
};
const OPENED_FLEX = {
  PUSH: 2.5,
  ALL_DAY: 2.5,
  REPEAT: 2.5,
  DESCRIPTION: 2.5,
  NOTE: 1.3,
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
type tabType = 'PUSH' | 'ALL_DAY' | 'REPEAT' | 'DESCRIPTION' | 'NOTE';
interface props {
  closeModal: any;
}
const NewTask = ({closeModal}: props) => {
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
  const [allDayOn, setAllDayOn] = useState(false);
  const [repeatOn, setRepeatOn] = useState(false);
  const [descriptionOn, setDescriptionOn] = useState(false);
  const [pushOn, setPushOn] = useState(false);
  const [noteOn, setNoteOn] = useState(false);
  const [allDayOpen, setAllDayOpen] = useState(false);
  const [repeatOpen, setRepeatOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [pushOpen, setPushOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [datesList, setDatesList] = useState<string[]>([]);
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
    ALL_DAY: {
      line: useSharedValue(DEFAULT_FLEX.ALL_DAY),
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
    // flexPush.value = withSpring(toValue, {...SPRING_CONFIG, mass: duration});
    TABS[tabName].setStateOn(!TABS[tabName].stateIsOn);
    TABS[tabName].setStateOpen(!TABS[tabName].stateIsOn);
    if (!TABS[tabName].stateIsOn) {
      closeAllExcept(tabName);
      flex[tabName].line.value = withTiming(OPENED_FLEX[tabName], {
        duration: 300,
      });
      flex[tabName].space.value = withTiming(3, {
        duration: 300,
      });
      if (tabName == 'DESCRIPTION')
        descInputAnimation.value = withTiming(100, {duration: 300});
    } else {
      TABS[tabName].close(tabName);
    }
  };
  const handleNamePress = (tabName: tabType) => {
    // flexPush.value = withSpring(toValue, {...SPRING_CONFIG, mass: duration});
    TABS[tabName].setStateOpen(!TABS[tabName].stateIsOpen);
    if (!TABS[tabName].stateIsOpen) {
      closeAllExcept(tabName);
      flex[tabName].line.value = withTiming(OPENED_FLEX[tabName], {
        duration: 300,
      });
      flex[tabName].space.value = withTiming(3, {
        duration: 300,
      });
    } else {
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
    ALL_DAY: {
      open,
      close,
      stateIsOn: allDayOn,
      setStateOn: setAllDayOn,
      stateIsOpen: allDayOpen,
      setStateOpen: setAllDayOpen,
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
        tab.close(key as tabType);
        tab.setStateOpen(false);
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
                autoFocus
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>

          <Animated.View style={[styles.allDayLong, AnimateStyle('ALL_DAY')]}>
            <Line
              strength={1}
              lengthPercentage={100}
              rotate180
              lineColor={constants.colors.UNDER_LINE}
            />
            <Animated.View style={styles.textAndToggleContainer}>
              <View style={styles.textAndToggle}>
                <SwitchToggle
                  switchOn={!allDayOn}
                  onPress={() => {
                    open('ALL_DAY');
                  }}
                  RTL
                  backgroundColorOff={constants.colors.BGC}
                  backgroundColorOn={constants.colors.OFF_WHITE}
                  circleColorOff={constants.colors.GREEN}
                  circleColorOn={constants.colors.GREEN}
                  containerStyle={containerStyle}
                  circleStyle={circleStyle}
                />
                <TouchableOpacity onPress={() => handleNamePress('ALL_DAY')}>
                  <Text style={[styles.sectionTxt]}>All day long</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View
              style={[styles.EveryContainer, EveryContainerStyle('ALL_DAY')]}>
              {allDayOpen && (
                <Animated.View
                  style={[
                    styles.dateContainer,
                    // allDayOn ? {flex: 2.5} : {flex: ZERO},
                  ]}>
                  <DateSelect
                    handleList={datesList}
                    setHandleList={setDatesList}
                  />
                </Animated.View>
              )}
              {/* <Text style={[styles.sectionTxt, {fontSize: 12}]}>
                    times date ...
                  </Text> */}
            </Animated.View>
          </Animated.View>
          {/* @@@@ REPEAT @@@@ */}
          <Animated.View style={[styles.allDayLong, AnimateStyle('REPEAT')]}>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
            <Animated.View style={styles.textAndToggleContainer}>
              <View style={styles.textAndToggle}>
                <SwitchToggle
                  switchOn={!repeatOn}
                  onPress={() => {
                    open('REPEAT');
                  }}
                  RTL
                  backgroundColorOff={constants.colors.BLACK}
                  backgroundColorOn={constants.colors.OFF_WHITE}
                  circleColorOff={constants.colors.GREEN}
                  circleColorOn={constants.colors.GREEN}
                  containerStyle={containerStyle}
                  circleStyle={circleStyle}
                />
                <TouchableOpacity onPress={() => handleNamePress('REPEAT')}>
                  <Text style={[styles.sectionTxt]}>Repeat every ...</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View
              style={[styles.EveryContainer, EveryContainerStyle('REPEAT')]}>
              {repeatOpen && (
                <Animated.View
                  style={[
                    styles.dateContainer,
                    // allDayOn ? {flex: 2.5} : {flex: ZERO},
                  ]}>
                  <DateSelect
                    handleList={datesList}
                    setHandleList={setDatesList}
                  />
                </Animated.View>
              )}
            </Animated.View>
          </Animated.View>
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
                  RTL
                  backgroundColorOff={constants.colors.BLACK}
                  backgroundColorOn={constants.colors.OFF_WHITE}
                  circleColorOff={constants.colors.GREEN}
                  circleColorOn={constants.colors.GREEN}
                  containerStyle={containerStyle}
                  circleStyle={circleStyle}
                />

                <TouchableOpacity onPress={() => handleNamePress('PUSH')}>
                  <Text style={[styles.sectionTxt, {fontSize: 22}]}>
                    Push it for me
                  </Text>
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
          <View style={styles.share}>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
              rotate180
            />
            <View style={styles.textAndToggleContainer}>
              <View style={styles.textAndToggle}>
                <TouchableOpacity onPress={() => {}}>
                  <SVG.plusIconOutlined
                    fill={constants.colors.BGC}
                    height="100%"
                  />
                </TouchableOpacity>
                <Text style={[styles.sectionTxt, {fontSize: 22}]}>
                  Share this task
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.note}>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
            <View style={styles.noteTxtContainer}>
              <Text style={[styles.sectionTxt, {fontSize: 22}]}>Note</Text>
            </View>
          </View>
        </Animated.View>

        <TouchableOpacity onPress={submit} style={styles.buttonContainer}>
          <SVG.DoneButton
            fill={constants.colors.BLACK}
            width="100%"
            height="100%"
          />
        </TouchableOpacity>
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
    justifyContent: 'space-evenly',
    padding: '3.2%',
  },
  realContainer: {
    // backgroundColor: 'red',
    height: '90%',
    width: '100%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    // padding: '5.2%',
  },
  newTask: {flex: 1.6, padding: '5.2%'},
  headLineTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.paragraph,
    fontSize: 30,
  },
  newTaskTitleInputContainer: {
    // backgroundColor: constants.colors.BLACK,
    height: '70%',
    width: '62%',
    alignSelf: 'flex-end',
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
    flexDirection: 'row',
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
  allDayLong: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  sectionTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text,
    fontSize: 20,
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
    alignSelf: 'flex-end',
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
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  push: {
    flex: 1.2,
    // alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  share: {flex: 1},
  note: {flex: 1.3},
  noteTxtContainer: {
    padding: '5.2%',
  },
  buttonContainer: {
    // backgroundColor: 'blue',
    width: '35%',
    height: '10%',
  },
  doneButton: {},
  EveryContainer: {paddingRight: '5.5%', paddingLeft: '5.2%'},
});
