import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import React from 'react';
import constants, {searchTasksData} from '../assets/constants';
import SVG from '../assets/svg';
import {Keyboard} from 'react-native';
import {LayoutChangeEvent} from 'react-native';
import SearchElement from '../components/search/SearchElement';
import Line from '../components/Line';
import {useNavigation} from '@react-navigation/core';
// import {ScrollView} from 'react-native-gesture-handler';
const {HEIGHT, WIDTH} = constants;
const paddingHorizontal = WIDTH * (80 / 896);
const paddingVertical = HEIGHT * (45 / 896);
const realHeight = HEIGHT - 2 * paddingVertical;
const xBtnSize = 40;
const Search = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [searchHeight, setSearchHeight] = React.useState(60);
  const navigate = useNavigation();
  const [flashListHeight, setFlashListHeight] = React.useState<
    number | undefined
  >(undefined);
  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {height, width} = event.nativeEvent.layout;
    setSearchHeight(height);
    setFlashListHeight(realHeight - searchHeight - xBtnSize);
  }, []);
  return (
    <View style={styles.container}>
      <View onLayout={onLayout} style={styles.searchContainer}>
        <SVG.SearchBtn height={18} style={{top: 21, alignSelf: 'flex-end'}} />
        <TextInput
          value={inputValue}
          placeholder={
            !inputValue ? 'You can search for anything you want' : ''
          }
          cursorColor={constants.colors.GREEN}
          style={[
            styles.inputTxt,
            {fontSize: inputValue ? 24 : 11, height: 30},
          ]}
          placeholderTextColor={constants.colors.UNDER_LINE}
          onChangeText={setInputValue}
        />
      </View>

      {/* <Pressable style={{flex: 1, backgroundColor: 'blue'}}> */}
      <View style={[styles.searchContent, {height: flashListHeight}]}>
        <ScrollView
          style={{flexGrow: 1}}
          fadingEdgeLength={150}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled>
          <SearchElement title="TASKS" data={searchTasksData} />
          <Line strength={1} lineColor={constants.colors.UNDER_LINE} />
          <SearchElement title="LIST & NOTES" data={searchTasksData} />
          <Line strength={1} lineColor={constants.colors.UNDER_LINE} />
          <SearchElement title="MESSEGE TO MYSELF" data={searchTasksData} />
          <Line strength={1} lineColor={constants.colors.UNDER_LINE} />
          <SearchElement title="MESSEGE TO MYSELF" data={searchTasksData} />
          <Line strength={1} lineColor={constants.colors.UNDER_LINE} />
          <SearchElement title="MESSEGE TO MYSELF" data={searchTasksData} />
          <Line strength={1} lineColor={constants.colors.UNDER_LINE} />
          <SearchElement title="MESSEGE TO MYSELF" data={searchTasksData} />
        </ScrollView>
      </View>
      {/* </Pressable> */}
      <SVG.XBtn
        onPress={() => navigate.navigate('HomePage')}
        height={xBtnSize}
        style={{
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal,
    paddingVertical,
    height: HEIGHT,
    backgroundColor: constants.colors.BGC,
  },
  searchContainer: {},
  searchContent: {
    flexGrow: 1,
    // backgroundColor: 'red',
  },
  inputTxt: {
    fontFamily: constants.Fonts.text,
    color: constants.colors.GREEN,
    borderBottomColor: constants.colors.OFF_WHITE,
    borderBottomWidth: 1,
    // backgroundColor: 'blue',
    textAlignVertical: 'center',
    fontSize: 12,
    width: '100%',
    top: 0,
    padding: 0,
    // bottom: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});
