import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
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
import constants from '../../assets/constants';
import MyListsWrapper from './MyListsWrapper';
import BallonTxt, {gap} from '../../components/BallonTxt';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useGetListsQuery} from '../../app/api/listApi';

type RootStackParamList = {
  ListAndNotes: {
    lists: any[];
    listsLoading: boolean;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ListAndNotes'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ListAndNotes'>;

const NewCategory = () => {
  const navigation = useNavigation();
  const {
    data: lists,
    error: listsFetchError,
    isLoading: listsLoading,
  } = useGetListsQuery(undefined);
  const navigateToAddCategory = useCallback(() => {
    navigation.navigate('NewListCategory' as never);
  }, []);
  const navigateToList = useCallback((index: number) => {
    navigation.navigate('MyLists' as never, {index} as never);
  }, []);
  const listSize = useMemo(() => {
    return lists?.length;
  }, [lists?.length]);
  return (
    <MyListsWrapper
      rightBtn
      title="All my lists and notes"
      onRightBtnPress={navigateToAddCategory}>
      <FlatList
        data={lists}
        renderItem={props => (
          <BallonTxt
            txt={props.item.name}
            listSize={listSize || 0}
            onPress={navigateToList}
            {...props}
          />
        )}
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
});
