import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  ScrollView,
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
import Animated, {
  FadeIn,
  FadeOut,
  SequencedTransition,
} from 'react-native-reanimated';
import {useAddOrEditMessageMutation} from '../../app/api/messageApi';
import {FlashList} from '@shopify/flash-list';
const {HEIGHT, WIDTH} = constants;
const ICON_SIZE = HEIGHT * (29.25 / 896);
const margin = 15;
const paddingHorizontal = WIDTH * (30.37 / 414);
const paddingVertical = HEIGHT * (22 / 896);
const textLengthLimit = 21;
const sendSize = 40.75;
type RootStackParamList = {
  Message: {
    messageRouteProp: IMessageValues | undefined;
    flashListRef: React.RefObject<FlashList<IMessageValues>> | undefined;
    navFromSearch: boolean | undefined;
    navFromHome: boolean | undefined;
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
  const navFromHome = useRoute<MessageRouteProp>().params?.navFromHome;
  const flashListRef = useRoute<MessageRouteProp>().params?.flashListRef;
  const [addMsg, {isLoading: addLoading}] = useAddOrEditMessageMutation();
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [values, setValues] = useState<IMessageValues>(
    messageRouteProp || {
      ...initialValues,
      createdAt: getRealDate(new Date()).toISOString(),
    },
  );
  const inputRef = React.useRef<TextInput>(null);
  const changeDarkMode = () => setDarkMode(prev => !prev);
  const goBack = React.useCallback(() => {
    if (navFromSearch) {
      return navigation.navigate('Search' as never);
    }
    if (navFromHome) {
      return navigation.navigate('HomePage' as never);
    }
    navigation.navigate('Messages' as never);
  }, []);

  const handleSubmit = async () => {
    goBack();
    await addMsg(values);
    if (flashListRef?.current) {
      flashListRef.current?.prepareForLayoutAnimationRender();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
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
  const [textH, setTextH] = useState(HEIGHT);
  const [keyboardH, setKeyboardH] = useState(0);
  const [keyboardShow, setKeyboardShow] = useState(false);
  Keyboard.addListener('keyboardDidShow', event => {
    const keyboardHeight = event.endCoordinates.height;
    setKeyboardH(keyboardHeight);
    setKeyboardShow(true);
    const newScreenHeight = HEIGHT - keyboardHeight;
    setTextH(newScreenHeight);
  });
  Keyboard.addListener('keyboardDidHide', event => {
    setKeyboardShow(false);
    setTextH(HEIGHT);
  });

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <Animated.ScrollView
          entering={FadeIn}
          exiting={FadeOut}
          scrollEnabled={keyboardShow}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
          <View style={styles.headerContainer}>
            <View style={{flex: 1}}>
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
            <View style={[styles.bottomHeaderContainer, {flex: 0.5}]}>
              <Text style={styles.bottomHeaderText}>
                {new Date(values.createdAt!).toLocaleString('eng', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.formContainer,
              {height: keyboardShow ? textH * 0.6816 : textH * 0.616},
            ]}>
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
            <TouchableOpacity
              style={[
                styles.doneContainer,
                {bottom: keyboardShow ? sendSize : '12%'},
              ]}
              onPress={handleSubmit}>
              <SVG.SendBtn
                height={sendSize}
                fill={constants.colors.BGC}
                // style={{backgroundColor: 'red'}}
              />
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Message;

const styles = StyleSheet.create({
  scrollContainer: {
    // flexGrow: 1,
    // height: '120%',
    // justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: constants.colors.GREEN,
    height: HEIGHT - HEIGHT * 0.616,
    // height: '40%',
    // flex: 1,
    paddingVertical,
    paddingHorizontal,
  },
  formContainer: {
    // flex: 1.6,
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: '60%',
    // height: HEIGHT * 0.616,
    // backgroundColor: 'red',
    backgroundColor: constants.colors.BGC,
    // flex: 1,
    paddingVertical,
    paddingHorizontal,
  },
  textInput: {
    // Styling for your text input
    color: constants.colors.GREEN,
    fontFamily: constants.Fonts.text_medium,
    // flex: 1,
    backgroundColor: 'red',
    textAlignVertical: 'top',
  },
  ////////////////////////////////
  container: {
    // flex: 1,
    height: '100%',
    backgroundColor: constants.colors.BGC,
  },
  backIcon: {marginBottom: margin},
  Header: {
    backgroundColor: constants.colors.GREEN,
    height: HEIGHT * 0.5,
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
    flex: 1,
    paddingVertical,
    paddingHorizontal,
  },
  contentText: {
    color: constants.colors.GREEN,
    fontFamily: constants.Fonts.text_medium,
    flex: 1,
    textAlignVertical: 'top',
  },
  doneContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '12%',
  },
  darkMode: {},
});
