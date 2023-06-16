import {
  StyleSheet,
  Text,
  View,
  TextInput as Input,
  TextInputProps,
  Dimensions,
  Keyboard,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import constants from '../assets/constants';

export interface InputHandle {
  getValue: () => string;
  onFocus: () => void;
  blur: () => void;
  setNativeProps: (obj: object) => void;
  setText: (value: string) => void;
}
interface MyTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}
const TextInput = forwardRef<InputHandle, MyTextInputProps>((props, ref) => {
  const [isSecurePass, setSecurePass] = useState(
    props.secureTextEntry ? true : false,
  );
  const [value, setValue] = useState('');
  const textInputRef = useRef<Input>(null);
  const handleEyeIconPress = () => {
    setSecurePass(!isSecurePass);
  };
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    onFocus: () => textInputRef.current?.focus(),
    setNativeProps: (obj: object) => textInputRef.current?.setNativeProps(obj),
    blur: () => () => textInputRef.current?.blur(),
    setText: (value: string) => {
      textInputRef.current?.setNativeProps({text: value});
    },
  }));
  Keyboard.addListener('keyboardDidHide', () => {
    textInputRef?.current?.blur();
  });
  return (
    <View
      style={[styles.container, props?.containerStyle && props.containerStyle]}>
      <Input
        {...props}
        style={
          props.value?.length == 0
            ? [styles.textInput, props.style, styles.placeHolder]
            : [styles.textInput, props.style]
        }
        secureTextEntry={isSecurePass}
        placeholderTextColor={
          props.placeholderTextColor || constants.colors.GREY
        }
        returnKeyType={props.onSubmitEditing ? 'next' : 'done'}
        blurOnSubmit={props.onSubmitEditing ? false : true}
        ref={textInputRef}
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
});
export default React.memo(TextInput);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  textInput: {
    marginTop: '10%',
    paddingBottom: -5,
    borderBottomColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 1,
    width: '70%',
    color: constants.colors.BGC,
    fontFamily: constants.Fonts.text,
  },
  eyeIcon: {
    position: 'absolute',
    color: constants.colors.BGC,
    left: 0.7 * constants.WIDTH - 20,
  },
  placeHolder: {
    fontWeight: '300',
  },
});
