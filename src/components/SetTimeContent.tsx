import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import constants from '../assets/constants';

type DateFormat = 'datetime' | 'time' | 'date';
interface Props {
  dateFormat?: DateFormat;
  onPress: (type?: DateFormat) => void;
  title: string;
  buttonTxt: string;
}

const SetTimeContent: FC<Props> = ({onPress, title, buttonTxt, dateFormat}) => {
  return (
    <View style={styles.flexOneAndJustifyCenter}>
      <View style={styles.textAndToggleContainer}>
        <View style={styles.TxtAndToggleInSetTime}>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnTxt} numberOfLines={1}>
              {buttonTxt}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onPress(dateFormat);
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
    fontSize: 12,
  },
  btn: {
    borderColor: constants.colors.GREY,
    borderWidth: 0.5,
    borderRadius: 15,
    width: constants.WIDTH * 0.29,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  btnTxt: {color: '#0500FF', textAlign: 'center'},
});
