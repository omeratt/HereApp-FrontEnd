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
  useEffect,
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
export type CheckBoxListType = 'NUMBERS' | 'DOTS' | 'V' | 'NONE';

type RootStackParamList = {
  CreateOrEditList: {categoryIndex: number; listIndex: number};
};
export interface ListItemType {
  _id?: string;
  description?: string;
  done?: boolean;
  flag?: boolean;
}

// export interface P {
//   type: 'INPUT' | 'FLAG' | 'CHECK';
//   // index: number;
//   payload: any;
// }
export interface Action {
  type: 'INPUT' | 'FLAG' | 'CHECK';
  index: number;
  payload: any;
}
type CreateOrEditListProp = RouteProp<RootStackParamList, 'CreateOrEditList'>;
const reducer = (state: ListItemType[], action: Action) => {
  switch (action.type) {
    case 'CHECK':
      state[action.index].done = !state[action.index].done;
      // state[action.index].done = action.payload;
      return [...state];
    case 'INPUT':
      // state[action.index].description = action.payload;
      // return state;
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
  const {
    data: lists,
    error: listsFetchError,
    isLoading: listsLoading,
  } = useGetListsQuery(undefined);
  const categoryIndex: number =
    useRoute<CreateOrEditListProp>().params.categoryIndex;
  const listIndex: number = useRoute<CreateOrEditListProp>().params.listIndex;

  // dispatch({type:'INPUT', payload:  item});
  const [state, dispatch] = useReducer(
    reducer,
    lists ? [...lists[categoryIndex].lists[listIndex].listItems] : [],
  );
  // console.log(state);
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

  const FooterComponent = useCallback(
    () => (
      <ListItem
        iconSize={checkBoxSize}
        type={checkboxType}
        flag={false}
        index={lastIndex}
      />
    ),
    [checkboxType, lastIndex],
  );
  const keyExtractor: (item: ListItemType, index: number) => string =
    useCallback((item: ListItemType) => item._id!, []);
  const RenderItem: ListRenderItem<ListItemType> = useCallback(
    props => (
      <ListItem
        iconSize={checkBoxSize}
        type={checkboxType}
        flag={state[props.index].flag}
        done={state[props.index].done}
        inputTxt={state[props.index].description}
        dispatch={dispatch}
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
        ListFooterComponent={FooterComponent}
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
