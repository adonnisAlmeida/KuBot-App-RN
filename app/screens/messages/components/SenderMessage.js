import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import Colors from '../../../constants/Colors'

const SenderMessage = ({ message }) => {
    return (
        <View style={styles.messageContainer}>
            <View style={styles.bonito}></View>
            {message.title ? (
                <Typography semibold style={styles.messageTitle}>{message.title}</Typography>
            ) : (
                null
            )}
            <Typography style={styles.message}>{message.content}</Typography>
        </View>
    )
}

const styles = StyleSheet.create({
    bonito: {
        backgroundColor: 'red',
        position: 'absolute',
        right: -6,
        width: 6,
        height: 6,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderRightColor: "transparent",
        borderTopColor: 'rgba(45, 206, 138, 0.4)',
    },
    messageTitle: {
        marginBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    message: {
        //color: '#FFF'
    },
    messageContainer: {
        //backgroundColor: '#3ee7cd',
        backgroundColor: 'rgba(45, 206, 138, 0.4)',
        borderRadius: 6,
        borderTopRightRadius: 0,
        padding: 4,
        paddingHorizontal: 10,
        marginVertical: 3,
        marginHorizontal: 10,
        alignSelf: "flex-end",
        marginLeft: "auto",
        marginBottom: 3
    },
})

export default SenderMessage