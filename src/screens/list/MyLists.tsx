import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  StyleSheet,
  // ListRenderItemInfo,
  Vibration,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import constants, {ListType} from '../../assets/constants';
import MyListsWrapper from './MyListsWrapper';
import ListItem from './ListItem';
import {
  useDeleteManyListInCategoryMutation,
  useEditListFlagMutation,
  useGetListsQuery,
} from '../../app/api/listApi';
import {
  CommonActions,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import Animated, {
  ZoomIn,
  ZoomInDown,
  ZoomInEasyDown,
  ZoomInEasyUp,
  ZoomOut,
  ZoomOutEasyDown,
  ZoomOutEasyUp,
} from 'react-native-reanimated';
import SVG from '../../assets/svg';
import BottomSheetDeleteModal, {
  BottomSheetDeleteModalHandles,
} from '../../components/BottomSheetDeleteModal';

type RootStackParamList = {
  MyLists: {index: number; navFromHome: boolean | undefined};
};
type MyListsRouteProp = RouteProp<RootStackParamList, 'MyLists'>;
const height = constants.HEIGHT * (71 / 896);
const width = constants.WIDTH * (71 / 414);
const MyLists = () => {
  const index: number = useRoute<MyListsRouteProp>().params.index;
  const navFromHome: boolean | undefined =
    useRoute<MyListsRouteProp>().params.navFromHome;
  const navigation = useNavigation();
  const [isSelect, setIsSelect] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [deleteManyListInCategory, {isLoading: deleteManyListLoading}] =
    useDeleteManyListInCategoryMutation();
  const toggleSelect = React.useCallback(() => {
    setIsSelect(!isSelect);
    Vibration.vibrate(1);
    setSelected([]);
  }, [isSelect]);
  const bottomSheetRef = useRef<BottomSheetDeleteModalHandles>(null);
  const navigateToList = useCallback(() => {
    const id = lists![index]._id;
    navigation.dispatch(
      CommonActions.navigate({
        name: 'NewListTitle',
        params: {
          id,
        },
      }),
    );
  }, [index, navigation]);

  const openDeleteModal = React.useCallback(() => {
    bottomSheetRef.current?.openModal();
  }, []);

  const handleSelected = React.useCallback((id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(_id => _id !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelect) setIsSelect(false);
        else if (navFromHome) {
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
    }, [navigation, isSelect]),
  );
  const navigateToEditList = useCallback(
    (listIndex: number) => {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'CreateOrEditList',
          params: {
            categoryIndex: index,
            listIndex,
          },
        }),
      );
    },
    [index, navigation],
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
  const showLine = true;
  const RenderItem = useCallback(
    (props: ListRenderItemInfo<ListType>) => {
      // const isSelected = React.useMemo(() => {
      //   console.log(selected?.includes(props.item._id!));
      //   return selected?.includes(props.item._id!);
      // }, [selected, props.item._id, index]);
      // useEffect(() => {
      //   console.log('first');
      // }, [isSelected, selected]);
      return (
        <ListItem
          isCheckBox={isSelect}
          showLine={showLine}
          flag={props.item.flag}
          onFlagPress={handleFlagPress}
          iconSize={checkBoxSize}
          description={props.item.title}
          textPress={navigateToEditList}
          selected={selected}
          // done={isSelected}
          handleSelect={handleSelected}
          // item={props.item}
          // index={props.index}
          {...props}
        />
      );
    },
    [
      lists,
      index,
      handleFlagPress,
      checkBoxSize,
      navigateToEditList,
      // isSelect,
      // selected,
      // showLine,
    ],
  );
  // const keyExtractor = useCallback(
  //   (item: unknown, index: number) => (item as ListType)._id,
  //   [selected, showLine, selected],
  // );
  const keyExtractor: (item: ListType, index: number) => string = useCallback(
    (item: ListType) => item._id!,
    [],
  );
  const handleDelete = useCallback(async () => {
    setIsSelect(false);
    bottomSheetRef.current?.closeModal();
    await deleteManyListInCategory(selected);
  }, [bottomSheetRef, deleteManyListInCategory, selected]);

  return (
    <MyListsWrapper
      title={lists?.[index]?.name || 'loading...'}
      rightBtn={!deleteManyListLoading}
      onSelectPress={deleteManyListLoading ? undefined : toggleSelect}
      isSelected={deleteManyListLoading ? undefined : isSelect}
      onRightBtnPress={deleteManyListLoading ? undefined : navigateToList}
      isLoading={deleteManyListLoading}
      onDonePress={() => {
        navigation.goBack();
      }}>
      {lists && (
        <FlashList
          data={lists![index].lists}
          keyExtractor={keyExtractor}
          renderItem={props => <RenderItem {...props} />}
          estimatedItemSize={40}
          extraData={{selected, showLine, isSelect}}
          ListEmptyComponent={() => {
            return listsLoading ? (
              <ActivityIndicator size={32} color={constants.colors.GREEN} />
            ) : (
              <Text style={styles.newTaskTitleInput}>No Lists</Text>
            );
          }}
        />
      )}
      {isSelect && (
        <Animated.View
          entering={ZoomInEasyDown.duration(250)}
          exiting={ZoomOutEasyDown.duration(250)}
          style={styles.listContainerFooter}>
          <TouchableOpacity
            style={[styles.containerFooterBtn, {height, width}]}
            // onPress={onVCheckboxPress}
          >
            {selected.length > 0 ? (
              <SVG.TrashBlack onPress={openDeleteModal} />
            ) : (
              <SVG.Trash />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.containerFooterBtn, {height, width}]}
            // onPress={onDotsCheckboxPress}
          ></TouchableOpacity>
          <TouchableOpacity
            style={[styles.containerFooterBtn, {height, width}]}
            // onPress={onNumbersCheckboxPress}
          ></TouchableOpacity>
        </Animated.View>
      )}
      <BottomSheetDeleteModal
        onDelete={handleDelete}
        ids={selected}
        ref={bottomSheetRef}
      />
    </MyListsWrapper>
  );
};

export default memo(MyLists);

const styles = StyleSheet.create({
  listContainerContent: {
    // paddingVertical: '7%',
  },
  newTaskTitleInput: {
    borderWidth: 0,
    fontSize: 20,
    color: constants.colors.UNDER_LINE,
    alignItems: 'center',
    textAlignVertical: 'center',
    fontFamily: constants.Fonts.text,
    marginLeft: '2%',
  },
  listContainerFooter: {
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    width: '80%',
    height: '9%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'cyan',
  },
  containerFooterBtn: {
    borderWidth: 0.5,
    borderRadius: 20,
    backgroundColor: constants.colors.OFF_WHITE,
    borderColor: constants.colors.UNDER_LINE,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
