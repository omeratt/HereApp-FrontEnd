import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ListRenderItem} from '@shopify/flash-list';
import constants, {CategoryListType, ListType} from '../assets/constants';
import {useNavigation} from '@react-navigation/native';
// import {ListCategoryWidth} from '../screens/Home';
const ListCategoryWidth = constants.WIDTH * 0.2925925996568468;

const RenderListCategoryHome:
  | ListRenderItem<ListType>
  | null
  | undefined = props => {
  const navigation = useNavigation();
  const findCategoryIndex = () => {
    const listIndex = (props.extraData.lists as CategoryListType[]).findIndex(
      list => list._id === props.item.categoryId,
    );
    return listIndex;
  };
  const findListIndexInCategory = (categoryIndex: number) => {
    const listIndex = (props.extraData.lists as CategoryListType[])[
      categoryIndex
    ]?.lists?.findIndex(list => list._id === props.item._id);
    return listIndex;
  };
  const navigateToList = React.useCallback(() => {
    const categoryIndex = findCategoryIndex();
    const listIndex = findListIndexInCategory(categoryIndex);
    navigation.navigate(
      'ListAndNotesStack' as never,
      {
        screen: 'CreateOrEditList' as never,
        params: {categoryIndex, listIndex, navFromHome: true} as never,
      } as never,
    );
  }, [props.index]);
  return (
    <Pressable onPress={navigateToList} style={styles.myListCategory}>
      <Text numberOfLines={1} style={styles.listTxt}>
        {props.item.title}
      </Text>
    </Pressable>
  );
};

export default React.memo(RenderListCategoryHome);

const styles = StyleSheet.create({
  myListCategory: {
    width: ListCategoryWidth + 5,
    height: '100%',
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
    fontSize: constants.rf(13),
    fontFamily: constants.Fonts.text,
  },
});
