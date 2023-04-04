import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Animated, {SlideInDown, SlideOutRight} from 'react-native-reanimated';
import constants from '../assets/constants';
import CircleCheckBox from './CircleCheckBox';
import {CheckBox} from '@rneui/themed';
import {useDeleteTaskMutation} from '../app/api/taskApi';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const height = constants.HEIGHT * 0.25143823768886817258883248730964;
interface RenderItemProps {
  _id?: string;
  name?: string;
  details?: string;
  expires?: string;
  done: false;
}
interface props {
  data: any[];
  isTaskLoading: boolean;
}
export default function DisplayTask({data, isTaskLoading}: props) {
  // if (!data || data.length === 0) return <React.Fragment />;
  const [
    DeleteTask,
    {isLoading, data: responseDelete, isSuccess, isError, error},
  ] = useDeleteTaskMutation();
  const onPressDelete = (_id: string) => {
    try {
      DeleteTask(_id).unwrap();
      closeDeleteModal();
    } catch (err: any) {
      console.log('err in delete', err);
    }
  };
  let timer: any;
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);
  const [deleteProps, setDeleteProps] = useState({id: '', name: ''});
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['15%', '15%'], []);

  // callbacks
  const closeDeleteModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const openDeleteModal = (props: {name: string; id: string}) => {
    if (timer) clearTimeout(timer);
    setDeleteProps(props);
    //todo without timer - with send props on present()
    timer = setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 150);
  };
  const DeleteModal = ({_id, name}: {_id: string; name: string}) => {
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        // contentHeight={constants.HEIGHT}
        // detached

        backgroundStyle={{backgroundColor: constants.colors.GREEN}}
        stackBehavior="replace"
        // onChange={handleSheetChanges}
      >
        <View
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
          }}>
          <Text style={[styles.deleteTxt]}>
            Are you sure you want to delete
          </Text>
          <Text style={[styles.deleteTxt, {marginBottom: '2%'}]}>
            {deleteProps.name}
          </Text>
          <View
            style={{
              // height: '100%',
              width: '70%',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row-reverse',
            }}>
            <TouchableOpacity
              style={{
                // backgroundColor: '#DD3C2E',
                width: '35%',
                borderColor: constants.colors.UNDER_LINE,
                borderRadius: 100,
                borderWidth: 1,
              }}
              onPress={() => onPressDelete(deleteProps.id)}>
              <Text style={styles.deleteTxt}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '35%'}} onPress={closeDeleteModal}>
              <Text style={styles.deleteTxt}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    );
  };
  const emptyList = () => {
    console.log(data, 'emptyList DisplayTask.tsx');
    if (data === undefined)
      return <ActivityIndicator size={30} color={constants.colors.GREEN} />;
    else return null;
  };
  const renderItem: ListRenderItem<RenderItemProps> = ({item, index}) => {
    return (
      <Animated.View
        style={styles.taskListContainer}
        // exiting={SlideOutRight.duration(600)}
        // entering={SlideInDown.delay(index * 50).duration(500)}
      >
        <View style={styles.taskListContent}>
          <TouchableOpacity
            // onPress={() => {
            //   handlePresentModalPress(item.name as string, item._id as string);
            // }}
            onPress={() =>
              openDeleteModal({
                name: item.name as string,
                id: item._id as string,
              })
            }>
            <Text style={styles.taskContentTitle}>12.00</Text>
            <Text style={styles.taskContentTitle}>{item.name}</Text>
            <Text style={styles.taskContentBody}>{item.details}</Text>
          </TouchableOpacity>
          <CheckBox
            checked={item.done}
            iconRight
            fontFamily={constants.Fonts.text}
            containerStyle={{
              position: 'absolute',
              right: 2,
              backgroundColor: 'transparent',
            }}
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
                fill={constants.colors.GREEN}
                borderColor={constants.colors.UNDER_LINE}
              />
            }
            textStyle={styles.taskTxt}
            // title="Wednesday"
            titleProps={{}}
            uncheckedColor="#F00"
          />
        </View>
        {/* <View>
          <CheckBox
            checked={item.done}
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
        </View> */}
      </Animated.View>
    );
  };
  console.log({he: constants.HEIGHT});
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {isTaskLoading ? (
        <ActivityIndicator size={30} color={constants.colors.GREEN} />
      ) : (
        <View
          style={{
            width: '100%',
            height: constants.HEIGHT * 0.25143823768886817258883248730964,
          }}
          onLayout={e => {
            console.log(e.nativeEvent.layout);
          }}>
          {/* <View style={{width: '100%', height: constants.HEIGHT * 0.639 * 0.755}}> */}
          <FlatList
            data={data}
            ListEmptyComponent={emptyList}
            renderItem={renderItem}
            keyExtractor={item => item._id as string}
            contentContainerStyle={{paddingVertical: 40}}
          />
          <DeleteModal
            _id={deleteProps.id as string}
            name={deleteProps.name as string}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  taskListContainer: {
    marginTop: '3.5%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: '95%',
    height: height * 0.45,

    // height
    // backgroundColor: 'red',
  },
  taskTxt: {
    fontSize: 15,
    fontWeight: 'normal',
    color: constants.colors.BGC,
    fontFamily: constants.Fonts.text,
  },
  checkBox: {
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
  },
  taskListContent: {
    // height: constants.HEIGHT * 0.1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: constants.colors.UNDER_LINE,
    width: '100%',
    padding: '3%',
    elevation: 5,
    justifyContent: 'center',
    // backgroundColor: 'red',
    // zIndex: 9999,
  },
  taskContentTitle: {
    fontFamily: constants.Fonts.text,
    fontWeight: 'bold',
    fontSize: 14,
    color: constants.colors.BLACK,
  },
  taskContentBody: {
    fontFamily: constants.Fonts.text,
    fontSize: 12.5,
    color: constants.colors.UNDER_LINE,
  },
  deleteTxt: {
    color: constants.colors.BGC,
    fontFamily: constants.Fonts.text,
    fontSize: 15.5,
    textAlign: 'center',
  },
});
