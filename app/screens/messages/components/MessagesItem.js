import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { Typography } from '../../../components';
import Theme from '../../../constants/Theme';
import moment from 'moment';
import Colors from '../../../constants/Colors';

const MessagesItem = ({ navigation, message }) => {
    //console.log("FROM ITEM message ", message.node.messages[0].serverId)
    const { dark, colors } = useTheme()

    const avatar =
        message.node.conversationUser.avatar ? {
            uri: message.node.conversationUser.avatar.url,
        }
            : require('../../../../assets/user_avatar.png')


    const copiaWat = (para) => {
        const fecha = new Date(para).setHours(0, 0, 0, 0)
        const hoy = new Date().setHours(0, 0, 0, 0)
        let moment1 = moment(para).add(1, 'd').format('DD/MM/YY')
        let moment2 = moment(hoy).format('DD/MM/YY')
        let yy = moment(para).format('DD/MM/YY')
        let horas = moment(para).format('h:mm a')
        if (fecha === hoy) {
            return horas
        } if (moment2 === moment1) {
            return "Ayer"
        } else {
            return yy
        }
    }

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('MessagesChatScreen', { message: message.node })}
        >
            <View style={[dark ? styles.cardDark : styles.card, { backgroundColor: (message.node.messages[0].serverId && !message.node.messages[0].isRead) ? Colors.COLORS.SWITCH_OFF : '#fff' }]}>
                <Image
                    style={styles.avatar}
                    imageStyle={styles.avatar}
                    source={avatar}
                    indicator={Progress.Pie}
                    indicatorProps={{
                        color: colors.PRIMARY,
                        borderWidth: 0,
                    }}
                />
                <View style={styles.card_details}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={styles.messageTitle}>
                            <Typography medium style={{ color: colors.ON_SURFACE }}>
                                {message.node.conversationUser.firstName ? (
                                    message.node.conversationUser.firstName + " " + message.node.conversationUser.lastName
                                ) : (
                                    message.node.conversationUser.userName
                                )}
                            </Typography>
                            <Typography
                                bold={(message.node.messages[0].serverId && !message.node.messages[0].isRead) ? true : false}
                                small>
                                {copiaWat(message.node.messages[0].message.createdAt)}
                            </Typography>
                        </View>

                        <Typography
                            small
                            bold={(message.node.messages[0].serverId && !message.node.messages[0].isRead) ? true : false}
                            style={{ color: colors.ON_SURFACE_VARIANT, marginTop: 3 }}
                        >
                            {message.node.messages[0].message.content.length > 43
                                ? message.node.messages[0].message.content.substring(0, 43) + '...'
                                : message.node.messages[0].message.content}
                        </Typography>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default MessagesItem

const styles = StyleSheet.create({
    messageTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'transparent',
        marginHorizontal: 2,
        marginVertical: Theme.SIZES.BASE / 2,
        padding: Theme.SIZES.BASE,
        backgroundColor: Theme.LIGHT.SURFACE,
        shadowOpacity: Theme.SIZES.OPACITY,
        shadowColor: Theme.LIGHT.BACKGROUND,
        elevation: 16,
        borderRadius: Theme.SIZES.RADIUS,
    },
    cardDark: {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'transparent',
        marginHorizontal: 2,
        marginVertical: Theme.SIZES.BASE / 2,
        padding: Theme.SIZES.BASE,
        backgroundColor: Theme.DARK.SURFACE,
        shadowOpacity: Theme.SIZES.OPACITY,
        shadowColor: Theme.DARK.BACKGROUND,
        elevation: 16,
        borderRadius: Theme.SIZES.RADIUS,
    },
    card_details: {
        flex: 2,
        paddingLeft: 20,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    left: {
        marginRight: Theme.SIZES.BASE,
    },
    right: {
        width: 10,
        backgroundColor: 'transparent',
    },
    avatar: {
        position: 'relative',
        width: 42,
        height: 42,
        borderRadius: 62,
        borderWidth: 0,
    },
})