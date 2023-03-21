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
  formatStringToDate,
  getDatesForYear,
} from '../components/WeeklyCalender';
import {selectDateSelector} from '../app/Reducers/User/userSlice';
import Line from '../components/Line';

const CURRENT_DATE = new Date();
const thisYear = CURRENT_DATE.getFullYear();
const allDates = getDatesForYear(thisYear);
const DATE_ITEM_WIDTH = constants.WIDTH * 0.108;
const flatListData = allDates.slice(60, 100);
const Home = () => {
  // const [isModalVisible, setModalVisible] = useState(false);
  // const [dates, setDates] = useState<Date[]>([]);
  // const [offset, setOffset] = useState(0);
  // const [isNext, setIsNext] = useState<boolean>(false);
  const [topViewWidth, setTopViewWidth] = useState<number | undefined>(
    undefined,
  );
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(CURRENT_DATE),
  );
  const [isTaskLoading, setIsTaskLoading] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const flatListRef = useRef<FlatList>();
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

  const findDateIndex = (DateToCheck: Date) => {
    if (!datesDict) return 0;
    const index = Object.values(flatListData).findIndex((val, index) => {
      // const gaga = val.filter(vals => vals.date === DateToCheck);
      // compareDates(val.fullDate, DateToCheck);
      if (compareDates(val.fullDate, DateToCheck)) {
        console.log('---------------------------index hsa found!!', index);
        flatListRef.current?.scrollToIndex({index: index + 3});
        // flatListRef.current?.sc;
        return index;
      }
    });
    return ~index ? index : 0;
  };

  const currentDateIndexInFlatList = useMemo(() => {
    if (!selectedDate) return findDateIndex(CURRENT_DATE);
    const dateToCheck = formatStringToDate(selectedDate); //13/2/2023
    return findDateIndex(dateToCheck);
    // if (!selectedDate) return findDateIndex(formatDate(CURRENT_DATE));
    // const [day, month, year] = selectedDate.split('/').map(Number);
    // const date = new Date(year, month - 1, day);
    // const formattedDateToCheck = formatDate(date); //13/2/2023
    // return findDateIndex(formattedDateToCheck);
  }, [selectedDate]);

  // if (flatListRef.current) {
  //   flatListRef.current?.scrollToIndex({index: 1});
  //   console.log(
  //     'aklsdklasjdklasjdlkasjdklasjdlkj89217318237189237918238912389127389',
  //   );
  // }

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

  const getMonthFromStringDate = (date: string) => {
    const [day, month, year] = date.split('/');

    const monthName = new Date(+year, +month - 1, +day).toLocaleString('eng', {
      month: 'long',
      year: '2-digit',
    });
    console.log({monthName});
    return monthName;
  };
  const tempGetMonthFromStringDate = (item: any) => {
    const monthName = item?.fullDate.toLocaleString('eng', {
      month: 'long',
    });

    const isToday =
      item?.fullDate.toDateString() === CURRENT_DATE.toDateString();
    const formattedDate = `${isToday ? 'Today' : item.dayName},${
      item.day
    } ${monthName}`;
    return formattedDate;
  };

  const handleViewableChange = useRef((item: any) => {
    // console.log({items: item.viewableItems});
    // item.viewableItems?.forEach((item: any) => {
    //   console.log(item.item, item.index);
    // });
    const date = item.viewableItems[3]?.item;
    if (!date) return;
    const currentDateToDisplay = tempGetMonthFromStringDate(date);
    setCurrentMonth(currentDateToDisplay);

    // const firstElementDate =
    //   item.viewableItems[1]?.item[0].date ||
    //   item.viewableItems[0]?.item[0].date;
    // const month = getMonthFromStringDate(firstElementDate);
  });
  // console.log({selectedDate});

  const renderItem: ListRenderItem<any> | null | undefined = ({item}) => {
    const date2 = item.fullDate;
    //TODO: change selectedDate from string to something else

    // const selec
    const date1 = formatStringToDate(selectedDate);
    const areDatesEqual = compareDates(date1, date2);
    return (
      <View
        style={[
          styles.dateContent,
          {width: topViewWidth && topViewWidth / 7.8},
        ]}>
        <TouchableOpacity
          style={{
            width: '100%',
            alignItems: 'center',
            // backgroundColor: 'white',
          }}
          onPress={() => {
            console.log({item});
          }}>
          <Text style={[styles.dateText, {marginBottom: 1}]}>
            {item.dayName}
          </Text>
          <View
            style={[
              styles.datePicker,
              {
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
  // console.log({currentDateIndexInFlatList});
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOutUp}
      style={styles.container}>
      <View style={styles.topView}>
        <View
          style={styles.task}
          onLayout={e => {
            setTopViewWidth(e.nativeEvent.layout.width);
          }}>
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
            <Text style={styles.taskTitle}>{currentMonth || 'Today'}</Text>
          </View>
          <View
            style={{
              // height: 0,
              margin: 0,
              padding: 0,
              backgroundColor: 'cyan',
              justifyContent: 'flex-start',
            }}>
            <Line
              strength={1}
              lengthPercentage={100}
              lineColor={constants.colors.UNDER_LINE}
              rotate180
            />
          </View>
          <View style={styles.triangle} />
          <View style={[styles.date]}>
            {datesDict && (
              <FlatList
                ref={flatListRef}
                data={flatListData}
                onContentSizeChange={() => {
                  if (
                    flatListRef &&
                    flatListRef.current &&
                    flatListData &&
                    flatListData.length &&
                    currentDateIndexInFlatList
                  ) {
                    flatListRef.current.scrollToIndex({
                      index: currentDateIndexInFlatList + 3,
                    });
                  }
                }}
                // data={Object.values(datesDict)}

                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                // initialScrollIndex={16}
                initialScrollIndex={currentDateIndexInFlatList || 0}
                inverted
                pagingEnabled
                // ItemSeparatorComponent={() => <React.Fragment />}
                // contentContainerStyle={{flex: 1}}
                // style={{flex: 1}}
                onViewableItemsChanged={handleViewableChange.current}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 24,
                }}
                // viewabilityConfigCallbackPairs={
                //   viewabilityConfigCallbackPairs.current
                // }
                snapToAlignment={'center'}
                // getItemLayout={(data, index) => {
                //   // console.log({topViewWidth});
                //   const width = topViewWidth || 360;
                //   // if (!topViewWidth) console.log({widthasdasd: width});
                //   // else console.log({widrh: width});
                //   return {
                //     index,
                //     length: constants.WIDTH / 8,
                //     offset: (constants.WIDTH / 8) * index,
                //   };
                // }}
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
          <NewTask
            closeModal={bottomSheetModalRef.current?.dismiss}
            targetDate={selectedDate}
            setTargetDate={setSelectedDate}
          />
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
