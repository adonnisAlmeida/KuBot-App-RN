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
import ReviewsCard from '../profile/components/ReviewsCard'
import { user } from '../../redux/userlogin/userLoginSlice'

const SellerDetailsScreen = ({ navigation, route }) => {
    const [seller, setSeller] = useState(route.params?.seller)
    const { dark, colors } = useTheme()
    const conversation_reducer = useSelector(conversations)
    const user_state = useSelector(user)

    //console.log("seller >> ", seller)

    const avatar =
        seller.user.avatar !== null
            ? {
                uri: seller.user.avatar.url,
            }
            : require('../../../assets/user_avatar.png')

    navigation.setOptions({
        title: `${seller.user.firstName ? seller.user.firstName : seller.user.userName}`,
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
            navigation.navigate('WriteMessageScreen', { selecteds: [seller.user] })
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
                            {seller.user.firstName ? (
                                seller.user.firstName + " " + seller.user.lastName
                            ) : (
                                seller.user.userName
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
                    {seller.defaultAddress ? (
                        <Typography >
                            {seller.defaultAddress.streetAddress1}, {seller.defaultAddress.city}, {seller.defaultAddress.country.country}
                        </Typography>

                    ) : (
                        <Typography >
                            {seller.user.addresses[0].streetAddress1}, {seller.user.addresses[0].city}, {seller.user.addresses[0].country.country}
                        </Typography>
                    )}

                    <Typography style={styles.textHeader} h3 bold>
                        Fecha de Ingreso:
                    </Typography>
                    <Typography>
                        {printCreated(seller.user?.dateJoined)}
                    </Typography>
                </View>
            </View>
            <View style={{ paddingVertical: 8 }} >
                <Typography h3 bold>Calificación y opiniones:</Typography>
            </View>
            {seller.reviews && seller.reviews.length > 0 ? (
                seller.reviews.slice(0).reverse().map((review, index) => {
                    if (review.approvalStatus == 'PENDING' || review.approvalStatus == 'DISAPPROVED') {
                        if (review.user.serverId == user_state.serverId) {
                            return <ReviewsCard key={index} review={review} />
                        } else {
                            return null
                        }
                    } else {
                        return <ReviewsCard key={index} review={review} />
                    }
                }
                    /* review.approvalStatus == 'APPROVED' ? <ReviewsCard key={index} review={review} /> : null */
                )
            ) : (
                <View style={{ alignItems: 'center' }}>
                    <Typography color={Colors.COLORS.WEB_LINK}>No hay calificaciones para este vendedor.</Typography>
                </View>
            )}
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