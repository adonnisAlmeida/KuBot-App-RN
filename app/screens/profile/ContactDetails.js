import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions, Modal, ToastAndroid, Platform, TouchableWithoutFeedback, ImageBackground, TextInput, ActivityIndicator } from 'react-native'
import { useTheme } from '@react-navigation/native'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { user } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'
import { Button, Typography } from '../../components'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useMutation } from '@apollo/client'
import { USER_AVATAR_UPDATE } from '../../graphql/customers'
import ProfilePhoto from './components/ProfilePhoto'
import ProfileUpdate from './components/ProfileUpdate'

const ContactDetails = ({ navigation }) => {
    const user_state = useSelector(user)
    const [userInfo, setUserInfo] = useState(user_state)

    const { colors } = useTheme()
    const [avatar, setAvatar] = useState()

    //console.log(user_state)
    //console.log("userInfo.avatar", userInfo.avatar)

    useEffect(() => {
        setUserInfo(user_state)
    }, [user_state])

    useEffect(() => {
        setAvatar(userInfo.avatar
            ? {
                uri: userInfo.avatar.url,
            }
            : require('../../../assets/user_avatar.png'))
    }, [])

    const handleEditAddress = (address) => {
        navigation.navigate('EditAddressScreen', {
            address: address
        })
    }

    const showModalName = () => {
        setEditNameModal(true)
        setTimeout(() => {
            refNameInput.current.focus()
        }, 200);
        //refNameInput.current.focus()
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            {alert}
            <View style={[styles.card, { backgroundColor: colors.SURFACE, marginBottom: 30 }]}>
                <ProfilePhoto avatar={avatar} setAvatar={setAvatar} />
                <ProfileUpdate />
            </View>
            {/* <View style={styles.headerContainer}>
                <Typography bold>
                    DIRECCIONES
                </Typography>
            </View> */}
            {
                userInfo.addresses.map((address, index) => {
                    return (
                        <View key={index} style={[styles.card, { backgroundColor: colors.SURFACE, marginTop: 10, paddingTop: 5, }]}>
                            <View style={styles.seccionCorner}>
                                {address.isDefaultBillingAddress ? (
                                    <Typography style={{
                                        color: Colors.COLORS.ON_SURFACE,
                                        fontWeight: 'bold',
                                    }}>Dirección de facturación</Typography>
                                ) : (
                                    null
                                )}
                                {address.isDefaultShippingAddress ? (
                                    <Typography style={{
                                        color: Colors.COLORS.ON_SURFACE,
                                        fontWeight: 'bold',
                                    }}>Dirección de entrega</Typography>
                                ) : (
                                    null
                                )}
                            </View>
                            <View style={[styles.cardRow, {marginBottom: 5}]}>
                                <Typography style={{
                                    color: Colors.COLORS.ON_SURFACE,
                                    fontWeight: 'bold', marginRight: 5,
                                }}>
                                    {address.firstName}
                                </Typography>
                                <Typography style={{
                                    color: Colors.COLORS.ON_SURFACE,
                                    fontWeight: 'bold',
                                }}>
                                    {address.lastName}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography bold style={{
                                    color: Colors.COLORS.ON_SURFACE,
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    marginRight: 5,
                                }}>
                                    Calle:
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE }}>
                                    {address.streetAddress1}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography bold style={{
                                    color: Colors.COLORS.ON_SURFACE,
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    marginRight: 5,
                                }}>
                                    Municipio:
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE, marginRight: 5, }}>
                                    {address.city}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography bold style={{
                                    color: Colors.COLORS.ON_SURFACE,
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    marginRight: 5,
                                }}>
                                    Provincia:
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE }}>
                                    {address.countryArea}
                                </Typography>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                <Typography bold style={{
                                    color: Colors.COLORS.ON_SURFACE,
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    marginRight: 5,
                                }}>
                                    País:
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {address.country.country}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography bold style={{
                                    color: Colors.COLORS.ON_SURFACE,
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    marginRight: 5,
                                }}>
                                    Código postal:
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE, marginRight: 5, }}>
                                    {address.postalCode}
                                </Typography>
                            </View>
                            {/* <View style={styles.addressEdit}>
                                <TouchableOpacity>
                                    <FontAwesome
                                        name="edit"
                                        color={colors.ON_SURFACE}
                                        size={22}
                                        onPress={() => handleEditAddress(address)}
                                    />
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    )
                })
            }
            <Typography></Typography>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    addressEdit: {
        marginTop: 15
    },
    cardRow: {
        flexDirection: 'row',
        marginTop: 3,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        flexDirection: 'column',
        borderColor: 'rgba(0, 0, 0, 0.125)',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 60,
        marginBottom: 5,
        paddingTop: 100,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 8,
        elevation: 1
    },
    seccionCorner: {
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between'
    }
})

export default ContactDetails