import React, {useEffect, useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import Animated, {withSpring} from 'react-native-reanimated';
import {getTimeFromDateString} from '../../components/WeeklyCalender';
import {ListRenderItem} from 'react-native';
import {RenderItemProps} from '../../components/DisplayTask';
import constants from '../../assets/constants';
import {TaskType} from '../../app/Reducers/User/userSlice';
import CheckBox from '../../components/CheckBox';
const springConfig = {stiffness: 100, mass: 0.5};
const TASK_WIDTH = constants.WIDTH * 0.975;

const RenderTasks: ListRenderItem<RenderItemProps> = ({item, index}) => {
  // item.handleSelect;
  const itemHours = getTimeFromDateString(item.targetDate);
  useEffect(() => {
    if (item?.sharedX && item?.sharedX.value !== undefined) {
      item.sharedX.value =
        item.sharedX.value < 0 ? TASK_WIDTH * 2 : -TASK_WIDTH * 2;
      item.sharedX.value = withSpring(0, springConfig);
    }
  }, []);
  const isSelected = useMemo(() => {
    return item?._id && item?.selected?.includes(item._id) ? true : false;
  }, [item?.selected, item._id]);
  console.log({isSelectOn: item?.isSelectOn, isSelected});
  return (
    <Animated.View
      // entering={ZoomIn.duration(500)}
      // {...(sharedX.value === 0 && {exiting: SlideOutRight})}
      style={[
        styles.taskListContainer,
        {...(isSelected && {backgroundColor: constants.colors.GREEN})},
        {...(!index && {marginTop: 0}), height: item.taskH / 6.5},
      ]}>
      <View style={styles.taskListContent}>
        <TouchableOpacity
          onPress={() => {
            item?.isSelectOn
              ? item?.handleSelected?.(item._id!)
              : item?.goToEditTask?.(item as TaskType);
          }}>
          {item.isSetTime && (
            <View style={{width: '33%'}}>
              <Text style={styles.taskContentHour}>{itemHours}</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignItems: 'center',
            }}>
            <View style={{width: '40%'}}>
              <Text style={styles.taskContentName}>{item.name}</Text>
            </View>
            <View style={{width: '60%'}}>
              <Text style={styles.taskContentDetails} numberOfLines={1}>
                {item.details}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{position: 'absolute', right: '5%'}}>
          <CheckBox
            size={22}
            // isFilled={true}
            isFilled={item?.isSelectOn ? isSelected : item.done}
            onPress={() => {
              item?.isSelectOn && item?.handleSelected?.(item._id!);
            }}
            type={item?.isSelectOn ? 'V' : undefined}
            colorFill={constants.colors.GREEN}
          />
        </View>
      </View>
      
    </Animated.View>
  );
};
export default React.memo(RenderTasks);

const styles = StyleSheet.create({
  taskListContainer: {
    marginTop: '2.2%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: '90.36%',
    height: 60,
    backgroundColor: constants.colors.OFF_WHITE,
    borderRadius: 20,
    // height
    // backgroundColor: 'red',
  },
  taskListContent: {
    // height: constants.HEIGHT * 0.1,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: constants.colors.UNDER_LINE,
    width: '100%',
    padding: '3%',
    // elevation: 1,
    // shadowRadius: 20,
    // shadowColor: 'rgba(255, 255, 255, 0.8)',
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    // backgroundColor: 'red',
    // zIndex: 9999,
  },
  taskContentHour: {
    fontFamily: constants.Fonts.text,
    // borderBottomColor: constants.colors.UNDER_LINE,
    // borderBottomWidth: 1,
    // backgroundColor: 'red',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 12,
    color: constants.colors.BLACK,
  },
  taskContentName: {
    fontFamily: constants.Fonts.text,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 12,
    color: constants.colors.BLACK,
  },
  taskContentDetails: {
    fontFamily: constants.Fonts.text,
    textAlign: 'left',
    fontSize: 12,
    color: constants.colors.UNDER_LINE,
  },
});
