import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
  useEffect,
} from 'react';
import constants from '../../assets/constants';
import SVG from '../../assets/svg';
import MyListsWrapper from './MyListsWrapper';
import ListItem from './ListItem';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useAddListItemMutation, useGetListsQuery} from '../../app/api/listApi';
import {InputHandle} from '../../components/TextInput';
import uuid from 'react-native-uuid';
export type CheckBoxListType = 'NUMBERS' | 'DOTS' | 'V' | 'NONE';

type RootStackParamList = {
  CreateOrEditList: {categoryIndex: number; listIndex: number};
};
export interface ListItemType {
  _id?: string;
  description?: string;
  done?: boolean;
  flag?: boolean;
  new?: boolean;
}

export interface Action {
  type: 'INPUT' | 'FLAG' | 'CHECK' | 'POP' | 'PUSH' | 'SET';
  index?: number;
  payload: any;
}

type CreateOrEditListProp = RouteProp<RootStackParamList, 'CreateOrEditList'>;
const newItem: ListItemType = {
  description: '',
  done: false,
  flag: false,
  new: true,
  _id: uuid.v4() + '',
};
const reducer = (state: ListItemType[], action: Action) => {
  switch (action.type) {
    case 'SET':
      state =
        action.payload?.length > 0
          ? action.payload
          : [{...newItem, _id: uuid.v4() + ''}];
      return [...state];
    case 'CHECK':
      action.index && (state[action.index].done = !state[action.index].done);
      return [...state];
    case 'POP':
      action.index && state.splice(action.index, 1);
      return [...state];
    case 'PUSH':
      action.index &&
        state.splice(action.index + 1, 0, {...newItem, _id: uuid.v4() + ''});
      return [...state];
    case 'INPUT':
      if (action.index === state.length - 1) {
        state.push({...newItem, _id: uuid.v4() + ''});
        return [...state];
      }
      return state.map((item, index) => {
        if (index === action.index) {
          return {...item, description: action.payload};
        }
        return item;
      });
    case 'FLAG':
      action.index && (state[action.index].flag = !state[action.index].flag);
      return [...state];
    default:
      return state;
  }
};

const checkBoxSize = constants.HEIGHT * (26.95 / 896);
const height = constants.HEIGHT * (71 / 896);
const width = constants.WIDTH * (71 / 414);
const CreateOrEditList = () => {
  const textInputRef = useRef<InputHandle>(null);
  const {
    data: lists,
    error: listsFetchError,
    isLoading: listsLoading,
  } = useGetListsQuery(undefined);
  const [addItemSubmit, {isLoading, isError, isSuccess}] =
    useAddListItemMutation(undefined);

  const categoryIndex: number =
    useRoute<CreateOrEditListProp>().params.categoryIndex;
  const listIndex: number = useRoute<CreateOrEditListProp>().params.listIndex;

  const [deleted, setDeleted] = React.useState<ListItemType[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const [state, dispatch] = useReducer(
    reducer,
    lists
      ? [...lists[categoryIndex].lists[listIndex].listItems, {...newItem}]
      : [],
  );
  const title = lists?.[categoryIndex].name
    ? '' +
      lists![categoryIndex].name +
      ' ' +
      lists![categoryIndex].lists[listIndex].title
    : 'loading...';

  const [checkboxType, setCheckboxType] = useState<CheckBoxListType>('V');
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const nav = useNavigation();
  const handleSubmit = useCallback(async () => {
    const items = {
      listId: lists![categoryIndex].lists[listIndex]._id,
      items: state,
      deleted,
    };
    addItemSubmit(items)
      .then(data => {
        nav.goBack();
      })
      .catch(error => {
        console.log('error on handleSubmit add items, error', state);
      });
  }, [addItemSubmit, state, deleted]);
  const onListItemTypePress = useCallback((type: CheckBoxListType) => {
    setCheckboxType(type);
  }, []);

  useEffect(() => {
    if (state.length > 0) return;
    const items = lists
      ? lists[categoryIndex]?.lists[listIndex]?.listItems
      : [];
    dispatch({type: 'SET', index: listIndex, payload: items});
  }, [lists]);

  const onVCheckboxPress = useCallback(
    () => onListItemTypePress('V'),
    [onListItemTypePress],
  );
  const onDotsCheckboxPress = useCallback(
    () => onListItemTypePress('DOTS'),
    [onListItemTypePress],
  );
  const onNumbersCheckboxPress = useCallback(
    () => onListItemTypePress('NUMBERS'),
    [onListItemTypePress],
  );

  const keyExtractor: (item: ListItemType, index: number) => string =
    useCallback((item: ListItemType) => item._id!, [state]);
  const RenderItem: ListRenderItem<ListItemType> = useCallback(
    props => (
      <ListItem
        iconSize={checkBoxSize}
        type={checkboxType}
        flag={state[props.index].flag}
        done={state[props.index].done}
        inputTxt={state[props.index].description}
        dispatch={dispatch}
        listLength={state.length}
        setDeleted={setDeleted}
        currentFocusIndex={currentFocusIndex}
        setCurrentFocusIndex={setCurrentFocusIndex}
        flatListRef={flatListRef.current}
        {...props}
      />
    ),
    [state, checkboxType, checkBoxSize, currentFocusIndex],
  );
  return (
    <MyListsWrapper
      title={title}
      isLoading={isLoading}
      onDonePress={handleSubmit}>
      <View style={{height: '82%'}}>
        {state ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            // data={lists![categoryIndex].lists[listIndex].listItems}
            data={state}
            // ListFooterComponent={FooterComponent}
            keyExtractor={keyExtractor}
            renderItem={RenderItem}
            // extraData={state}
            // contentContainerStyle={{flex: 1}}
            style={styles.listContainerContent}
          />
        ) : (
          <ActivityIndicator color={'black'} size={'large'} />
        )}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '3%',
          // backgroundColor: 'red',
        }}>
        <SVG.ArrowDown />
      </View>
      <View style={styles.listContainerFooter}>
        <TouchableOpacity
          style={[styles.containerFooterBtn, {height, width}]}
          onPress={onVCheckboxPress}>
          <View style={styles.innerBtnCircleCheckbox} />
          <View style={styles.innerBtnCircleCheckbox} />
          <View style={styles.innerBtnCircleCheckbox} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.containerFooterBtn, {height, width}]}
          onPress={onDotsCheckboxPress}>
          <View style={innerBtnFillCircleCheckbox} />
          <View style={innerBtnFillCircleCheckbox} />
          <View style={innerBtnFillCircleCheckbox} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.containerFooterBtn, {height, width}]}
          onPress={onNumbersCheckboxPress}>
          <SVG.NumCheckbox style={{marginLeft: '13%'}} />
        </TouchableOpacity>
      </View>
    </MyListsWrapper>
  );
};

export default memo(CreateOrEditList);
const styles = StyleSheet.create({
  listContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '100%',
  },
  textHeader: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
    fontSize: 25,
  },
  listContainerContent: {
    // marginTop: '10%',
    // height: '91%',
  },
  newTaskTitleInput: {
    borderWidth: 0,
    fontSize: 20,
    color: constants.colors.UNDER_LINE,
    alignItems: 'center',
    textAlignVertical: 'center',
    fontFamily: constants.Fonts.text,
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
