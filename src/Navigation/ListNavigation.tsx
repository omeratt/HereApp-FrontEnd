// CreateProfileNavigator.tsx

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ListAndNotes from '../screens/list/ListAndNotes';
import Lists from '../screens/list/Lists';
import MyLists from '../screens/list/MyLists';
import NewList from '../screens/list/NewList';
const Stack = createNativeStackNavigator();

const ListAndNotesNavigator = () => {
  const options = {headerShown: false};
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListAndNotes"
        component={ListAndNotes}
        options={options}
      />
      <Stack.Screen name="Lists" component={Lists} options={options} />
      <Stack.Screen name="MyLists" component={MyLists} options={options} />
      <Stack.Screen name="NewList" component={NewList} options={options} />
    </Stack.Navigator>
  );
};

export default ListAndNotesNavigator;
