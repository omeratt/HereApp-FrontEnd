import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, ReactNode, memo, useCallback} from 'react';
import constants from '../assets/constants';

type Children<P> = P & {children?: ReactNode};
interface Props {
  onDonePress?: () => void;
  children?: Children<ReactNode>;
}
const MyListAndNotes: FC<Props> = ({children, onDonePress}) => {
  const onPress = useCallback(() => {
    console.log('click on done');
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>{children}</View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={onDonePress || onPress}
          style={[styles.footerBtn]}>
          <Text style={styles.textFooterBtn}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(MyListAndNotes);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: constants.colors.OFF_WHITE,
  },
  listContainer: {
    // padding: 10,
    flex: 0.9,
    borderWidth: 1.2,
    borderColor: constants.colors.UNDER_LINE,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    width: '100%',
    borderTopWidth: 0,
    marginTop: '10%',
    // paddingHorizontal: '7.48%',
    paddingHorizontal: constants.WIDTH * 0.0748,
    alignSelf: 'flex-start',
  },
  listContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '100%',
  },
  textHeader: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
    fontSize: 25,
  },
  listContainerContent: {
    marginTop: '10%',
  },
  newTaskTitleInput: {
    borderWidth: 0,
    fontSize: 20,
    color: constants.colors.UNDER_LINE,
    alignItems: 'center',
    textAlignVertical: 'center',
    fontFamily: constants.Fonts.text,
  },
  listContainerFooter: {
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    width: '80%',
    height: '9%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'cyan',
  },
  containerFooterBtn: {
    borderWidth: 0.5,
    borderRadius: 20,
    backgroundColor: constants.colors.OFF_WHITE,
    borderColor: constants.colors.UNDER_LINE,
    elevation: 2,
    justifyContent: 'center',
  },
  innerBtnCircleCheckbox: {
    borderColor: constants.colors.BLACK,
    height: '15%',
    width: '15%',
    borderWidth: 1,
    borderRadius: 99,
    marginBottom: '4%',
    marginLeft: '13%',
  },
  footer: {
    flex: 0.15,
    justifyContent: 'center',
  },
  footerBtn: {
    borderWidth: 0.5,
    borderRadius: 99,
    paddingHorizontal: '7%',
    paddingVertical: '2%',
    backgroundColor: constants.colors.OFF_WHITE,
    borderColor: constants.colors.UNDER_LINE,
    elevation: 2,
  },
  textFooterBtn: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.BLACK,
    fontSize: 19,
  },
});

const innerBtnFillCircleCheckbox = StyleSheet.flatten([
  styles.innerBtnCircleCheckbox,
  {backgroundColor: constants.colors.BLACK},
]);
