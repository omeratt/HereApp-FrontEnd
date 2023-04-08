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
type CheckboxListItem = 'circle' | 'filledCircle' | 'numbers' | 'note';
const MyLists = () => {
  const height = constants.HEIGHT * (71 / 896);
  const width = constants.WIDTH * (71 / 414);
  const textInputRef = useRef<TextInput>(null);
  const InputRef = useRef<string>('');
  const onListItemTypePress = useCallback((type: CheckboxListItem) => {
    console.log('click on checkbox, type is ', type);
  }, []);
  const onChangeText = useCallback((text: string) => {
    InputRef.current = text;
  }, []);
  const onKeyboardDismiss = () => {
    textInputRef.current?.blur();
  };
  const onCircleLIPress = useCallback(() => onListItemTypePress('circle'), []);
  const onFilledCircleLIPress = useCallback(
    () => onListItemTypePress('filledCircle'),
    [],
  );
  const onNumbersLIPress = useCallback(
    () => onListItemTypePress('numbers'),
    [],
  );
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', onKeyboardDismiss);
  }, []);
  const ListItem = () => {
    return (
      <View style={{backgroundColor: 'cyan', alignItems: 'flex-start'}}>
        <TouchableOpacity style={[styles.innerBtnCircleCheckbox]} />
        <TouchableOpacity style={[styles.innerBtnCircleCheckbox]} />
        <TouchableOpacity style={[styles.innerBtnCircleCheckbox]} />
      </View>
    );
  };
  return (
    <MyListAndNotes>
      <View style={styles.listContainerHeader}>
        <View>
          <Text style={styles.textHeader}>Home-work</Text>
          <Text style={styles.textHeader}>design</Text>
        </View>
      </View>
      <View style={styles.listContainerContent}>
        <TextInput
          ref={textInputRef}
          maxLength={19}
          placeholder="Notes"
          placeholderTextColor={constants.colors.UNDER_LINE}
          selectionColor={constants.colors.GREEN}
          cursorColor={constants.colors.GREEN}
          style={styles.newTaskTitleInput}
          onChangeText={onChangeText}
        />
        <ListItem />
      </View>
      <View style={styles.listContainerFooter}>
        <TouchableOpacity
          style={[styles.containerFooterBtn, {height, width}]}
          onPress={onCircleLIPress}>
          <View style={styles.innerBtnCircleCheckbox} />
          <View style={styles.innerBtnCircleCheckbox} />
          <View style={styles.innerBtnCircleCheckbox} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.containerFooterBtn, {height, width}]}
          onPress={onFilledCircleLIPress}>
          <View style={innerBtnFillCircleCheckbox} />
          <View style={innerBtnFillCircleCheckbox} />
          <View style={innerBtnFillCircleCheckbox} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.containerFooterBtn, {height, width}]}
          onPress={onNumbersLIPress}>
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
    marginTop: '10%',
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
