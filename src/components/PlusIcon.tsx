import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {FC, memo} from 'react';
import SVG from '../assets/svg';
import constants from '../assets/constants';

interface Props {
  onPress?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}
const PlusIcon: FC<Props> = ({onPress, style, size}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <SVG.plusIconOutlined
        style={[styles.plusIcon, style]}
        fill={constants.colors.BGC}
        height={size || 18}
        width={size || 18}
      />
    </TouchableOpacity>
  );
};

export default memo(PlusIcon);

const styles = StyleSheet.create({
  container: {zIndex: 1},
  plusIcon: {
    color: constants.colors.BLACK,
    borderRadius: 9999,
    backgroundColor: constants.colors.OFF_WHITE,
    // elevation: 6,
  },
});
