import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import constants from '../../assets/constants';
import moment from 'moment';
import {getShortName, getTimeFromDateString} from '../WeeklyCalender';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SVG from '../../assets/svg';
import {CommonActions, useNavigation} from '@react-navigation/native';
const {rf} = constants;
interface LastMessageProps {
  width: number;
  height: number;
  navToMsg?: (msg?: IMessageValues) => void;
  message: IMessageValues;
  isLoading?: boolean;
}
const LastMessage: React.FC<LastMessageProps> = ({
  width,
  height,
  message,
  isLoading,
}) => {
  if (isLoading) {
    return isLoading ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={constants.colors.UNDER_LINE} size={32} />
      </View>
    ) : (
      <React.Fragment />
    );
  }
  const navigation = useNavigation();
  const date = moment(message?.createdAt);
  const hours = getTimeFromDateString(date.toDate().toISOString());
  const formattedDate = getShortName(date.day()) + ' ' + date.date();

  const navToNewMessage = React.useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate('Message', {
        params: {navFromHome: true},
      }),
    );
  }, [message]);
  const navToEditMessage = React.useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate('Message', {
        messageRouteProp: message,
        navFromHome: true,
      }),
    );
  }, [message]);
  const messageSubString = React.useMemo(() => {
    const inputString = message?.message;
    const searchString = message?.title;
    const regex = new RegExp(searchString, 'g');
    const result = inputString?.replace(regex, '');
    return result?.trim();
  }, [message?.message, message?.title]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{justifyContent: 'center'}}>
          <Text style={[styles.font, styles.title]}>Message</Text>
          {message && <Text style={[styles.font]}>{hours}</Text>}
        </View>
        <TouchableOpacity onPress={navToNewMessage}>
          <SVG.NotePlus height={23.75} width={23.75} />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: height * 0.1}}>
        {message ? (
          <>
            <Text style={[styles.font, styles.title]}>
              {message?.title?.trim()}
            </Text>
            <Text numberOfLines={3} style={styles.font}>
              {messageSubString?.trim()}
            </Text>
          </>
        ) : (
          <Text
            style={[
              styles.font,
              {
                height: '60%',
                textAlignVertical: 'bottom',
                fontSize: constants.rf(15),
                color: constants.colors.UNDER_LINE,
              },
            ]}>
            No messages
          </Text>
        )}
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <View style={[styles.textFooter, {width: `${(49 / width) * 100}%`}]}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.font}>
              {formattedDate}
            </Text>
          </View>
          <TouchableOpacity onPress={navToEditMessage}>
            <AntDesign
              name="rightcircleo"
              color={constants.colors.BLACK}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(LastMessage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 17,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  font: {
    fontFamily: constants.Fonts.text,
    textAlign: 'left',
    fontSize: rf(12),
    color: constants.colors.BLACK,
  },
  title: {
    fontFamily: constants.Fonts.text_medium,
    color: constants.colors.BLACK,
  },
  footerContainer: {flex: 1, justifyContent: 'flex-end'},
  footer: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textFooter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
