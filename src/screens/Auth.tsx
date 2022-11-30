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
  const temp = () => {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <SVG.HereLogo viewBox="-31 0 150 150" width={200} height={200} />
        </View>
        <Text>Auth</Text>
      </View>
    );
  };
  const Temp2 = () => {
    return (
      //   <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.logo}>
            <SVG.HereLogo width="200" height="200" />
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Text>asdasd</Text>
        </View>
      </View>
      //   </SafeAreaView>
    );
  };
  return <Temp2 />;
}

const styles = StyleSheet.create({
  container: {
    // display: 'flex',
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: constants.colors.BGC,
  },
  logo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: WIDTH / 10,
  },
  topSection: {
    // display: 'flex',
    flex: 1,
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: constants.colors.BGC,
    // height: '30%',
  },
  bottomSection: {
    // display: 'flex',
    flex: 2,
    width: '100%',
    backgroundColor: constants.colors.OFF_WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  body: {
    flex: 1,
    backgroundColor: constants.colors.BGC,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  inputText: {
    height: 52,
    width: '100%',
    color: constants.colors.GREY,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: constants.colors.GREY,
    paddingLeft: 10,
  },
});
