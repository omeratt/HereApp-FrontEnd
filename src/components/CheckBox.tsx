import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import {CheckBoxListType} from '../screens/list/CreateOrEditList';
import SVG from '../assets/svg';

interface props {
  size: number;
  index?: number;
  type?: CheckBoxListType;
}
export default function CheckBox({size, type, index}: props) {
  const [isFilled, setIsFilled] = React.useState<boolean>(false);
  const onClick = () => {
    setIsFilled(prev => !prev);
  };
  const isNumber = type === 'NUMBERS';

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderColor: isNumber ? 'transparent' : constants.colors.BGC,
          backgroundColor:
            type === 'DOTS'
              ? constants.colors.BLACK
              : constants.colors.OFF_WHITE,
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
}

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
