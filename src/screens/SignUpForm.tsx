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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password does not match')
    .required('Confirm Password is required'),
});

const userInfo = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
export default function SignUpForm({hideScreen, ErrTxt}: props) {
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
          <Text style={[styles.text]}></Text>
          <Text style={[styles.text]}>Sign Up</Text>

          <TextInput
            onChangeText={handleChange('email')}
            value={values.email}
            placeholder="Email"
            keyboardType="email-address"
            onBlur={() => setFieldTouched('email')}
          />
          <ErrTxt txt={errors.email} touched={touched.email} />

          <TextInput
            onChangeText={handleChange('fullName')}
            value={values.fullName}
            placeholder="Full Name"
            keyboardType="name-phone-pad"
            onBlur={() => setFieldTouched('fullName')}
          />
          <ErrTxt txt={errors.fullName} touched={touched.fullName} />

          <TextInput
            onChangeText={handleChange('password')}
            value={values.password}
            secureTextEntry
            placeholder="Password"
            onBlur={() => setFieldTouched('password')}
          />
          <ErrTxt txt={errors.password} touched={touched.password} />

          <TextInput
            onChangeText={handleChange('confirmPassword')}
            value={values.confirmPassword}
            secureTextEntry
            placeholder="Repeat Password"
            onBlur={() => setFieldTouched('confirmPassword')}
          />
          <ErrTxt
            txt={errors.confirmPassword}
            touched={touched.confirmPassword}
          />

          <View style={{marginTop: '10%'}}>
            <TouchableOpacity
              style={styles.button}
              disabled={!isValid}
              onPress={() => handleSubmit()}>
              <Text style={[styles.text]}>Sign Up</Text>
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
