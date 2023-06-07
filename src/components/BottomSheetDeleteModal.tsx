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
  behavior?: 'replace' | 'push';
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
const paddingHorizontal = (87 / 414) * constants.WIDTH;
// const txtHeight = bottomSheetHeight * (90 / bottomSheetHeight);
const txtHeight = bottomSheetHeight * 0.26627218934911242603550295857988;
const BottomSheetDeleteModal = forwardRef<BottomSheetDeleteModalHandles, Props>(
  ({onDelete, ids, behavior}, ref) => {
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
        stackBehavior={behavior || 'replace'}>
        <View style={styles.container}>
          <View
            style={[
              styles.txtContainer,
              {width: constants.WIDTH - paddingHorizontal * 2},
            ]}>
            <View style={{flex: 1}}>
              <Text
                // adjustsFontSizeToFit={true}
                // numberOfLines={1}
                // maxFontSizeMultiplier={1}
                // ellipsizeMode="tail"
                // textBreakStrategy="balanced"
                // lineBreakMode="middle"
                style={styles.contentTxt}>
                {`Are you sure you`}
              </Text>
              <Text
                // adjustsFontSizeToFit
                // numberOfLines={1}
                // maxFontSizeMultiplier={1}
                // ellipsizeMode="tail"
                // textBreakStrategy="balanced"
                // lineBreakMode="middle"
                style={[styles.contentTxt]}>
                want to delete this
              </Text>
              <Text
                // adjustsFontSizeToFit={true}
                // numberOfLines={1}
                // maxFontSizeMultiplier={1}
                // ellipsizeMode="tail"
                // textBreakStrategy="balanced"
                // lineBreakMode="middle"
                style={styles.contentTxt}>
                {`item`}
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
    // fontSize: 12,
    fontSize: (constants.WIDTH - paddingHorizontal * 2) / 11,
    lineHeight: txtHeight / 3.8,
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
