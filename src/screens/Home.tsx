import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import {useLogoutMutation} from '../app/api/userApi';

const dates = [
  {
    dayName: 'Mon',
    dayNum: '20',
    key: 'asd123',
  },
  {
    dayName: 'Tue',
    key: '123312asd',
    dayNum: '21',
  },
  {
    dayName: 'Wed',
    key: 'asd1gsd',
    dayNum: '22',
  },
  {
    dayName: 'Thu',
    key: 'adgasd3',
    dayNum: '23',
  },
  {
    dayName: 'Fri',
    key: 'hderh341',
    dayNum: '24',
  },
  {
    dayName: 'Sat',
    key: 'as32tasgz',
    dayNum: '25',
  },
  {
    key: 'asf32tgzg',
    dayName: 'Sun',
    dayNum: '26',
  },
];

const Home = () => {
  const [Logout, {isLoading, data, isSuccess, isError, error}] =
    useLogoutMutation();
  useEffect(() => {
    if (data) {
      console.log('logout', data);
    }
    if (error) {
      console.log('logoutError', error);
    }
  }, [data, error]);
  const SignOut = () => (
    <TouchableOpacity
      style={{
        position: 'absolute',
        top: 0,
        right: '50%',
      }}
      onPress={async () => await Logout(null)}>
      <Text style={{color: 'black'}}>logout</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <SignOut />
      <View style={styles.topView}>
        <View style={styles.task}>
          <View style={styles.today}>
            <SVG.plusIconOutlined
              style={styles.plusIcon}
              fill={constants.colors.BGC}
            />
            <Text style={styles.taskTitle}>Today</Text>
          </View>
          <View style={styles.date}>
            {dates.map(date => (
              <View key={date.key} style={styles.dateContent}>
                {/*TODO: horizontal flatlist*/}
                <Text style={styles.dateText}>{date.dayName}</Text>
                <View style={styles.datePicker}>
                  <Text style={styles.dateText}>{date.dayNum}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.taskListColumnContainer}>
            <View style={styles.taskListContainer}>
              <View style={styles.taskListContent}>
                <Text style={styles.taskContentTitle}>Home work</Text>
                <Text style={styles.taskContentBody}>Finish with...</Text>
              </View>
              <View style={styles.taskListHighlight}></View>
            </View>
            <View style={styles.taskListContainer}>
              <View style={styles.taskListContent}>
                <Text style={styles.taskContentTitle}>Home work</Text>
                <Text style={styles.taskContentBody}>Finish with...</Text>
              </View>
              <View style={styles.taskListHighlight}></View>
            </View>
          </View>
        </View>
        <View style={styles.myListContainer}>
          <View style={styles.myList}>
            <SVG.plusIconOutlined
              style={styles.myListPlusIcon}
              fill={constants.colors.BGC}
            />
            <Text style={styles.myListTitle}>My lists</Text>
          </View>
          <View style={styles.categoryContainer}>
            <View style={styles.myListCategory}>
              <Text
                // numberOfLines={2}
                // adjustsFontSizeToFit
                // lineBreakMode="tail"
                style={styles.listTxt}>
                Shopping list
              </Text>
            </View>
            <View style={styles.myListCategory}>
              <Text style={styles.listTxt}>Shopping list</Text>
            </View>
            <View style={styles.myListCategory}>
              <Text style={styles.listTxt}>Shopping list</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.middleView}>
        <View style={styles.box}>
          <View style={styles.topBox}></View>
          <View style={styles.bottomPlusBox}>
            <SVG.plusIconOutlined
              style={styles.boxPlusIcon}
              fill={constants.colors.BGC}
              height="80%"
            />
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.topBox}></View>
          <View style={styles.bottomPlusBox}>
            <SVG.plusIconOutlined
              style={styles.boxPlusIcon}
              fill={constants.colors.BGC}
              height="80%"
            />
          </View>
        </View>
        <View style={styles.box}></View>
      </View>
      <View style={styles.bottomView}>
        <View style={{width: '33.33%'}}>
          <SVG.Timer fill={constants.colors.BLACK} height="100%" width="100%" />
        </View>
        <View style={{width: '33.33%'}}>
          <SVG.BoxIcon
            fill={constants.colors.BLACK}
            height="100%"
            width="100%"
          />
        </View>
        <View style={{width: '33.33%'}}>
          <SVG.Search height="100%" width="100%" />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: constants.colors.OFF_WHITE,
    padding: '3%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  topView: {
    height: '61.9%',
    width: '100%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
  },
  middleView: {
    height: '22.5%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  box: {
    flex: 1,
    margin: '1%',
    padding: '1%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
  },
  topBox: {
    height: '85%',
  },
  bottomPlusBox: {
    height: '15%',
  },
  boxPlusIcon: {},
  bottomView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '9.7%',
    width: '65%',
    flexDirection: 'row',
    // backgroundColor: 'blue',
  },
  task: {
    height: '75.5%',
    borderColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 1,
    padding: '5%',
    position: 'relative',
  },
  today: {
    // backgroundColor: 'blue',
  },
  taskTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 40,
  },
  plusIcon: {
    position: 'absolute',
    color: constants.colors.BLACK,
    left: 0,
    top: 0,
  },
  myListPlusIcon: {
    position: 'absolute',
    color: constants.colors.BLACK,
    left: '6.5%',
  },
  date: {
    flexDirection: 'row',
    height: '23.5%',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'yellow',
  },
  dateContent: {
    width: '11.2%',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 5,
    alignContent: 'center',
  },
  dateText: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
    fontSize: constants.WIDTH / 29,
    textAlign: 'center',
  },
  datePicker: {
    height: '50%',
    width: `90%`,
    backgroundColor: constants.colors.GREEN,
    borderRadius: 800,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskListColumnContainer: {
    height: `${100 - 23.5 - 10}%`,
    // backgroundColor: 'red',
    justifyContent: 'center',
    paddingBottom: '10%',
    paddingTop: '10%',
  },
  taskListContainer: {
    marginTop: '2.5%',
    height: `42%`,
    flexDirection: 'row',
    // padding: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
    // alignContent: 'center',
    // backgroundColor: 'red',
  },
  taskListContent: {
    height: '100%',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    width: '80%',
    marginRight: '3%',
    position: 'relative',
    padding: '3%',
  },
  taskContentTitle: {
    fontFamily: constants.Fonts.text,
    fontWeight: 'bold',
    fontSize: 14,
    color: constants.colors.BLACK,
  },
  taskContentBody: {
    fontFamily: constants.Fonts.text,
    // fontWeight: '700',
    fontSize: 12.5,
    color: constants.colors.UNDER_LINE,
  },
  taskListHighlight: {
    position: 'absolute',
    right: 0,
    backgroundColor: constants.colors.GREEN,
    height: '45%',
    width: '8.5%',
    borderRadius: 800,
  },
  myListContainer: {
    height: '24.5%',

    paddingTop: '3%',
    // backgroundColor: 'blue',
  },
  myList: {
    marginBottom: 6,
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  myListTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 25,
  },
  categoryContainer: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: constants.colors.BLACK,
  },
  myListCategory: {
    height: '80.5%',
    width: '31%',
    padding: '0.1%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    justifyContent: 'center',
    alignContent: 'center',
  },
  listTxt: {
    color: constants.colors.BLACK,
    textAlign: 'center',
    fontSize: constants.WIDTH * 0.035,
    fontFamily: constants.Fonts.text,
  },
  bottomBox: {
    height: 50,
    width: 50,
    borderBottomColor: constants.colors.UNDER_LINE,
    borderRadius: 15,
    borderWidth: 1,
  },
});
