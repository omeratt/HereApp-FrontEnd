// CreateProfileNavigator.tsx

import React from 'react';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import ListAndNotes from '../screens/list/ListAndNotes';
import MyLists from '../screens/list/MyLists';
import CreateOrEditList from '../screens/list/CreateOrEditList';
import NewListCategory from '../screens/list/NewListCategory';
import NewListTitle from '../screens/list/NewListTitle';

const Stack = createNativeStackNavigator();

const ListAndNotesNavigator = () => {
  const options: NativeStackNavigationOptions = {headerShown: false};

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListAndNotes"
        component={ListAndNotes}
        options={options}
      />
      <Stack.Screen name="MyLists" component={MyLists} options={options} />
      <Stack.Screen
        name="CreateOrEditList"
        component={CreateOrEditList}
        options={options}
      />
      <Stack.Screen
        name="NewListTitle"
        component={NewListTitle}
        options={options}
      />
      <Stack.Screen
        name="NewListCategory"
        component={NewListCategory}
        options={options}
      />
    </Stack.Navigator>
  );
};

export default ListAndNotesNavigator;
