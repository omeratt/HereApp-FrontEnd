import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import constants, {ListsType} from '../../assets/constants';
import SVG from '../../assets/svg';
import MyListsWrapper from './MyListsWrapper';
import ListItem from './ListItem';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useGetListsQuery} from '../../app/api/listApi';
import {InputHandle} from '../../components/TextInput';
import uuid from 'react-native-uuid';
// import { v4 as uuidv4 } from 'uuid';
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
  type: 'INPUT' | 'FLAG' | 'CHECK' | 'POP';
  index: number;
  payload: any;
}
function generateID(): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const idLength = 18;
  let id = '';
  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  return id;
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
    case 'CHECK':
      state[action.index].done = !state[action.index].done;
      // state[action.index].done = action.payload;
      return [...state];
    case 'POP':
      console.log(action.index, 'in pop');
      state.splice(action.index, 1);
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
      state[action.index].flag = !state[action.index].flag;
      return [...state];
    default:
      // console.log({action: action.type});
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
  const categoryIndex: number =
    useRoute<CreateOrEditListProp>().params.categoryIndex;
  const listIndex: number = useRoute<CreateOrEditListProp>().params.listIndex;

  const [state, dispatch] = useReducer(
    reducer,
    lists
      ? [...lists[categoryIndex].lists[listIndex].listItems, {...newItem}]
      : [],
  );
  const title =
    '' +
    lists![categoryIndex].name +
    ' ' +
    lists![categoryIndex].lists[listIndex].title;
  const lastIndex = useMemo(
    () => lists![categoryIndex].lists[listIndex].listItems.length,
    [lists![categoryIndex].lists[listIndex].listItems.length],
  );
  const [checkboxType, setCheckboxType] = useState<CheckBoxListType>('V');

  const onListItemTypePress = useCallback((type: CheckBoxListType) => {
    setCheckboxType(type);
  }, []);

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

  // const FooterComponent = useCallback(
  //   () => (
  //     <ListItem
  //       iconSize={checkBoxSize}
  //       type={checkboxType}
  //       flag={false}
  //       index={lastIndex}
  //       dispatch={dispatch}
  //     />
  //   ),
  //   [checkboxType, lastIndex, dispatch],
  // );
  console.log({state});
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
        // isLast={props.index === state.length - 1}
        listLength={state.length}
        // {...(props.index === state.length - 1 && {textInputRef})}
        {...props}
      />
    ),
    [state, checkboxType, checkBoxSize],
  );
  return (
    <MyListsWrapper title={title}>
      <FlatList
        // data={lists![categoryIndex].lists[listIndex].listItems}
        data={state}
        // ListFooterComponent={FooterComponent}
        keyExtractor={keyExtractor}
        renderItem={RenderItem}
        // extraData={state}
        style={styles.listContainerContent}
      />
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
