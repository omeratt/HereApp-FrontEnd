import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ListRenderItemInfo} from '@shopify/flash-list';
import constants from '../../assets/constants';
import CheckBox from '../../components/CheckBox';
import {LayoutChangeEvent} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  ZoomInRight,
  ZoomOut,
  ZoomOutRight,
} from 'react-native-reanimated';

const marginBottom = constants.HEIGHT * (40 / 896);
interface Props extends ListRenderItemInfo<IMessageValues> {
  isLastIndex?: boolean;
}
const RenderMessageItem = (props: Props) => {
  const [height, setHeight] = React.useState<number>(0);
  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {height: _height, width} = event.nativeEvent.layout;
    setHeight(_height);
  }, []);
  const isSelected = React.useMemo(() => {
    return props.extraData?.selected?.includes(props.item._id!);
  }, [props.extraData?.selected, props.item._id, props.index]);

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          props.extraData.isSelectOn
            ? props.extraData.handleSelected(props.item._id!)
            : props.extraData.navToEditMessage(props.item)
        }>
        <Animated.View
          entering={FadeInUp}
          onLayout={onLayout}
          style={[
            styles.container,
            {...(props.isLastIndex && {marginBottom: 0})},
          ]}>
          <Text style={styles.msgTitleTxt}>{props.item.title}</Text>
          <Text style={styles.msgTxt}>{props.item.message}</Text>
          <Text style={styles.dateTxt}>
            {new Date(props.item.createdAt!).toLocaleString('eng', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })}
          </Text>
        </Animated.View>
      </TouchableOpacity>
      {props.extraData.isSelectOn && (
        <Animated.View
          entering={ZoomIn.duration(250)}
          exiting={ZoomOut.duration(250)}
          style={[styles.checkBoxContainer, {height}]}>
          <CheckBox
            size={25 / 1.05}
            isFilled={isSelected}
            colorFill={constants.colors.GREEN}
            onPress={() => props.extraData.handleSelected(props.item._id!)}
          />
        </Animated.View>
      )}
    </>
  );
};

export default React.memo(RenderMessageItem);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginBottom,
    // position: 'relative',
    // zIndex: 0,
    // backgroundColor: 'red',
  },
  msgTitleTxt: {
    fontFamily: constants.Fonts.text_medium,
    fontSize: 20,
    color: constants.colors.GREEN,
  },
  msgTxt: {
    fontFamily: constants.Fonts.text,
    fontSize: 15,
    color: constants.colors.GREEN,
    lineHeight: 18,
  },
  dateTxt: {
    fontFamily: constants.Fonts.text,
    fontSize: 10,
    color: constants.colors.GREEN,
    lineHeight: 18,
  },
  checkBoxContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    right: 0,
  },
});
