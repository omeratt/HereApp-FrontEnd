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
import {
  getRealDate,
  getShortName,
  getTimeFromDateString,
} from '../WeeklyCalender';
import {TaskType} from '../../app/Reducers/User/userSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CheckBox from '../CheckBox';
import SVG from '../../assets/svg';
import {useNavigation} from '@react-navigation/native';
const realDate = getRealDate(new Date());
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
  const navigation = useNavigation();
  if (!message || isLoading) {
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
  const date = moment(message?.createdAt);
  const hours = getTimeFromDateString(date.toDate().toISOString());
  const formattedDate = getShortName(date.day()) + ' ' + date.date();
  const handlePress = () => {
    // navToMsg?.(nextTask[0]);
    console.log('handlePress');
  };
  // const handleCheckboxPress = () => {
  //   // const {_id, done} = nextTask[0] || {};
  //   // if (!_id) return;
  //   // updateTask?.(_id, !done);
  // };
  const navToNewMessage = React.useCallback(() => {
    navigation.navigate('Message' as never, {navFromHome: true} as never);
  }, [message]);
  const navToEditMessage = React.useCallback(() => {
    navigation.navigate(
      'Message' as never,
      {messageRouteProp: message, navFromHome: true} as never,
    );
  }, [message]);
  const messageSubString = React.useMemo(() => {
    const inputString = message.message;
    const searchString = message.title;
    const regex = new RegExp(searchString, 'g');
    const result = inputString.replace(regex, '');
    return result.trim();
  }, [message.message, message.title]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{justifyContent: 'center'}}>
          <Text style={[styles.font, styles.title]}>Message</Text>
          {message && <Text style={[styles.font]}>{hours}</Text>}
        </View>
        {message._id && (
          <TouchableOpacity onPress={navToNewMessage}>
            <SVG.NotePlus height={23.75} width={23.75} />
          </TouchableOpacity>
        )}
      </View>
      <View style={{marginTop: height * 0.1}}>
        <Text style={[styles.font, styles.title]}>{message.title?.trim()}</Text>
        <Text numberOfLines={3} style={styles.font}>
          {messageSubString?.trim()}
        </Text>
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
