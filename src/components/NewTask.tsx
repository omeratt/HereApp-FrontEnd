import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import Line from './Line';
import SwitchToggle from 'react-native-switch-toggle';

const NewTask = () => {
  const [isModalVisible, setModalVisible] = useState(true);
  const [toggleOn, setToggleOn] = useState(true);
  return (
    <Modal
      isVisible={isModalVisible}
      onSwipeComplete={() => setModalVisible(false)}
      onBackdropPress={() => setModalVisible(false)}
      style={styles.container}
      swipeDirection="down">
      <View style={styles.container}>
        <View style={styles.realContainer}>
          <View style={styles.newTask}>
            <Text style={styles.headLineTxt}>New Task</Text>
          </View>
          <View style={styles.allDayLongContainer}>
            <Line
              strength={1}
              lengthPercentage={100}
              rotate180
              lineColor={constants.colors.UNDER_LINE}
            />
            <View style={styles.allDayLong}>
              <SwitchToggle
                switchOn={toggleOn}
                onPress={() => setToggleOn(!toggleOn)}
                RTL
                backgroundColorOff={constants.colors.BLACK}
                backgroundColorOn={constants.colors.OFF_WHITE}
                circleColorOff={constants.colors.GREEN}
                circleColorOn={constants.colors.GREEN}
                containerStyle={{
                  width: 75,
                  height: 35,
                  borderRadius: 25,
                  padding: 3,
                  borderWidth: 1,
                  borderColor: constants.colors.UNDER_LINE,
                }}
                circleStyle={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: constants.colors.UNDER_LINE,
                }}
              />
              <Text style={styles.sectionTxt}>All day long</Text>
            </View>
          </View>
          <View style={styles.repeat}>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          <View style={styles.description}>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          <View style={styles.push}>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          <View style={styles.share}>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          <View style={styles.note}>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          {/* <Text>I am the modal content!</Text> */}
        </View>

        <View style={styles.buttonContainer}>
          <SVG.DoneButton
            fill={constants.colors.BLACK}
            width="100%"
            height="100%"
          />
        </View>
      </View>
    </Modal>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: constants.WIDTH,
    height: constants.HEIGHT,
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
    fontSize: 40,
  },
  allDayLong: {
    // padding: '5.2%',
    paddingRight: '5.2%',
    paddingLeft: '5.2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'black',
    height: '100%',
  },
  allDayLongContainer: {
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
  description: {flex: 1},
  push: {flex: 1.2},
  share: {flex: 1},
  note: {flex: 1.3},
  buttonContainer: {
    // backgroundColor: 'blue',
    width: '35%',
    height: '10%',
  },
  doneButton: {},
});
