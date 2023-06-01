import {LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import React, {ReactElement, ReactNode, cloneElement, useState} from 'react';
import SVG from '../../assets/svg';
import constants from '../../assets/constants';
type Children<P> = P & {children?: ReactNode};

interface BoardingBoxWrapperProps {
  Component?: any;
  showPlusIcon?: boolean;
  basicStyle?: boolean;
}
const BoardingBoxWrapper: React.FC<BoardingBoxWrapperProps> = ({
  Component,
  showPlusIcon,
  basicStyle = true,
}) => {
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();

  const handleLayout = (e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    setWidth(width);
    setHeight(height);
  };
  const topBoxStyle = {
    ...(height && basicStyle && {paddingTop: `${(24 / height) * 100}%`}),
    ...(width && basicStyle && {paddingHorizontal: `${(14 / width) * 100}%`}),
  };
  // const formattedText;
  return (
    <View style={styles.box} onLayout={handleLayout}>
      {Component && width && height && (
        <View style={[styles.topBox, topBoxStyle]}>
          <Component width={width} height={height} />
        </View>
      )}
      {showPlusIcon && (
        <View style={styles.bottomPlusBox}>
          <SVG.plusIconOutlined
            style={styles.boxPlusIcon}
            fill={constants.colors.BGC}
            height="80%"
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(BoardingBoxWrapper);

const styles = StyleSheet.create({
  box: {
    flex: 1,
    margin: '1%',
    // padding: '1%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    // backgroundColor: 'cyan',
    backgroundColor: constants.colors.OFF_WHITE,
    elevation: 2,
    overflow: 'hidden',
  },
  topBox: {
    height: '100%',
    width: '100%',
  },
  bottomPlusBox: {
    height: '15%',
  },
  boxPlusIcon: {},
});
