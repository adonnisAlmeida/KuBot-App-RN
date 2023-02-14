import { StyleSheet, ScrollView, View, Image, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native'
import React from 'react'
import { useSelector } from 'react-redux'
import { user } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'
import { Typography } from '../../components'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const ContactDetails = ({ navigation }) => {
    const user_state = useSelector(user)
    const { colors } = useTheme()

    const avatar = user_state.avatar
        ? {
            uri: user_state.avatar.url,
        }
        : require('../../../assets/user_avatar.png')

    const handleEditarProfile = () => {
        navigation.navigate('EditarProfile', {
            user_id: user_state.id,
            user_firstName: `${user_state.firstName}`,
            user_lastName: `${user_state.lastName}`,
        })
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            {alert}
            <View style={[styles.card, { backgroundColor: colors.SURFACE }]}>
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <Image backgroundColor='white' source={avatar} style={styles.avatar} />
                        {/* <Typography h2 style={{ color: colors.ON_BACKGROUND, alignSelf: 'center', marginVertical: 20 }}>
							{user_state.firstName} {user_state.lastName}
						</Typography> */}
                    </View>
                </View>
                <View style={styles.editIcon}>
                    <TouchableOpacity>
                        <FontAwesome
                            style={styles.headerRight}
                            name="edit"
                            color={colors.ON_SURFACE}
                            size={20}
                            onPress={() => handleEditarProfile()}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.seccion}>
                    <Typography style={styles.seccionTitle} >
                        Nombre:
                    </Typography>
                    <Typography style={{ color: colors.ON_SURFACE }}>
                        {user_state.firstName}
                    </Typography>
                </View>
                <View style={styles.seccion}>
                    <Typography style={styles.seccionTitle} >
                        Apellidos:
                    </Typography>
                    <Typography style={{ color: colors.ON_SURFACE }}>
                        {user_state.lastName}
                    </Typography>
                </View>
                <View style={styles.seccion}>
                    <Typography style={styles.seccionTitle}>
                        Correo:
                    </Typography>
                    <Typography style={{ color: colors.ON_SURFACE }}>
                        {user_state.email}
                    </Typography>
                </View>
            </View>
            <View style={styles.headerContainer}>
                <Typography>
                    DIRECCIONES
                </Typography>
            </View>
            {
                user_state.addresses.map((address, index) => {
                    return (
                        <View key={index} style={[styles.card, { backgroundColor: colors.SURFACE, marginTop: 10, paddingTop: 5, }]}>
                            <View style={styles.cardRow}>
                                <Typography style={{ color: colors.ON_SURFACE, marginRight: 5, }}>
                                    {address.firstName}
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE }}>
                                    {address.firstName}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography style={{ color: colors.ON_SURFACE }}>
                                    {address.streetAddress1}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography style={{ color: colors.ON_SURFACE, marginRight: 5, }}>
                                    {address.city}
                                </Typography>
                                <Typography style={{ color: colors.ON_SURFACE }}>
                                    {address.countryArea}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography style={{ color: colors.ON_SURFACE, marginRight: 5, }}>
                                    {address.postalCode}
                                </Typography>
                            </View>
                            <View style={styles.cardRow}>
                                <Typography style={{ color: colors.ON_SURFACE, marginRight: 5, }}>
                                    {address.country.country}
                                </Typography>
                            </View>
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
    cardRow: {
        flexDirection: 'row',
        marginTop: 3,
    },
    editIcon: {
        position: 'absolute',
        top: 18,
        right: 0,
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
        marginRight: 20
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
        marginVertical: 6,
        flexDirection: 'row',
    }
})

export default ContactDetails