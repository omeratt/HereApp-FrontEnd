import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Animated, {
  FadeInUp,
  SlideInDown,
  SlideInRight,
} from 'react-native-reanimated';
import constants from '../assets/constants';
import CircleCheckBox from './CircleCheckBox';
import {CheckBox} from '@rneui/themed';

interface RenderItemProps {
  name?: string;
  details?: string;
  expires?: string;
  done: false;
}
interface props {
  data: any[];
}
const emptyList = () => (
  <ActivityIndicator size={30} color={constants.colors.GREEN} />
);
export default function DisplayTask({data}: props) {
  const renderItem: ListRenderItem<RenderItemProps> = ({item, index}) => (
    <Animated.View
      style={styles.taskListContainer}
      entering={SlideInDown.delay(index * 100).duration(1000)}>
      <View style={styles.taskListContent}>
        <Text style={styles.taskContentTitle}>{item.name}</Text>
        <Text style={styles.taskContentBody}>{item.details}</Text>
      </View>
      <View>
        <CheckBox
          checked={item.done}
          // onPress={async () =>
          //   await addToList(days[3], isWednesday, setIsWednesday)
          // }
          iconRight
          fontFamily={constants.Fonts.text}
          containerStyle={styles.checkBox}
          checkedIcon={
            <CircleCheckBox
              size={25}
              fill={constants.colors.GREEN}
              borderColor={constants.colors.UNDER_LINE}
            />
          }
          uncheckedIcon={
            <CircleCheckBox
              size={25}
              borderColor={constants.colors.UNDER_LINE}
            />
          }
          textStyle={styles.taskTxt}
          // title="Wednesday"
          titleProps={{}}
          uncheckedColor="#F00"
        />
      </View>
    </Animated.View>
  );

  return (
    <View
      //   style={styles.taskListContainer}

      style={{
        // height: '100%',
        // width: '100%',

        // justifyContent: 'center',
        // flexDirection: 'row',
        // marginTop: '2.5%',
        paddingTop: '6.5%',
        // paddingBottom: '2%',
        // height: `60%`,
        // flexDirection: 'row',
        // padding: '10%',
        justifyContent: 'center',
        // backgroundColor: 'blue',
        // alignItems: 'center',
        // alignItems: 'center',
      }}>
      <FlatList
        data={data}
        ListEmptyComponent={emptyList}
        contentContainerStyle={{height: '135%'}}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  taskListContainer: {
    marginTop: '3.5%',
    // height: `60%`,
    flexDirection: 'row',
    // padding: '10%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'blue',
    // alignContent: 'center',
    // backgroundColor: 'red',
  },
  taskTxt: {
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
    padding: 0,
    // alignItems: 'center',
    // borderColor: constants.colors.BGC,
  },
  Shadow: {
    borderRadius: 12.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 2,
  },
  taskListContent: {
    height: 65,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    width: '80%',
    // marginRight: '3%',
    // position: 'relative',
    padding: '3%',
    elevation: 5,
    backgroundColor: constants.colors.OFF_WHITE,
  },
  taskContentTitle: {
    fontFamily: constants.Fonts.text,
    fontWeight: 'bold',
    fontSize: 14,
    color: constants.colors.BLACK,
  },
  taskContentBody: {
    fontFamily: constants.Fonts.text,
    // fontWeight: '700',
    fontSize: 12.5,
    color: constants.colors.UNDER_LINE,
  },
  taskListHighlight: {
    position: 'absolute',
    right: 0,
    backgroundColor: constants.colors.GREEN,
    height: '45%',
    width: '8.5%',
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    borderRadius: 800,
  },
});
