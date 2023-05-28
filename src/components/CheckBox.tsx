import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import {CheckBoxListType} from '../screens/list/CreateOrEditList';
import SVG from '../assets/svg';

interface props {
  size: number;
  index?: number;
  isFilled?: boolean;
  onPress?: () => void;
  type?: CheckBoxListType;
  colorFill?: string;
}
const CheckBox = ({
  size,
  type,
  index,
  onPress,
  isFilled,
  colorFill = constants.colors.BGC,
}: props) => {
  const isNumber = type === 'NUMBERS';

  const backgroundColor = React.useMemo(() => {
    if (type === 'DOTS') {
      return constants.colors.BLACK;
    } else if (!type && isFilled !== undefined) {
      //normal checkBox

      return isFilled ? colorFill : constants.colors.OFF_WHITE;
    } else return constants.colors.OFF_WHITE;
  }, [isFilled]);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderColor: isNumber ? 'transparent' : constants.colors.BLACK,
          backgroundColor,
          borderRadius: size / 2,
        },
      ]}>
      {type === 'V' && isFilled && (
        <SVG.VIcon height={size / 1.4} width={size / 1.4} />
      )}
      {isNumber && (
        <Text
          style={{
            fontFamily: constants.Fonts.text,
            color: constants.colors.BLACK,
            fontSize: size / 1.4,
          }}>
          {`${index}.`}
        </Text>
      )}
    </TouchableOpacity>
  );
};
export default React.memo(CheckBox);
const styles = StyleSheet.create({
  circle: {
    // borderRadius: 9999,
    borderWidth: 1.2,
    borderColor: constants.colors.BGC,
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: '1.5%',
  },
});
