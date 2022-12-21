import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import constants from '../assets/constants';
import {CheckBox, Icon} from '@rneui/themed';
import SVG from '../assets/svg';
import CircleCheckBox from './CircleCheckBox';

enum days {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
interface props {
  handleList: string[];
  setHandleList: (value: React.SetStateAction<string[]>) => void;
}
export default function DateSelect({handleList, setHandleList}: props) {
  // const [handleList, setHandleList] = useState<string[]>([]);
  const [isSunday, setIsSunday] = useState(handleList.includes(days[0]));
  const [isMonday, setIsMonday] = useState(handleList.includes(days[1]));
  const [isTuesday, setIsTuesday] = useState(handleList.includes(days[2]));
  const [isWednesday, setIsWednesday] = useState(handleList.includes(days[3]));
  const [isThursday, setIsThursday] = useState(handleList.includes(days[4]));
  const [isFriday, setIsFriday] = useState(handleList.includes(days[5]));
  const [isSaturday, setIsSaturday] = useState(handleList.includes(days[6]));

  const circleSize = 18;
  const addToList = async (
    day: string,
    state: boolean,
    setState: (state: boolean) => void,
  ) => {
    if (state) {
      setHandleList(prev => {
        prev.splice(
          prev.findIndex(() => day),
          1,
        );
        return [...new Set(prev)];
      });
    } else {
      setHandleList(prev => [...new Set([...prev, day])]);
    }
    setState(!state);
  };
  useEffect(() => {
    console.log(handleList);
  }, [handleList.length]);
  return (
    <View style={styles.container}>
      <View style={styles.col}>
        <CheckBox
          checked={isWednesday}
          onPress={async () =>
            await addToList(days[3], isWednesday, setIsWednesday)
          }
          iconRight
          fontFamily={constants.Fonts.text}
          containerStyle={styles.checkBox}
          checkedIcon={
            <CircleCheckBox size={circleSize} fill={constants.colors.GREEN} />
          }
          uncheckedIcon={<CircleCheckBox size={circleSize} />}
          textStyle={styles.dateTxt}
          title="Wednesday"
          titleProps={{}}
          uncheckedColor="#F00"
        />
        <CheckBox
          checked={isThursday}
          onPress={async () =>
            await addToList(days[4], isThursday, setIsThursday)
          }
          iconRight
          fontFamily={constants.Fonts.text}
          containerStyle={styles.checkBox}
          checkedIcon={
            <CircleCheckBox size={circleSize} fill={constants.colors.GREEN} />
          }
          uncheckedIcon={<CircleCheckBox size={circleSize} />}
          textStyle={styles.dateTxt}
          title="Thursday"
          titleProps={{}}
          uncheckedColor="#F00"
        />
        <CheckBox
          checked={isFriday}
          onPress={async () => await addToList(days[5], isFriday, setIsFriday)}
          iconRight
          fontFamily={constants.Fonts.text}
          containerStyle={styles.checkBox}
          checkedIcon={
            <CircleCheckBox size={circleSize} fill={constants.colors.GREEN} />
          }
          uncheckedIcon={<CircleCheckBox size={circleSize} />}
          textStyle={styles.dateTxt}
          title="Friday"
          titleProps={{}}
          uncheckedColor="#F00"
        />
        <CheckBox
          checked={isSaturday}
          onPress={async () =>
            await addToList(days[6], isSaturday, setIsSaturday)
          }
          iconRight
          fontFamily={constants.Fonts.text}
          containerStyle={styles.checkBox}
          checkedIcon={
            <CircleCheckBox size={circleSize} fill={constants.colors.GREEN} />
          }
          uncheckedIcon={<CircleCheckBox size={circleSize} />}
          textStyle={styles.dateTxt}
          title="Saturday"
          titleProps={{}}
          uncheckedColor="#F00"
        />
      </View>
      <View style={styles.col}>
        <CheckBox
          checked={isSunday}
          onPress={async () => await addToList(days[0], isSunday, setIsSunday)}
          iconRight
          // checkedColor="#0F0"
          fontFamily={constants.Fonts.text}
          containerStyle={styles.checkBox}
          checkedIcon={
            <CircleCheckBox size={circleSize} fill={constants.colors.GREEN} />
          }
          uncheckedIcon={<CircleCheckBox size={circleSize} />}
          textStyle={styles.dateTxt}
          title="Sunday"
          titleProps={{}}
          uncheckedColor="#F00"
        />
        <CheckBox
          checked={isMonday}
          onPress={async () => await addToList(days[1], isMonday, setIsMonday)}
          iconRight
          fontFamily={constants.Fonts.text}
          containerStyle={styles.checkBox}
          checkedIcon={
            <CircleCheckBox size={circleSize} fill={constants.colors.GREEN} />
          }
          uncheckedIcon={<CircleCheckBox size={circleSize} />}
          textStyle={styles.dateTxt}
          title="Monday"
          titleProps={{}}
          // uncheckedColor="#F00"
        />
        <CheckBox
          checked={isTuesday}
          onPress={async () =>
            await addToList(days[2], isTuesday, setIsTuesday)
          }
          iconRight
          fontFamily={constants.Fonts.text}
          containerStyle={styles.checkBox}
          checkedIcon={
            <CircleCheckBox size={circleSize} fill={constants.colors.GREEN} />
          }
          uncheckedIcon={<CircleCheckBox size={circleSize} />}
          textStyle={styles.dateTxt}
          title="Tuesday"
          titleProps={{}}
          uncheckedColor="#F00"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'flex-end',

    // alignItems: 'flex-',
    // backgroundColor: constants.colors.BGC,
  },
  col: {
    // flex: 1,
    // width: '50%',
    alignItems: 'flex-end',
    // backgroundColor: 'white',
    // justifyContent: 'center',
  },
  dateTxt: {
    fontSize: 15,
    fontWeight: 'normal',
    color: constants.colors.BGC,
    fontFamily: constants.Fonts.text,
  },
  checkBox: {
    // backgroundColor: constants.colors.BGC,
    // marginRight: 5,
    // borderRadius: 100,
    backgroundColor: 'transparent',
    margin: 0,
    padding: 3,
    alignItems: 'center',
    // borderColor: constants.colors.BGC,
  },
});
