import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import {CheckBoxListType} from '../screens/list/MyLists';
import SVG from '../assets/svg';

interface props {
  size: number;
  fill?: string;
  borderColor?: string;
  isElevation?: boolean;
  type?: CheckBoxListType;
}
export default function CheckBox({
  size,
  fill,
  borderColor,
  isElevation = true,
  type,
}: props) {
  const [isFilled, setIsFilled] = React.useState<boolean>(false);
  const onClick = () => {
    setIsFilled(prev => !prev);
  };
  const isNumber = type === 'NUMBERS';
  //   if (type === 'NUMBERS' || true) {
  //     return <Text style={{color: constants.Fonts.paragraph}}>1.</Text>;
  //   }
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderColor: isNumber ? 'transparent' : constants.colors.GREY,
          backgroundColor:
            type === 'DOTS'
              ? constants.colors.BLACK
              : constants.colors.OFF_WHITE,
          borderRadius: size / 2,
          elevation: isElevation ? 5 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 5,
        },
      ]}>
      {type === 'V' && isFilled && (
        <SVG.VIcon height={size / 1.2} width={size / 1.2} />
      )}
      {isNumber && (
        <Text
          style={{
            fontFamily: constants.Fonts.text,
            color: constants.colors.BLACK,
            fontSize: size / 1.2,
          }}>
          1.
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    // borderRadius: 9999,
    borderWidth: 1,
    borderColor: constants.colors.GREY,
  },
});
