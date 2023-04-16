import {FlatList, StyleSheet} from 'react-native';
import React, {memo, useCallback, useEffect} from 'react';
import constants, {ListsType} from '../../assets/constants';
import MyListsWrapper from './MyListsWrapper';
import ListItem from './ListItem';
import {useGetListsQuery} from '../../app/api/listApi';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

type RootStackParamList = {
  MyLists: {index: number};
};
type MyListsRouteProp = RouteProp<RootStackParamList, 'MyLists'>;

const MyLists = () => {
  const index: number = useRoute<MyListsRouteProp>().params.index;
  const navigation = useNavigation();
  const navigateToList = useCallback(() => {
    const id = lists![index]._id;
    navigation.navigate('NewListTitle' as never, {id} as never);
  }, [index]);
  const navigateToEditList = useCallback(
    (listIndex: number) => {
      navigation.navigate(
        'CreateOrEditList' as never,
        {categoryIndex: index, listIndex} as never,
      );
    },
    [index],
  );
  const checkBoxSize = constants.HEIGHT * (24.95 / 896);
  const {
    data: lists,
    error: listsFetchError,
    isLoading: listsLoading,
  } = useGetListsQuery(undefined);

  return (
    <MyListsWrapper
      title={lists![index].name}
      rightBtn
      onRightBtnPress={navigateToList}>
      <FlatList
        data={lists![index].lists}
        renderItem={props => (
          <ListItem
            isCheckBox={false}
            showLine={false}
            flag={false}
            iconSize={checkBoxSize}
            type="NUMBERS"
            description={props.item.title}
            textPress={navigateToEditList}
            {...props}
          />
        )}
        style={styles.listContainerContent}
      />
    </MyListsWrapper>
  );
};

export default memo(MyLists);

const styles = StyleSheet.create({
  listContainerContent: {
    // paddingVertical: '7%',
  },
});
