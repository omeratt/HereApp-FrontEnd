import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import React, {Dispatch, SetStateAction, useRef} from 'react';
import TextInput, {InputHandle} from '../components/TextInput';
import constants from '../assets/constants';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {useSignupMutation} from '../app/api/userApi';
import {useDispatch} from 'react-redux';
import {selectUser} from '../app/Reducers/User/userSlice';
import {useAppSelector} from '../app/hooks';

interface props {
  hideScreen: () => void;
  ErrTxt: ({txt}: any, {touched}: any) => JSX.Element | any;
  goToSignIn: () => void;
  setEmailFromSignUp: Dispatch<SetStateAction<string>>;
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
export default function SignUpForm({
  hideScreen,
  ErrTxt,
  goToSignIn,
  setEmailFromSignUp,
}: props) {
  const refs = Array.from(Array(3), () => useRef<InputHandle>(null));
  const onSubmitEditing = (index: number) => {
    refs[index]?.current?.onFocus();
  };

  const [signup, {isLoading, data, isSuccess, isError, error}] =
    useSignupMutation();

  const submit = async (values: typeof userInfo) => {
    try {
      Keyboard.dismiss();
      const data = await signup(values).unwrap();
      setEmailFromSignUp(values.email);
      goToSignIn();
    } catch (err) {
      console.log('error from signup', err);
    }
  };
  // React.useEffect(() => {
  //   if (isSuccess) {
  //   }
  // }, [data, error]);

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
            onSubmitEditing={() => onSubmitEditing(0)}
          />
          <ErrTxt txt={errors.email} touched={touched.email} />

          <TextInput
            ref={refs[0]}
            onChangeText={handleChange('fullName')}
            value={values.fullName}
            placeholder="Full Name"
            keyboardType="name-phone-pad"
            onBlur={() => setFieldTouched('fullName')}
            onSubmitEditing={() => onSubmitEditing(1)}
          />
          <ErrTxt txt={errors.fullName} touched={touched.fullName} />

          <TextInput
            ref={refs[1]}
            onChangeText={handleChange('password')}
            value={values.password}
            secureTextEntry
            placeholder="Password"
            onBlur={() => setFieldTouched('password')}
            onSubmitEditing={() => onSubmitEditing(2)}
          />
          <ErrTxt txt={errors.password} touched={touched.password} />

          <TextInput
            ref={refs[2]}
            onChangeText={handleChange('confirmPassword')}
            value={values.confirmPassword}
            secureTextEntry
            placeholder="Repeat Password"
            onBlur={() => setFieldTouched('confirmPassword')}
            onSubmitEditing={handleSubmit}
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
              {isLoading ? (
                <ActivityIndicator color={constants.colors.UNDER_LINE} />
              ) : (
                <Text style={[styles.text]}>Sign Up</Text>
              )}
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

    fontFamily: constants.Fonts.text,
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
