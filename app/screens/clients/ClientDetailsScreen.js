import { View, StyleSheet, ScrollView, TouchableOpacity, Image as RNImage } from 'react-native'
import React, { useState } from 'react'
import { Typography } from '../../components'
import Theme from '../../constants/Theme'
import { useTheme } from '@react-navigation/native'
import moment from 'moment'
import { printCreated } from '../../utils/CommonFunctions'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import Colors from '../../constants/Colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { conversations } from '../../redux/messages/messagesSlice'
import { useRef } from 'react'
import { useEffect } from 'react'
moment.locale('es')

const ClientDetailsScreen = ({ navigation, route }) => {
    const [client, setClient] = useState(route.params?.client)
    const { dark, colors } = useTheme()
    const conversation_reducer = useSelector(conversations)

    const avatar =
        client.avatar !== null
            ? {
                uri: client.avatar.url,
            }
            : require('../../../assets/user_avatar.png')

    navigation.setOptions({
        title: `${client.firstName ? client.firstName : client.userName}`,
        headerLeft: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                    <Ionicons
                        name='arrow-back'
                        size={24}
                        color='#fff'
                        style={{ marginTop: 4 }}
                    />
                    <RNImage source={avatar} style={styles.image} />
                </TouchableOpacity>
            </View>
        ),
    })

    const contactMessage = () => {
        let flag = false
        conversation_reducer.forEach(conv => {
            if (conv.node.conversationUser.serverId == client.user.serverId) {
                flag = true
                navigation.navigate('MessagesChatScreen', { message: conv.node })
            }
        })
        if (!flag) {
            navigation.navigate('WriteMessageScreen', { selecteds: [client] })
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View
                style={[dark ? styles.cardDark : styles.card]}
            >
                <View style={styles.header}>
                    <Image
                        backgroundColor='white'
                        source={avatar}
                        indicator={Progress.Pie}
                        indicatorProps={{
                            color: Colors.COLORS.PRIMARY,
                            borderWidth: 0,
                        }}
                        imageStyle={styles.avatar}
                    />
                    <View style={styles.headetText}>
                        <Typography style={{ color: 'white', shadowOpacity: 0.8, shadowColor: 'red', }} bold title >
                            {client.firstName ? (
                                client.firstName + " " + client.lastName
                            ) : (
                                client.userName
                            )}
                        </Typography>
                        <TouchableOpacity onPress={() => contactMessage()}>
                            <Typography bold color={Colors.COLORS.WEB_LINK}>
                                CONTACTAR
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Typography style={styles.textHeader} h3 bold>
                        Dirección:
                    </Typography>
                    <Typography >
                        {client.addresses[0].streetAddress1}, {client.addresses[0].city}, {client.addresses[0].country.country}
                    </Typography>
                    <Typography style={styles.textHeader} h3 bold>
                        Fecha de Ingreso:
                    </Typography>
                    <Typography>
                        {printCreated(client.dateJoined)}
                    </Typography>
                </View>
            </View>


        </ScrollView>
    )
}

export default ClientDetailsScreen

const styles = StyleSheet.create({
    image: {
        height: 35,
        width: 35,
        borderRadius: 100,
        marginLeft: 5,
    },
    headerLeft: {
        flexDirection: 'row',
        marginLeft: 12,
        padding: 5,
        borderRadius: 100,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    textHeader: {
        marginTop: 10,
        marginBottom: 5
    },
    card: {
        flex: 1,
        borderColor: 'transparent',
        marginHorizontal: 2,
        marginVertical: Theme.SIZES.BASE / 2,
        padding: 10,
        backgroundColor: Theme.LIGHT.SURFACE,
        shadowOpacity: Theme.SIZES.OPACITY,
        shadowColor: Theme.LIGHT.BACKGROUND,
        elevation: 16,
    },
    cardDark: {
        borderColor: 'transparent',
        marginHorizontal: 2,
        marginVertical: Theme.SIZES.BASE / 2,
        padding: 10,
        backgroundColor: Theme.DARK.SURFACE,
        shadowOpacity: Theme.SIZES.OPACITY,
        shadowColor: Theme.DARK.BACKGROUND,
        elevation: 16,
    },
    header: {
        backgroundColor: Theme.LIGHT.SECUNDARY_VARIANT,
        margin: -10,
        height: 100,
        marginBottom: 30,
    },
    avatar: {
        //alignSelf: 'center',
        width: 90,
        height: 90,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'white',
        position: 'absolute',
        top: 30,
        left: 10,
    },
    headetText: {
        position: 'absolute',
        top: 50,
        left: 110,
    },
})