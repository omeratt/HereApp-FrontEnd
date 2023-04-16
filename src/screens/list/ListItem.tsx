import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput as InputText,
} from 'react-native';
import React, {useCallback, useRef} from 'react';
import CheckBox from '../../components/CheckBox';
import Line from '../../components/Line';
import constants from '../../assets/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInput, {InputHandle} from '../../components/TextInput';
import {PADDING_HORIZONTAL} from './MyListsWrapper';
import {Action, CheckBoxListType, ListItemType} from './CreateOrEditList';

interface ListItemProps {
  iconSize?: number;
  isCheckBox?: boolean;
  showLine?: boolean;
  type: CheckBoxListType;
  index: number;
  flag?: boolean;
  description?: string;
  textPress?: (index: number) => void;
  inputTxt?: string;
  dispatch?: React.Dispatch<Action>;
  state?: ListItemType[];
  item: ListItemType;
  done?: boolean;
  listLength?: number;
  setDeleted?: React.Dispatch<React.SetStateAction<ListItemType[]>>;
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
  }, [isLast]);
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
  const onFlagPress = useCallback(() => {
    dispatch?.({type: 'FLAG', index, payload: 'change flag'});
  }, [dispatch, index]);
  const onCheckboxPress = useCallback(() => {
    dispatch?.({type: 'CHECK', index, payload: 'change checkbox'});
  }, [dispatch, index]);
  return (
    <View
      style={{
        marginBottom: '4%',
      }}>
      <View style={styles.topContainer}>
        {isCheckBox && (
          <CheckBox
            size={iconSize / 1.05}
            type={type}
            index={index + 1}
            isFilled={done}
            onPress={onCheckboxPress}
          />
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
                height: iconSize + 12,
                color: constants.colors.GREY,
              },
            ]}
            onFocus={focus}
            placeholder="Finish with ..."
            onBlur={blur}
            onChangeText={onChangeText}
          />
        ) : (
          <TouchableOpacity onPress={textPress && (() => textPress(index))}>
            <Text
              style={[
                styles.input,
                {
                  width,
                  fontSize: iconSize,
                  height: iconSize + 12,
                },
              ]}>
              {description}
            </Text>
          </TouchableOpacity>
        )}
        <Ionicons
          name={flag ? 'flag' : 'flag-outline'}
          // name={state?.[index]?.flag ? 'flag' : 'flag-outline'}
          size={iconSize}
          color={constants.colors.BGC}
          onPress={onFlagPress}
        />
      </View>
      {showLine && (
        <Line
          lengthPercentage={100}
          strength={1}
          lineColor={constants.colors.UNDER_LINE}
        />
      )}
    </View>
  );
};

export default React.memo(ListItem);

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    marginTop: 0,
    padding: 0,
    borderBottomWidth: 0,
    textAlignVertical: 'top',
    textAlign: 'left',
    height: '100%',
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
