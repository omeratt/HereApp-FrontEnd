import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import SVG from '../assets/svg';
import constants from '../assets/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useLogoutMutation} from '../app/api/userApi';
import Line from '../components/Line';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import TextInput from '../components/TextInput';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
interface ICustomerDrawer extends DrawerContentComponentProps {
  isSignIn?: boolean;
}

const paddingHorizontal = constants.WIDTH * 0.09903381642512077294685990338164;
const paddingTop = constants.HEIGHT * 0.1171875;
const marginBottomFromMenuTxtToLine =
  constants.HEIGHT * 0.01450892857142857142857142857143;
const marginBottomFromLineToItems =
  constants.HEIGHT * 0.06808035714285714285714285714286;
const marginBottomToXBtnFromBottom =
  constants.HEIGHT * 0.07254464285714285714285714285714;
const bottomContainerHeight =
  constants.HEIGHT * 0.39133928571428571428571428571429;
const middleContainerHeight = constants.HEIGHT * 0.3;
const CustomDrawer: React.FC<ICustomerDrawer> = props => {
  const [Logout, {isLoading, data, isSuccess, isError, error}] =
    useLogoutMutation();
  const nav = useNavigation();
  const closeDrawer = React.useCallback(() => {
    nav.dispatch(DrawerActions.closeDrawer());
  }, []);
  const handleLogout = async () => {
    try {
      closeDrawer();
      if (auth()?.currentUser) await auth().signOut();
      if (await GoogleSignin.isSignedIn()) await GoogleSignin.signOut();
      await Logout(null).unwrap();
    } catch (err) {
      console.log('an error at logout', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menu</Text>
      <Line
        lineColor={constants.colors.OFF_WHITE}
        strength={1}
        style={{marginBottom: marginBottomFromLineToItems}}
      />
      <DrawerContentScrollView style={styles.lists} {...props}>
        <DrawerItemList {...props} />
        {props.isSignIn && (
          <DrawerItem
            label="Logout"
            labelStyle={[
              styles.label,
              {
                color: constants.colors.OFF_WHITE,
              },
            ]}
            onPress={handleLogout}
          />
        )}
      </DrawerContentScrollView>
      <View
        style={{
          // backgroundColor: 'red',
          height: bottomContainerHeight - bottomContainerHeight * 0.6,
        }}>
        <SVG.XBtn
          onPress={closeDrawer}
          style={{
            alignSelf: 'center',
          }}
        />
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    width: constants.WIDTH,
    height: constants.HEIGHT,
    paddingTop,
    paddingHorizontal,
  },
  header: {
    // marginLeft: constants.WIDTH * 0.055,
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.OFF_WHITE,
    marginBottom: marginBottomFromMenuTxtToLine,
    fontSize: 35,
  },
  lists: {
    height: middleContainerHeight,
    width: constants.WIDTH,
    marginTop: -constants.HEIGHT * 0.03,
    // height: constants.HEIGHT,
    // backgroundColor: 'blue',
    marginLeft: -constants.WIDTH * 0.055,
  },
  label: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: 20,
    marginTop: -constants.HEIGHT * 0.015 - constants.HEIGHT * 0.015 * 0.2,
    // fontWeight: 'bold',
  },
  bottomSearchTxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.GREY,
    fontSize: constants.WIDTH * 0.033,
    alignSelf: 'center',
    marginTop: 5,
    // backgroundColor: 'red',
  },
});
