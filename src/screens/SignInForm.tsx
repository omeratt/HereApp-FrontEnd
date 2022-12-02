import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import TextInput from '../components/TextInput';
import constants from '../assets/constants';
import * as Yup from 'yup';
import {Formik} from 'formik';
interface props {
  hideScreen: () => void;
  ErrTxt: ({txt}: any, {touched}: any) => JSX.Element | any;
}
const validationSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, 'Invalid name!')
    .required('Full Name is required'),
  email: Yup.string().email('Invalid email!').required('Email is required'),
  password: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string().equals(
    [Yup.ref('password')],
    'Password does not match',
  ),
});
const userInfo = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
export default function SignInForm({hideScreen, ErrTxt}: props) {
  const submit = (values: typeof userInfo) => {
    //todo submit values and hide screen with hideScreen function
    console.log(values);
  };
  return (
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={submit}>
      {({
        values,
        handleChange,
        errors,
        touched,
        setFieldTouched,
        isValid,
        handleSubmit,
      }) => (
        <>
          <TextInput
            onChangeText={handleChange('email')}
            value={values.email}
            placeholder="Email"
            keyboardType="email-address"
            onBlur={() => setFieldTouched('email')}
          />
          <ErrTxt txt={errors.email} touched={touched.email} />

          <TextInput
            onChangeText={handleChange('password')}
            value={values.password}
            secureTextEntry
            placeholder="Password"
            onBlur={() => setFieldTouched('password')}
          />
          <ErrTxt txt={errors.password} touched={touched.password} />
          <View
            style={{marginTop: '10%', width: '70%', alignItems: 'flex-end'}}>
            <Text style={[styles.forgotPassword]}>Forgot Password ?</Text>
          </View>

          <View style={{marginTop: '10%'}}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}>
              <Text style={[styles.text]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  text: {
    color: constants.colors.BGC,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
  },
  forgotPassword: {
    color: constants.colors.BGC,
    paddingLeft: '1%',
    fontSize: 13,
  },
  button: {
    borderRadius: 20,
    borderWidth: 0.9,
    borderColor: constants.colors.UNDER_LINE,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
