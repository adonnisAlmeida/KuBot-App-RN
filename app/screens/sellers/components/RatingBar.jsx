import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../constants/Colors';
import {Typography} from '../../../components';

const RatingBar = ({calification, number, total}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
      }}>
      <MaterialIcons
        name={true ? 'star' : 'star-border'}
        size={25}
        color='#828282'
      />
      <Typography>{number}</Typography>
      <View
        style={{
          width: 150,
          backgroundColor: '#d3d1d0',
          borderRadius: 40,
          marginHorizontal: 5,
        }}>
        <View
          style={{
            width: (calification * 100 / total) + '%',
            backgroundColor: '#1e83a9',
            borderRadius: 40,
          }}>
          <Text></Text>
        </View>
      </View>
      <Typography>{calification}</Typography>
    </View>
  );
};

export default RatingBar;

const styles = StyleSheet.create({});
