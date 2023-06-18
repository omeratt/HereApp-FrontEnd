import {StyleSheet, Text, Modal, View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import Pdf from 'react-native-pdf';
import constants from '../assets/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setFocus} from '../app/Reducers/User/screensSlice';
const pdf = require('../assets/privacy/term_of_use.pdf');
const TermOfUse = () => {
  const navigation = useNavigation();
  const back = () => navigation.goBack();
  const dispatch = useDispatch();
  useEffect(() => {
    const subscribe = navigation.addListener('focus', e => {
      dispatch(setFocus({termOfUse: true}));
    });
    return subscribe;
  }, []);
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{
          height: '5%',
          paddingRight: '5%',
          borderBottomColor: constants.colors.UNDER_LINE,
          borderBottomWidth: 1,
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0,0.2)',
        }}
        onPress={back}>
        <AntDesign
          name="rightcircleo"
          size={constants.HEIGHT * 0.025}
          color={constants.colors.UNDER_LINE}
        />
      </TouchableOpacity>
      <Pdf
        source={{uri: 'bundle-assets://term_of_use.pdf'}}
        trustAllCerts={false}
        onError={error => {
          console.log(error);
        }}
        style={{flex: 1}}
      />
    </View>
  );
};

export default TermOfUse;

const styles = StyleSheet.create({});
