import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ListRenderItem} from '@shopify/flash-list';
import constants, {ListsType} from '../assets/constants';
import {ListCategoryWidth} from '../screens/Home';

const RenderListCategoryHome:
  | ListRenderItem<ListsType>
  | null
  | undefined = props => {
  return (
    <View style={styles.myListCategory}>
      <Text style={styles.listTxt}>{props.item.name}</Text>
    </View>
  );
};

export default React.memo(RenderListCategoryHome);

const styles = StyleSheet.create({
  myListCategory: {
    width: ListCategoryWidth,
    padding: '0.1%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 5,
  },
  listTxt: {
    color: constants.colors.BGC,
    textAlign: 'center',
    fontSize: constants.WIDTH * 0.033,
    fontFamily: constants.Fonts.text,
  },
});
