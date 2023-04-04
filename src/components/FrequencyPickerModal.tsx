import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import React, {useCallback} from 'react';
import constants from '../assets/constants';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
interface FrequencyPickerModalProps {
  freq: string;
  setFreq: (freq: string) => void;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  data: string[];
}
const ItemSize = (constants.HEIGHT * 0.4 - 40) / 6;
const FrequencyPickerModal: React.FC<FrequencyPickerModalProps> = ({
  isOpen,
  setIsOpen,
  setFreq,
  freq,
  data,
}) => {
  const tempFreq = useSharedValue(freq);

  const handleConfirm = useCallback(() => {
    setFreq(tempFreq.value);
    close();
  }, []);

  const cancelConfirm = useCallback(() => {
    tempFreq.value = freq;
    close();
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ModalHeader = () => {
    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={cancelConfirm}>
          <Text style={styles.textBtn}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
          <Text style={styles.textBtn}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleIndexChange = (index: number) => {
    tempFreq.value = data[index];
  };
  const scrollY = useSharedValue(0);
  const last = useSharedValue(0);
  const opacity = useSharedValue(1);
  const realIndex = useSharedValue(data.indexOf(freq));
  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: ({contentOffset: {y: value}}) => {
      'worklet';
      last.value = scrollY.value;
      scrollY.value = value;
      const curI = Math.round(scrollY.value / ItemSize);
      const lastI = Math.round(last.value / ItemSize);
      if (curI !== lastI) {
        realIndex.value = curI;
        runOnJS(handleIndexChange)(curI);
      }
    },
    onBeginDrag(event, context) {
      opacity.value = withTiming(0.2, {duration: 200});
    },
    onMomentumEnd(event, context) {
      opacity.value = withTiming(1);
    },
  });
  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  const RenderItem: ListRenderItem<string> = useCallback(({item, index}) => {
    const animatedOpacity = useAnimatedStyle(() => {
      return {
        opacity: realIndex.value !== index ? opacity.value : 1,
      };
    });
    return (
      <Animated.View style={[styles.renderItemContainer, animatedOpacity]}>
        <Text style={styles.renderItemTxt}>{item}</Text>
      </Animated.View>
    );
  }, []);
  const FlatListFreq = () => {
    return (
      <View style={styles.modalViewContainer}>
        <SafeAreaView style={styles.safeArea}>
          <ModalHeader />
          <View style={styles.selectedItemLines}></View>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            data={data}
            getItemLayout={(data, index) => {
              return {index, length: ItemSize, offset: index * ItemSize};
            }}
            snapToInterval={ItemSize}
            initialScrollIndex={data.indexOf(freq)}
            pagingEnabled
            onScroll={animatedScrollHandler}
            renderItem={props => <RenderItem {...props} />}
          />
        </SafeAreaView>
      </View>
    );
  };
  return (
    <Modal
      onBackdropPress={cancelConfirm}
      style={styles.modal}
      isVisible={isOpen}>
      <FlatListFreq />
    </Modal>
  );
};

export default FrequencyPickerModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalViewContainer: {
    height: constants.HEIGHT * 0.4,
    backgroundColor: constants.colors.BGC,
    paddingHorizontal: '7.5%',
    width: constants.WIDTH,
    borderTopRightRadius: 21,
    borderTopLeftRadius: 21,
  },
  safeArea: {flex: 1, alignItems: 'center'},
  contentContainerStyle: {
    paddingTop: 2 * ItemSize,
    paddingBottom: 3 * ItemSize,
  },
  renderItemContainer: {
    width: constants.WIDTH * 0.85,
    height: ItemSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renderItemTxt: {
    color: constants.colors.OFF_WHITE,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  selectedItemLines: {
    position: 'absolute',
    height: ItemSize,
    width: '100%',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: constants.colors.GREEN,
    bottom: ItemSize * 3,
  },
  btnContainer: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: '7.5%',
    alignItems: 'center',
    // marginBottom: '10%',
  },
  btn: {
    height: '100%',
    justifyContent: 'center',
  },
  textBtn: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.GREEN,
    fontSize: 16,
  },
  datePicker: {
    backgroundColor: constants.colors.BGC,
    alignSelf: 'center',
    width: constants.WIDTH,
  },
});
