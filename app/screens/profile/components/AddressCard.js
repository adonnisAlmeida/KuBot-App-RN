import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, ToastAndroid, Image } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'
import { Typography } from '../../../components'
import Colors from '../../../constants/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { COUNTRIES } from '../../../constants/Other'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADDRESS_DELETE } from '../../../graphql/customers'
import AwesomeAlert from 'react-native-awesome-alerts'
import { useDispatch } from 'react-redux'
import { setUserAddresses } from '../../../redux/userlogin/userLoginSlice'

const AddressCard = ({
    address,
    openEdit,
    addressCount
}) => {
    const [showAlertAw, setShowAlertAw] = useState(false)
    const [deletingAddress, setDeletingAddress] = useState(false)
    const { colors } = useTheme()
    const dispatch = useDispatch()

    const [addressDelete, { loadingAddressDelete, errorAddressDelete, dataAddressDelete }] = useMutation(ADDRESS_DELETE, {
        onCompleted: (dataAddressDelete) => {
            console.log("Eliminando la direccion >> ", dataAddressDelete.accountAddressDelete.user)
            dispatch(setUserAddresses(dataAddressDelete.accountAddressDelete.user.addresses))
            setShowAlertAw(false)
            setDeletingAddress(false)
            if (Platform.OS === 'android') {
                ToastAndroid.show('Dirección eliminada correctamente.', ToastAndroid.LONG)
            }
        },
        onError: (errorAddressDelete, dataAddressDelete) => {
            setShowAlertAw(false)
            setDeletingAddress(false)
            if (Platform.OS === 'android') {
                ToastAndroid.show(`Error actualizando dirección. ${errorAddressDelete.message}`, ToastAndroid.LONG)
            }
            //console.log('ERROR CARRIER REGISTER >> ', JSON.stringify(errorCarrierRegister, null, 2))
            console.log('ERROR Creando direccion >> ', JSON.stringify(errorAddressDelete, null, 2))
            console.log('ERROR Creando direccion dataCarrierRegister>> ', dataAddressDelete)
        },
        fetchPolicy: "no-cache"
    })

    const deleteAddress = () => {
        setDeletingAddress(true)
        setShowAlertAw(false)
        addressDelete({
            variables: {
                id: address.id
            }
        })
    }

    const editAction = () => {
        openEdit(address)
    }

    const handleDelete = () => {
        setShowAlertAw(true)
    }

    return (
        <>
            <View style={[styles.card, {
                marginTop: 10,
                paddingTop: address.isDefaultBillingAddress ? address.isDefaultShippingAddress ? 46 : 25 : address.isDefaultShippingAddress ? 25 : 5,
            }]}>
                {deletingAddress ? (
                    <View
                        style={{
                            position: 'absolute',
                            borderRadius: 8,
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255,0.7)',
                            zIndex: 999,
                        }}
                    >
                        <Image
                            source={require('../../../../assets/outline-bin-solid.gif')}
                            style={{ width: 40, height: 40 }}
                        />
                    </View>
                ) : (null)}
                {address.isDefaultBillingAddress ? (
                    <View style={{
                        backgroundColor: Colors.COLORS.INFO,
                        position: 'absolute',
                        paddingTop: 5,
                        paddingLeft: 18,
                        paddingBottom: 3,
                        left: 0,
                        right: 0,
                        zIndex: 99,
                        borderTopLeftRadius: 7,
                        borderTopRightRadius: 7,
                        /* borderBottomWidth: 1,
                        borderBottomColor: 'red', */
                    }}>
                        <Typography style={{
                            color: 'rgba(0, 0, 0, 0.6)',
                            fontWeight: 'bold',
                        }}>Dirección de Facturación</Typography>
                    </View>
                ) : (
                    null
                )}
                {address.isDefaultShippingAddress ? (
                    <View style={{
                        backgroundColor: Colors.COLORS.INFO,
                        position: 'absolute',
                        top: 0,
                        paddingTop: address.isDefaultBillingAddress ? 28 : 5,
                        borderTopLeftRadius: 7,
                        borderTopRightRadius: 7,
                        paddingBottom: 3,
                        paddingLeft: 18,
                        left: 0,
                        right: 0,
                    }}>
                        <Typography style={{
                            color: 'rgba(0, 0, 0, 0.6)',
                            fontWeight: 'bold',
                        }}>Dirección de Entrega</Typography>
                    </View>
                ) : (
                    null
                )}

                <View style={styles.seccionCorner}>
                    {/* {address.isDefaultBillingAddress ? (
                        <Typography style={{
                            color: Colors.COLORS.ON_SURFACE,
                            fontWeight: 'bold',
                        }}>Facturación</Typography>
                    ) : (
                        null
                    )}
                    {address.isDefaultShippingAddress ? (
                        <Typography style={{
                            color: Colors.COLORS.ON_SURFACE,
                            fontWeight: 'bold',
                        }}>Entrega</Typography>
                    ) : (
                        null
                    )} */}
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <View>
                        {address.firstName || address.lastName ? (
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
                        ) : (null)}

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
                                Dirección:
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
                    <View
                        style={{
                            //backgroundColor: 'red',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                padding: 5
                            }}
                            onPress={() => editAction()}
                        >
                            <MaterialCommunityIcons
                                name="notebook-edit-outline"
                                color={Colors.COLORS.PRIMARY}
                                size={20}
                            />
                        </TouchableOpacity>
                        {
                            addressCount == 1 ? (
                                null
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        padding: 5
                                    }}
                                    onPress={() => handleDelete()}
                                >
                                    <MaterialCommunityIcons
                                        name="notebook-remove-outline"
                                        color={Colors.COLORS.WARNING}
                                        size={20}
                                    />
                                </TouchableOpacity>
                            )
                        }

                    </View>
                </View>
            </View>
            <AwesomeAlert
                show={showAlertAw}
                showProgress={deletingAddress}
                title={"¿Eliminar Dirección?"}
                message={"¿Está seguro que desea eliminar esta dirección?"}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Cancelar"
                confirmText="Eliminar"
                confirmButtonColor={Colors.COLORS.WARNING}
                onCancelPressed={() => {
                    setShowAlertAw(false)
                }}
                onConfirmPressed={() => {
                    deleteAddress()
                }}
            />
        </>
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
        backgroundColor: '#fff',
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