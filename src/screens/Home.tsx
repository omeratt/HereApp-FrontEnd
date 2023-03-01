import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ListRenderItem,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import NewTask from '../components/NewTask';
import Animated, {FadeIn, FadeOutUp} from 'react-native-reanimated';
import {tasksApi, useGetTasksByDateQuery} from '../app/api/taskApi';
import DisplayTask from '../components/DisplayTask';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {Week} from '../components/WeeklyCalender';
import {selectDateSelector} from '../app/Reducers/User/userSlice';

const CURRENT_DATE = new Date();
const DATE_ITEM_WIDTH = constants.WIDTH * 0.095;
const Home = () => {
  // const [isModalVisible, setModalVisible] = useState(false);
  // const [dates, setDates] = useState<Date[]>([]);
  // const [offset, setOffset] = useState(0);
  // const [isNext, setIsNext] = useState<boolean>(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isTaskLoading, setIsTaskLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const datesDict = useAppSelector(selectDateSelector);
  const {
    isLoading: taskLoading,
    data: tasks1,
    isSuccess: taskSuccess,
    isError: taskIsError,
    error: tasksError,
    isFetching: taskFetch,
  } = useGetTasksByDateQuery(selectedDate);
  const datePress = (date: string) => {
    setIsTaskLoading(true);
    setSelectedDate(date);
    const result = dispatch(tasksApi.endpoints.getTasksByDate.initiate(date))
      .then(res => {
        setTasks(res.data);
        console.log(tasks.length);
      })
      .catch(err => {
        console.log('error getting tasks', err);
      })
      .finally(() => setIsTaskLoading(false));
  };
  useEffect(() => {
    // Set the initial selected date to today
    setSelectedDate(formatDate(CURRENT_DATE));
  }, []);

  // const handleBackPress = () => {
  //   setIsNext(false);
  //   setOffset(offset - 7);
  // };

  // const handleNextPress = () => {
  //   setIsNext(true);
  //   setOffset(offset + 7);
  // };

  const formatDate = (date: Date): string => {
    const formattedDate = new Intl.DateTimeFormat('heb-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);

    const fixedDate = formattedDate.split('.').join('/');
    return fixedDate;
  };

  const findDateIndex = (DateToCheck: string) => {
    if (!datesDict) return 0;
    // console.log(DateToCheck);
    const index = Object.values(datesDict).findIndex((val, index) => {
      // console.log(val);
      const gaga = val.filter(vals => vals.date === DateToCheck);
      console.log('gagaaaaaa', gaga);
      if (gaga.length) return index;
    });
    return ~index ? index : 0;
  };
  const currentDateIndexInFlatList = useMemo(() => {
    if (!selectedDate) return findDateIndex(formatDate(CURRENT_DATE));
    const [day, month, year] = selectedDate.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const formattedDateToCheck = formatDate(date); //13/2/2023
    return findDateIndex(formattedDateToCheck);
  }, [selectedDate]);
  console.log(currentDateIndexInFlatList);

  useEffect(() => {
    if (taskFetch) {
      setIsTaskLoading(true);
    } else {
      setIsTaskLoading(false);
    }
    if (tasks1) {
      console.log('getting tasks', tasks);
      setTasks(tasks1);
    }
    if (tasksError) {
      console.log('error getting tasks', tasksError);
    }
  }, [tasks1, tasksError]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const getItemLayout = (data: any, index: any) => ({
    length: DATE_ITEM_WIDTH,
    offset: DATE_ITEM_WIDTH * index,
    index,
  });

  const renderItem: ListRenderItem<Week> | null | undefined = item => {
    return (
      <>
        {item.item.map(day => {
          const date = day.date;
          return (
            <View key={date} style={styles.dateContent}>
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => {
                  datePress(date);
                }}>
                <Text style={[styles.dateText, {marginBottom: 5}]}>
                  {day.name}
                </Text>
                <View
                  style={[
                    styles.datePicker,
                    {
                      backgroundColor:
                        selectedDate === date
                          ? constants.colors.GREEN
                          : 'transparent',
                      elevation: selectedDate === date ? 5 : 0,
                    },
                  ]}>
                  {/* <Text style={styles.dateText}>{date.substring(0, 2)}</Text> */}
                  <Text style={styles.dateText}>{date.substring(0, 2)}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </>
    );
  };
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOutUp}
      style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.task}>
          <View style={styles.today}>
            <TouchableOpacity
              // onPress={() => setModalVisible(!isModalVisible)}
              onPress={handlePresentModalPress}
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
            {datesDict && (
              <FlatList
                data={Object.values(datesDict)}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                // style={{
                //   flex: 1,
                // }}
                // initialNumToRender={7}
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={currentDateIndexInFlatList || 0}
                inverted
                pagingEnabled
                getItemLayout={getItemLayout}
              />
            )}
          </View>
          <View style={styles.taskListColumnContainer}>
            <DisplayTask data={tasks} isTaskLoading={isTaskLoading} />
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
        <TouchableOpacity onPress={openDrawer} style={{width: '35.33%'}}>
          <SVG.MenuIcon
            fill={constants.colors.BLACK}
            height="100%"
            width="100%"
          />
        </TouchableOpacity>
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
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          // android_keyboardInputMode="adjustResize"
          // keyboardBehavior="fillParent"
          // keyboardBlurBehavior="restore"
          // contentHeight={constants.HEIGHT}
          keyboardBlurBehavior="restore"
          handleIndicatorStyle={{backgroundColor: constants.colors.UNDER_LINE}}
          handleStyle={{
            backgroundColor: constants.colors.OFF_WHITE,
          }}
          // enableDismissOnClose
          onChange={handleSheetChanges}>
          <NewTask closeModal={bottomSheetModalRef.current?.dismiss} />
        </BottomSheetModal>
      </BottomSheetModalProvider>
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
    flex: 1,
    flexDirection: 'row',
    height: '23.5%',
    // width: constants.WIDTH,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor:''

    // backgroundColor: constants.colors.BLACK,
  },
  dateContent: {
    // flex: 1,
    width: DATE_ITEM_WIDTH,
    // height: '70%',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 5,
    alignContent: 'center',
    borderRadius: 9999,
    // backgroundColor: constants.colors.GREEN,
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

    borderRadius: 800,
    alignItems: 'center',
    justifyContent: 'center',
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
