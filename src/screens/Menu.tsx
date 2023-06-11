import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import Line from '../components/Line';
import SVG from '../assets/svg';
import {useNavigation} from '@react-navigation/native';

const Menu = () => {
  // const [overlayColor,setOverlayColor] = useState()
  const navigation = useNavigation();
  const closeDrawer = () => {
    navigation.goBack();
  };
  const navigateTo = (screen: string) => () => {
    navigation.navigate(screen as never);
  };

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
      <View style={styles.menuList}>
        <TouchableOpacity
          style={styles.listItem}
          onPress={navigateTo('HomePage')}>
          <Text style={styles.listTxt}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={navigateTo('ListAndNotesStack')}>
          <Text style={styles.listTxt}>Lists</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={navigateTo('AllMyTasks')}>
          <Text style={styles.listTxt}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={navigateTo('PlayGround')}>
          <Text style={styles.listTxt}>PlayGround</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={navigateTo('Messages')}>
          <Text style={styles.listTxt}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.listTxt}>Time tips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={navigateTo('IamNotStupid')}>
          <Text style={styles.listTxt}>I'm not stupid</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.listTxt}>Settings</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.xView}>
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
    width: widthPercent,
    height: constants.HEIGHT * (581 / 896),
    alignItems: 'center',
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
