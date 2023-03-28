import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  I18nManager,
  LayoutChangeEvent,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import NewTask from '../components/NewTask';
import Animated, {FadeIn, FadeOutUp} from 'react-native-reanimated';
import {tasksApi, useGetTasksByDateQuery} from '../app/api/taskApi';
import DisplayTask from '../components/DisplayTask';
import {useAppDispatch} from '../app/hooks';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {DateObject, getDatesForYear} from '../components/WeeklyCalender';
import Line from '../components/Line';
import {FlashList} from '@shopify/flash-list';
import RenderItem from '../components/RenderDateItem';

const CURRENT_DATE = new Date();
const allDates = getDatesForYear(CURRENT_DATE);
const flatListData = Object.values(allDates);
const initialNumToRender = flatListData.length;
export const DATE_WIDTH = constants.WIDTH * 0.9;
const Home = () => {
  const [topViewWidth, setTopViewWidth] = useState<number | undefined>(
    undefined,
  );
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedFinalDate, setSelectedFinalDate] =
    useState<Date>(CURRENT_DATE);
  const [isTaskLoading, setIsTaskLoading] = useState<boolean>(false);
  const flashListRef = useRef<FlashList<DateObject> | null>(null);
  const [selectedScrollDate, setSelectedScrollDate] =
    useState<Date>(CURRENT_DATE);
  const [selectedDate, setSelectedDate] = useState<Date>(CURRENT_DATE);

  const [dateHeader, setDateHeader] = useState<DateObject>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const SetDateHeader = useCallback((header: any) => {
    setDateHeader(header);
  }, []);
  const SetSelectedFinalDate = useCallback((date: any) => {
    setSelectedFinalDate(date);
  }, []);
  const SetSelectedDate = useCallback((date: any) => {
    setSelectedDate(date);
  }, []);
  // const SetDateHeader = useCallback((header:any)=>{setDateHeader(header)},[])
  const {
    isLoading: taskLoading,
    data: tasks1,
    isSuccess: taskSuccess,
    isError: taskIsError,
    error: tasksError,
    isFetching: taskFetch,
  } = useGetTasksByDateQuery(formatDate(CURRENT_DATE));
  React.useEffect(() => {
    console.log('asd');
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
  }, []);
  const FetchTasks = useCallback((date: Date) => {
    const result = dispatch(
      tasksApi.endpoints.getTasksByDate.initiate(formatDate(date)),
    )
      .then(res => {
        setTasks(res.data);
        console.log(tasks.length);
      })
      .catch(err => {
        console.log('error getting tasks', err);
      })
      .finally(() => setIsTaskLoading(false));
  }, []);
  const datePress = useCallback(
    (date: Date) => {
      findDateAndScroll(date);
      setIsTaskLoading(true);
      SetSelectedFinalDate(date);
      SetSelectedDate(date);
      // runOnJS(FetchTasks)(date);
      FetchTasks(date);
    },
    [selectedFinalDate],
  );
  const snapToOffsets = useMemo(() => {
    return Array.from({length: initialNumToRender}, (_, index) => {
      return (DATE_WIDTH / 7) * index;
    });
  }, [DATE_WIDTH, initialNumToRender]);
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

  function formatDate(date: Date): string {
    const formattedDate = new Intl.DateTimeFormat('heb-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);

    const fixedDate = formattedDate.split('.').join('/');
    return fixedDate;
  }

  // TODO: find a way to handle scroll to index
  const getIndexByKey = useCallback(
    (obj: Record<string, any>, key: string): number => {
      const keys = Object.keys(obj);
      console.log(keys.indexOf(key));
      return keys.indexOf(key);
    },
    [],
  );
  const findDateAndScroll = useCallback((DateToCheck: Date) => {
    const key = DateToCheck.toLocaleDateString();
    const index = getIndexByKey(allDates, key);
    scrollToIndex(index);
  }, []);

  useEffect(() => {
    // if (!selectedDate.current) findDateAndScroll(CURRENT_DATE);
    // else
    console.log('first render', selectedDate);
    findDateAndScroll(selectedDate);
  }, []);

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
  const snapPoints = useMemo(() => ['100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const tempGetMonthFromStringDate = () => {
    if (!dateHeader) return;
    const monthName = dateHeader?.fullDate.toLocaleString('eng', {
      month: 'long',
    });

    const isToday =
      dateHeader?.fullDate.toDateString() === CURRENT_DATE.toDateString();
    const formattedDate = `${isToday ? 'Today' : dateHeader.dayName},${
      dateHeader.day
    } ${monthName}`;
    return formattedDate;
  };

  //  -------------------------------------------------------- flat list callbacks --------------------------------------------------------
  let prevDate: Date | undefined = selectedScrollDate;
  const handleViewableChange = useRef((item: any) => {
    item.viewableItems?.forEach((item: any) => {
      // console.log(item.index, item);
    });
    const itemsLength = item.viewableItems?.length;
    const currentViewableItemIndex = itemsLength <= 4 ? itemsLength - 1 : 4;
    const date = item.viewableItems[3]?.item;
    if (!date) return;
    prevDate = date.fullDate;
    SetDateHeader(date);
    setSelectedScrollDate(date.fullDate);
    // SetSelectedFinalDate(date.fullDate);
  });
  const onDragEnd = useCallback(() => {
    console.log(prevDate);
    if (!prevDate) return;
    prevDate = undefined;
    console.log(dateHeader?.fullDate);
    SetSelectedFinalDate(dateHeader?.fullDate);
    // SetSelectedFinalDate(selectedScrollDate);
    // datePress(selectedScrollDate.current);
    // runOnJS(FetchTasks)(selectedScrollDate);
    FetchTasks(selectedScrollDate);
    // datePress(selectedScrollDate.current);
  }, [selectedScrollDate]);

  const keyExtractor = useCallback(
    (item: DateObject, index: number) => item.fullDate.toLocaleString(),
    [],
  );

  //  -------------------------------------------------------- flat list callbacks --------------------------------------------------------
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOutUp}
      style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.task}>
          <View style={styles.today}>
            <TouchableOpacity
              onPress={handlePresentModalPress}
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
            <Text style={styles.taskTitle}>{tempGetMonthFromStringDate()}</Text>
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
          <View
            style={[
              styles.date,
              {
                // overflow: 'visible',
                // backfaceVisibility: 'visible',
                // backgroundColor: 'red',
                // flex: 1,
              },
            ]}>
            {/* {flatListData && ( */}
            <FlashList
              ref={flashListRef}
              keyExtractor={keyExtractor}
              renderItem={props => <RenderItem {...props} />}
              extraData={{
                selectedFinalDate,
                onDatePress: datePress,
              }}
              estimatedItemSize={DATE_WIDTH / 7}
              data={flatListData}
              onMomentumScrollEnd={onDragEnd}
              horizontal
              contentContainerStyle={{
                paddingHorizontal: constants.WIDTH / 2 + 2.7 - DATE_WIDTH / 7,
              }}
              // pagingEnabled
              // onViewableItemsChanged={handleViewableChange.current}
              // snapToAlignment={'center'}
              // initialScrollIndex={getIndexByKey(
              //   allDates,
              //   CURRENT_DATE.toLocaleDateString(),
              // )}
              snapToOffsets={snapToOffsets && snapToOffsets}
              decelerationRate={'fast'}
            />
            {/* )} */}
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
            {tasks.length > 0 && (
              <DisplayTask data={tasks} isTaskLoading={isTaskLoading} />
            )}
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
          index={0}
          snapPoints={snapPoints}
          keyboardBlurBehavior="restore"
          handleIndicatorStyle={{backgroundColor: constants.colors.UNDER_LINE}}
          handleStyle={{
            backgroundColor: constants.colors.OFF_WHITE,
          }}
          onChange={handleSheetChanges}>
          {/* <NewTask
            closeModal={bottomSheetModalRef.current?.dismiss}
            targetDate={selectedDate}
            setTargetDate={SetSelectedDate}
          /> */}
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
    padding: constants.WIDTH * 0.025,
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
    // padding: '5%',
    position: 'relative',
  },
  today: {
    // backgroundColor: 'blue',
    // marginBottom: 5,
    padding: '5%',
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
    height: '23.5%',
    // width: '100%',
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
    height: `${100 - 23.5 - 15}%`,
    padding: '5%',
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
