import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import constants from '../../assets/constants';
import {ISearchElementProps} from './types';
const {HEIGHT, WIDTH} = constants;
const paddingVertical = HEIGHT * (45 / 896);
const SearchElement: React.FC<ISearchElementProps> = ({items, title}) => {
  if (!items) return <React.Fragment />;
  return (
    <View style={styles.container}>
      <Text style={styles.titleTxt}>{title}</Text>
      {items.map(({data: {description, name}}, index) => {
        return (
          <View style={styles.txtContainer} key={index}>
            <Text numberOfLines={1} style={styles.dataName}>
              {name}
            </Text>
            <Text numberOfLines={1} style={styles.dataDesc}>
              {description}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default SearchElement;
const lineHeight = 24;
const maxWidth = '45%';
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
    // backgroundColor: 'cyan',
    textAlign: 'left',
  },
  dataName: {
    fontFamily: constants.Fonts.text,
    fontWeight: '800',
    color: constants.colors.OFF_WHITE,
    fontSize: 12,
    lineHeight,
    maxWidth,
    paddingLeft: 1.5,
  },
  dataDesc: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: 12,
    lineHeight,
    maxWidth,
    textAlign: 'left',
    width: maxWidth,
  },
  txtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
