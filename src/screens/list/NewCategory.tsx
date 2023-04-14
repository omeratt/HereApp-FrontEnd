import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {memo, useEffect, useRef} from 'react';
import constants from '../../assets/constants';
import PlusIcon from '../../components/PlusIcon';
import MyListAndNotes from '../../components/MyListAndNotes';
import BallonTxt from '../../components/BallonTxt';

const NewCategory = () => {
  return (
    <MyListAndNotes>
      <View style={styles.bottomContainer}>
        <View style={styles.wordsContainer}>
          <BallonTxt index={1} txt="bal" selectedItems={['s']} />
          <BallonTxt index={1} txt="homework" selectedItems={['s']} />
          <BallonTxt index={1} txt="design" selectedItems={['s']} />
          <BallonTxt index={1} txt="balance" selectedItems={['s']} />
          <BallonTxt index={1} txt="balhomework" selectedItems={['s']} />
          <BallonTxt index={1} txt="homework" selectedItems={['s']} />
          <BallonTxt index={1} txt="design" selectedItems={['s']} />
          <BallonTxt index={1} txt="balancehomework" selectedItems={['s']} />
          <BallonTxt index={1} txt="bal" selectedItems={['s']} />
          <BallonTxt index={1} txt="bal" selectedItems={['s']} />
          <BallonTxt index={1} txt="bal" selectedItems={['s']} />
          <BallonTxt index={1} txt="homework" selectedItems={['s']} />
          <BallonTxt
            index={1}
            txt="designbalancehomework"
            selectedItems={['s']}
          />
          <BallonTxt index={1} txt="balance" selectedItems={['s']} />
        </View>
      </View>
    </MyListAndNotes>
  );
};

export default memo(NewCategory);

const styles = StyleSheet.create({
  // listContainerHeader: {
  //   // flex: 1,
  //   backgroundColor: constants.colors.BGC,
  //   paddingHorizontal: constants.WIDTH * 0.071449,
  //   paddingVertical: constants.HEIGHT * 0.0591,
  // },
  bottomContainer: {
    // backgroundColor: 'cyan',
    // paddingHorizontal: constants.WIDTH * 0.071449,
    // paddingVertical: constants.HEIGHT * 0.0591,
    height: '76.2277%',
    alignSelf: 'flex-start',
  },
  wordsContainer: {
    // backgroundColor: 'red',
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // listContainerHeader: {
  //   flexDirection: 'row',
  //   flex: 1,
  //   // flex:'w'
  //   flexWrap: 'wrap',
  //   flexGrow: 2,

  //   justifyContent: 'space-between',
  //   alignSelf: 'center',
  //   // width: '100%',
  // },
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
