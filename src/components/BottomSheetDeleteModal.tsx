import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import constants from '../assets/constants';
import Line from './Line';

interface Props {
  ids?: string[];
  onDelete?: () => void;
}

export interface BottomSheetDeleteModalHandles {
  closeModal: () => void;
  openModal: () => void;
}

const bottomSheetHeight = constants.HEIGHT * 0.37723;
const paddingTop = bottomSheetHeight * (51 / bottomSheetHeight);
const marginBottom = bottomSheetHeight * (39 / bottomSheetHeight);

const btnWidth = constants.WIDTH * (71 / constants.WIDTH);
const btnHeight = bottomSheetHeight * (41 / bottomSheetHeight);
const paddingHorizontal = bottomSheetHeight * (81 / constants.WIDTH);
const txtHeight = bottomSheetHeight * (90 / bottomSheetHeight);
const BottomSheetDeleteModal = forwardRef<BottomSheetDeleteModalHandles, Props>(
  ({onDelete, ids}, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const closeModal = useCallback(() => {
      bottomSheetModalRef.current?.dismiss();
    }, []);
    const openModal = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);
    // variables
    const snapPoints = useMemo(() => ['37.723%'], []);

    // Expose the `closeModal` function via ref
    useImperativeHandle(ref, () => ({
      closeModal,
      openModal,
    }));

    return (
      <BottomSheetModal
        handleStyle={{display: 'none'}}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{backgroundColor: constants.colors.BGC}}
        stackBehavior="replace">
        <View style={styles.container}>
          <View style={styles.txtContainer}>
            <View style={{flex: 1}}>
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={3}
                ellipsizeMode="tail"
                style={styles.contentTxt}>
                Are you sure you want to delete this item?
              </Text>
            </View>
            <Line
              strength={1.2}
              lineColor={constants.colors.OFF_WHITE}
              style={{marginTop: 10, borderRadius: 100}}
            />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={onDelete}
              style={[styles.btn, styles.yes]}>
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={[styles.btnTxt, styles.yesTxt]}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeModal}
              style={[styles.btn, styles.no]}>
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={[styles.btnTxt, styles.noTxt]}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    );
  },
);

export default BottomSheetDeleteModal;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingTop,
    paddingHorizontal,
  },
  txtContainer: {
    height: txtHeight,
    marginBottom,
    // flex: 1,
    // backgroundColor: 'white',
    // flexDirection: 'row',
  },
  contentTxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: txtHeight / 4.94,
    // lineHeight: txtHeight / 3,
    // height: txtHeight,
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btn: {
    height: btnHeight,
    width: btnWidth,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: btnHeight / 2,
  },
  yes: {
    backgroundColor: constants.colors.GREEN,
  },
  no: {
    backgroundColor: constants.colors.BGC,
    borderColor: constants.colors.GREEN,
    borderWidth: 1,
  },
  btnTxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.OFF_WHITE,
    fontSize: constants.WIDTH * 0.04,
    height: btnHeight,
    width: btnWidth,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  yesTxt: {
    color: constants.colors.BGC,
  },
  noTxt: {
    color: constants.colors.GREEN,
  },
});
