import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import constants from '../../assets/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/core';
import {useGetMessagesQuery} from '../../app/api/messageApi';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import RenderMessageItem from './RenderMessageItem';
import Line from '../../components/Line';
import SVG from '../../assets/svg';
import {Vibration} from 'react-native';
import Animated, {FadeInUp, ZoomIn, ZoomOut} from 'react-native-reanimated';
import CheckBox from '../../components/CheckBox';
const {WIDTH, HEIGHT} = constants;
const paddingHorizontal = WIDTH * (30.37 / 414);
const paddingVertical = HEIGHT * (22 / 896);

const height = HEIGHT - 2 * paddingVertical;
const width = WIDTH - 2 * paddingHorizontal;
const ICON_BACK_SIZE = HEIGHT * (29.25 / 896) * 1.2;
const ICON_PLUS_SIZE = HEIGHT * (24.25 / 896) * 1.2;
const msgContainerH = height - ICON_BACK_SIZE - ICON_PLUS_SIZE;
const flashListH = msgContainerH * (488 / 793.75);
const lastMsgH = msgContainerH - flashListH;
const lastMsgPaddingTop = lastMsgH * (37 / 305);
const initialValues: IMessageValues = {
  message: '',
  title: '',
  date: undefined,
  _id: '',
};
const Messages = () => {
  const navigation = useNavigation();
  const {data, isLoading} = useGetMessagesQuery(null);
  const handleBackPress = () => {
    navigation.goBack();
  };
  const [lastMsg, setLastMsg] = React.useState<IMessageValues>(initialValues);
  const [isSelectOn, setIsSelectOn] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [lastMsgTxtHeight, setLastMsgTxtHeight] = React.useState<number>(0);
  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {height: _height, width} = event.nativeEvent.layout;
    setLastMsgTxtHeight(_height);
  }, []);
  const handleSelected = React.useCallback((id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(_id => _id !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);
  React.useEffect(() => {
    if (data) {
      setLastMsg(data[data.length - 1]);
    }
  }, [data]);

  const toggleSelect = React.useCallback(() => {
    setIsSelectOn(!isSelectOn);
    Vibration.vibrate(1);
    setSelected([]);
  }, [isSelectOn]);

  const navToEditTask = React.useCallback((id: string) => {
    console.log('navigate to edit list', id);
  }, []);

  const isLastSelected = React.useMemo(() => {
    return selected.includes(lastMsg._id!);
  }, [selected, lastMsg]);
  const renderItem: ListRenderItem<IMessageValues> = React.useCallback(
    props => {
      const isLastIndex = props.index === data!.length - 2;
      return <RenderMessageItem {...props} isLastIndex={isLastIndex} />;
    },
    [data?.length],
  );
  const keyExtractor = React.useCallback(
    (item: IMessageValues, index: number) => {
      return item._id!;
    },
    [],
  );
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          //   backgroundColor: 'red',
        }}>
        <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
          <AntDesign
            name="leftcircle"
            color={constants.colors.OFF_WHITE}
            size={ICON_BACK_SIZE - 1}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSelect}>
          <SVG.Select
            height={ICON_BACK_SIZE}
            width={50}
            fill={
              isSelectOn ? constants.colors.GREEN : constants.colors.OFF_WHITE
            }
            style={{
              borderRadius: ICON_BACK_SIZE / 2,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.msgContainer}>
        {data && (
          <>
            <View style={styles.flashList}>
              <FlashList
                data={[...data.slice(0, data.length - 1)]}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                estimatedItemSize={200}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={data.length - 2}
                contentContainerStyle={{paddingVertical: lastMsgPaddingTop}}
                fadingEdgeLength={600}
                extraData={{
                  isSelectOn,
                  handleSelected,
                  selected,
                  navToEditTask,
                }}
                scrollToOverflowEnabled
              />
            </View>
            <Line
              lineColor={constants.colors.OFF_WHITE}
              strength={0.5}
              lengthPercentage={110}
              style={{
                alignSelf: 'center',
                //   width: WIDTH * 0.94
              }}
            />
            <View style={styles.flashListFooter}>
              <TouchableOpacity
                onPress={() =>
                  isSelectOn
                    ? handleSelected(lastMsg._id!)
                    : navToEditTask(lastMsg._id!)
                }>
                <Animated.View
                  style={{height: lastMsgH, width: width * 0.9}}
                  entering={FadeInUp}>
                  <View onLayout={onLayout} style={{alignSelf: 'flex-start'}}>
                    <Text
                      numberOfLines={4}
                      textBreakStrategy="highQuality"
                      style={styles.lastMsgTxt}>
                      {/* {lastMsg.message} */}
                      An idea I had for an interactive course - to search in
                      science books
                    </Text>
                    <Text style={styles.dateTxt}>
                      {new Date(lastMsg.createdAt!).toLocaleString('eng', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
              {isSelectOn && (
                <Animated.View
                  entering={ZoomIn.duration(250)}
                  exiting={ZoomOut.duration(250)}
                  style={[
                    styles.checkBoxContainer,
                    {height: lastMsgTxtHeight},
                  ]}>
                  <CheckBox
                    size={25 / 1.05}
                    isFilled={isLastSelected}
                    colorFill={constants.colors.GREEN}
                    onPress={() => handleSelected(lastMsg._id!)}
                  />
                </Animated.View>
              )}
            </View>
          </>
        )}
      </View>
      <TouchableOpacity style={styles.plusIcon} onPress={handleBackPress}>
        <AntDesign
          name="pluscircleo"
          color={constants.colors.OFF_WHITE}
          size={ICON_PLUS_SIZE - 1}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal,
    paddingVertical,
    backgroundColor: constants.colors.BGC,
    // alignItems: 'center',

    // justifyContent: 'center',
    // backgroundColor: 'red',
  },
  backIcon: {
    height: ICON_BACK_SIZE,
    width: ICON_BACK_SIZE,
  },
  plusIcon: {
    height: ICON_PLUS_SIZE,
    width: ICON_PLUS_SIZE,
    alignSelf: 'flex-end',
  },
  msgContainer: {
    height: msgContainerH,
    width,

    // backgroundColor: 'grey',
  },
  flashList: {
    height: flashListH,
    width,

    // elevation: 5,
    // shadowColor: 'white',
    // backgroundColor: 'grey',
  },
  flashListFooter: {
    height: lastMsgH,
    width,
    paddingTop: lastMsgPaddingTop,
    // backgroundColor: 'red',
  },
  lastMsgTxt: {
    fontFamily: constants.Fonts.paragraph,
    fontSize: 32,
    lineHeight: 32,
    color: constants.colors.GREEN,
    width: width * 0.9,
  },
  dateTxt: {
    fontFamily: constants.Fonts.text,
    fontSize: 10,
    color: constants.colors.GREEN,
    lineHeight: 32,
  },
  checkBoxContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: lastMsgH,
    width: 25,
    right: 0,
    top: lastMsgPaddingTop,
  },
});
