import {
  ActivityIndicator,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Animated, {
  SharedValue,
  runOnJS,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import constants from '../assets/constants';
import CircleCheckBox from './CircleCheckBox';
import {CheckBox} from '@rneui/themed';
import {tasksApi, useDeleteTaskMutation} from '../app/api/taskApi';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import SVG from '../assets/svg';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {FlashList} from '@shopify/flash-list';
import {DateObject, getTimeFromDateString} from './WeeklyCalender';

interface RenderItemProps {
  _id?: string;
  name?: string;
  details?: string;
  expires?: string;
  done: false;
  targetDate?: string;
}
interface props {
  data: any[];
  isTaskLoading: boolean;
  sharedX: SharedValue<number>;
  flashListRef: React.MutableRefObject<FlashList<DateObject> | null>;
  sharedDatesIndex: SharedValue<number>;
  datePress: (dateItem: DateObject) => void;
  flatListData: DateObject[];
  snapToOffsets: number[];
}
const TASK_CONTAINER_HEIGHT =
  constants.HEIGHT * 0.64 * 0.84 - //topView till lists
  constants.HEIGHT * 0.64 * 0.84 * 0.2 - //date header
  constants.HEIGHT * 0.64 * 0.84 * 0.2 - //dates list
  8.7 - //triangle
  constants.WIDTH * 0.025;
const height = TASK_CONTAINER_HEIGHT;

const DisplayTask = ({
  data,
  isTaskLoading,
  sharedX,
  flashListRef,
  sharedDatesIndex,
  datePress,
  flatListData,
  snapToOffsets,
}: props) => {
  const [
    DeleteTask,
    {isLoading, data: responseDelete, isSuccess, isError, error},
  ] = useDeleteTaskMutation();
  const onPressDelete = async (_id: string) => {
    try {
      await DeleteTask(_id).unwrap();
      closeDeleteModal();
    } catch (err: any) {
      console.log('err in delete', err);
    }
  };
  let timer: any;
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);
  const [deleteProps, setDeleteProps] = useState({id: '', name: ''});
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['15%', '15%'], []);
  // callbacks
  const closeDeleteModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const openDeleteModal = (props: {name: string; id: string}) => {
    if (timer) clearTimeout(timer);
    setDeleteProps(props);
    //todo without timer - with send props on present()
    timer = setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 150);
  };
  const DeleteModal = ({_id, name}: {_id: string; name: string}) => {
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        // contentHeight={constants.HEIGHT}
        // detached

        backgroundStyle={{backgroundColor: constants.colors.GREEN}}
        stackBehavior="replace"
        // onChange={handleSheetChanges}
      >
        <View
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
          }}>
          <Text style={[styles.deleteTxt]}>
            Are you sure you want to delete
          </Text>
          <Text style={[styles.deleteTxt, {marginBottom: '2%'}]}>
            {deleteProps.name}
          </Text>
          <View
            style={{
              // height: '100%',
              width: '70%',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row-reverse',
            }}>
            <TouchableOpacity
              style={{
                // backgroundColor: '#DD3C2E',
                width: '35%',
                borderColor: constants.colors.UNDER_LINE,
                borderRadius: 100,
                borderWidth: 1,
              }}
              onPress={() => onPressDelete(deleteProps.id)}>
              <Text style={styles.deleteTxt}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '35%'}} onPress={closeDeleteModal}>
              <Text style={styles.deleteTxt}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    );
  };
  const emptyList = () => {
    if (isTaskLoading)
      return <ActivityIndicator size={30} color={constants.colors.GREEN} />;
    else return null;
  };
  const springConfig = useMemo(() => {
    return {stiffness: 100, mass: 0.5};
  }, []);
  const TASK_WIDTH = constants.WIDTH * 0.975;
  const RenderItem: ListRenderItem<RenderItemProps> = useCallback(
    ({item, index}) => {
      const itemHours = getTimeFromDateString(item.targetDate);
      useEffect(() => {
        sharedX.value = sharedX.value < 0 ? -TASK_WIDTH : TASK_WIDTH;
        sharedX.value = withSpring(0, springConfig);
      }, []);
      return (
        <Animated.View
          style={[styles.taskListContainer, {...(!index && {marginTop: 0})}]}>
          <View style={styles.taskListContent}>
            <TouchableOpacity
              onPress={() =>
                openDeleteModal({
                  name: item.name as string,
                  id: item._id as string,
                })
              }>
              <View style={{alignSelf: 'flex-start'}}>
                <Text style={styles.taskContentHour}>{itemHours}</Text>
              </View>
              <Text style={styles.taskContentName}>{item.name}</Text>
              <Text style={styles.taskContentDetails} numberOfLines={1}>
                {item.details}
              </Text>
            </TouchableOpacity>
            <CheckBox
              checked={item.done}
              iconRight
              fontFamily={constants.Fonts.text}
              containerStyle={{
                position: 'absolute',
                right: 2,
                backgroundColor: 'transparent',
              }}
              checkedIcon={
                <CircleCheckBox
                  size={25}
                  fill={constants.colors.GREEN}
                  borderColor={constants.colors.UNDER_LINE}
                />
              }
              uncheckedIcon={
                <CircleCheckBox
                  size={25}
                  fill={constants.colors.GREEN}
                  borderColor={constants.colors.UNDER_LINE}
                />
              }
              textStyle={styles.taskTxt}
              titleProps={{}}
              uncheckedColor="#F00"
            />
          </View>
        </Animated.View>
      );
    },
    [],
  );
  const startX = useSharedValue(sharedDatesIndex.value);
  const DATE_WIDTH = (constants.WIDTH * 0.89444444444444444444444444444444) / 7;

  const scroll = useCallback((x: number) => {
    const offset = snapToOffsets[startX.value] - (x / DATE_WIDTH) * 15;
    flashListRef?.current?.scrollToOffset({
      offset: offset,
    });
  }, []);

  const press: () => void = useCallback(() => {
    datePress(flatListData[sharedDatesIndex.value]);
  }, []);

  const endScroll: () => void = useCallback(() => {
    flashListRef?.current?.scrollToOffset({
      offset: snapToOffsets[sharedDatesIndex.value],
      animated: true,
    });
  }, []);

  const gestureX = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onStart(e => {
          startX.value = sharedDatesIndex.value;
        })
        .onUpdate(e => {
          sharedX.value = e.translationX;
          runOnJS(scroll)(e.translationX);
        })
        .onEnd(e => {
          if (startX.value !== sharedDatesIndex.value) {
            if (sharedX.value > 0) {
              sharedX.value = withSpring(TASK_WIDTH, springConfig);
            } else {
              sharedX.value = withSpring(-TASK_WIDTH, springConfig);
            }
          } else {
            sharedX.value = withSpring(0);
          }
          runOnJS(endScroll)();
          runOnJS(press)();
          startX.value = sharedDatesIndex.value;
        }),
    [],
  );
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: height,
      }}>
      <View style={styles.header}>
        <SVG.plusIconOutlined
          style={styles.PlusIcon}
          fill={constants.colors.BGC}
        />
        <Text style={styles.taskHeaderTitle}>Tasks</Text>
      </View>
      <View
        style={{
          width: '100%',
          height: height - 0.185 * height,
        }}>
        <GestureDetector gesture={gestureX}>
          <Animated.FlatList
            style={{transform: [{translateX: sharedX}]}}
            data={data}
            ListEmptyComponent={emptyList}
            renderItem={props => <RenderItem {...props} />}
            keyExtractor={item => item._id as string}
            contentContainerStyle={{paddingBottom: height * 0.01}}
          />
        </GestureDetector>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: height * 0.03,
            // backgroundColor: 'red',
          }}>
          <SVG.ArrowDown />
        </View>
        <DeleteModal
          _id={deleteProps.id as string}
          name={deleteProps.name as string}
        />
      </View>
    </View>
  );
};
export default React.memo(DisplayTask);
const styles = StyleSheet.create({
  taskListContainer: {
    marginTop: '2.2%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: '90.36%',
    height: height * 0.3663,
    // height
    // backgroundColor: 'red',
  },
  PlusIcon: {
    position: 'absolute',
    color: constants.colors.BLACK,
    right: '6.5%',
    borderRadius: 9999,
    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 5,
  },
  header: {
    // marginBottom: 6,
    width: '100%',
    paddingLeft: '5%',
    paddingRight: '5%',
    // backgroundColor: 'red',
    height: height * 0.17,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  taskHeaderTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 20,
    // fontWeight: '600',
  },
  taskTxt: {
    fontSize: 15,
    fontWeight: 'normal',
    color: constants.colors.BGC,
    fontFamily: constants.Fonts.text,
  },
  checkBox: {
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
  },
  taskListContent: {
    // height: constants.HEIGHT * 0.1,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: constants.colors.UNDER_LINE,
    width: '100%',
    padding: '3%',
    elevation: 2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    // backgroundColor: 'red',
    // zIndex: 9999,
  },
  taskContentHour: {
    fontFamily: constants.Fonts.text,
    borderBottomColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 1,
    // backgroundColor: 'red',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 14,
    color: constants.colors.BLACK,
  },
  taskContentName: {
    fontFamily: constants.Fonts.text,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 14,
    color: constants.colors.BLACK,
  },
  taskContentDetails: {
    fontFamily: constants.Fonts.text,
    textAlign: 'left',
    fontSize: 12.5,
    color: constants.colors.UNDER_LINE,
  },
  deleteTxt: {
    color: constants.colors.BGC,
    fontFamily: constants.Fonts.text,
    fontSize: 15.5,
    textAlign: 'center',
  },
});
