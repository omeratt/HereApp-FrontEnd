import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import constants from '../../assets/constants';
import SVG from '../../assets/svg';
import NewTask from '../../components/NewTask';
import Animated, {FlipInEasyY, useSharedValue} from 'react-native-reanimated';
import {tasksApi, useGetTasksByDateQuery} from '../../app/api/taskApi';
import DisplayTask from '../../components/DisplayTask';
import {useAppDispatch} from '../../app/hooks';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {DateObject, getDatesForYear} from '../../components/WeeklyCalender';
import Line from '../../components/Line';
import {FlashList} from '@shopify/flash-list';
import DatesFlatList from '../../components/DatesFlatList';
import CalendarModal from '../../components/CalendarModal';
import {TaskType} from '../../app/Reducers/User/userSlice';
import {DATE_WIDTH} from '../Home';
import json from '../../../AllDates.json';
const CURRENT_DATE = new Date();
const allDates = json;
const flatListData = Object.values(allDates);
const initialNumToRender = flatListData.length;
const {HEIGHT, WIDTH} = constants;
const contentH = HEIGHT * (670 / 896);
const todayH = HEIGHT * (73 / 896);
const dateFlashListH = HEIGHT * (90 / 896);
const contentW = WIDTH * (384 / 414);
// const contentW = WIDTH * (384 / 414);
const paddingVertical = HEIGHT * (23 / 896);
const tasksH = HEIGHT * (465 / 896);

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

  const flashListRef = useRef<FlashList<DateObject> | null>(null);
  const [selectedScrollDate, setSelectedScrollDate] =
    useState<Date>(CURRENT_DATE);
  const [selectedDate, setSelectedDate] = useState<Date>(CURRENT_DATE); // target date
  const sharedDatesIndex = useSharedValue(findIndexByDate(CURRENT_DATE));
  const [dateHeader, setDateHeader] = useState<DateObject>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [editTaskDetails, setEditTaskDetails] = useState<TaskType | undefined>(
    undefined,
  );
  // const a = useNavig
  const goBack = useCallback(() => {
    console.log('goBack');
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.navigate('HomePage' as never);
  }, [navigation]);

  const SetDateHeader = useCallback((header: any) => {
    setDateHeader(header);
  }, []);
  const SetSelectedDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);
  const sharedX = useSharedValue(0);

  const {isLoading: tasksLoading, data: tasks} =
    useGetTasksByDateQuery(selectedDate);
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
      new Date(dateItem.fullDate).getTime() -
        new Date(dateItem.fullDate).getTimezoneOffset() * 60000,
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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['100%'], []);

  // callbacks
  const openTaskModal = useCallback(() => {
    console.log('opening task');

    bottomSheetModalRef.current?.present();
  }, []);
  const closeTaskModal = useCallback(() => {
    console.log('closing task');
    bottomSheetModalRef.current?.dismiss();
    setEditTaskDetails(undefined);
  }, [bottomSheetModalRef.current]);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const tempGetMonthFromStringDate = useMemo(() => {
    if (!dateHeader) return 'Today';
    const monthName = new Date(dateHeader?.fullDate).toLocaleString('eng', {
      month: 'long',
    });

    const isToday =
      new Date(dateHeader?.fullDate).toDateString() ===
      CURRENT_DATE.toDateString();
    const formattedDate = `${isToday ? 'Today' : dateHeader.dayName}, ${
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
      entering={FlipInEasyY}
      // exiting={FadeOutUp}
      style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTxt}>All my tasks</Text>
        <SVG.NotePlus height={32} onPress={openTaskModal} />
      </View>
      <View style={styles.topView}>
        <View style={styles.task}>
          <View style={styles.today}>
            <Text style={styles.todayTitle}>{tempGetMonthFromStringDate}</Text>
            <TouchableOpacity
              style={styles.calendarBtn}
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
              //@ts-ignore
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
              //@ts-ignore
              flatListData={flatListData}
              snapToOffsets={snapToOffsets}
              openTaskModal={openTaskModal}
              task={editTaskDetails}
              setTask={setEditTaskDetails}
              isRenderTaskFromAllTasks={true}
              TASK_CONTAINER_HEIGHT={tasksH}
            />
            <View
              style={{
                height: 20,
                width: 20,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: '-5%',
                zIndex: 20,
              }}>
              {tasks?.length >= 6 && <SVG.ArrowDown fill={'black'} />}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.doneContainer}>
        <SVG.DoneButton fill={constants.colors.BGC} onPress={goBack} />
      </View>
      <CalendarModal
        visible={calendarVisible}
        toggleCalendar={toggleCalendar}
        FetchTasks={FetchTasks}
        findDateAndScroll={findDateAndScroll}
      />
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
            closeModal={closeTaskModal}
            targetDate={selectedDate}
            setTargetDate={SetSelectedDate}
            findDateAndScroll={findDateAndScroll}
            task={editTaskDetails}
            setTask={setEditTaskDetails}
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
    padding: WIDTH * 0.025,
    // justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'cyan',
    width: '100%',
    paddingHorizontal: '5%',
    paddingVertical,
  },
  headerTxt: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BGC,
    fontSize: 32,
  },
  topView: {
    height: contentH,
    width: '100%',
    alignItems: 'center',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    backgroundColor: constants.colors.OFF_WHITE,
    // backgroundColor: constants.colors.GREY,
    elevation: 2,
    overflow: 'hidden',
  },
  calendarBtn: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  task: {
    height: '100%',
    // padding: '5%',
    // position: 'relative',
  },
  today: {
    // backgroundColor: 'blue',
    // marginBottom: 5,
    alignItems: 'center',
    flexDirection: 'row',
    padding: '5%',
    height: todayH,
  },
  todayTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BGC,
    fontSize: 25,
    zIndex: 0,
    marginRight: '4%',
  },
  date: {
    height: dateFlashListH,
    // width: '100%',
    // backgroundColor: 'blue',
    paddingHorizontal: WIDTH * 0.025,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: '2.5%',
    // alignItems: 'center',
  },
  taskListColumnContainer: {
    height: tasksH, //container padding
    overflow: 'visible',
    // justifyContent: 'center',
    paddingVertical: 12,
    // backgroundColor: 'cyan',
    // borderColor: 'brown',
    // borderWidth: 1,
    padding: '0%',
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
  doneContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
