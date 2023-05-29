import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import constants from '../../assets/constants';
const {HEIGHT, WIDTH} = constants;
const paddingVertical = HEIGHT * (45 / 896);
const SearchElement: React.FC<ISearchElementProps> = ({data, title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleTxt}>{title}</Text>
      {data.map(({description, name}, index) => {
        return (
          <View style={styles.txtContainer} key={index}>
            <Text style={styles.dataName}>{name}</Text>
            <Text style={styles.dataDesc}>{description}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default SearchElement;
const lineHeight = 22;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical,
  },
  titleTxt: {
    fontFamily: constants.Fonts.text,
    // fontWeight: '800',
    color: constants.colors.UNDER_LINE,
    fontSize: 12,
    lineHeight,
  },
  dataName: {
    fontFamily: constants.Fonts.text,
    fontWeight: '800',
    color: constants.colors.OFF_WHITE,
    fontSize: 12,
    lineHeight,
  },
  dataDesc: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: 12,
    lineHeight,
  },
  txtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
