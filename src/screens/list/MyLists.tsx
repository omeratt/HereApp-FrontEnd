import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import React, {memo, useCallback, useEffect} from 'react';
import constants, {ListType} from '../../assets/constants';
import MyListsWrapper from './MyListsWrapper';
import ListItem from './ListItem';
import {useEditListFlagMutation, useGetListsQuery} from '../../app/api/listApi';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

type RootStackParamList = {
  MyLists: {index: number; navFromHome: boolean | undefined};
};
type MyListsRouteProp = RouteProp<RootStackParamList, 'MyLists'>;

const MyLists = () => {
  const index: number = useRoute<MyListsRouteProp>().params.index;
  const navFromHome: boolean | undefined =
    useRoute<MyListsRouteProp>().params.navFromHome;
  const navigation = useNavigation();

  const navigateToList = useCallback(() => {
    const id = lists![index]._id;
    navigation.navigate('NewListTitle' as never, {id} as never);
  }, [index]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navFromHome) {
          navigation.navigate('HomePage' as never);
        } else {
          navigation.goBack();
        }
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );
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

  const [toggleFlag] = useEditListFlagMutation();
  const handleFlagPress = useCallback(
    async (itemIndex: number) => {
      if (!lists?.[index]?.lists?.[itemIndex]) return;
      const flags = lists[index].lists?.[itemIndex].flag;
      const item = lists[index].lists?.[itemIndex];
      await toggleFlag({
        id: lists[index].lists?.[itemIndex]._id,
        flag: !lists[index].lists?.[itemIndex].flag,
      });
    },
    [lists, index, toggleFlag],
  );
  const RenderItem = useCallback(
    (props: ListRenderItemInfo<ListType>) => (
      <ListItem
        isCheckBox={false}
        showLine={false}
        flag={lists?.[index].lists?.[props.index]?.flag}
        onFlagPress={handleFlagPress}
        iconSize={checkBoxSize}
        type="NUMBERS"
        description={props.item.title}
        textPress={navigateToEditList}
        {...props}
      />
    ),
    [lists, index, handleFlagPress, checkBoxSize, navigateToEditList],
  );
  return (
    <MyListsWrapper
      title={lists?.[index]?.name || 'loading...'}
      rightBtn
      onRightBtnPress={navigateToList}
      onDonePress={() => {
        navigation.goBack();
      }}>
      {listsLoading && <ActivityIndicator />}
      {lists && (
        <FlatList
          data={lists![index].lists}
          renderItem={props => <RenderItem {...props} />}
          style={styles.listContainerContent}
        />
      )}
    </MyListsWrapper>
  );
};

export default memo(MyLists);

const styles = StyleSheet.create({
  listContainerContent: {
    // paddingVertical: '7%',
  },
});
