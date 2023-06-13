import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import constants from '../assets/constants';
import Line from '../components/Line';
import SVG from '../assets/svg';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../app/hooks';
import {screenSelector} from '../app/Reducers/User/screensSlice';
import {FlashList} from '@shopify/flash-list';
import {useLogoutMutation} from '../app/api/userApi';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
const Menu = () => {
  // const [overlayColor,setOverlayColor] = useState()
  const navigation = useNavigation();
  const closeDrawer = () => {
    navigation.goBack();
  };
  const navigateTo = (screen: string) => () => {
    navigation.navigate(screen as never);
  };

  const flatListRef = useRef<FlatList>(null);
  const screens = useAppSelector(screenSelector);
  const [Logout, {isLoading, data, isSuccess, isError, error}] =
    useLogoutMutation();
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
  const page1 = () => {
    return (
      <View
        style={{
          width: constants.WIDTH * 0.6037036895751953,
          alignItems: 'center',
          // height: '100%',
          height: constants.HEIGHT * (581 / 896),
          // height: constants.HEIGHT * (650 / 896),
          backgroundColor: 'tomato',
        }}>
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              backgroundColor: screens.home
                ? constants.colors.GREEN
                : 'transparent',
            },
          ]}
          onPress={navigateTo('HomePage')}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.home
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              backgroundColor: screens.lists
                ? constants.colors.GREEN
                : 'transparent',
            },
          ]}
          onPress={navigateTo('ListAndNotesStack')}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.lists
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            Lists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              backgroundColor: screens.tasks
                ? constants.colors.GREEN
                : 'transparent',
            },
          ]}
          onPress={navigateTo('AllMyTasks')}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.tasks
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              backgroundColor: screens.playGround
                ? constants.colors.GREEN
                : 'transparent',
            },
          ]}
          onPress={navigateTo('PlayGround')}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.playGround
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            PlayGround
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              backgroundColor: screens.chat
                ? constants.colors.GREEN
                : 'transparent',
            },
          ]}
          onPress={navigateTo('Messages')}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.chat
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              backgroundColor: screens.timeTips
                ? constants.colors.GREEN
                : 'transparent',
            },
          ]}
          onPress={navigateTo('TimeTips')}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.timeTips
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            Time tips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              backgroundColor: screens.stupid
                ? constants.colors.GREEN
                : 'transparent',
            },
          ]}
          onPress={navigateTo('IamNotStupid')}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.stupid
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            I'm not stupid
          </Text>
        </TouchableOpacity>
        {/* TODO: NAVIGATE TO SETTINGS, NOT TO SELECT WIDGET */}
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              backgroundColor: screens.settings
                ? constants.colors.GREEN
                : 'transparent',
            },
          ]}
          onPress={navigateTo('Widgets')}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.settings
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const settingPage = () => {
    return (
      <View
        style={{
          width: constants.WIDTH * 0.6037036895751953,
          alignItems: 'center',
          // height: '100%',
          backgroundColor: 'tomato',
          height: constants.HEIGHT * (581 / 896),
          // flex: 1,
        }}>
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              backgroundColor: screens.home
                ? constants.colors.GREEN
                : 'transparent',
            },
          ]}
          onPress={navigateTo('Widgets')}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.home
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            Edit Widgets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItem]} onPress={handleLogout}>
          <Text
            style={[
              styles.listTxt,
              {
                color: screens.home
                  ? constants.colors.BGC
                  : constants.colors.OFF_WHITE,
              },
            ]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const pages = [page1, settingPage];
  useEffect(() => {
    console.log(flatListRef);
    flatListRef.current?.scrollToEnd();
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.topView} onPress={navigateTo('Search')}>
        <Text style={styles.searchTxt}>Search</Text>
      </TouchableOpacity>
      <View style={styles.headerView}>
        <Text style={styles.menuTxt}>Menu</Text>
      </View>
      <Line
        lengthPercentage={widthNumberPercent}
        strength={1}
        lineColor={constants.colors.OFF_WHITE}
      />
      <View style={[styles.menuList, {backgroundColor: 'red'}]}>
        <FlashList
          data={pages}
          renderItem={props => (
            <View style={{height: constants.HEIGHT * (581 / 896)}}>
              <props.item />
            </View>
          )}
          horizontal
          pagingEnabled
          estimatedItemSize={constants.WIDTH * 0.6037036895751953}
        />
      </View>
      <TouchableOpacity style={[styles.xView]}>
        <SVG.XBtn onPress={closeDrawer} />
      </TouchableOpacity>
    </View>
  );
};

export default Menu;
const widthNumberPercent = 100 * (250 / 414);
const widthPercent = `${widthNumberPercent}%`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.colors.BGC,
    alignItems: 'center',
  },
  topView: {
    height: constants.HEIGHT * (56 / 896),
    width: '100%',
    paddingHorizontal: constants.WIDTH * (30 / 414),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerView: {
    height: constants.HEIGHT * (120 / 896),
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: constants.HEIGHT * (16 / 896),
  },
  menuList: {
    width: constants.WIDTH * (250 / 414),
    height: constants.HEIGHT * (581 / 896),
    alignItems: 'center',
    paddingTop: constants.HEIGHT * (70 / 896),
    paddingBottom: constants.HEIGHT * (173 / 896),
    // justifyContent: 'space-evenly',
    // backgroundColor: 'red',
  },
  menuListFlatList: {
    width: widthPercent,
    height: constants.HEIGHT * (581 / 896),
    // alignItems: 'center',
    paddingTop: constants.HEIGHT * (70 / 896),
    paddingBottom: constants.HEIGHT * (173 / 896),
    // justifyContent: 'space-evenly',
    // backgroundColor: 'red',
  },
  xView: {
    flex: 1,
    alignItems: 'center',
  },
  listTxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: constants.rf(21),
  },
  searchTxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: constants.rf(13),
  },
  menuTxt: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.OFF_WHITE,
    fontSize: constants.rf(40),
  },
  listItem: {
    // backgroundColor: 'red',
    // width: '100%',
    paddingHorizontal: '9%',
    justifyContent: 'center',
    borderRadius: 9999,
    alignItems: 'center',
    marginBottom: constants.HEIGHT * (16 / 896),
  },
});
