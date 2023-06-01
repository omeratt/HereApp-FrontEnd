import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import constants from '../../assets/constants';
import Pizza from '../playGround/Pizza';

const NextTask: React.FC = () => {
  const [size, setSize] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const {height, width} = e.nativeEvent.layout;
    const fixeDim = height > width ? width : height;
    setSize(fixeDim * 0.85);
  };
  return (
    <View onLayout={onLayout} style={styles.container}>
      {size !== 0 && (
        <Pizza
          size={size}
          backgroundColor={constants.colors.OFF_WHITE}
          borderColor={constants.colors.UNDER_LINE}
        />
      )}
    </View>
  );
};

export default React.memo(NextTask);

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
