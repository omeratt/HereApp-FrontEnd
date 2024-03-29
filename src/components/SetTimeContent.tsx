import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import constants from '../assets/constants';

type DateFormat = 'datetime' | 'time' | 'date';
interface Props {
  dateFormat?: DateFormat;
  /**
   * @param type which format to use in date picker
   * @param _isDateEnd should date picker use setTargetDate or setEndDate
   */
  onPress: (type: DateFormat, _isDateEnd: boolean) => void;
  title: string;
  buttonTxt: string;
}

const SetTimeContent: FC<Props> = ({onPress, title, buttonTxt, dateFormat}) => {
  return (
    <View style={styles.flexOneAndJustifyCenter}>
      <View style={styles.textAndToggleContainer}>
        <View style={styles.TxtAndToggleInSetTime}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              onPress(dateFormat || 'date', title === 'End Date');
            }}>
            <Text style={styles.btnTxt} numberOfLines={1}>
              {buttonTxt}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onPress(dateFormat || 'date', title === 'End Date');
            }}>
            <Text style={[styles.subSectionTxt]}>{title}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(SetTimeContent);

const styles = StyleSheet.create({
  textAndToggleContainer: {
    justifyContent: 'center',
  },
  flexOneAndJustifyCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  TxtAndToggleInSetTime: {
    paddingLeft: '5.2%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  subSectionTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text,
    fontSize: 14,
  },
  btn: {
    borderColor: constants.colors.GREY,
    borderWidth: 0.5,
    borderRadius: 15,
    width: constants.WIDTH * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  btnTxt: {
    color: constants.colors.UNDER_LINE,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: constants.Fonts.text,
  },
});
