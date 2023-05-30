import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import Animated, {withSpring} from 'react-native-reanimated';
import {getTimeFromDateString} from '../../components/WeeklyCalender';
import {ListRenderItem} from 'react-native';
import {RenderItemProps} from '../../components/DisplayTask';
import constants from '../../assets/constants';
import {TaskType} from '../../app/Reducers/User/userSlice';
const springConfig = {stiffness: 100, mass: 0.5};
const TASK_WIDTH = constants.WIDTH * 0.975;
const RenderTasks: ListRenderItem<RenderItemProps> = ({item, index}) => {
  const itemHours = getTimeFromDateString(item.targetDate);
  useEffect(() => {
    if (item?.sharedX && item?.sharedX.value) {
      item.sharedX.value =
        item.sharedX.value < 0 ? TASK_WIDTH * 2 : -TASK_WIDTH * 2;
      item.sharedX.value = withSpring(0, springConfig);
      // sharedX.value = 0;
    }
  }, []);
  return (
    <Animated.View
      // entering={ZoomIn.duration(500)}
      // {...(sharedX.value === 0 && {exiting: SlideOutRight})}
      style={[styles.taskListContainer, {...(!index && {marginTop: 0})}]}>
      <View style={styles.taskListContent}>
        <TouchableOpacity
          onPress={() => item?.goToEditTask?.(item as TaskType)}>
          {item.isSetTime && (
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={styles.taskContentHour}>{itemHours}</Text>
            </View>
          )}
          <Text style={styles.taskContentName}>{item.name}</Text>
          <Text style={styles.taskContentDetails} numberOfLines={1}>
            {item.details}
          </Text>
        </TouchableOpacity>
        {/* <CheckBox
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
        /> */}
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
});
