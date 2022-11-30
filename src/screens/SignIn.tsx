import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import TextInput from '../components/TextInput';
import {TouchableOpacity} from 'react-native';
import SVG from '../assets/svg';

export default function SignIn() {
  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" keyboardType="email-address" />
      <TextInput secureTextEntry placeholder="Password" />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          {/* <Text style={styles.text}>Done</Text>
           */}
          <SVG.DoneButton fill={constants.colors.BGC} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    width: '100%',
    backgroundColor: constants.colors.OFF_WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    // borderRadius: 20,
    // alignSelf: 'stretch',
    // borderWidth: 1,
    // borderColor: constants.colors.UNDER_LINE,
    // width: '100%',
  },
  text: {
    color: constants.colors.BGC,
    textAlign: 'center',
  },
});
