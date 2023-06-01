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
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
const {HEIGHT, WIDTH} = constants;
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
    const inputString = props.item.message;
    const searchString = props.item.title;
    const regex = new RegExp(searchString, 'g');

    const result = inputString.replace(regex, '');
    console.log(props.item.message, props.item.title, result);
    return result.trim();
  }, [props.item.message, props.item.title]);
  const AnimatedTouchableOpacity = React.useMemo(() => {
    return Animated.createAnimatedComponent(TouchableOpacity);
  }, []);
  return (
    <>
      <AnimatedTouchableOpacity
        layout={SequencedTransition}
        // style={{flex: 1}}
        onLongPress={props.extraData.toggleSelect}
        onPress={() =>
          props.extraData.isSelectOn
            ? props.extraData.handleSelected(props.item._id!)
            : props.extraData.navToEditMessage(props.item)
        }>
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutUp}
          onLayout={onLayout}
          style={[
            styles.container,
            {flexDirection: 'row'},
            {...(props.index === 0 && {marginBottom: 0})},
          ]}>
          {props.extraData.isSelectOn && (
            <Animated.View
              entering={ZoomIn.duration(250)}
              exiting={ZoomOut.duration(250)}
              layout={SequencedTransition}
              style={[styles.checkBoxContainer, {height}]}>
              <CheckBox
                size={25 / 1.05}
                isFilled={isSelected}
                colorFill={constants.colors.GREEN}
                onPress={() => props.extraData.handleSelected(props.item._id!)}
              />
            </Animated.View>
          )}
          <Animated.View layout={SequencedTransition}>
            <Text style={styles.msgTitleTxt}>{props.item.title}</Text>
            {messageSubString && (
              <Text style={styles.msgTxt}>{messageSubString}</Text>
            )}
            <Text style={styles.dateTxt}>
              {new Date(props.item.createdAt!).toLocaleString('eng', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </Text>
          </Animated.View>
        </Animated.View>
      </AnimatedTouchableOpacity>
    </>
  );
};

export default React.memo(RenderMessageItem);
const paddingHorizontal = WIDTH * (30.37 / 414);
const width = WIDTH - 2 * paddingHorizontal;
// const lineHeight = RFPercentage(width * 0.01);
// const fontH = RFPercentage(width * 0.007);
// const dateH = RFPercentage(width * 0.004);
const lineHeight = constants.rf(22);
const titleH = constants.rf(18);
const fontH = constants.rf(15);
const dateH = constants.rf(11);
const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginBottom,
    paddingRight: '10%',
  },
  msgTitleTxt: {
    fontFamily: constants.Fonts.text_medium,
    fontSize: titleH,
    color: constants.colors.GREEN,
    opacity: 0.8,
  },
  msgTxt: {
    fontFamily: constants.Fonts.text,
    fontSize: fontH,
    color: constants.colors.GREEN,
    lineHeight: lineHeight,
    opacity: 0.7,

    // backgroundColor: 'red',
  },
  dateTxt: {
    fontFamily: constants.Fonts.text,
    fontSize: dateH,
    color: constants.colors.GREEN,
    lineHeight: lineHeight,
    opacity: 0.7,
  },
  checkBoxContainer: {
    // position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    marginRight: '5%',
    left: 0,
  },
});
