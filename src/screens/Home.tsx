import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import NewTask from '../components/NewTask';
import Animated, {
  FadeIn,
  FadeOutUp,
  useSharedValue,
} from 'react-native-reanimated';
import {tasksApi, useGetTasksByDateQuery} from '../app/api/taskApi';
import DisplayTask from '../components/DisplayTask';
import {useAppDispatch} from '../app/hooks';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {DateObject, getDatesForYear} from '../components/WeeklyCalender';
import Line from '../components/Line';
import {FlashList} from '@shopify/flash-list';
import DatesFlatList from '../components/DatesFlatList';
import moment from 'moment';
import {useGetListsQuery} from '../app/api/listApi';
import CalendarModal from '../components/CalendarModal';

const CURRENT_DATE = new Date();
const allDates = getDatesForYear(CURRENT_DATE);
const flatListData = Object.values(allDates);
const initialNumToRender = flatListData.length;
export const DATE_WIDTH = constants.WIDTH * 0.89444444444444444444444444444444;
export const TASK_CONTAINER_HEIGHT =
  constants.HEIGHT * 0.64 * 0.84 - //topView till lists
  constants.HEIGHT * 0.64 * 0.84 * 0.2 - //date header
  constants.HEIGHT * 0.64 * 0.84 * 0.2 - //dates list
  8.7 - //triangle
  constants.WIDTH * 0.025; //container padding
const Home = () => {
  const getIndexByKey = useCallback(
    (obj: Record<string, any>, key: string): number => {
      const keys = Object.keys(obj);
      return keys.indexOf(key);
    },
    [],
  );
  const findIndexByDate = useCallback((DateToCheck: Date) => {
    const key = DateToCheck.toLocaleDateString();
    const index = getIndexByKey(allDates, key);
    return index;
  }, []);
  // const [tasks, setTasks] = useState<any[]>([]);
  // const [isTaskLoading, setIsTaskLoading] = useState<boolean>(false);
  const flashListRef = useRef<FlashList<DateObject> | null>(null);
  const [selectedScrollDate, setSelectedScrollDate] =
    useState<Date>(CURRENT_DATE);
  const [selectedDate, setSelectedDate] = useState<Date>(CURRENT_DATE); // target date
  const sharedDatesIndex = useSharedValue(findIndexByDate(CURRENT_DATE));
  const [dateHeader, setDateHeader] = useState<DateObject>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const SetDateHeader = useCallback((header: any) => {
    setDateHeader(header);
  }, []);
  const SetSelectedDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);
  const sharedX = useSharedValue(0);
  const {
    data: lists,
    error: listsFetchError,
    isLoading: listsLoading,
  } = useGetListsQuery(null);
  const {
    isLoading: tasksLoading,
    data: tasks,
    isSuccess: taskSuccess,
    isError: taskIsError,
    error: tasksError,
    isFetching: taskFetch,
  } = useGetTasksByDateQuery(selectedDate);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const FetchTasks = useCallback((date: Date) => {
    const result = dispatch(tasksApi.endpoints.getTasksByDate.initiate(date))
      .then((res: any) => {})
      .catch(err => {
        console.log('error getting tasks', err);
      });
  }, []);

  const datePress = useCallback((dateItem: DateObject) => {
    const realDate = new Date(
      dateItem.fullDate.getTime() -
        dateItem.fullDate.getTimezoneOffset() * 60000,
    );
    findDateAndScroll(realDate);
    FetchTasks(realDate);
  }, []);

  const findDateAndScroll = useCallback((DateToCheck: Date) => {
    const key = DateToCheck.toLocaleDateString();
    const index = getIndexByKey(allDates, key);
    SetSelectedDate(DateToCheck);
    SetDateHeader(flatListData[index]);
    scrollToIndex(index);
  }, []);

  useEffect(() => {
    findDateAndScroll(CURRENT_DATE);
  }, []);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const handleListPlusIcon = useCallback(() => {
    navigation.navigate(
      'ListAndNotesStack' as never,
      {
        screen: 'ListAndNotes' as never,
      } as never,
    );
  }, [navigation]);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const tempGetMonthFromStringDate = useMemo(() => {
    if (!dateHeader) return 'Today';
    const monthName = dateHeader?.fullDate.toLocaleString('eng', {
      month: 'long',
    });

    const isToday =
      dateHeader?.fullDate.toDateString() === CURRENT_DATE.toDateString();
    const formattedDate = `${isToday ? 'Today' : dateHeader.dayName},${
      dateHeader.day
    } ${monthName}`;
    return formattedDate;
  }, [dateHeader, CURRENT_DATE]);

  //  -------------------------------------------------------- flat list callbacks --------------------------------------------------------
  const snapToOffsets = useMemo(() => {
    return Array.from({length: initialNumToRender}, (_, index) => {
      return (DATE_WIDTH / 7) * index;
    });
  }, []);
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!snapToOffsets) return null;
      flashListRef.current?.scrollToOffset({
        offset: snapToOffsets[index],
        animated: true,
      });
    },
    [snapToOffsets],
  );
  //  -------------------------------------------------------- flat list callbacks --------------------------------------------------------

  const toggleCalendar = useCallback(() => {
    setCalendarVisible(!calendarVisible);
  }, [calendarVisible]);
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOutUp}
      style={styles.container}>
      <CalendarModal
        visible={calendarVisible}
        toggleCalendar={toggleCalendar}
        FetchTasks={FetchTasks}
        findDateAndScroll={findDateAndScroll}
      />
      <View style={styles.topView}>
        <View style={styles.task}>
          <View style={styles.today}>
            <Text style={styles.taskTitle}>{tempGetMonthFromStringDate}</Text>

            <TouchableOpacity
              style={{
                // backgroundColor: 'black',
                width: 15,
                height: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={toggleCalendar}>
              <SVG.ArrowDown />
            </TouchableOpacity>
          </View>
          <View>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
              rotate180
              style={{elevation: 2.5}}
            />
          </View>
          <View style={styles.triangle} />
          <View style={[styles.date]}>
            <DatesFlatList
              flashListRef={flashListRef}
              datePress={datePress}
              // FetchTasks={FetchTasks}
              selectedFinalDate={selectedDate}
              // setSelectedFinalDate={SetSelectedFinalDate}
              selectedScrollDate={selectedScrollDate}
              flatListData={flatListData}
              // dateHeader={dateHeader}
              sharedX={sharedX}
              sharedDatesIndex={sharedDatesIndex}
            />
          </View>
          <View>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
              rotate180
              style={{elevation: 2.5}}
            />
          </View>
          <View style={styles.taskListColumnContainer}>
            <DisplayTask
              data={tasks}
              isTaskLoading={tasksLoading}
              sharedX={sharedX}
              flashListRef={flashListRef}
              sharedDatesIndex={sharedDatesIndex}
              datePress={datePress}
              flatListData={flatListData}
              snapToOffsets={snapToOffsets}
              handlePresentModalPress={handlePresentModalPress}
            />

            {/* {tasks?.length > 0 ? (
              <DisplayTask data={tasks} isTaskLoading={isTaskLoading} />
            ) : (
              <React.Fragment />
            )} */}
          </View>
        </View>
        <View style={styles.myListContainer}>
          <View style={styles.myList}>
            {/* <SVG.plusIconOutlined
              style={styles.myListPlusIcon}
              fill={constants.colors.BGC}
              onPress={() => {
                console.log('asf');
              }}
            /> */}
            <TouchableOpacity
              onPress={handleListPlusIcon}
              style={[
                {
                  zIndex: 1,
                },
              ]}>
              <SVG.plusIconOutlined
                style={[styles.plusIcon]}
                fill={constants.colors.BGC}
              />
            </TouchableOpacity>
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
          index={0}
          snapPoints={snapPoints}
          keyboardBlurBehavior="restore"
          handleIndicatorStyle={{backgroundColor: constants.colors.UNDER_LINE}}
          handleStyle={{
            backgroundColor: constants.colors.OFF_WHITE,
          }}
          onChange={handleSheetChanges}>
          <NewTask
            closeModal={bottomSheetModalRef.current?.dismiss}
            targetDate={selectedDate}
            setTargetDate={SetSelectedDate}
            maximumDate={flatListData[initialNumToRender - 1]?.fullDate}
            minimumDate={flatListData[0]?.fullDate}
            findDateAndScroll={findDateAndScroll}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Animated.View>
  );
};

export default React.memo(Home);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: constants.colors.OFF_WHITE,
    padding: constants.WIDTH * 0.025,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  topView: {
    height: '64%',
    width: '100%',
    alignItems: 'center',
    borderRadius: 32,
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
    height: '84%',
    borderColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 1,
    // backgroundColor: 'cyan',
    // padding: '5%',
    // position: 'relative',
  },
  today: {
    // backgroundColor: 'blue',
    // marginBottom: 5,
    alignItems: 'center',
    flexDirection: 'row',
    padding: '5%',
    height: '20%',
  },
  taskTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 30,
    zIndex: 0,
    marginRight: '4%',
  },
  plusIcon: {
    position: 'absolute',
    color: constants.colors.BLACK,
    right: 0,
    top: 0,
    borderRadius: 9999,
    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 6,
  },
  myListPlusIcon: {
    position: 'absolute',
    color: constants.colors.BLACK,
    right: '6.5%',
    borderRadius: 9999,

    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 5,
  },
  date: {
    height: '20%',
    // width: '100%',
    // backgroundColor: 'blue',

    paddingHorizontal: constants.WIDTH * 0.025,
    // paddingLeft: constants.WIDTH * 0.025,
    // paddingRight: constants.WIDTH * 0.025,
    // width: constants.WIDTH * 0.95,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: '2.5%',
    // alignItems: 'center',
  },
  taskListColumnContainer: {
    // height: `${100 - 22.7 - 20}%`,
    height: TASK_CONTAINER_HEIGHT, //container padding
    overflow: 'hidden',
    // backgroundColor: 'cyan',
    // borderColor: 'brown',
    // borderWidth: 1,
    padding: '0%',
  },
  myListContainer: {
    // height: '16%',
    paddingVertical: '1.5%',
    // justifyContent: 'flex-end',
    // backgroundColor: 'blue',
    // borderColor: 'brown',
    // borderWidth: 2,
  },
  myList: {
    marginBottom: 6,
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  myListTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 20,
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
    // height: '80.5%',
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
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8.7,
    // borderBottomWidth: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
    // transform: [{rotate: '180deg'}],
    alignSelf: 'center',
  },
});
