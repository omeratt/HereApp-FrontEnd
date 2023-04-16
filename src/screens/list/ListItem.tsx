import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput as InputText,
} from 'react-native';
import React, {useRef} from 'react';
import CheckBox from '../../components/CheckBox';
import Line from '../../components/Line';
import constants from '../../assets/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInput, {InputHandle} from '../../components/TextInput';
import {PADDING_HORIZONTAL} from './MyListsWrapper';
import {CheckBoxListType} from './CreateOrEditList';

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
}
const ListItem: React.FC<ListItemProps> = ({
  index,
  iconSize = 25,
  type,
  isCheckBox = true,
  showLine = true,
  flag,
  description,
  textPress,
  inputTxt = '',
}) => {
  const width = constants.WIDTH - PADDING_HORIZONTAL * 2 - iconSize * 2 - 20;
  const textInputRef = useRef<InputHandle>(null);
  const InputRef = useRef<string>(inputTxt);
  return (
    <View
      style={{
        marginBottom: '4%',
        // height: 45,
        // backgroundColor: 'red',
        // borderWidth: 1,
        // justifyContent: 'center',
      }}>
      <View style={styles.topContainer}>
        {isCheckBox && (
          <CheckBox size={iconSize / 1.05} type={type} index={index + 1} />
        )}
        {!description ? (
          <TextInput
            ref={textInputRef}
            selectionColor={constants.colors.GREEN}
            cursorColor={constants.colors.GREEN}
            containerStyle={styles.inputContentStyle}
            value={InputRef.current}
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
          size={iconSize}
          color={constants.colors.BGC}
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

export default ListItem;

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
