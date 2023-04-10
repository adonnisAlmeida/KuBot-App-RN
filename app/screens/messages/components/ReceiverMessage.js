import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
/* import Image from 'react-native-image-progress'; */
import * as Progress from 'react-native-progress';
import { useTheme } from '@react-navigation/native';

const ReceiverMessage = ({ message }) => {
    const { dark, colors } = useTheme()
    const avatar = message.author.avatar ? {
        uri: message.author.avatar.url,
    } : require('../../../../assets/user_avatar.png')

    return (
        <View style={styles.messageContainer}>
            {/* <Image
                style={styles.image}
                imageStyle={styles.image}
                source={avatar}
                indicator={Progress.Pie}
                indicatorProps={{
                    color: colors.PRIMARY,
                    borderWidth: 0,
                }}
            /> */}
            <Image source={avatar} style={styles.image} />
            <View style={styles.bonito}></View>
            {message.title ? (
                <Typography semibold style={styles.messageTitle}>{message.title}</Typography>
            ) : (
                null
            )}

            <Typography style={styles.messageContent}>{message.content}</Typography>
        </View>
    )
}

const styles = StyleSheet.create({
    bonito: {
        backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        left: -6,
        width: 6,
        height: 6,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderRightColor: "transparent",
        borderTopColor: 'rgba(38, 165, 212, 0.3)',
        transform: [{ rotate: "90deg" }],
    },
    image: {
        height: 25,
        width: 25,
        borderRadius: 100,
        position: 'absolute',
        top: 0,
        left: -35,
    },
    messageTitle: {
        marginBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    messageContent: {
    },
    messageContainer: {
        backgroundColor: 'rgba(38, 165, 212, 0.3)',
        borderRadius: 6,
        borderTopLeftRadius: 0,
        padding: 4,
        paddingHorizontal: 10,
        marginVertical: 3,
        marginHorizontal: 3,
        alignSelf: "flex-start",
        marginLeft: 35,
        marginBottom: 3
        //marginLeft: "auto"
    },
})

export default ReceiverMessage