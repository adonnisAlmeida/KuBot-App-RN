import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Typography } from '../../components'
import Theme from '../../constants/Theme'
import { useTheme } from '@react-navigation/native'
import moment from 'moment'

const SellerDetailsScreen = ({ navigation, route }) => {
    const [seller, setSeller] = useState(route.params?.seller)
    const { dark, colors } = useTheme()
    const joinDate = moment(seller.dateJoined).format('YYYY-MM-DD')

    console.log(seller)

    navigation.setOptions({
        title: `${seller.firstName}`,
    })

    const avatar =
        seller.avatar !== null
            ? {
                uri: seller.avatar.url,
            }
            : require('../../../assets/user_avatar.png')

    return (
        <ScrollView style={styles.container}>
            <View
                style={[dark ? styles.cardDark : styles.card]}
            >
                <View style={styles.header}>
                    <Image
                        backgroundColor='white'
                        source={avatar}
                        style={styles.avatar}
                    />
                    <View style={styles.headetText}>
                        <Typography style={{ color: 'white', shadowOpacity: 0.8, shadowColor: 'red', }} bold title >
                            {seller.firstName} {seller.lastName}
                        </Typography>
                        <TouchableOpacity>
                            <Typography>
                                CONTACTAR
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Typography style={styles.textHeader} h3 bold>
                        Dirección
                    </Typography>
                    <Typography >
                        {seller.addresses[0].streetAddress1}, {seller.addresses[0].city}, {seller.addresses[0].country.country}
                    </Typography>
                    <Typography style={styles.textHeader} h3 bold>
                        Fecha de Ingreso
                    </Typography>
                    {/* <Typography>
                        {joinDate.toString()}
                    </Typography> */}
                </View>
            </View>
        </ScrollView>
    )
}

export default SellerDetailsScreen

const styles = StyleSheet.create({
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