import {FlatList, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import constants from '../../assets/constants';
import MyListAndNotes from '../../components/MyListAndNotes';
import ListItem from './ListItem';

const ListAndNotes = () => {
  let data = [
    {description: 'interacrive'},
    {description: 'broadcast'},
    {description: 'design'},
    {description: 'home'},
  ];
  const checkBoxSize = constants.HEIGHT * (22.95 / 896);
  return (
    <MyListAndNotes title="Homework">
      <FlatList
        data={data}
        renderItem={props => (
          <ListItem
            isCheckBox={false}
            showLine={false}
            flag={false}
            iconSize={checkBoxSize}
            type="NUMBERS"
            description={props.item.description}
            {...props}
          />
        )}
        style={styles.listContainerContent}
      />
    </MyListAndNotes>
  );
};

export default memo(ListAndNotes);

const styles = StyleSheet.create({
  listContainerContent: {
    paddingVertical: '7%',
  },
});
