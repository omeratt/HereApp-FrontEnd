import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import TextInput, {InputHandle} from '../components/TextInput';
import constants from '../assets/constants';
import * as Yup from 'yup';
import {Formik, FormikProps} from 'formik';
import {useLoginMutation, useLoginWithGoogleMutation} from '../app/api/userApi';
import {
  GoogleSigninButton,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {GOOGLE_WEB_CLIENT_ID} from '@env';
interface props {
  hideScreen: () => void;
  ErrTxt: ({txt}: any, {touched}: any) => JSX.Element | any;
  emailFromSignUp?: string;
}
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email!').required('Email is required'),
  password: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});
export default function SignInForm({
  hideScreen,
  ErrTxt,
  emailFromSignUp = '',
}: props) {
  // const EmailInputRef = React.useRef<InputHandle>(null);
  const userInfo = {
    email: emailFromSignUp,
    password: '',
  };
  const EmailInputRef = React.useRef<any>();
  const SecondInputRef = React.useRef<InputHandle>(null);
  const onSubmitEditing = () => {
    SecondInputRef?.current?.onFocus();
  };

  const [login, {isLoading, data, isSuccess, isError, error}] =
    useLoginMutation();
  const [GoogleLogIn, {isLoading: GLoading, isError: GIsError}] =
    useLoginWithGoogleMutation();

  const googleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      // dispatch(loadingModal(true));
      // console.log(idToken);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const user = await auth().signInWithCredential(googleCredential);
      // console.log(user);
      await GoogleLogIn(undefined);

      // if (user) loginSaga();
    } catch (error: any) {
      // const obj = getFailedMessage(error?.message);
      // showError(obj);
    } finally {
      // dispatch(loadingModal(false));
    }
  }, []);
  const submit = async (values: typeof userInfo) => {
    //todo submit values and hide screen with hideScreen function
    const x = await login(values);
    // console.log('xxx', x);
  };
  useEffect(() => {
    EmailInputRef.current &&
      EmailInputRef.current?.setFieldValue('email', emailFromSignUp);
  }, [emailFromSignUp]);

  return (
    <Formik
      innerRef={EmailInputRef}
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
          <View
            style={{
              paddingTop: '2%',
              position: 'absolute',
              alignItems: 'center',
              width: '70%',
              // backgroundColor: 'black',
            }}>
            <ErrTxt
              txt={error ? (error as any)?.data?.message : undefined}
              touched={error ? true : false}
            />
          </View>
          <TextInput
            onChangeText={handleChange('email')}
            value={values.email}
            placeholder="Email"
            keyboardType="email-address"
            onBlur={() => setFieldTouched('email')}
            onSubmitEditing={onSubmitEditing}
          />
          <ErrTxt txt={errors.email} touched={touched.email} />

          <TextInput
            ref={SecondInputRef}
            onChangeText={handleChange('password')}
            value={values.password}
            secureTextEntry
            placeholder="Password"
            onBlur={() => setFieldTouched('password')}
            onSubmitEditing={() => {
              handleSubmit();
            }}
          />
          <ErrTxt txt={errors.password} touched={touched.password} />
          <View
            style={{marginTop: '7%', width: '70%', alignItems: 'flex-start'}}>
            <Text style={[styles.forgotPassword]}>Forgot Password ?</Text>
          </View>

          <View
            style={{
              marginTop: '10%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={styles.button}
              disabled={!isValid}
              onPress={() => handleSubmit()}>
              {isLoading ? (
                <ActivityIndicator color={constants.colors.GREEN} />
              ) : (
                <Text style={[styles.text]}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              height: '20%',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <GoogleSigninButton
              // style={styles.button}
              size={GoogleSigninButton.Size.Standard}
              color={GoogleSigninButton.Color.Dark}
              // disabled={!isValid}
              onPress={googleSignIn}
            />
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
    marginBottom: '4%',
  },
});
