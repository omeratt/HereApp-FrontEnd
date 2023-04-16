import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import constants from '../../assets/constants';
import MyListsWrapper from './MyListsWrapper';
import {useAddListTitleMutation} from '../../app/api/listApi';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
type RootStackParamList = {
  MyLists: {id: string};
};
type MyListsRouteProp = RouteProp<RootStackParamList, 'MyLists'>;
const NewListTitle = () => {
  const id = useRoute<MyListsRouteProp>().params.id;
  const [AddListTitle, {isLoading, error, isSuccess}] =
    useAddListTitleMutation();
  const navigation = useNavigation();
  const textInputRef = useRef<TextInput>(null);
  const InputRef = useRef<string>('');
  const onPress = () => {
    console.log(InputRef.current);
  };

  const AddNewListTitle = useCallback(() => {
    AddListTitle({title: InputRef.current, id}).then(value => {
      navigation.goBack();
    });
  }, [id]);

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
      title={'New list'}
      isLoading={isLoading}
      onDonePress={AddNewListTitle}>
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

export default memo(NewListTitle);

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
