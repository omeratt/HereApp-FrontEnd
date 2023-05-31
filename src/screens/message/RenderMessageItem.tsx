import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ListRenderItemInfo} from '@shopify/flash-list';
import constants from '../../assets/constants';
import CheckBox from '../../components/CheckBox';
import {LayoutChangeEvent} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutUp,
  SequencedTransition,
  ZoomIn,
  ZoomInRight,
  ZoomOut,
  ZoomOutRight,
} from 'react-native-reanimated';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

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
  const messageSubString = React.useMemo(() => {
    const index = props.item.message.indexOf(props.item.title);
    let result: string;
    if (index !== -1) {
      result = props.item.message.substring(0, index);
    } else {
      result = props.item.message;
    }
    return result;
  }, [props.item.message, props.item.title]);

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
          exiting={FadeOutUp}
          onLayout={onLayout}
          layout={SequencedTransition}
          style={[
            styles.container,
            {...(props.index === 0 && {marginBottom: 0})},
          ]}>
          <Text style={styles.msgTitleTxt}>{props.item.title}</Text>
          <Text style={styles.msgTxt}>{messageSubString}</Text>
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
const lineHeight = RFPercentage(3);
const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginBottom,
  },
  msgTitleTxt: {
    fontFamily: constants.Fonts.text_medium,
    fontSize: RFPercentage(3),
    color: constants.colors.GREEN,
  },
  msgTxt: {
    fontFamily: constants.Fonts.text,
    fontSize: RFPercentage(2),
    color: constants.colors.GREEN,
    lineHeight: lineHeight,
  },
  dateTxt: {
    fontFamily: constants.Fonts.text,
    fontSize: RFPercentage(1.5),
    color: constants.colors.GREEN,
    lineHeight: lineHeight,
  },
  checkBoxContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    right: 0,
  },
});
