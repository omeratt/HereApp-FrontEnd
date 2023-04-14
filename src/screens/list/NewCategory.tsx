import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {memo, useEffect, useRef} from 'react';
import constants from '../../assets/constants';
import MyListAndNotes from '../../components/MyListAndNotes';
import BallonTxt from '../../components/BallonTxt';

const NewCategory = () => {
  let categories = [
    {txt: 'brow'},
    {txt: 'To-Do Lists'},
    {txt: 'Wish Lists'},
    {txt: 'Bucaaaew'},
    {txt: 'TraLists'},
    {txt: 'gsa'},
    {txt: 'Reading'},
    {txt: 'Lists'},
    {txt: 'Recipe Lists'},
    {txt: 'Goal Lists'},
    {txt: 'Goal Lists'},
    {txt: 'Goal Lists'},
    {txt: 'Goal Lists'},
    {txt: 'Goal Lists'},
    {txt: 'Goal Lists'},
  ];
  // let categories = [
  //   {txt: 'Grocery Lists'},
  //   {txt: 'To-Do Lists'},
  //   {txt: 'Wish Lists'},
  //   {txt: 'Bucket Lists'},
  //   {txt: 'Travel Lists'},
  //   {txt: 'Shopping Lists'},
  //   {txt: 'Reading Lists'},
  //   {txt: 'Movie Lists'},
  //   {txt: 'Recipe Lists'},
  //   {txt: 'Goal Lists'},
  // ];
  return (
    <MyListAndNotes rightBtn title="All my lists and notes">
      <FlatList
        data={categories}
        renderItem={props => <BallonTxt txt={props.item.txt} {...props} />}
        style={styles.wordsContainer}
        contentContainerStyle={{width: '100%'}}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </MyListAndNotes>
  );
};

export default memo(NewCategory);

const styles = StyleSheet.create({
  wordsContainer: {
    // backgroundColor: 'cyan',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    marginLeft: '2%',
  },
});
