import { StyleSheet, ScrollView, View, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, ActivityIndicator } from 'react-native'
import { useTheme } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserAddresses, user } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'
import { Typography } from '../../components'

import ProfilePhoto from './components/ProfilePhoto'
import ProfileUpdate from './components/ProfileUpdate'
import AddressCard from './components/AddressCard'
import { allDeliveryAreas, setAllDeliveryAreas } from '../../redux/deliveryareas/deliveryareasSlice'
import { useLazyQuery } from '@apollo/client'
import { DELIVERY_ZONES } from '../../graphql/deliveryAreas'
import { COUNTRIES } from '../../constants/Other'

const ContactDetails = ({ navigation }) => {
    const user_state = useSelector(user)
    const [userInfo, setUserInfo] = useState(user_state)
    const [editAddressModal, setEditAddressModal] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [country, setCountry] = useState('')
    const [countryArea, setCountryArea] = useState('')
    const [city, setCity] = useState('')
    const [cityArea, setCityArea] = useState('')
    const [address, setAddress] = useState('')
    const [address2, setAddress2] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [phone, setPhone] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [provinciasList, setProvinciasList] = useState([])
    const [loadingZones, setLoadingZones] = useState(false)
    const [errors, setErrors] = useState([])
    const dispatch = useDispatch()
    const allDeliveryAreasStorage = useSelector(allDeliveryAreas)

    const { colors } = useTheme()
    const [avatar, setAvatar] = useState()

    const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

    //console.log("User state desde contact Detaisl View >>> ", user_state)

    const [getDeliveryZones, { loadingProvincias, errorProvincias, dataProvincias }] = useLazyQuery(DELIVERY_ZONES, {
        onCompleted: (dataProvincias) => {
            const allResult = dataProvincias.deliveryZones.edges
            let groupedProvinces = []

            allResult.map((prov) => {
                if (prov.node.parent !== null) {
                    let flag = false
                    groupedProvinces.map((provi, i) => {
                        if (prov.node.parent.id == provi.id) {
                            provi.municipios.push(prov)
                            flag = true
                        }
                    })
                    if (!flag) {
                        var father = {
                            'id': prov.node.parent.id,
                            'name': prov.node.parent.name,
                            'municipios': [prov]
                        }
                        groupedProvinces.push(father)
                    }
                }
            })
            if (dataProvincias.deliveryZones.pageInfo.hasNextPage) {
                setProvinciasList(groupedProvinces)
                getDeliveryZones({ variables: { after: dataProvincias.deliveryZones.pageInfo.endCursor, before: '' } })
            } else {
                let temporal = []
                provinciasList.forEach(item => temporal.push(item))
                groupedProvinces.map((groupProv) => {
                    let flag = false
                    temporal.map((prov) => {
                        if (groupProv.name == prov.name) {
                            flag = true
                            prov.municipios = prov.municipios.concat(groupProv.municipios)
                        }
                    })
                    if (!flag) {
                        temporal = temporal.concat(groupProv)
                    }
                })
                setProvinciasList(temporal)
                setLoadingZones(false)
                dispatch(setAllDeliveryAreas(temporal))
            }
        },
        onError: (errorProvincias) => {
            setLoadingZones(false)
            console.log('Error cargando todas las zonas de entrega', errorProvincias)
        }
    })

    useEffect(() => {
        setUserInfo(user_state)
    }, [user_state])

    useEffect(() => {
        setAvatar(userInfo.avatar
            ? {
                uri: userInfo.avatar.url,
            }
            : require('../../../assets/user_avatar.png'))
        if (allDeliveryAreasStorage.length == 0) {// no ha cargado todas las zonas todavia
            setLoadingZones(true)
            getDeliveryZones({ variables: { after: '', before: '' } })
        } else { // ya los cargo estane l localstorage
            setProvinciasList(allDeliveryAreasStorage)
        }
    }, [])

    return (
        <>
            <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} style={styles.container}>
                {alert}
                <View style={[styles.card, { backgroundColor: colors.SURFACE, marginBottom: 30 }]}>
                    <ProfilePhoto avatar={avatar} setAvatar={() => setAvatar()} />
                    <ProfileUpdate />
                </View>
                {
                    userInfo.addresses.map((address, index) =>
                        <AddressCard
                            key={index}
                            navigation={navigation}
                            address={address}
                            setEditAddressModal={setEditAddressModal}
                            setFirstName={setFirstName}
                            setLastName={setLastName}
                            setCountry={setCountry}
                            setCountryArea={setCountryArea}
                            setCity={setCity}
                            setCityArea={setCityArea}
                            setAddress={setAddress}
                            setAddress2={setAddress2}
                            setPostalCode={setPostalCode}
                            setPhone={setPhone}
                            setCompanyName={setCompanyName}
                        />)
                }
                <Typography></Typography>
            </ScrollView>
            <Modal
                visible={editAddressModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setEditAddressModal(false)
                }}
            >
                <TouchableOpacity
                    style={styles.modalView}
                    onPressOut={() => {
                        setEditAddressModal(false)
                    }}
                >
                </TouchableOpacity>
                <View keyboardShouldPersistTaps={'handled'} style={styles.modalContent}>
                    {loadingZones ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size='large' color={Colors.COLORS.PRIMARY} />
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} style={{
                            //backgroundColor: 'red',
                            flex: 1,
                        }}>
                            <View>
                                <Typography
                                    color={hasErrors('firstName') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                //style={{ marginVertical: 10 }}
                                >
                                    Nombre
                                </Typography>
                                <TextInput
                                    value={firstName}
                                    style={[
                                        styles.input,
                                        hasErrors('firstName'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Nombre'
                                    onChangeText={(text) => setFirstName(text)}
                                />
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <Typography
                                    color={hasErrors('lastName') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                //style={{ marginVertical: 10 }}
                                >
                                    Apellidos
                                </Typography>
                                <TextInput
                                    value={lastName}
                                    style={[
                                        styles.input,
                                        hasErrors('lastName'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Apellidos'
                                    onChangeText={(text) => setLastName(text)}
                                />
                            </View>
                            <View
                                style={{
                                    marginTop: 15,
                                    borderBottomColor: '#8E8E8E',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}>
                                <Typography
                                    color={hasErrors('pais') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                >
                                    País
                                </Typography>
                                <TextInput
                                    value={country}
                                    style={[
                                        styles.input,
                                        hasErrors('lastName'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Apellidos'
                                    onChangeText={(text) => setCountry(text)}
                                />
                                {/* <Picker
                                    themeVariant={'dark'}
                                    selectedValue={pais}
                                    style={[
                                        //styles.select,
                                        {
                                            color: colors.ON_BACKGROUND,
                                            padding: 0,
                                            marginLeft: -14,
                                        },
                                    ]}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setPais(itemValue)
                                        setCodigoTelefono(itemValue)
                                    }
                                    }>
                                    {
                                        COUNTRIES.map((item, index) => {
                                            return <Picker.Item key={index} themeVariant={'dark'} label={item.name} value={index} />
                                        })
                                    }
                                </Picker> */}
                            </View>
                            <View
                                style={{
                                    marginTop: 15,
                                    borderBottomColor: '#8E8E8E',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            >
                                <Typography
                                    color={hasErrors('provincia') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                //style={{ marginVertical: 10 }}
                                >
                                    Provincia
                                </Typography>
                                <TextInput
                                    value={countryArea}
                                    style={[
                                        styles.input,
                                        hasErrors('lastName'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Apellidos'
                                    onChangeText={(text) => setCountryArea(text)}
                                />
                                {/* {loadingZones ? (
                                    <ActivityIndicator style={{ padding: 15 }}></ActivityIndicator>
                                ) : (
                                    <Picker
                                        themeVariant={'dark'}
                                        selectedValue={provincia}
                                        style={[
                                            //styles.select,
                                            {
                                                color: colors.ON_BACKGROUND,
                                                padding: 0,
                                                marginLeft: -14,
                                            },
                                        ]}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setProvincia(itemValue)
                                            setMunicipio(0)
                                        }
                                        }>
                                        {
                                            provinciasList.map((item, index) => {
                                                return <Picker.Item key={index} themeVariant={'dark'} label={item.name} value={index} />
                                            })
                                        }
                                    </Picker>
                                )} */}
                            </View>
                            <View
                                style={{
                                    marginTop: 15,
                                    borderBottomColor: '#8E8E8E',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            >
                                <Typography
                                    color={hasErrors('minicipio') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                //style={{ marginVertical: 10 }}
                                >
                                    Municipio
                                </Typography>
                                <TextInput
                                    value={city}
                                    style={[
                                        styles.input,
                                        hasErrors('lastName'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Apellidos'
                                    onChangeText={(text) => setCity(text)}
                                />
                                {/* {loadingZones ? (
                                    <ActivityIndicator style={{ padding: 15 }}></ActivityIndicator>
                                ) : (
                                    <Picker
                                        themeVariant={'dark'}
                                        selectedValue={municipio}
                                        style={[
                                            //styles.select,
                                            {
                                                color: colors.ON_BACKGROUND,
                                                padding: 0,
                                                marginLeft: -14,
                                            },
                                        ]}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setMunicipio(itemValue)
                                        }
                                        }>
                                        {
                                            provinciasList[provincia]?.municipios.map((item, index) => {
                                                return <Picker.Item key={index} themeVariant={'dark'} label={item.node.name} value={index} />
                                            })
                                        }
                                    </Picker>
                                )} */}
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <Typography
                                    color={hasErrors('direccion1') || hasErrors('direccion2') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                //style={{ marginVertical: 10 }}
                                >
                                    Dirección
                                </Typography>
                                <TextInput
                                    value={address}
                                    style={[
                                        styles.input,
                                        hasErrors('address'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Dirección'
                                    onChangeText={(text) => setAddress(text)}
                                />
                                {hasErrors('address') ? (
                                    <Typography color={Colors.COLORS.ERROR} style={{ marginVertical: 10 }} >
                                        Este campo es requerido.
                                    </Typography>
                                ) : (
                                    null
                                )}
                                <TextInput
                                    value={address2}
                                    style={[
                                        styles.input,
                                        hasErrors('address2'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Departamento, suite, edificio, piso, etc'
                                    onChangeText={(text) => setAddress2(text)}
                                />
                                {hasErrors('address2') ? (
                                    <Typography color={Colors.COLORS.ERROR} style={{ marginVertical: 10 }} >
                                        Este campo es requerido.
                                    </Typography>
                                ) : (
                                    null
                                )}
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <Typography
                                    color={hasErrors('postalCode') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                //style={{ marginVertical: 10 }}
                                >
                                    Código Postal
                                </Typography>
                                <TextInput
                                    value={postalCode}
                                    style={[
                                        styles.input,
                                        hasErrors('postalCode'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Código Postal'
                                    onChangeText={(text) => setPostalCode(text)}
                                />
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <Typography
                                    color={hasErrors('telefono') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                //style={{ marginVertical: 10 }}
                                >
                                    Número de teléfono
                                </Typography>
                                <View style={{ flexDirection: 'row' }}>
                                    {/* <Typography
                                        style={{
                                            fontSize: 16,
                                            marginTop: 11,
                                            paddingRight: 5,
                                            borderBottomColor: '#8E8E8E',
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                        }}>
                                        {COUNTRIES[codigoTelefono].mobileCode}
                                    </Typography> */}
                                    <TextInput
                                        keyboardType='phone-pad'
                                        inputMode='tel'
                                        value={phone}
                                        style={[
                                            styles.input,
                                            hasErrors('phone'),
                                            { color: colors.ON_BACKGROUND, width: '100%' },
                                        ]}
                                        placeholder='Número de teléfono'
                                        onChangeText={(text) => setPhone(text)}
                                    />
                                </View>
                                {hasErrors('phone') ? (
                                    <Typography color={Colors.COLORS.ERROR} style={{ marginVertical: 10 }} >
                                        El número de teléfono no es válido.
                                    </Typography>
                                ) : (
                                    null
                                )}
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <Typography
                                    color={hasErrors('companyName') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                //style={{ marginVertical: 10 }}
                                >
                                    Empresa
                                </Typography>
                                <TextInput
                                    value={companyName}
                                    style={[
                                        styles.input,
                                        hasErrors('companyName'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Empresa'
                                    onChangeText={(text) => setCompanyName(text)}
                                />
                            </View>
                        </ScrollView>
                    )}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: 10,
                    }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 5,
                                paddingHorizontal: 8,
                                marginRight: 40,
                            }}
                            onPress={() => setEditAddressModal(false)}
                        >
                            <Typography bold color={Colors.COLORS.PRIMARY}>Cancelar</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 5,
                                paddingHorizontal: 8,
                            }}
                        >
                            <Typography bold color={Colors.COLORS.PRIMARY}>Guardar</Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    modalButtons: {
        //position: 'absolute',
        /* bottom: 50,
        right: 16, */
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    container: {
        flex: 1,
        padding: 16,
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
    textInput: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: '#8E8E8E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 45,
        fontSize: 16,
    },
    /* inputLabel: {
        marginBottom: 5,
    }, */
    modalContent: {
        //borderWidth: 1,
        borderBottomWidth: 0,
        padding: 15,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalView: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1,
    },
    input: {
        borderRadius: 0,
        borderWidth: 0,
        height: 45,
        fontSize: 16,
        borderBottomColor: '#8E8E8E',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})

export default ContactDetails