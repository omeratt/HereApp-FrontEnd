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
  item?: any;
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
}) => {
  const width = constants.WIDTH - PADDING_HORIZONTAL * 2 - iconSize * 2 - 20;
  const textInputRef = useRef<InputHandle>(null);
  const onChangeText = useCallback(
    (value: string) => {
      dispatch?.({type: 'INPUT', index, payload: value});
    },
    [dispatch],
  );
  const onFlagPress = useCallback(() => {
    dispatch?.({type: 'FLAG', index, payload: 'change flag'});
  }, [dispatch]);
  const onCheckboxPress = useCallback(() => {
    dispatch?.({type: 'CHECK', index, payload: 'change checkbox'});
  }, [dispatch]);
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
            isFilled={state?.[index].done}
            onPress={onCheckboxPress}
          />
        )}
        {!description ? (
          <TextInput
            ref={textInputRef}
            selectionColor={constants.colors.GREEN}
            cursorColor={constants.colors.GREEN}
            containerStyle={styles.inputContentStyle}
            //TODO: MAKE INPUT BUG
            value={state ? state[index]?.description : 'inputTxt'}
            // value={inputTxt}
            style={[
              styles.input,
              {
                width,
                fontSize: iconSize / 1.1,
                height: iconSize + 12,
                color: constants.colors.GREY,
              },
            ]}
            placeholder="Finish with ..."
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
          name={state?.[index]?.flag ? 'flag' : 'flag-outline'}
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
