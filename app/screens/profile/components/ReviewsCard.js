import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import Colors from '../../../constants/Colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { useTheme } from '@react-navigation/native'
import { printCreated } from '../../../utils/CommonFunctions'

const ReviewsCard = ({ review }) => {
    const { dark, colors } = useTheme()

    //console.log('Firs name', review.user.userName)

    const avatar =
        review.user.avatar !== null
            ? {
                uri: review.user.avatar.url,
            }
            : require('../../../../assets/user_avatar.png')

    const bgColor = () => {
        if (review.approvalStatus == 'PENDING') {
            return Colors.COLORS.WEB_BUTTON
        } else if (review.approvalStatus == 'DISAPPROVED') {
            return Colors.COLORS.WEB_RED
        }
    }

    const borderRadi = () => {
        if (review.approvalStatus == 'PENDING' || review.approvalStatus == 'DISAPPROVED') {
            return 8
        } else {
            return 0
        }
    }

    const cardPadd = () => {
        if (review.approvalStatus == 'PENDING' || review.approvalStatus == 'DISAPPROVED') {
            return 5
        } else {
            return 0
        }
    }

    const inPadd = () => {
        if (review.approvalStatus == 'PENDING' || review.approvalStatus == 'DISAPPROVED') {
            return 13
        } else {
            return 18
        }
    }

    const bordWidth = () => {
        if (review.approvalStatus == 'PENDING' || review.approvalStatus == 'DISAPPROVED') {
            return 0
        } else {
            return 1
        }
    }

    return (
        <View
            style={[styles.card, { backgroundColor: colors.SURFACE, marginBottom: 10, borderWidth: bordWidth(), }]}
        >
            <View style={{
                backgroundColor: bgColor(),
                borderRadius: borderRadi(),
                padding: cardPadd(),
            }}>
                {review.approvalStatus == 'DISAPPROVED' || review.approvalStatus == 'PENDING' ? (
                    <View style={{ alignItems: 'center', paddingBottom: 3 }}>
                        <Typography color={'#fff'} bold>{review.approvalStatus == 'DISAPPROVED' ? 'Desaprobado' : 'Pendiente a aprobación'}</Typography>
                    </View>
                ) : (null)}

                <View style={{
                    /* marginTop: 5,
                    marginBottom: 5, */
                    paddingTop: 10,
                    padding: inPadd(),
                    backgroundColor: '#fff',
                    borderRadius: 8,
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            backgroundColor='white'
                            source={avatar}
                            imageStyle={styles.opinionAvatar}
                            indicator={Progress.Pie}
                            indicatorProps={{
                                color: Colors.COLORS.PRIMARY,
                                borderWidth: 0,
                            }}
                        />
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                            <View>
                                <Typography style={{ color: '#333' }}>{
                                    review.user.firstName ? review.user.firstName + ' ' + review.user.lastName : review.user.userName
                                }</Typography>
                                <Typography style={{ color: '#828282' }}>{printCreated(review.createdAt)}</Typography>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                                <MaterialIcons
                                    name={review.rating >= 1 ? 'star' : 'star-border'}
                                    size={20}
                                    color={review.rating >= 1 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF}
                                />
                                <MaterialIcons
                                    name={review.rating >= 2 ? 'star' : 'star-border'}
                                    size={20}
                                    color={review.rating >= 2 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF}
                                />
                                <MaterialIcons
                                    name={review.rating >= 3 ? 'star' : 'star-border'}
                                    size={20}
                                    color={review.rating >= 3 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF}
                                />
                                <MaterialIcons
                                    name={review.rating >= 4 ? 'star' : 'star-border'}
                                    size={20}
                                    color={review.rating >= 4 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF}
                                />
                                <MaterialIcons
                                    name={review.rating >= 5 ? 'star' : 'star-border'}
                                    size={20}
                                    color={review.rating >= 5 ? Colors.COLORS.WEB_START_ON : Colors.COLORS.WEB_START_OFF}
                                />
                            </View>
                        </View>
                    </View>
                    <Typography style={{ marginTop: 10, color: Colors.COLORS.ON_SURFACE, }} bold>{review.title}</Typography>
                    <Typography style={{ color: '#333' }}>{review.message}</Typography>
                    {review.approvalStatus == 'DISAPPROVED' ? (
                        <>
                            <Typography style={{ marginTop: 10, color: Colors.COLORS.ON_SURFACE, }} bold>{review.option.name}</Typography>
                            <Typography style={{ color: '#333' }}>{review.option.description}</Typography>
                        </>
                    ) : (null)}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    opinionAvatar: {
        width: 40,
        height: 40,
        borderRadius: 100,
        position: 'relative',
        marginRight: 8,

    },
    card: {
        //flexDirection: 'column',
        borderColor: 'rgba(0, 0, 0, 0.125)',
        borderRadius: 8,
        /* marginTop: 5,
        marginBottom: 5,
        paddingTop: 10,
        padding: 18, */
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 8,
        elevation: 1
    },
})

export default ReviewsCard