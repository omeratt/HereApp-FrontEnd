import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {memo, useEffect, useRef} from 'react';
import constants from '../../assets/constants';
import MyListAndNotes from '../../components/MyListAndNotes';

const NewList = () => {
  const textInputRef = useRef<TextInput>(null);
  const InputRef = useRef<string>('');
  const onPress = () => {
    console.log(InputRef.current);
  };
  const onChangeText = (text: string) => {
    InputRef.current = text;
  };
  const onKeyboardDismiss = () => {
    textInputRef.current?.blur();
  };
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', onKeyboardDismiss);
  }, []);
  return (
    <MyListAndNotes title={'New list category'} rightBtn={false}>
      {/* <View style={styles.listContainerContent}> */}
      <TextInput
        ref={textInputRef}
        maxLength={19}
        placeholder="List name"
        placeholderTextColor={constants.colors.UNDER_LINE}
        selectionColor={constants.colors.GREEN}
        cursorColor={constants.colors.GREEN}
        style={styles.newTaskTitleInput}
        onChangeText={onChangeText}
      />
      {/* </View> */}
    </MyListAndNotes>
  );
};

export default memo(NewList);

const styles = StyleSheet.create({
  newTaskTitleInput: {
    borderWidth: 0,
    fontSize: 20,
    color: constants.colors.UNDER_LINE,
    alignItems: 'center',
    textAlignVertical: 'center',
    fontFamily: constants.Fonts.text,
  },
});
