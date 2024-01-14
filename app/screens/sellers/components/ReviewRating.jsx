import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../constants/Colors';
import {Typography} from '../../../components';
import RatingBar from './RatingBar';

const ReviewRating = ({reviews}) => {
  const [count, setCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [califications, setCalifications] = useState([]);

  useEffect(() => {
    if (reviews.length > 0) {
      let uno = 0;
      let dos = 0;
      let tres = 0;
      let cuatro = 0;
      let cinco = 0;
      reviews.map(review => {
        if (
          review.approvalStatus != 'PENDING' ||
          review.approvalStatus != 'DISAPPROVED' ||
          review.approvalStatus != null
        ) {
          switch (review.rating) {
            case 1:
              cinco += 1;
              break;
            case 2:
              cuatro += 1;
              break;
            case 3:
              tres += 1;
              break;
            case 4:
              dos += 1;
              break;
            case 5:
              uno += 1;
              break;
          }
          setCalifications([cinco, cuatro, tres, dos, uno]);
          setCount(oldState => oldState + 1);
          setRating(oldState => oldState + review.rating);
        }
      });
    }
  }, []);

  console.log(' >>>>>> ', Math.round(rating / count))

  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        alignContent: 'center',
      }}>
      <View
        style={{
          alignItems: 'center',
        }}>
        <Typography size={40}>{(rating / count).toFixed(1)}</Typography>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <MaterialIcons
            name={Math.round(rating / count) >= 1 ? 'star' : 'star-border'}
            size={25}
            color={
                Math.round(rating / count) >= 1 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF
            }
          />
          <MaterialIcons
            name={Math.round(rating / count) >= 2 ? 'star' : 'star-border'}
            size={25}
            color={
                Math.round(rating / count) >= 2 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF
            }
          />
          <MaterialIcons
            name={Math.round(rating / count) >= 3 ? 'star' : 'star-border'}
            size={25}
            color={
                Math.round(rating / count) >= 3 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF
            }
          />
          <MaterialIcons
            name={Math.round(rating / count) >= 4  ? 'star' : 'star-border'}
            size={25}
            color={
                Math.round(rating / count) >= 4 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF
            }
          />
          <MaterialIcons
            name={Math.round(rating / count) >= 5  ? 'star' : 'star-border'}
            size={25}
            color={
                Math.round(rating / count) >= 5 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF
            }
          />
        </View>
        <Typography>{count} calificaciones</Typography>
      </View>
      <View style={{marginLeft: 5}}>
        <RatingBar calification={califications[4]} number={5} total={count}/>
        <RatingBar calification={califications[3]} number={4} total={count}/>
        <RatingBar calification={califications[2]} number={3} total={count}/>
        <RatingBar calification={califications[1]} number={2} total={count}/>
        <RatingBar calification={califications[0]} number={1} total={count}/>
      </View>
    </View>
  );
};

export default ReviewRating;

const styles = StyleSheet.create({
  test: {
    flexDirection: 'row',
    backgroundColor: '#555555',
    heigth: 10,
  },
});
