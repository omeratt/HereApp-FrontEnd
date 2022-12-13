import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import Line from './Line';
const NewTask = () => {
  const [isModalVisible, setModalVisible] = useState(true);
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
            {/* <Line lengthPercentage={100} /> */}
          </View>
          <View style={styles.allDayLong}>
            <Line
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          <View style={styles.repeat}>
            <Line
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          <View style={styles.description}>
            <Line
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          <View style={styles.push}>
            <Line
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          <View style={styles.share}>
            <Line
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
            />
          </View>
          <View style={styles.note}>
            <Line
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
  newTask: {flex: 1.6},
  allDayLong: {flex: 1},
  repeat: {flex: 1},
  description: {flex: 1},
  push: {flex: 1},
  share: {flex: 1},
  note: {flex: 1},
  buttonContainer: {
    // backgroundColor: 'blue',
    width: '35%',
    height: '10%',
  },
  doneButton: {},
});
