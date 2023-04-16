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
}
const MyListsWrapper: FC<Props> = ({
  children,
  onDonePress,
  title,
  numberOfLines = 2,
  rightBtn,
  onRightBtnPress,
  isLoading = false,
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
            <TouchableOpacity
              style={[{height: '100%'}]}
              onPress={onRightBtnPress}>
              <SVG.plusIconOutlined
                width={25}
                height={25}
                fill={constants.colors.BLACK}
              />
            </TouchableOpacity>
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
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '10%',
    width: '100%',
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  titleContainer: {width: '55%'},
  title: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 32,
    width: '100%',
    lineHeight: 32,
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
