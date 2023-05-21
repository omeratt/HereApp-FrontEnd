import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import constants from '../../assets/constants';
import MyListsWrapper from './MyListsWrapper';
import {useAddCategoryMutation} from '../../app/api/listApi';
import {useNavigation} from '@react-navigation/native';

const NewListCategory = () => {
  const [AddCategory, {isLoading, error, isSuccess}] = useAddCategoryMutation();
  const navigation = useNavigation();
  const textInputRef = useRef<TextInput>(null);
  const InputRef = useRef<string>('');
  const onPress = () => {
    console.log(InputRef.current);
  };
  const AddNewCategory = useCallback(() => {
    AddCategory({name: InputRef.current}).then(value => {
      navigation.goBack();
    });
  }, []);

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
    <MyListsWrapper
      title={'New list category'}
      rightBtn={false}
      isLoading={isLoading}
      onDonePress={AddNewCategory}>
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
    </MyListsWrapper>
  );
};

export default memo(NewListCategory);

const styles = StyleSheet.create({
  newTaskTitleInput: {
    // borderWidth: 1,
    // borderColor: 'black',
    height: '100%',

    fontSize: 20,
    color: constants.colors.UNDER_LINE,
    alignItems: 'center',
    textAlignVertical: 'top',
    fontFamily: constants.Fonts.text,
  },
});
