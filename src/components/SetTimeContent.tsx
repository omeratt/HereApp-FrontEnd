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
    <View style={[styles.flexOneAndJustifyCenter]}>
      <View style={styles.textAndToggleContainer}>
        <View style={styles.TxtAndToggleInSetTime}>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnTxt}>{buttonTxt}</Text>
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
  textAndToggle: {
    paddingHorizontal: '5.2%',
    // flexDirection: 'row-reverse',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // height: '100%',
  },
  textAndToggleContainer: {
    // flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'yellow',
  },
  flexOneAndJustifyCenter: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  sectionTxt: {
    color: constants.colors.BLACK,
    fontFamily: constants.Fonts.text,
    fontSize: 18,
    // marginBottom: '1%',
  },
  TxtAndToggleInSetTime: {
    // padding: '5.2%',
    // paddingRight: '5.2%',
    paddingLeft: '5.2%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',

    // backgroundColor: 'yellow',
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
    width: '32%',
    alignItems: 'center',
  },
  btnTxt: {color: '#0500FF', textAlign: 'center'},
});
