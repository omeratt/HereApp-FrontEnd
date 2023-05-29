import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import constants, {searchTasksData} from '../assets/constants';
import SVG from '../assets/svg';
import {Keyboard} from 'react-native';
import {LayoutChangeEvent} from 'react-native';
import SearchElement from '../components/search/SearchElement';
import Line from '../components/Line';
import {useNavigation} from '@react-navigation/core';
import {useSearchQuery} from '../app/api/searchApi';
import Animated, {SequencedTransition} from 'react-native-reanimated';
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
  const {data: searchResult} = useSearchQuery({input: inputValue});
  const shouldDisplayList = useMemo(
    () => searchResult?.lists && searchResult?.lists?.length > 0,
    [searchResult],
  );
  const shouldDisplayTask = useMemo(
    () => searchResult?.tasks && searchResult?.tasks?.length > 0,
    [searchResult],
  );
  const shouldDisplayMsg = useMemo(
    () => searchResult?.messages && searchResult?.messages?.length > 0,
    [searchResult],
  );
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

      <View style={[styles.searchContent, {height: flashListHeight}]}>
        <Animated.ScrollView
          contentContainerStyle={{flex: 1}}
          style={{flex: 1}}
          fadingEdgeLength={150}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled>
          {shouldDisplayTask && (
            <SearchElement title="TASKS" items={searchResult?.tasks} />
          )}
          {shouldDisplayTask && (shouldDisplayList || shouldDisplayMsg) && (
            <Line strength={1} lineColor={constants.colors.UNDER_LINE} />
          )}
          {shouldDisplayList && (
            <SearchElement title="LIST & NOTES" items={searchResult?.lists} />
          )}
          {shouldDisplayMsg && (shouldDisplayTask || shouldDisplayList) && (
            <Line strength={1} lineColor={constants.colors.UNDER_LINE} />
          )}
          {shouldDisplayMsg && (
            <SearchElement
              title="MESSAGE TO MYSELF"
              items={searchResult?.messages}
            />
          )}
        </Animated.ScrollView>
      </View>
      <SVG.XBtn
        onPress={() => navigate.navigate('HomePage' as never)}
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
