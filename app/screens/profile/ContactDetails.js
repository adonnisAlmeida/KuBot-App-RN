import { StyleSheet, ScrollView, View, Image, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native'
import React from 'react'
import { useSelector } from 'react-redux'
import { user } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'
import { Typography } from '../../components'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useState, useEffect } from 'react'

const ContactDetails = ({ navigation }) => {
    const user_state = useSelector(user)
    const [userInfo, setUserInfo] = useState(user_state)
    const { colors } = useTheme()

    //console.log(user_state)
    console.log("userInfo.avatar", userInfo.avatar)

    useEffect(() => {
        setUserInfo(user_state)
    }, [user_state])

    const avatar = userInfo.avatar
        ? {
            uri: userInfo.avatar.url,
        }
        : require('../../../assets/user_avatar.png')

    const handleEditarProfile = () => {
        navigation.navigate('EditarProfile', {
            user_id: userInfo.id,
            user_firstName: `${userInfo.firstName}`,
            user_lastName: `${userInfo.lastName}`,
            user_avatarURL: `${userInfo.avatar?.url}`,
        })
    }

    const handleEditAddress = (address) => {
        navigation.navigate('EditAddressScreen', {
            address: address
        })
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            {alert}
            <View style={[styles.card, { backgroundColor: colors.SURFACE }]}>
                <View style={styles.editIcon}>
                    <TouchableOpacity>
                        <FontAwesome
                            style={styles.headerRight}
                            name="edit"
                            color={colors.ON_SURFACE}
                            size={22}
                            onPress={() => handleEditarProfile()}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <Image backgroundColor='white' source={avatar} style={styles.avatar} />
                        {/* <Typography h2 style={{ color: colors.ON_BACKGROUND, alignSelf: 'center', marginVertical: 20 }}>
							{user_state.firstName} {user_state.lastName}
						</Typography> */}
                    </View>
                </View>

                <View style={styles.seccion}>
                    <Typography style={styles.seccionTitle} >
                        Nombre:
                    </Typography>
                    <Typography style={{ color: colors.ON_SURFACE }}>
                        {userInfo.firstName}
                    </Typography>
                </View>
                <View style={styles.seccion}>
                    <Typography style={styles.seccionTitle} >
                        Apellidos:
                    </Typography>
                    <Typography style={{ color: colors.ON_SURFACE }}>
                        {userInfo.lastName}
                    </Typography>
                </View>
                <View style={styles.seccion}>
                    <Typography style={styles.seccionTitle}>
                        Correo:
                    </Typography>
                    <Typography style={{ color: colors.ON_SURFACE }}>
                        {userInfo.email}
                    </Typography>
                </View>
            </View>
            <View style={styles.headerContainer}>
                <Typography bold>
                    DIRECCIONES
                </Typography>
            </View>
            {
                userInfo.addresses.map((address, index) => {
                    return (
                        <View key={index} style={[styles.card, { backgroundColor: colors.SURFACE, marginTop: 10, paddingTop: 5, }]}>
                            <View style={styles.seccionCorner}>
                                {address.isDefaultBillingAddress ? (
                                    <Typography bold>Dirección de facturación</Typography>
                                ) : (
                                    null
                                )}
                                {address.isDefaultShippingAddress ? (
                                    <Typography bold>Dirección de entrega</Typography>
                                ) : (
                                    null
                                )}
                            </View>

                            <View style={styles.cardRow}>
                                <Typography style={{ color: colors.ON_SURFACE, marginRight: 5, }}>
                                    {address.firstName}
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE }}>
                                    {address.lastName}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                    Calle:
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE }}>
                                    {address.streetAddress1}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                    Municipio:
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE, marginRight: 5, }}>
                                    {address.city}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                    Provincia:
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE }}>
                                    {address.countryArea}
                                </Typography>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                    País:
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {address.country.country}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
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

            {/* <Button
				color="error"
				style={{ alignItems: 'center', marginVertical: 16 }}
				onPress={() => handleEliminar()}
			>
				<Typography style={{ color: '#ffffff' }}>Eliminar</Typography>
			</Button> */}
            {/* <Button
				color={Colors.COLORS.INFO}
				style={{ alignItems: 'center', marginVertical: 20 }}
				onPress={() => handleCerrarSesion()}
			>
				<Typography style={{ color: '#000000' }}>Cerrar Sesión</Typography>
			</Button> */}
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
    editIcon: {
        position: 'absolute',
        top: 15,
        //right: 0,
        left: 15
    },
    seccionTitle: {
        color: Colors.COLORS.ON_SURFACE,
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 3,
        marginRight: 5,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        top: -160,
        elevation: 0,
        position: 'absolute',
    },
    headerRight: {
        marginRight: 20,
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
    avatar: {
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: Colors.COLORS.PRIMARY
    },
    seccion: {
        flexDirection: 'row',
    },
    seccionCorner: {
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between'
    }
})

export default ContactDetails