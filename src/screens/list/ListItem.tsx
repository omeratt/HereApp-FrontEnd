import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput as InputText,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  FlatList,
  ListRenderItemInfo as flatListProps,
} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import CheckBox from '../../components/CheckBox';
import Line from '../../components/Line';
import constants, {ListType} from '../../assets/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInput, {InputHandle} from '../../components/TextInput';
import {PADDING_HORIZONTAL} from './MyListsWrapper';
import {Action, CheckBoxListType, ListItemType} from './CreateOrEditList';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  SequencedTransition,
  ZoomIn,
  ZoomInLeft,
  ZoomInRight,
  ZoomOut,
  ZoomOutLeft,
} from 'react-native-reanimated';
import {ListRenderItemInfo} from '@shopify/flash-list';

// type x = ListRenderItemInfo<ListType> | flatListProps<ListType>;
interface ListItemProps extends ListRenderItemInfo<ListType> {
  iconSize?: number;
  isCheckBox?: boolean;
  showLine?: boolean;
  type?: CheckBoxListType;
  // index: number;
  flag?: boolean;
  description?: string;
  textPress?: (index: number) => void;
  inputTxt?: string;
  dispatch?: React.Dispatch<Action>;
  state?: ListItemType[];
  // item: ListItemType;
  done?: boolean;
  listLength?: number;
  setDeleted?: React.Dispatch<React.SetStateAction<ListItemType[]>>;
  currentFocusIndex?: number;
  setCurrentFocusIndex?: React.Dispatch<React.SetStateAction<number>>;
  flatListRef?: FlatList<ListItemType> | null;
  onFlagPress?: (itemIndex: number) => void;
  handleSelect?: (id: string) => void;
  selected?: string[];
}
const ListItem: React.FC<ListItemProps> = ({
  item,
  index,
  iconSize = 25,
  type,
  isCheckBox = true,
  showLine = true,
  flag,
  description,
  textPress,
  inputTxt = '',
  dispatch,
  state,
  done,
  listLength,
  setDeleted,
  currentFocusIndex,
  setCurrentFocusIndex,
  flatListRef,
  onFlagPress,
  handleSelect,
  selected,
  extraData,
}) => {
  const width = constants.WIDTH - PADDING_HORIZONTAL * 2 - iconSize * 2 - 20;
  const isLast = React.useMemo(
    () => listLength && index === listLength - 1,
    [listLength],
  );
  const textInputRef = useRef<InputHandle>(null);
  const focus = useCallback(() => {
    if (!isLast) return;

    dispatch?.({type: 'INPUT', index, payload: ''});
  }, [isLast, index]);

  const blur = useCallback(() => {
    if (isLast || inputTxt.length > 0) return;
    if (!item.new) setDeleted?.(prev => [...prev, item]);
    dispatch?.({type: 'POP', index, payload: ''});
  }, [listLength, inputTxt, isLast, index]);

  const onChangeText = useCallback(
    (value: string) => {
      dispatch?.({type: 'INPUT', index, payload: value});
    },
    [dispatch, index],
  );

  const onEnter = useCallback(() => {
    if (!inputTxt) return;
    dispatch?.({type: 'PUSH', index, payload: ''});
    flatListRef?.scrollToIndex({index: index + 1});
    setCurrentFocusIndex?.(index + 1);
  }, [index, isLast, inputTxt]);

  useEffect(() => {
    if (currentFocusIndex === undefined) return;
    if (currentFocusIndex >= 0 && currentFocusIndex === index) {
      flatListRef?.scrollToIndex({index});
      setTimeout(() => {
        textInputRef.current?.onFocus();
      }, 250);
      setCurrentFocusIndex?.(-1);
    }
  }, [currentFocusIndex]);
  const handleFlagPress = useCallback(() => {
    if (onFlagPress) onFlagPress?.(index);
    else dispatch?.({type: 'FLAG', index, payload: 'change flag'});
  }, [dispatch, index, onFlagPress]);
  const onCheckboxPress = useCallback(() => {
    dispatch?.({type: 'CHECK', index, payload: 'change checkbox'});
  }, [dispatch, index]);

  const isSelected = React.useMemo(() => {
    return extraData?.selected?.includes(item._id!);
  }, [extraData?.selected, item._id, index]);

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (index === 0 || isLast) return;
      if (e.nativeEvent.key === 'Backspace' && inputTxt === '') {
        // console.log('User tried to delete an empty value');
        textInputRef.current?.blur();
        // blur();
        dispatch?.({type: 'POP', index, payload: ''});
        // setTimeout(() => {
        setCurrentFocusIndex?.(index - 1);
        // }, 0);
      }
    },
    [inputTxt, index, isLast],
  );
  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutLeft}
      layout={SequencedTransition}
      style={{
        marginBottom: '4%',
        height: 40,
      }}>
      <View style={styles.topContainer}>
        {(isCheckBox || extraData?.isSelect) && (
          <Animated.View
            entering={ZoomInLeft.duration(250)}
            layout={SequencedTransition}
            exiting={ZoomOutLeft.duration(600)}>
            <CheckBox
              size={iconSize / 1.05}
              type={type}
              index={index + 1}
              isFilled={isSelected !== undefined ? isSelected : done}
              colorFill={constants.colors.GREEN}
              onPress={
                handleSelect ? () => handleSelect(item._id!) : onCheckboxPress
              }
            />
          </Animated.View>
        )}
        {!description ? (
          <TextInput
            ref={textInputRef}
            selectionColor={constants.colors.GREEN}
            cursorColor={constants.colors.GREEN}
            containerStyle={styles.inputContentStyle}
            value={inputTxt}
            style={[
              styles.input,
              {
                width,
                fontSize: iconSize / 1.1,
                height: iconSize + 3,
                color: constants.colors.GREY,
              },
            ]}
            onFocus={focus}
            placeholder=""
            onBlur={blur}
            onChangeText={onChangeText}
            onSubmitEditing={onEnter}
            onKeyPress={handleKeyPress}
          />
        ) : (
          <TouchableOpacity
            onPress={
              extraData?.isSelect
                ? () => handleSelect?.(item._id)
                : textPress && (() => textPress(index))
            }>
            <Animated.Text
              layout={SequencedTransition}
              style={[
                styles.input,
                {
                  width,
                  fontSize: iconSize,
                  height: iconSize + 12,
                  // height: iconSize / 1.05,
                },
              ]}>
              {description}
            </Animated.Text>
          </TouchableOpacity>
        )}
        <Ionicons
          name={flag ? 'flag' : 'flag-outline'}
          // name={state?.[index]?.flag ? 'flag' : 'flag-outline'}
          size={iconSize}
          color={constants.colors.BGC}
          onPress={handleFlagPress}
        />
      </View>
      {showLine && (
        <Line
          lengthPercentage={100}
          strength={1}
          lineColor={constants.colors.UNDER_LINE}
        />
      )}
    </Animated.View>
  );
};

export default React.memo(ListItem);
// export default React.memo(ListItem);

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1%',
  },
  input: {
    marginTop: 0,
    padding: 0,
    borderBottomWidth: 0,
    textAlignVertical: 'center',
    textAlign: 'left',
    fontFamily: constants.Fonts.text,
    color: constants.colors.BGC,
  },
  inputContentStyle: {
    // justifyContent: 'flex-start'
    // height: '100%',
    // backgroundColor: 'red',
    marginLeft: 15,
  },
});
