import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Keyboard,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import constants, {CategoryListType} from '../../assets/constants';
import MyListsWrapper, {PADDING_HORIZONTAL} from './MyListsWrapper';
import BallonTxt, {gap} from '../../components/BallonTxt';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  useDeleteCategoriesMutation,
  useGetListsQuery,
} from '../../app/api/listApi';
import {ListRenderItemInfo} from 'react-native';
import {TouchableOpacity} from 'react-native';
import SVG from '../../assets/svg';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import BottomSheetDeleteModal, {
  BottomSheetDeleteModalHandles,
} from '../../components/BottomSheetDeleteModal';

type RootStackParamList = {
  ListAndNotes: {
    lists: any[];
    listsLoading: boolean;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ListAndNotes'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ListAndNotes'>;
const height = constants.HEIGHT * (71 / 896);
const width = constants.WIDTH * (71 / 414);
const NewCategory = () => {
  const navigation = useNavigation();
  const {
    data: lists,
    error: listsFetchError,
    isLoading: listsLoading,
  } = useGetListsQuery(undefined);
  const [isSelect, setIsSelect] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const bottomSheetRef = useRef<BottomSheetDeleteModalHandles>(null);

  const [deleteCategories, {isLoading}] = useDeleteCategoriesMutation();

  const DeleteCategories = React.useCallback(async () => {
    bottomSheetRef.current?.closeModal();
    toggleSelect();
    await deleteCategories(selected);
  }, [selected]);

  const handleSelected = React.useCallback((id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(_id => _id !== id);
      return [...prev, id];
    });
  }, []);

  const toggleSelect = React.useCallback(() => {
    setIsSelect(!isSelect);
    Vibration.vibrate(1);
    setSelected([]);
  }, [isSelect]);

  const navigateToAddCategory = useCallback(() => {
    navigation.navigate('NewListCategory' as never);
  }, []);

  const navigateToList = useCallback((index: number) => {
    navigation.navigate('MyLists' as never, {index} as never);
  }, []);

  const listSize = useMemo(() => {
    return lists?.length;
  }, [lists?.length]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('HomePage' as never);
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const openDeleteModal = React.useCallback(() => {
    bottomSheetRef.current?.openModal();
  }, []);

  const renderItem: ListRenderItem<CategoryListType> | null | undefined =
    React.useCallback(
      (props: ListRenderItemInfo<CategoryListType>) => {
        return (
          <BallonTxt
            txt={props.item.name}
            isSelectOn={isSelect}
            listSize={listSize || 0}
            onPress={navigateToList}
            id={props.item._id}
            selected={selected}
            handleSelect={handleSelected}
            toggleSelectOnOff={toggleSelect}
            {...props}
          />
        );
      },
      [isSelect, listSize, selected],
    );
  const keyExtractor = useCallback(
    (item: unknown, index: number) => (item as CategoryListType)._id,
    [],
  );
  return (
    <MyListsWrapper
      rightBtn={!isLoading}
      title="All my lists and notes"
      onSelectPress={isLoading ? undefined : toggleSelect}
      isSelected={isLoading ? undefined : isSelect}
      onRightBtnPress={isLoading ? undefined : navigateToAddCategory}
      isLoading={isLoading}>
      <View
        style={{
          height: '85%',
          // width: constants.WIDTH,
          // alignSelf: 'center',
          // borderWidth: 1.2,
          // borderTopWidth: 0,
          // borderColor: constants.colors.UNDER_LINE,
          // paddingHorizontal: PADDING_HORIZONTAL,
          // borderBottomLeftRadius: 50,
          // borderBottomRightRadius: 50,
          // overflow: 'hidden',
        }}>
        <FlatList
          data={lists}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.wordsContainer}
          contentContainerStyle={{width: '100%', paddingBottom: gap}}
          numColumns={2}
          columnWrapperStyle={{marginBottom: -21 + gap}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return listsLoading ? (
              <ActivityIndicator size={32} color={constants.colors.GREEN} />
            ) : (
              <Text style={styles.newTaskTitleInput}>
                No Lists yet, Create One By Clicking On Plus Icon
              </Text>
            );
          }}
        />
      </View>
      {isSelect && (
        <Animated.View
          entering={ZoomIn.duration(150)}
          exiting={ZoomOut.duration(150)}
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
        onDelete={DeleteCategories}
        ids={selected}
        ref={bottomSheetRef}
      />
    </MyListsWrapper>
  );
};

export default memo(NewCategory);

const styles = StyleSheet.create({
  wordsContainer: {
    // backgroundColor: 'cyan',

    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    // overflow: 'visible',
    // height: '95%',
  },
  textHeader: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
    fontSize: 25,
  },
  listContainerContent: {
    marginTop: '10%',
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
  innerBtnCircleCheckbox: {
    borderColor: constants.colors.BLACK,
    height: '15%',
    width: '15%',
    borderWidth: 1,
    borderRadius: 99,
    marginBottom: '4%',
    marginLeft: '13%',
  },
});
const innerBtnFillCircleCheckbox = StyleSheet.flatten([
  styles.innerBtnCircleCheckbox,
  {backgroundColor: constants.colors.BLACK},
]);
