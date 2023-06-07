import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import constants from '../assets/constants';
import SVG from '../assets/svg';
import {Keyboard} from 'react-native';
import {LayoutChangeEvent} from 'react-native';
import SearchElement from '../components/search/SearchElement';
import Line from '../components/Line';
import {useNavigation} from '@react-navigation/core';
import {useSearchQuery} from '../app/api/searchApi';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutUp,
} from 'react-native-reanimated';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import NewTask from '../components/NewTask';
import {ITaskSearchResult} from '../components/search/types';
import {TaskType} from '../app/Reducers/User/userSlice';
import {useAddOrEditTaskMutation} from '../app/api/taskApi';
const {HEIGHT, WIDTH} = constants;
const paddingHorizontal = WIDTH * (80 / 896);
const paddingVertical = HEIGHT * (45 / 896);
const realHeight = HEIGHT - 2 * paddingVertical;
const xBtnSize = 40;
const Search = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['100%'], []);
  const [selectedTask, setSelectedTask] = React.useState<ITaskSearchResult>();
  const [inputValue, setInputValue] = React.useState('');
  const [searchHeight, setSearchHeight] = React.useState(60);
  const navigate = useNavigation();
  const [addOrEditTask] = useAddOrEditTaskMutation();
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
  const openTaskModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const closeTaskModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    // setEditTaskDetails?.(undefined);
  }, [bottomSheetModalRef.current]);
  const handleSheetChanges = useCallback((index: number) => {}, []);
  return (
    <>
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.container}>
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutUp}
          onLayout={onLayout}
          style={styles.searchContainer}>
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
        </Animated.View>

        <View style={[styles.searchContent, {height: flashListHeight}]}>
          <Animated.ScrollView
            contentContainerStyle={{flexGrow: 1}}
            style={{flex: 1}}
            fadingEdgeLength={150}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled>
            {shouldDisplayTask && (
              <SearchElement
                title="TASKS"
                items={searchResult?.tasks}
                setSelectedTask={setSelectedTask}
                openTaskModal={openTaskModal}
              />
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
      </Animated.View>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          keyboardBlurBehavior="restore"
          handleIndicatorStyle={{backgroundColor: constants.colors.UNDER_LINE}}
          handleStyle={{
            backgroundColor: constants.colors.OFF_WHITE,
          }}
          onChange={handleSheetChanges}>
          <NewTask
            closeModal={closeTaskModal}
            task={selectedTask as TaskType}
            AddTask={addOrEditTask}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
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
    textAlign: 'left',
    fontSize: 12,
    width: '100%',
    top: 0,
    padding: 0,
    // bottom: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});
