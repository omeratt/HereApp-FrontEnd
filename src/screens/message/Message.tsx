import {
  BackHandler,
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
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useAddOrEditMessageMutation} from '../../app/api/messageApi';
const {HEIGHT, WIDTH} = constants;
const ICON_SIZE = HEIGHT * (29.25 / 896);
const margin = 15;
const paddingHorizontal = WIDTH * (30.37 / 414);
const paddingVertical = HEIGHT * (22 / 896);
const textLengthLimit = 21;

type RootStackParamList = {
  Message: {
    messageRouteProp: IMessageValues | undefined;
    navFromSearch: boolean | undefined;
  };
};
type MessageRouteProp = RouteProp<RootStackParamList, 'Message'>;
const initialValues: IMessageValues = {
  message: '',
  title: 'Message to myself',
  date: getRealDate(new Date()),
  createdAt: getRealDate(new Date()).toISOString(),
};

const Message: React.FC<IMessagesProps> = () => {
  const messageRouteProp =
    useRoute<MessageRouteProp>().params?.messageRouteProp;
  const navFromSearch = useRoute<MessageRouteProp>().params?.navFromSearch;
  const [addMsg, {isLoading: addLoading}] = useAddOrEditMessageMutation();
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [values, setValues] = useState<IMessageValues>(
    messageRouteProp || initialValues,
  );
  const inputRef = React.useRef<TextInput>(null);
  const changeDarkMode = () => setDarkMode(prev => !prev);
  const goBack = React.useCallback(() => {
    if (navFromSearch) {
      return navigation.navigate('Search' as never);
    }
    navigation.navigate('Messages' as never);
  }, []);

  const handleSubmit = async () => {
    console.log('submit', {values});
    goBack();
    await addMsg(values);
  };
  const sliceTitle = (value: string) => {
    if (value.length > textLengthLimit + 1) return;
    const shouldSliceText = value.charAt(textLengthLimit) !== '';
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
  const dismissKeyboard = React.useCallback(() => {
    Keyboard.dismiss();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        goBack();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation]),
  );
  const handleChangeText = (value: string) => {
    sliceTitle(value);
    setValues(prev => ({...prev, message: value}));
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <Animated.View
        entering={FadeIn}
        // exiting={FadeOut}
        style={styles.container}>
        <View style={styles.Header}>
          <View style={{height: '90%'}}>
            <TouchableOpacity style={styles.backIcon} onPress={goBack}>
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
            <Text style={styles.bottomHeaderText}>
              {new Date(values.createdAt!).toLocaleString('eng', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
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
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.colors.BGC,
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
