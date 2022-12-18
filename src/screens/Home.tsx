import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import {useLogoutMutation} from '../app/api/userApi';
import NewTask from '../components/NewTask';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOutUp,
  FadingTransition,
  FlipInYRight,
  ZoomInEasyDown,
} from 'react-native-reanimated';
import {useGetTasksQuery} from '../app/api/taskApi';
import DisplayTask from '../components/DisplayTask';
// import {TouchableOpacity} from 'react-native-gesture-handler';

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
  const [isModalVisible, setModalVisible] = useState(false);
  const {
    isLoading: taskLoading,
    data: tasks,
    isSuccess: taskSuccess,
    isError: taskIsError,
    error: tasksError,
  } = useGetTasksQuery('');
  useEffect(() => {
    if (data) {
      console.log('logout', data);
    }
    if (error) {
      console.log('logoutError', error);
    }
  }, [data, error]);
  useEffect(() => {
    if (tasks) {
      console.log('getting tasks', tasks);
    }
    if (error) {
      console.log('error getting tasks', error);
    }
  }, [tasks, tasksError]);
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
    <Animated.View
      entering={FadeIn}
      exiting={FadeOutUp}
      style={styles.container}>
      <SignOut />
      <View style={styles.topView}>
        <View style={styles.task}>
          <View style={styles.today}>
            <TouchableOpacity
              onPress={() => setModalVisible(!isModalVisible)}
              // onPressIn={() => setModalVisible(!isModalVisible)}
              style={[
                // styles.plusIcon,
                {
                  // backgroundColor: 'green',
                  // width: 25,
                  // height: 25,
                  zIndex: 1,
                  // position: 'absolute',
                },
              ]}>
              <SVG.plusIconOutlined
                // onPress={() => setModalVisible(!isModalVisible)}
                // onPress={() => setModalVisible(!isModalVisible)}
                // onPressIn={() => setModalVisible(!isModalVisible)}
                style={[styles.plusIcon]}
                // height={50}
                // width={50}
                fill={constants.colors.BGC}
              />
            </TouchableOpacity>
            <Text style={styles.taskTitle}>Today</Text>
          </View>
          <View style={styles.date}>
            {dates.map(date => (
              <View key={date.key} style={styles.dateContent}>
                {/*TODO: horizontal flatlist*/}
                <Text style={[styles.dateText, {marginBottom: '25%'}]}>
                  {date.dayName}
                </Text>
                <View style={styles.datePicker}>
                  <Text style={styles.dateText}>{date.dayNum}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.taskListColumnContainer}>
            <DisplayTask data={tasks} />
            {/* <View style={styles.taskListContainer}>
              <View style={styles.taskListContent}>
                <Text style={styles.taskContentTitle}>Home work</Text>
                <Text style={styles.taskContentBody}>Finish with...</Text>
              </View>
              <View style={styles.taskListHighlight}></View>
            </View> */}
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
              {/* maximum of char = 19 in formik and backend*/}
              <Text style={styles.listTxt}>House to do's</Text>
            </View>
            <View style={styles.myListCategory}>
              <Text style={styles.listTxt}>House to do's</Text>
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
        <View style={{width: '35.33%'}}>
          <SVG.Timer fill={constants.colors.BLACK} height="100%" width="100%" />
        </View>
        <View style={{width: '35.33%'}}>
          <SVG.BoxIcon
            fill={constants.colors.BLACK}
            height="100%"
            width="100%"
          />
        </View>
        <View style={{width: '35.33%'}}>
          <SVG.Search height="100%" width="100%" />
        </View>
      </View>
      <NewTask
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
    </Animated.View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: constants.colors.OFF_WHITE,
    padding: '2.2%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  topView: {
    height: '63.9%',
    width: '100%',
    alignItems: 'center',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 2,
  },
  middleView: {
    height: '22.5%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: constants.colors.OFF_WHITE,
  },
  box: {
    flex: 1,
    margin: '1%',
    padding: '1%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 2,
  },
  topBox: {
    height: '85%',
  },
  bottomPlusBox: {
    height: '15%',
  },
  boxPlusIcon: {},

  task: {
    height: '75.5%',
    borderColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 1,
    padding: '5%',
    position: 'relative',
  },
  today: {
    // backgroundColor: 'blue',
    // marginBottom: 5,
    height: '20%',
  },
  taskTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 30,
    zIndex: 0,
  },
  plusIcon: {
    position: 'absolute',
    color: constants.colors.BLACK,
    left: 0,
    top: 0,
    borderRadius: 9999,
    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 6,
  },
  myListPlusIcon: {
    position: 'absolute',
    color: constants.colors.BLACK,
    left: '6.5%',
    borderRadius: 9999,

    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 5,
  },
  date: {
    flexDirection: 'row',
    height: '23.5%',
    // width: constants.WIDTH,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',

    // backgroundColor: constants.colors.BLACK,
  },
  dateContent: {
    width: '11.2%',
    // height: '70%',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 5,
    alignContent: 'center',
    borderRadius: 9999,
    // backgroundColor: constants.colors.OFF_WHITE,
    // elevation: 2,
  },
  dateText: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
    fontSize: constants.WIDTH / 29,
    textAlign: 'center',
  },
  datePicker: {
    height: '55%',
    width: '100%',
    backgroundColor: constants.colors.GREEN,
    borderRadius: 800,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  taskListColumnContainer: {
    height: `${100 - 23.5 - 15}%`,
    // backgroundColor: 'green',
    // justifyContent: 'flex-end',
    // paddingBottom: '6%',
    // paddingTop: '6%',
  },
  taskListContainer: {
    // marginTop: '2.5%',
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
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
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
    fontSize: 22,
    // fontWeight: '600',
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
    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 5,
  },
  listTxt: {
    color: constants.colors.BLACK,
    textAlign: 'center',
    fontSize: constants.WIDTH * 0.033,
    fontFamily: constants.Fonts.text,
  },
  bottomView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '10.7%',
    width: '65%',
    flexDirection: 'row',

    // backgroundColor: 'blue',
  },
});
