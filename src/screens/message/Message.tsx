import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import constants from '../../assets/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getRealDate} from '../../components/WeeklyCalender';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SVG from '../../assets/svg';
const {HEIGHT, WIDTH} = constants;
const ICON_SIZE = HEIGHT * (29.25 / 896);
const margin = 15;
const paddingHorizontal = WIDTH * (30.37 / 414);
const paddingVertical = HEIGHT * (22 / 896);
const textLengthLimit = 21;
const initialValues: IMessageValues = {
  message: '',
  title: 'Message to myself',
  date: getRealDate(new Date()),
};
const Message: React.FC<IMessagesProps> = ({message}) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [values, setValues] = useState<IMessageValues>(initialValues);
  const inputRef = React.useRef<TextInput>(null);
  const changeDarkMode = () => setDarkMode(prev => !prev);
  const handleBackPress = () => {
    console.log('BackPress');
  };
  const handleSubmit = () => {
    console.log('submit', {values});
  };
  const sliceTitle = (value: string) => {
    if (value.length > textLengthLimit + 1) return;
    const shouldSliceText = value.charAt(textLengthLimit) !== '';
    console.log({shouldSliceText});
    if (!shouldSliceText) {
      setValues(prev => ({...prev, title: value}));
      return;
    }
    if (value.charAt(textLengthLimit) === ' ') {
      const texts = value.slice(0, textLengthLimit);
      return setValues({...values, title: texts});
    }
    const splittedText = value.split(' ');
    if (splittedText.length !== 1) splittedText.pop();
    const fixedText = splittedText.join(' ');
    setValues({...values, title: fixedText});
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleChangeText = (value: string) => {
    sliceTitle(value);
    setValues(prev => ({...prev, message: value}));
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.Header}>
          <View style={{height: '90%'}}>
            <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
              <AntDesign
                name="leftcircle"
                color={constants.colors.BLACK}
                size={ICON_SIZE}
              />
            </TouchableOpacity>
            <Text style={styles.topHeaderText}>Message to myself</Text>
            <Text style={styles.title} numberOfLines={2}>
              {values.title}
            </Text>
          </View>

          <View style={[styles.bottomHeaderContainer, {height: '10%'}]}>
            <Text style={styles.bottomHeaderText}>Mar 24,2021</Text>
          </View>
        </View>
        {/* <View style={[styles.Footer]}> */}
        {/* <KeyboardAwareScrollView style={styles.Footer} fadingEdgeLength={50}> */}
        <KeyboardAvoidingView style={styles.Footer} behavior="height">
          <TextInput
            ref={inputRef}
            style={styles.contentText}
            multiline
            placeholder={values.message}
            cursorColor={constants.colors.GREEN}
            placeholderTextColor={constants.colors.GREEN}
            onChangeText={handleChangeText}
            value={values.message}
          />
          <TouchableOpacity style={styles.doneContainer} onPress={handleSubmit}>
            <SVG.SendBtn />
          </TouchableOpacity>
        </KeyboardAvoidingView>
        {/* </View> */}
        {/* </KeyboardAwareScrollView> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIcon: {marginBottom: margin},
  Header: {
    backgroundColor: constants.colors.GREEN,
    height: HEIGHT - HEIGHT * 0.616,
    paddingVertical,
    paddingHorizontal,
  },
  topHeaderText: {
    color: constants.colors.GREY,
    fontFamily: constants.Fonts.text,
    marginBottom: 17,
  },
  title: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text_medium,
    fontSize: 40,
    marginBottom: 28,
  },
  bottomHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomHeaderText: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text,
  },
  Footer: {
    backgroundColor: constants.colors.BGC,
    // height: HEIGHT * 0.616,
    flex: 1,
    paddingVertical,
    paddingHorizontal,
  },
  contentText: {
    color: constants.colors.GREEN,
    fontFamily: constants.Fonts.text_medium,
    // height: HEIGHT * 0.616 * 0.8,
    flex: 33,
    textAlignVertical: 'top',
    // backgroundColor: 'red',
  },
  doneContainer: {
    // backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    // flex: 1,
    bottom: paddingVertical,
    // right: paddingHorizontal + 15,
    // right: '50%',
    // lef
    // height: '10%',
    // width: 122,
  },
  darkMode: {},
});
