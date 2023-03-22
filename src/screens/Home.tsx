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
import {
  DateObject,
  generateMonthObjects,
  getDatesForYear,
} from '../components/WeeklyCalender';
import Line from '../components/Line';

const DATE_ITEM_WIDTH = constants.WIDTH * 0.108;
const CURRENT_DATE = new Date();
const allDates = getDatesForYear(CURRENT_DATE);
// const allDates = generateMonthObjects(CURRENT_DATE);
const flatListData = Object.values(allDates);
console.log({len: flatListData.length});
const Home = () => {
  // const [isModalVisible, setModalVisible] = useState(false);
  // const [dates, setDates] = useState<Date[]>([]);
  // const [offset, setOffset] = useState(0);
  const [topViewWidth, setTopViewWidth] = useState<number | undefined>(
    undefined,
  );
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedFinalDate, setSelectedFinalDate] =
    useState<Date>(CURRENT_DATE);
  const [isTaskLoading, setIsTaskLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<DateObject> | null>(null);
  const selectedScrollDate = useRef<Date>(CURRENT_DATE);
  const selectedDate = useRef<Date>(CURRENT_DATE);
  const [dateHeader, setDateHeader] = useState<DateObject>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {
    isLoading: taskLoading,
    data: tasks1,
    isSuccess: taskSuccess,
    isError: taskIsError,
    error: tasksError,
    isFetching: taskFetch,
  } = useGetTasksByDateQuery('');
  const datePress = (date: Date) => {
    setIsTaskLoading(true);
    setSelectedFinalDate(date);
    selectedDate.current = date;
    // const result = dispatch(
    //   tasksApi.endpoints.getTasksByDate.initiate(formatDate(date)),
    // )
    //   .then(res => {
    //     setTasks(res.data);
    //     console.log(tasks.length);
    //   })
    //   .catch(err => {
    //     console.log('error getting tasks', err);
    //   })
    //   .finally(() => setIsTaskLoading(false));
  };

  const compareDates = (date1: Date, date2: Date): boolean => {
    return date1?.toDateString() === date2?.toDateString();
  };
  // const handleBackPress = () => {
  //   setIsNext(false);
  //   setOffset(offset - 7);
  // };

  // const handleNextPress = () => {
  //   setIsNext(true);
  //   setOffset(offset + 7);
  // };

  function formatDate(date: Date): string {
    const formattedDate = new Intl.DateTimeFormat('heb-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);

    const fixedDate = formattedDate.split('.').join('/');
    return fixedDate;
  }

  function getIndexByKey(obj: Record<string, any>, key: string): number {
    const keys = Object.keys(obj);
    return keys.indexOf(key);
  }

  const findDateAndScroll = (DateToCheck: Date) => {
    const key = DateToCheck.toLocaleDateString();
    const index = getIndexByKey(allDates, key);
    if (index < 0) return;
    flatListRef.current?.scrollToIndex({index});
    return index;
  };

  useEffect(() => {
    if (!selectedDate.current) findDateAndScroll(CURRENT_DATE);
    else findDateAndScroll(selectedDate.current);
  }, [topViewWidth, selectedDate.current]);

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
  const snapPoints = useMemo(() => ['0%', '100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const getMonthFromStringDate = (date: string) => {
    const [day, month, year] = date.split('/');

    const monthName = new Date(+year, +month - 1, +day).toLocaleString('eng', {
      month: 'long',
      year: '2-digit',
    });
    return monthName;
  };
  const tempGetMonthFromStringDate = () => {
    if (!dateHeader) return;
    // const date = new Date(dateHeader.)
    // console.log(Object.keys(flatListData))
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
  // const tempGetMonthFromStringDate = useMemo(() => {
  //   if (!dateHeader) return;
  //   const monthName = dateHeader?.fullDate.toLocaleString('eng', {
  //     month: 'long',
  //   });

  //   const isToday =
  //     dateHeader?.fullDate.toDateString() === CURRENT_DATE.toDateString();
  //   const formattedDate = `${isToday ? 'Today' : dateHeader.dayName},${
  //     dateHeader.day
  //   } ${monthName}`;
  //   return formattedDate;
  // }, [dateHeader]);

  let prevDate: Date | undefined = selectedScrollDate.current;
  const handleViewableChange = useRef((item: any) => {
    const itemsLength = item.viewableItems?.length;
    const currentViewableItemIndex = itemsLength <= 7 ? itemsLength - 1 : 7;
    const date = item.viewableItems[currentViewableItemIndex]?.item;
    if (!date) return;
    selectedScrollDate.current = date.fullDate;
    prevDate = date.fullDate;
    setDateHeader(date);

    // console.log('handleViewableChange');
    // setTimeout(() => {

    // }, 100);
    // const currentDateToDisplay = tempGetMonthFromStringDate(date);
    // setCurrentMonth(currentDateToDisplay);
  });
  const onDragEnd = useCallback(() => {
    if (!prevDate) return;
    prevDate = undefined;
    console.log(selectedScrollDate.current);
    setSelectedFinalDate(selectedScrollDate.current);
    datePress(selectedScrollDate.current);
    // setDateHeader(prev => {
    //   return {...prev};
    // });
  }, [selectedScrollDate.current, dateHeader?.fullDate]);
  // }, [selectedScrollDate.current, dateHeader]);

  const renderItem: ListRenderItem<any> | null | undefined = ({item}) => {
    const date2 = item.fullDate;
    // const areDatesEqual =
    // dateHeader?.fullDate && compareDates(dateHeader.fullDate, date2);
    const areDatesEqual = compareDates(selectedFinalDate, date2);
    // console.log({selectedFinalDate});
    return (
      <View
        style={[styles.dateContent, {width: topViewWidth && topViewWidth / 7}]}>
        <TouchableOpacity
          style={{
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => {
            datePress(date2);
            // setDateHeader(item);
          }}>
          <Text style={[styles.dateText, {marginBottom: 1}]}>
            {item.dayName}
          </Text>
          <View
            style={[
              styles.datePicker,
              {
                width: topViewWidth && topViewWidth / 9,
                height: topViewWidth && topViewWidth / 9,
                backgroundColor: areDatesEqual
                  ? constants.colors.GREEN
                  : 'transparent',
                elevation: areDatesEqual ? 5 : 0,
              },
            ]}>
            <Text style={[styles.dateText]}>{item.day}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  // const renderItem: ListRenderItem<Week> | null | undefined = item => {
  //   return (
  //     <>
  //       {item.item.map(day => {
  //         const date = day.date;
  //         return (
  //           <View key={date} style={styles.dateContent}>
  //             <TouchableOpacity
  //               style={{
  //                 width: '100%',
  //                 alignItems: 'center',
  //               }}
  //               onPress={() => {
  //                 console.log({date});
  //                 datePress(date);
  //               }}>
  //               <Text style={[styles.dateText, {marginBottom: 5}]}>
  //                 {day.name}
  //               </Text>
  //               <View
  //                 style={[
  //                   styles.datePicker,
  //                   {
  //                     backgroundColor:
  //                       selectedDate === date
  //                         ? constants.colors.GREEN
  //                         : 'transparent',
  //                     elevation: selectedDate === date ? 5 : 0,
  //                   },
  //                 ]}>
  //                 <Text style={styles.dateText}>{date.substring(0, 2)}</Text>
  //               </View>
  //             </TouchableOpacity>
  //           </View>
  //         );
  //       })}
  //     </>
  //   );
  // };
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
            {/* <Text style={styles.taskTitle}>{tempGetMonthFromStringDate}</Text> */}
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
          <View style={styles.date}>
            {
              <FlatList
                onLayout={e => {
                  setTopViewWidth(e.nativeEvent.layout.width);
                }}
                // extraData={[selectedFinalDate, topViewWidth]}
                ref={flatListRef}
                data={flatListData}
                // onContentSizeChange={() => {
                //   console.log('vhange1', flatListRef.current);
                //   if (
                //     flatListRef &&
                //     flatListRef.current &&
                //     flatListData &&
                //     flatListData.length
                //   ) {
                //     // console.log('change', flatListRef.current?.props);
                //     flatListRef.current.scrollToIndex({
                //       index: currentDateIndexInFlatList,
                //       animated: false,
                //     });
                //   }
                // }}
                initialNumToRender={100}
                // initialScrollIndex={currentDateIndexInFlatList}
                onMomentumScrollEnd={onDragEnd}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: topViewWidth && topViewWidth / 2,
                }}
                // contentOffset={{
                //   x: (topViewWidth && topViewWidth / 7 / 4) || 0,
                //   y: 0,
                // }}
                inverted
                pagingEnabled
                onViewableItemsChanged={handleViewableChange.current}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 24,
                }}
                snapToAlignment={'center'}
                getItemLayout={(data, index) => {
                  const width = topViewWidth || 360;
                  return {
                    index: index,
                    length: width / 7,
                    offset:
                      (width / 7) * (flatListData.length - 1 - index) +
                      width / 7 / 2,
                  };
                }}
              />
            }
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
          {/* <NewTask
            closeModal={bottomSheetModalRef.current?.dismiss}
            targetDate={selectedDate}
            setTargetDate={setSelectedDate}
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
    // flexDirection: 'row',

    height: '23.5%',
    paddingHorizontal: '5%',
    paddingTop: '2.5%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContent: {
    // flex: 1,
    // width: constants.WIDTH,
    // width: DATE_ITEM_WIDTH * 1.129,
    width: '30%',
    height: '80%',
    alignItems: 'center',
    flexDirection: 'column',
    // backgroundColor: 'green',
    // marginLeft: DATE_ITEM_WIDTH * 0.1255,
  },
  dateText: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
    fontSize: constants.WIDTH / 29,
    textAlign: 'center',
  },
  datePicker: {
    height: DATE_ITEM_WIDTH,
    width: DATE_ITEM_WIDTH,
    // marginBottom: '12%',
    borderRadius: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskListColumnContainer: {
    height: `${100 - 23.5 - 15}%`,
    padding: '5%',
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
