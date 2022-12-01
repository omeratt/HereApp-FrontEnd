import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import SVG from './../assets/svg';
import constants from '../assets/constants';
import {Dimensions} from 'react-native';
import SignIn from './SignIn';
import SignUp from './SignUp';

// import Modal from 'react-native-modal';
const WIDTH = Dimensions.get('window').width;
export default function Auth() {
  const [overlay, setOverlay] = useState(false);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [loader, setLoader] = useState(false);
  const validate = () => {
    if (email == '' && password == '') {
      showErr(true, true, 'Unable to sign in \n please fill in all fields');
    } else if (email == '') {
      showErr(true, true, 'Unable to sign in \n please enter your email');
    } else if (password == '') {
      showErr(true, true, 'Unable to sign in \n please enter your password');
    } else {
      setOverlay(false);
      setLoader(true);
      // signIn();
    }
  };
  const showErr = (show_overlay, show_popup, overlay_text) => {
    setOverlay(show_overlay);
    setpopUpErr(show_popup);
    setOverlayText(overlay_text);
  };
  const [signInScreen, setSignInScreen] = useState<boolean>(true);

  const Temp2 = () => {
    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <SVG.HereLogo width="200" height="200" />
        </View>
        {signInScreen ? <SignIn /> : <SignUp />}

        {/* <SignIn2 /> */}
      </View>
    );
  };
  return <Temp2 />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: constants.colors.BGC,
  },
  topSection: {
    marginRight: WIDTH / 10,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: constants.colors.BGC,
  },
});
