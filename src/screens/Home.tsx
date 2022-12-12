import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.task}>
          <View style={styles.today}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.taskTitle}>Today</Text>
          </View>
          <View style={styles.date}>
            <View style={styles.dateContent}>
              {/*TODO: horizontal flatlist*/}
              {/* <Text style={{color: 'black'}}>mon</Text>
              <Text style={{color: 'black'}}>25</Text> */}
            </View>
          </View>
          {/*TODO: vertical flatlist*/}
        </View>
        <View style={styles.myListContainer}>
          <View style={styles.myList}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.myListTitle}>My lists</Text>
          </View>
          <View style={styles.myListCategory}>
            <Text style={{color: 'black', textAlign: 'center'}}>
              home todo's
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.middleView}></View>
      <View style={styles.bottomView}>
        <SVG.Search height="100%" width="30%" />
        <SVG.Search height="100%" width="30%" />
        <SVG.Timer fill={constants.colors.BLACK} height="100%" width="30%" />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: constants.colors.OFF_WHITE,
    padding: '3%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  topView: {
    height: '61.9%',
    width: '100%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    // justifyContent: 'space-evenly',
  },
  middleView: {
    height: '21.5%',
    width: '100%',
  },
  bottomView: {
    // alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '8.7%',
    width: '60%',
    flexDirection: 'row',
  },
  task: {
    height: '75.5%',
    borderColor: constants.colors.UNDER_LINE,
    borderBottomWidth: 1,
    padding: '5%',
    position: 'relative',
  },
  today: {},
  taskTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 40,
  },
  plusIcon: {
    position: 'absolute',
    color: constants.colors.BLACK,
    left: '6.5%',
    top: '3%',
  },
  dateContainer: {},
  date: {
    height: '23.5%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
  },
  dateContent: {
    flexDirection: 'column',
  },
  taskList: {flexDirection: 'column'},
  myListContainer: {
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '3%',
    position: 'relative',
  },
  myList: {marginBottom: 6},
  myListTitle: {
    fontFamily: constants.Fonts.paragraph,
    color: constants.colors.BLACK,
    fontSize: 25,
  },
  myListCategory: {
    height: '23.5%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    justifyContent: 'center',
    alignContent: 'center',
  },
  bottomBox: {
    height: 50,
    width: 50,
    borderBottomColor: constants.colors.UNDER_LINE,
    borderRadius: 15,
    borderWidth: 1,
  },
});
