import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image as RNImage } from 'react-native'
import React, { useState } from 'react'
import { Typography } from '../../components'
import Theme from '../../constants/Theme'
import { useTheme } from '@react-navigation/native'
import moment from 'moment'
import { printCreated } from '../../utils/CommonFunctions'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import Colors from '../../constants/Colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { conversations } from '../../redux/messages/messagesSlice'

const SellerDetailsScreen = ({ navigation, route }) => {
    const [seller, setSeller] = useState(route.params?.seller)
    const { dark, colors } = useTheme()
    const joinDate = moment(seller.dateJoined).format('YYYY-MM-DD')
    const conversation_reducer = useSelector(conversations)

    //console.log(seller)

    const avatar =
        seller.avatar !== null
            ? {
                uri: seller.avatar.url,
            }
            : require('../../../assets/user_avatar.png')

    navigation.setOptions({
        title: `${seller.firstName? seller.firstName:seller.userName}`,
        headerLeft: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                    <Ionicons
                        name='arrow-back'
                        size={24}
                        color={colors.SURFACE}
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
            if (conv.usuario.serverId == seller.serverId) {
                flag = true
                navigation.navigate('MessagesChatScreen', { message: conv })
            }
        })
        if (!flag) {
            navigation.navigate('WriteMessageScreen', { selecteds: [seller] })
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
                        imageStyle={styles.avatar}
                        indicator={Progress.Pie}
                        indicatorProps={{
                            color: Colors.COLORS.PRIMARY,
                            borderWidth: 0,
                        }}
                    />
                    <View style={styles.headetText}>
                        <Typography style={{ color: 'white', shadowOpacity: 0.8, shadowColor: 'red', }} bold title >
                            {seller.firstName ? (
                                seller.firstName + " " + seller.lastName
                            ) : (
                                seller.userName
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
                        {seller.addresses[0].streetAddress1}, {seller.addresses[0].city}, {seller.addresses[0].country.country}
                    </Typography>
                    <Typography style={styles.textHeader} h3 bold>
                        Fecha de Ingreso:
                    </Typography>
                    <Typography>
                        {printCreated(seller.dateJoined)}
                    </Typography>
                </View>
            </View>
            <View style={{ paddingVertical: 8 }} >
                <Typography h3 bold>Calificación y opiniones:</Typography>
            </View>
            <View
                style={[dark ? styles.cardDark : styles.card]}
            >
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
                            <Typography style={{ color: '#333' }}>Samantha Lambert </Typography>
                            <Typography style={{ color: '#828282' }}>22 de Febrero de 2023 </Typography>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                            <MaterialIcons
                                name='star'
                                size={20}
                                color={Colors.COLORS.WEB_START_ON}
                            />
                            <MaterialIcons
                                name='star'
                                size={20}
                                color={Colors.COLORS.WEB_START_ON}
                            />
                            <MaterialIcons
                                name='star-half'
                                size={20}
                                color={Colors.COLORS.WEB_START_ON}
                            />
                            <MaterialIcons
                                name='star-border'
                                size={20}
                                color={Colors.COLORS.WEB_START_OFF}
                            />
                            <MaterialIcons
                                name='star-border'
                                size={20}
                                color={Colors.COLORS.WEB_START_OFF}
                            />
                        </View>
                    </View>
                </View>
                <Typography style={{ marginTop: 10, color: '#333' }} bold>buena</Typography>
                <Typography style={{ color: '#333' }}>Muy buena</Typography>
            </View>
        </ScrollView>
    )
}

export default SellerDetailsScreen

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
    opinionAvatar: {
        width: 40,
        height: 40,
        borderRadius: 100,
        position: 'relative',
        marginRight: 8,

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
        height: 100,
        margin: -10,
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