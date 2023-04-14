import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CheckBox from '../../components/CheckBox';
import Line from '../../components/Line';
import constants from '../../assets/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInput from '../../components/TextInput';
import {PADDING_HORIZONTAL} from '../../components/MyListAndNotes';
import {CheckBoxListType} from './MyLists';

interface ListItemProps {
  iconSize?: number;
  isCheckBox?: boolean;
  showLine?: boolean;
  type: CheckBoxListType;
  index: number;
  flag?: boolean;
  description?: string;
}
const ListItem: React.FC<ListItemProps> = ({
  index,
  iconSize = 25,
  type,
  isCheckBox = true,
  showLine = true,
  flag,
  description,
}) => {
  const width = constants.WIDTH - PADDING_HORIZONTAL * 2 - iconSize * 2 - 20;
  return (
    <View style={{paddingBottom: '4%'}}>
      <View style={styles.topContainer}>
        {isCheckBox && (
          <CheckBox size={iconSize} type={type} index={index + 1} />
        )}
        {!description ? (
          <TextInput
            containerStyle={styles.inputContentStyle}
            style={[
              styles.input,
              {
                width,
                fontSize: iconSize,
                height: iconSize,
              },
            ]}
            placeholder="Please add your task...."
          />
        ) : (
          <Text
            style={[
              styles.input,
              {
                width,
                fontSize: iconSize,
                height: iconSize,
              },
            ]}>
            {description}
          </Text>
        )}
        <Ionicons
          name={flag ? 'flag' : 'flag-outline'}
          size={iconSize}
          color={constants.colors.BLACK}
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
    alignItems: 'flex-start',
  },
  input: {
    marginTop: 0,
    padding: 0,
    borderBottomWidth: 0,
    textAlignVertical: 'bottom',
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
  },
  inputContentStyle: {justifyContent: 'flex-start'},
});
