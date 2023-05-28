import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
const textLengthLimit = 25;
const initialValues: IValues = {
  message: '',
  title: 'Message to myself',
  date: getRealDate(new Date()),
};
const Messages: React.FC<IMessagesProps> = ({message}) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [values, setValues] = useState<IValues>(initialValues);
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
    splittedText.pop();
    const fixedText = splittedText.join(' ');
    setValues({...values, title: fixedText});
  };

  const handleChangeText = (value: string) => {
    sliceTitle(value);
    setValues(prev => ({...prev, message: value}));
  };
  return (
    <View style={styles.container}>
      <View style={styles.Header}>
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

        <View style={styles.bottomHeaderContainer}>
          <Text style={styles.bottomHeaderText}>Mar 24,2021 - Mar 27,2021</Text>
        </View>
      </View>
      {/* <View style={[styles.Footer]}> */}
      {/* <KeyboardAwareScrollView style={styles.Footer} pos> */}
      <KeyboardAvoidingView style={styles.Footer} behavior="height">
        <TextInput
          style={styles.contentText}
          multiline
          placeholder={values.message}
          cursorColor={constants.colors.GREEN}
          placeholderTextColor={constants.colors.GREEN}
          onChangeText={handleChangeText}
          value={values.message}
        />
        <TouchableOpacity style={styles.doneContainer} onPress={handleSubmit}>
          <SVG.DoneButton fill={constants.colors.GREEN} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
      {/* </View> */}
      {/* </KeyboardAwareScrollView> */}
    </View>
  );
};

export default Messages;

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
    height: HEIGHT * 0.616,
    paddingVertical,
    paddingHorizontal,
  },
  contentText: {
    color: constants.colors.GREEN,
    fontFamily: constants.Fonts.text_medium,
    height: HEIGHT * 0.616 * 0.8,
    textAlignVertical: 'top',
    // backgroundColor: 'red',
  },
  doneContainer: {
    // backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: paddingVertical + 58.754,
    // right: paddingHorizontal + 15,
    right: '55%',
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
  darkMode: {},
});

// import {
//   KeyboardAvoidingView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Platform,
// } from 'react-native';
// import React, {useState} from 'react';
// import constants from '../../assets/constants';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {getRealDate} from '../../components/WeeklyCalender';

// const {HEIGHT, WIDTH} = constants;
// const ICON_SIZE = HEIGHT * (29.25 / 896);
// const margin = 15;
// const paddingHorizontal = WIDTH * (30.37 / 414);
// const paddingVertical = HEIGHT * (22 / 896);
// const textLengthLimit = 25;

// const initialValues = {
//   message: '',
//   title: 'Message to myself',
//   date: getRealDate(new Date()),
// };

// const Messages: React.FC<IMessagesProps> = ({message}) => {
//   const [darkMode, setDarkMode] = useState<boolean>(false);
//   const [values, setValues] = useState<IValues>(initialValues);

//   const changeDarkMode = () => setDarkMode(prev => !prev);

//   const handleBackPress = () => {
//     console.log('BackPress');
//   };

//   const handleSubmit = () => {
//     console.log('submit', {values});
//   };

//   const sliceTitle = (value: string) => {
//     if (value.length > textLengthLimit + 1) return;

//     const shouldSliceText = value.charAt(textLengthLimit) !== '';

//     if (!shouldSliceText) return setValues(prev => ({...prev, title: value}));

//     if (value.charAt(textLengthLimit) === ' ') {
//       const texts = value.slice(0, textLengthLimit);
//       return setValues(prev => ({...prev, title: texts}));
//     }

//     const splittedText = value.split(' ');
//     splittedText.pop();
//     const fixedText = splittedText.join(' ');
//     setValues(prev => ({...prev, title: fixedText}));
//   };

//   const handleChangeText = (value: string) => {
//     sliceTitle(value);
//     setValues(prev => ({...prev, message: value}));
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.Header}>
//         <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
//           <AntDesign
//             name="leftcircle"
//             color={constants.colors.BLACK}
//             size={ICON_SIZE}
//           />
//         </TouchableOpacity>
//         <Text style={styles.topHeaderText}>Message to myself</Text>
//         <Text style={styles.title} numberOfLines={2}>
//           {values.title}
//         </Text>

//         <View style={styles.bottomHeaderContainer}>
//           <Text style={styles.bottomHeaderText}>Mar 24,2021 - Mar 27,2021</Text>
//           <TouchableOpacity style={styles.backIcon} onPress={handleSubmit}>
//             <AntDesign
//               name="rightcircle"
//               color={constants.colors.BLACK}
//               size={ICON_SIZE}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <KeyboardAvoidingView
//         style={styles.Footer}
//         behavior={'height'} // Use 'padding' behavior for iOS and default behavior for Android
//       >
//         <TextInput
//           style={styles.contentText}
//           multiline
//           placeholder={values.message}
//           cursorColor={constants.colors.GREEN}
//           placeholderTextColor={constants.colors.GREEN}
//           onChangeText={handleChangeText}
//         />
//         <View style={styles.iconContainer}>
//           <AntDesign
//             name="rightcircle"
//             color={constants.colors.BLACK}
//             size={ICON_SIZE}
//           />
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default Messages;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backIcon: {
//     marginBottom: margin,
//   },
//   Header: {
//     backgroundColor: constants.colors.GREEN,
//     height: HEIGHT - HEIGHT * 0.616,
//     paddingVertical,
//     paddingHorizontal,
//   },
//   topHeaderText: {
//     color: constants.colors.GREY,
//     fontFamily: constants.Fonts.text,
//     marginBottom: 17,
//   },
//   title: {
//     color: constants.colors.BLACK,
//     fontFamily: constants.Fonts.text_medium,
//     fontSize: 40,
//     marginBottom: 28,
//   },
//   bottomHeaderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   bottomHeaderText: {
//     color: constants.colors.BLACK,
//     fontFamily: constants.Fonts.text,
//   },
//   Footer: {
//     backgroundColor: constants.colors.BGC,
//     height: HEIGHT * 0.616,
//     paddingVertical,
//     paddingHorizontal,
//   },
//   contentText: {
//     color: constants.colors.GREEN,
//     fontFamily: constants.Fonts.text_medium,
//     height: HEIGHT * 0.616 * 0.8,
//     textAlignVertical: 'top',
//     backgroundColor: 'red',
//   },
//   iconContainer: {
//     backgroundColor: 'blue',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: paddingVertical,
//     right: paddingHorizontal,
//     height: ICON_SIZE,
//     width: ICON_SIZE,
//   },
//   darkMode: {},
// });
