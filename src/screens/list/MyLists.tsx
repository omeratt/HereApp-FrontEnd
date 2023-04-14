import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import constants from '../../assets/constants';
import SVG from '../../assets/svg';
import MyListAndNotes from '../../components/MyListAndNotes';
import ListItem from './ListItem';
export type CheckBoxListType = 'NUMBERS' | 'DOTS' | 'V' | 'NONE';
const MyLists = () => {
  const [checkboxType, setCheckboxType] = useState<CheckBoxListType>('V');
  const height = constants.HEIGHT * (71 / 896);
  const width = constants.WIDTH * (71 / 414);
  const onListItemTypePress = useCallback((type: CheckBoxListType) => {
    setCheckboxType(type);
  }, []);

  const onVCheckboxPress = useCallback(
    () => onListItemTypePress('V'),
    [onListItemTypePress],
  );
  const onDotsCheckboxPress = useCallback(
    () => onListItemTypePress('DOTS'),
    [onListItemTypePress],
  );
  const onNumbersCheckboxPress = useCallback(
    () => onListItemTypePress('NUMBERS'),
    [onListItemTypePress],
  );

  const data = [1, 2, 3, 4, 5];
  const checkBoxSize = constants.HEIGHT * (22.95 / 896);
  return (
    <MyListAndNotes title="Homework">
      <FlatList
        data={data}
        renderItem={props => (
          <ListItem iconSize={checkBoxSize} type={checkboxType} {...props} />
        )}
        style={styles.listContainerContent}
      />
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
