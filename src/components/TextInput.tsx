import {
  StyleSheet,
  Text,
  View,
  TextInput as Input,
  TextInputProps,
  Dimensions,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import constants from '../assets/constants';

export default function TextInput(props: TextInputProps) {
  const [isSecurePass, setSecurePass] = React.useState<boolean>(
    props.secureTextEntry ? true : false,
  );
  const handleEyeIconPress = () => {
    setSecurePass(!isSecurePass);
  };
  return (
    <View style={styles.container}>
      <Input
        {...props}
        style={[styles.textInput, props.style]}
        secureTextEntry={isSecurePass}
        placeholderTextColor={constants.colors.BGC}
      />

      {props.secureTextEntry && (
        <Ionicons
          name={isSecurePass ? 'eye' : 'eye-off'}
          size={20}
          style={styles.eyeIcon}
          onPress={handleEyeIconPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    // display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  textInput: {
    marginTop: '10%',
    paddingBottom: -5,
    borderBottomColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 1,
    width: '60%',
    color: constants.colors.BGC,
  },
  eyeIcon: {
    position: 'absolute',
    color: constants.colors.BGC,
    right: 0.6 * constants.WIDTH - 20,
    // flex: 1,
    // fontSize: 40,
    // textAlign: 'right',
  },
});
