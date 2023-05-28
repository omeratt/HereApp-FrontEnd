import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {useGetNextTasksByDateQuery} from '../../app/api/taskApi';
import constants from '../../assets/constants';
import moment from 'moment';
import {
  getRealDate,
  getShortName,
  getTimeFromDateString,
} from '../WeeklyCalender';

const realDate = getRealDate(new Date());
interface NextTaskProps {
  width: number;
  height: number;
}
const NextTask: React.FC<NextTaskProps> = ({width, height}) => {
  const {data: nextTask, isLoading} = useGetNextTasksByDateQuery(realDate);
  if (!nextTask || isLoading) {
    return isLoading ? (
      <ActivityIndicator color={constants.colors.GREEN} />
    ) : (
      <React.Fragment />
    );
  }
  const date = moment(nextTask.targetDate);
  const hours = getTimeFromDateString(date.toDate().toISOString());
  const formattedDate = getShortName(date.day()) + ' ' + date.date();

  return (
    <View style={{flex: 1}}>
      <Text
        style={[
          styles.font,
          styles.title,
          {marginBottom: `${(17 / height) * 100}%`},
        ]}>
        Next task
      </Text>
      {nextTask.isSetTime && (
        <View style={[styles.hours, {marginBottom: `${(17 / height) * 100}%`}]}>
          <Text style={[styles.font, styles.title]}>{hours}</Text>
        </View>
      )}
      <Text style={[styles.font, styles.details]}>{nextTask.name}</Text>
      <View
        style={{
          width: `${(49 / width) * 100}%`,
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: `${(18 / height) * 100}%`,
        }}>
        <Text
          adjustsFontSizeToFit
          // allowFontScaling
          // ellipsizeMode="tail"
          numberOfLines={1}
          style={[
            styles.font,
            styles.targetDate,
            {
              // width: `50%`,
              fontSize: 12,
              // paddingBottom: `${(18 / height) * 100}%`,
              // backgroundColor: 'white',
            },
          ]}>
          {formattedDate}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(NextTask);

const styles = StyleSheet.create({
  container: {},
  font: {
    fontFamily: constants.Fonts.text,
    textAlign: 'left',
  },
  title: {
    fontFamily: constants.Fonts.text_medium,
    color: constants.colors.BLACK,
  },
  hours: {
    alignSelf: 'flex-start',
    borderBottomColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 1,
  },
  details: {
    color: constants.colors.UNDER_LINE,
  },
  targetDate: {
    // flex: 1,
    textAlignVertical: 'bottom',
    color: constants.colors.UNDER_LINE,
  },
});
