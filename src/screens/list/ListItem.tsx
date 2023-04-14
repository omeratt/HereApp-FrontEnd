import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CheckBox from '../../components/CheckBox';
import Line from '../../components/Line';
import constants from '../../assets/constants';
import Feather from 'react-native-vector-icons/Feather';
import TextInput from '../../components/TextInput';
import {PADDING_HORIZONTAL} from '../../components/MyListAndNotes';

interface ListItemProps {
  iconSize: number;
}
const ListItem: React.FC<ListItemProps> = ({iconSize}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <CheckBox size={iconSize} isElevation={false} type={'DOTS'} />
        <TextInput
          containerStyle={{justifyContent: 'flex-start'}}
          style={{
            // backgroundColor: 'cyan',
            marginTop: 0,
            padding: 0,
            borderBottomWidth: 0,
            width: constants.WIDTH - PADDING_HORIZONTAL * 2 - iconSize * 2 - 20,
            fontSize: iconSize,
            textAlignVertical: 'bottom',
            height: iconSize,
          }}
          placeholder="hahahahaha"
        />
        <Feather name="flag" size={iconSize} color={'black'} />
      </View>
      <Line
        lengthPercentage={100}
        strength={1}
        rotate180
        lineColor={constants.colors.UNDER_LINE}
      />
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({});
