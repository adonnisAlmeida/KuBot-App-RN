import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'
import { Typography } from '../../../components'
import Colors from '../../../constants/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const AddressCard = ({
    address,
    setEditAddressModal,
    setFirstName,
    setLastName,
    setCountry,
    setCountryArea,
    setCity,
    setCityArea,
    setAddress,
    setAddress2,
    setPostalCode,
    setPhone,
    setCompanyName,
}) => {
    const { colors } = useTheme()

    console.log("addressaddressaddress >> ", address)
    return (
        <View style={[styles.card, { backgroundColor: colors.SURFACE, marginTop: 10, paddingTop: 5, }]}>
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
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View>
                    <View style={[styles.cardRow, { marginBottom: 5 }]}>
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
                    {address.companyName ? (
                        <View style={styles.cardRow}>
                            <Typography bold style={{
                                color: Colors.COLORS.ON_SURFACE,
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginRight: 5,
                            }}>
                                Empresa:
                            </Typography>
                            <Typography style={{ color: colors.ON_SURFACE }}>
                                {address.companyName}
                            </Typography>
                        </View>
                    ) : (null)}
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
                    {address.streetAddress2 ? (
                        <View style={styles.cardRow}>
                            <Typography bold style={{
                                color: Colors.COLORS.ON_SURFACE,
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginRight: 5,
                            }}>
                                Edificio:
                            </Typography>
                            <Typography style={{ color: colors.ON_SURFACE }}>
                                {address.streetAddress2}
                            </Typography>
                        </View>
                    ) : (null)}
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
                    {address.phone ? (
                        <View style={{ flexDirection: 'row', marginTop: 3 }}>
                            <Typography bold style={{
                                color: Colors.COLORS.ON_SURFACE,
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginRight: 5,
                            }}>
                                Teléfono:
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {address.phone}
                            </Typography>
                        </View>
                    ) : (null)}
                </View>
                <View>
                    <TouchableOpacity
                        style={{
                            padding: 5
                        }}
                        onPress={() => {
                            setFirstName(address.firstName)
                            setLastName(address.lastName)
                            setCountry(address.country.country)
                            setCountryArea(address.countryArea)
                            setCity(address.city) // municipio
                            setCityArea(address.cityArea) // municipio
                            setAddress(address.streetAddress1)
                            setAddress2(address.streetAddress2)
                            setPostalCode(address.postalCode)
                            setPhone(address.phone)
                            setCompanyName(address.companyName)
                            setEditAddressModal(true)
                        }}
                    >
                        <MaterialCommunityIcons
                            style={styles.editNameIcon}
                            name="notebook-edit-outline"
                            color={Colors.COLORS.PRIMARY}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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

export default AddressCard