import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, ReactNode, memo, useCallback} from 'react';
import constants from '../../assets/constants';
import SVG from '../../assets/svg';

export const PADDING_HORIZONTAL = constants.WIDTH * 0.0848;

type Children<P> = P & {children?: ReactNode};
interface Props {
  onDonePress?: () => void;
  onRightBtnPress?: () => void;
  children?: Children<ReactNode>;
  title?: string;
  numberOfLines?: number;
  rightBtn?: boolean;
  isLoading?: boolean;
  isSelected?: boolean;
  onSelectPress?: () => void;
}
const selectHeight = 0.04464285714285714285714285714286 * constants.HEIGHT;
const selectWidth = selectHeight / 0.57746478873239436619718309859155;
const MyListsWrapper: FC<Props> = ({
  children,
  onDonePress,
  title,
  numberOfLines = 2,
  rightBtn,
  onRightBtnPress,
  isLoading = false,
  isSelected = undefined,
  onSelectPress,
}) => {
  const onPress = useCallback(() => {
    console.log('click on done');
  }, []);
  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <Text
              style={styles.title}
              numberOfLines={numberOfLines}
              textBreakStrategy="balanced">
              {title}
            </Text>
          </View>
          {rightBtn && (
            <View
              style={{
                flexDirection: 'row',
                height: '100%',
              }}>
              {isSelected !== undefined && (
                <TouchableOpacity
                  style={[{height: selectHeight}]}
                  onPress={onSelectPress}>
                  {isSelected ? (
                    <SVG.GreenSelect
                      height={'100%'}
                      width={selectWidth}
                      style={[styles.svg, styles.marginRight]}
                    />
                  ) : (
                    <SVG.Select
                      height={'100%'}
                      width={selectWidth}
                      style={[styles.svg, styles.marginRight]}
                    />
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[{height: selectHeight}]}
                onPress={onRightBtnPress}>
                <SVG.NotePlus
                  height={'100%'}
                  width={selectHeight}
                  style={styles.svg}
                />
              </TouchableOpacity>
            </View>
          )}
          {isLoading && (
            <View style={{height: '100%'}}>
              <ActivityIndicator size={32} color={constants.colors.GREEN} />
            </View>
          )}
        </View>
      )}
      <View style={styles.listContainer}>{children}</View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={onDonePress && onDonePress}
          style={[styles.footerBtn]}>
          <Text style={styles.textFooterBtn}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(MyListsWrapper);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: constants.colors.OFF_WHITE,
  },
  svg: {
    elevation: 3.5,
    borderRadius: 21,
    backgroundColor: constants.colors.OFF_WHITE,
  },
  marginRight: {
    marginRight: constants.WIDTH * 0.02,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '11%',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  titleContainer: {width: '65%', height: '100%'},
  title: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 32,
    width: '100%',
    lineHeight: 32,
    // borderColor: 'black',
    // borderWidth: 1,
    // width:'50%'
  },
  listContainer: {
    // backgroundColor: 'cyan',
    overflow: 'hidden',
    flex: 4.5,
    borderWidth: 1.2,
    borderColor: constants.colors.UNDER_LINE,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    width: '100%',
    borderTopWidth: 0,
    paddingHorizontal: PADDING_HORIZONTAL,
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
    // backgroundColor: 'red',
    flex: 0.7,
    // justifyContent: 'center',
    justifyContent: 'flex-start',
    paddingTop: '4%',
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
