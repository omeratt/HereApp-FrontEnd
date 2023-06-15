import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useGetNextTasksByDateQuery} from '../../app/api/taskApi';
import constants from '../../assets/constants';
import moment from 'moment';
import {
  getRealDate,
  getShortName,
  getTimeFromDateString,
} from '../WeeklyCalender';
import {TaskType} from '../../app/Reducers/User/userSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CheckBox from '../CheckBox';
const realDate = getRealDate(new Date());
const {rf} = constants;
interface NextTaskProps {
  width: number;
  height: number;
  navToTask?: (task: TaskType) => void;
  updateTask?: any;
}
const NextTask: React.FC<NextTaskProps> = ({
  width,
  height,
  navToTask,
  updateTask,
}) => {
  const {
    data: nextTask,
    isLoading,
    isFetching,
  } = useGetNextTasksByDateQuery(realDate);
  if (!nextTask || isLoading || isFetching) {
    return nextTask ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={constants.colors.UNDER_LINE} size={32} />
      </View>
    ) : (
      <React.Fragment />
    );
  }
  const date = moment(nextTask[0]?.targetDate);
  const hours = getTimeFromDateString(date.toDate().toISOString());
  const formattedDate = getShortName(date.day()) + ' ' + date.date();
  const handlePress = () => {
    navToTask?.(nextTask[0]);
  };
  const handleCheckboxPress = () => {
    const {_id, done} = nextTask[0] || {};
    if (!_id) return;
    updateTask?.(_id, !done);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{justifyContent: 'center'}}>
          <Text style={[styles.font, styles.title]}>Next task</Text>
          {nextTask[0]?.isSetTime && <Text style={[styles.font]}>{hours}</Text>}
        </View>
        {nextTask[0]?._id && (
          <CheckBox
            size={25}
            isFilled={nextTask[0]?.done}
            colorFill={constants.colors.GREEN}
            onPress={handleCheckboxPress}
          />
        )}
      </View>
      {nextTask[0]?._id ? (
        <View style={{marginTop: height * 0.1}}>
          <Text style={[styles.font, styles.title]}>
            {nextTask[0]?.name?.trim()}
          </Text>
          <Text numberOfLines={3} style={styles.font}>
            {nextTask[0]?.details?.trim()}
          </Text>
        </View>
      ) : (
        <Text style={styles.noTasks}>No tasks</Text>
      )}
      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <View style={[styles.textFooter, {width: `${(49 / width) * 100}%`}]}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.font}>
              {formattedDate}
            </Text>
          </View>
          <TouchableOpacity onPress={handlePress}>
            <AntDesign
              name="rightcircleo"
              color={constants.colors.BLACK}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(NextTask);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 17,
  },
  noTasks: {
    borderWidth: 0,
    fontSize: constants.rf(15),
    color: constants.colors.UNDER_LINE,
    // alignItems: 'center',
    flex: 1,
    textAlignVertical: 'bottom',
    fontFamily: constants.Fonts.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'grey',
    alignItems: 'center',
  },
  font: {
    fontFamily: constants.Fonts.text,
    textAlign: 'left',
    fontSize: rf(12),
    color: constants.colors.BLACK,
  },
  title: {
    fontFamily: constants.Fonts.text_medium,
    color: constants.colors.BLACK,
  },
  footerContainer: {flex: 1, justifyContent: 'flex-end'},
  footer: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textFooter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
