import {StyleSheet, View} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import SVG from '../assets/svg';
import constants from '../assets/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useLogoutMutation} from '../app/api/userApi';
interface ICustomerDrawer extends DrawerContentComponentProps {
  isSignIn?: boolean;
}

const CustomDrawer: React.FC<ICustomerDrawer> = props => {
  const [Logout, {isLoading, data, isSuccess, isError, error}] =
    useLogoutMutation();

  const handleLogout = async () => {
    try {
      await Logout(null);
    } catch (err) {
      console.log('an error at logout', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SVG.HereLogo height="100%" width="70%" />
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {props.isSignIn && (
          <DrawerItem
            label="logout"
            labelStyle={styles.label}
            onPress={handleLogout}
            icon={({color, focused}) => (
              <Ionicons
                name={focused ? 'md-exit' : 'md-exit-outline'}
                size={20}
                style={[styles.icon, {color}]}
              />
            )}
          />
        )}
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: constants.colors.BGC,
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {position: 'absolute', right: '5%'},
  label: {
    fontFamily: constants.Fonts.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
