import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ListRenderItem} from '@shopify/flash-list';
import constants, {ListsType} from '../assets/constants';
import {useNavigation} from '@react-navigation/native';
// import {ListCategoryWidth} from '../screens/Home';
const ListCategoryWidth = constants.WIDTH * 0.2925925996568468;

const RenderListCategoryHome:
  | ListRenderItem<ListsType>
  | null
  | undefined = props => {
  const navigation = useNavigation();
  const navigateToList = React.useCallback(() => {
    navigation.navigate(
      'ListAndNotesStack' as never,
      {
        screen: 'MyLists' as never,
        params: {index: props.index, navFromHome: true},
      } as never,
    );
  }, [props.index]);
  return (
    <Pressable onPress={navigateToList} style={styles.myListCategory}>
      <Text style={styles.listTxt}>{props.item.name}</Text>
    </Pressable>
  );
};

export default React.memo(RenderListCategoryHome);

const styles = StyleSheet.create({
  myListCategory: {
    width: ListCategoryWidth + 5,
    // height: 50,
    padding: '0.1%',
    marginRight: 5,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    elevation: 2,
  },
  listTxt: {
    color: constants.colors.BGC,
    textAlign: 'center',
    fontSize: constants.WIDTH * 0.033,
    fontFamily: constants.Fonts.text,
  },
});
