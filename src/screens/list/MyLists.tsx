import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import constants from '../../assets/constants';
import SVG from '../../assets/svg';
import MyListAndNotes from '../../components/MyListAndNotes';
import ListItem from './ListItem';
import CheckBox from '../../components/CheckBox';
export type CheckBoxListType = 'NUMBERS' | 'DOTS' | 'V' | 'NONE';
const MyLists = () => {
  const height = constants.HEIGHT * (71 / 896);
  const width = constants.WIDTH * (71 / 414);
  const textInputRef = useRef<TextInput>(null);
  const InputRef = useRef<string>('');
  const onListItemTypePress = useCallback((type: CheckBoxListType) => {
    console.log('click on checkbox, type is ', type);
  }, []);
  const onChangeText = useCallback((text: string) => {
    InputRef.current = text;
  }, []);
  const onKeyboardDismiss = () => {
    textInputRef.current?.blur();
  };
  const onVCheckboxPress = useCallback(() => onListItemTypePress('V'), []);
  const onDotsCheckboxPress = useCallback(
    () => onListItemTypePress('DOTS'),
    [],
  );
  const onNumbersCheckboxPress = useCallback(
    () => onListItemTypePress('NUMBERS'),
    [],
  );
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', onKeyboardDismiss);
  }, []);
  const checkBoxSize = constants.HEIGHT * (22.95 / 896);
  return (
    <MyListAndNotes title="Homework">
      <View style={styles.listContainerContent}>
        <ListItem iconSize={checkBoxSize} />
        <ListItem iconSize={checkBoxSize} />
        <ListItem iconSize={checkBoxSize} />
        <ListItem iconSize={checkBoxSize} />
        {/* <CheckBox
          size={checkBoxSize}
          fill="black"
          isElevation={false}
          type={'DOTS'}
        /> */}
        {/* <CheckBox size={checkBoxSize} fill="black" isElevation={false} />
        <CheckBox
          size={checkBoxSize}
          fill="black"
          isElevation={false}
          type={'V'}
        />
        <CheckBox
          size={checkBoxSize}
          fill="black"
          isElevation={false}
          type={'NUMBERS'}
        />
        <CheckBox
          size={checkBoxSize}
          fill="black"
          isElevation={false}
          type={'NUMBERS'}
        /> */}
      </View>
      <View style={styles.listContainerFooter}>
        <TouchableOpacity
          style={[styles.containerFooterBtn, {height, width}]}
          onPress={onVCheckboxPress}>
          <View style={styles.innerBtnCircleCheckbox} />
          <View style={styles.innerBtnCircleCheckbox} />
          <View style={styles.innerBtnCircleCheckbox} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.containerFooterBtn, {height, width}]}
          onPress={onDotsCheckboxPress}>
          <View style={innerBtnFillCircleCheckbox} />
          <View style={innerBtnFillCircleCheckbox} />
          <View style={innerBtnFillCircleCheckbox} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.containerFooterBtn, {height, width}]}
          onPress={onNumbersCheckboxPress}>
          <SVG.NumCheckbox style={{marginLeft: '13%'}} />
        </TouchableOpacity>
      </View>
    </MyListAndNotes>
  );
};

export default memo(MyLists);
const styles = StyleSheet.create({
  listContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '100%',
  },
  textHeader: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
    fontSize: 25,
  },
  listContainerContent: {
    // marginTop: '10%',
  },
  newTaskTitleInput: {
    borderWidth: 0,
    fontSize: 20,
    color: constants.colors.UNDER_LINE,
    alignItems: 'center',
    textAlignVertical: 'center',
    fontFamily: constants.Fonts.text,
  },
  listContainerFooter: {
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    width: '80%',
    height: '9%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'cyan',
  },
  containerFooterBtn: {
    borderWidth: 0.5,
    borderRadius: 20,
    backgroundColor: constants.colors.OFF_WHITE,
    borderColor: constants.colors.UNDER_LINE,
    elevation: 2,
    justifyContent: 'center',
  },
  innerBtnCircleCheckbox: {
    borderColor: constants.colors.BLACK,
    height: '15%',
    width: '15%',
    borderWidth: 1,
    borderRadius: 99,
    marginBottom: '4%',
    marginLeft: '13%',
  },
});

const innerBtnFillCircleCheckbox = StyleSheet.flatten([
  styles.innerBtnCircleCheckbox,
  {backgroundColor: constants.colors.BLACK},
]);
