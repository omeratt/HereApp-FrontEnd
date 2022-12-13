import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import {useLogoutMutation} from '../app/api/userApi';

const dates = [
  {
    dayName: 'Mon',

    dayNum: '20',
  },
  {
    dayName: 'Tue',

    dayNum: '21',
  },
  {
    dayName: 'Wed',

    dayNum: '22',
  },
  {
    dayName: 'Thu',

    dayNum: '23',
  },
  {
    dayName: 'Fri',

    dayNum: '24',
  },
  {
    dayName: 'Sat',

    dayNum: '25',
  },
  {
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
              <>
                <View style={styles.dateContent}>
                  {/*TODO: horizontal flatlist*/}
                  <Text style={styles.dateText}>{date.dayName}</Text>
                  <View style={styles.datePicker}>
                    <Text style={styles.dateText}>{date.dayNum}</Text>
                  </View>
                </View>
              </>
            ))}
          </View>
          <View style={styles.taskListContainer}>
            <View style={styles.taskListContent}>
              <View style={styles.taskContentTitle}></View>
              <View style={styles.taskContentBody}></View>
            </View>
            <View style={styles.taskListHighlight}></View>
          </View>
        </View>
        <View style={styles.myListContainer}>
          <View style={styles.myList}>
            <SVG.plusIconOutlined
              style={styles.plusIcon}
              fill={constants.colors.BGC}
            />
            <Text style={styles.myListTitle}>My lists</Text>
          </View>
          <View style={styles.myListCategory}>
            <Text style={{color: 'black', textAlign: 'center'}}>
              home todo's
            </Text>
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
        <SVG.Search height="100%" width="30%" />
        <SVG.Search height="100%" width="30%" />
        <SVG.Timer fill={constants.colors.BLACK} height="100%" width="30%" />
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
    height: '8.7%',
    width: '60%',
    flexDirection: 'row',
  },
  task: {
    height: '75.5%',
    borderColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 1,
    padding: '5%',
    position: 'relative',
  },
  today: {
    backgroundColor: 'blue',
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
  date: {
    flexDirection: 'row',
    height: '23.5%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'yellow',
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
    width: '100%',
    backgroundColor: constants.colors.GREEN,
    borderRadius: 800,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskListContainer: {
    flexDirection: 'row',
    height: `${100 - 23.5 - 10}%`,
    // padding: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
    // alignContent: 'center',
    // backgroundColor: 'red',
  },
  taskListContent: {
    height: '31%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    width: '80%',
    marginRight: '3%',
    position: 'relative',
  },
  taskContentTitle: {},
  taskContentBody: {},
  taskListHighlight: {
    position: 'absolute',
    right: 0,
    backgroundColor: constants.colors.GREEN,
    height: '15%',
    width: '10%',
    borderRadius: 800,
  },
  myListContainer: {
    height: '24.5%',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '3%',
    // backgroundColor: 'blue',
  },
  myList: {marginBottom: 6},
  myListTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 25,
  },
  myListCategory: {
    height: '23.5%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    justifyContent: 'center',
    alignContent: 'center',
  },
  bottomBox: {
    height: 50,
    width: 50,
    borderBottomColor: constants.colors.UNDER_LINE,
    borderRadius: 15,
    borderWidth: 1,
  },
});
