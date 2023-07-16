import { StyleSheet, ScrollView, View, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, ActivityIndicator, Platform, ToastAndroid, RefreshControl } from 'react-native'
import { useTheme } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, setUser, setUserAddresses, user } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'
import { NetworkError, Typography } from '../../components'

import ProfilePhoto from './components/ProfilePhoto'
import ProfileUpdate from './components/ProfileUpdate'
import AddressCard from './components/AddressCard'
import { allDeliveryAreas, setAllDeliveryAreas } from '../../redux/deliveryareas/deliveryareasSlice'
import { useLazyQuery, useMutation } from '@apollo/client'
import { DELIVERY_ZONES } from '../../graphql/deliveryAreas'
import { COUNTRIES } from '../../constants/Other'
import { Picker } from '@react-native-picker/picker'
import { containsOnlyNumbers } from '../../utils/CommonFunctions'
import { ADDRESS_CREATE, ADDRESS_DELETE, ADDRESS_UPDATE } from '../../graphql/customers'
import { FloatingAction } from 'react-native-floating-action'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomPicker from './components/CustomPicker'
import { TOKEN_VERIFY, USER_INFO } from '../../graphql/login'

const ContactDetails = ({ navigation }) => {
    const user_state = useSelector(user)

    const [userInfo, setUserInfo] = useState(user_state)
    const [editAddressModal, setEditAddressModal] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [country, setCountry] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [countryArea, setCountryArea] = useState('')
    const [countryAreaIndex, setCountryAreaIndex] = useState(-1)
    const [city, setCity] = useState('')
    const [cityIndex, setCityIndex] = useState(-1)
    const [cityArea, setCityArea] = useState('')
    const [address, setAddress] = useState('')
    const [address2, setAddress2] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [phone, setPhone] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [provinciasList, setProvinciasList] = useState([])
    const [provinciasListTemp, setProvinciasListTemp] = useState([])
    const [loadingZones, setLoadingZones] = useState(false)
    const [loadingZonesError, setLoadingZonesError] = useState(false)
    const [updatingAddress, setUpdatingAddress] = useState(false)
    const [invalidMun, setInvalidMun] = useState(false)
    const [invalidProv, setInvalidProv] = useState(false)
    const [selectedInvalidProv, setSelectedInvalidProv] = useState(false)
    const [errors, setErrors] = useState([])
    const [codigoTelefono, setCodigoTelefono] = useState(0)
    const [actionToDo, setActionToDo] = useState(null)
    const dispatch = useDispatch()
    const allDeliveryAreasStorage = useSelector(allDeliveryAreas)
    const [refreshing, setRefreshing] = useState(false)

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
                setProvinciasListTemp(groupedProvinces)
                setLoadingZonesError(false)
                getDeliveryZones({ variables: { after: dataProvincias.deliveryZones.pageInfo.endCursor, before: '' } })
            } else {
                let temporal = []
                provinciasListTemp.forEach(item => temporal.push(item))
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
            setLoadingZonesError(true)
            console.log('Error cargando todas las zonas de entrega', errorProvincias)
        }
    })

    const [getLogedUserInfo, { loadingUserInfo, errorUserInfo, dataUserInfo }] = useLazyQuery(USER_INFO, {
		onCompleted: (dataUserInfo) => {
			//console.log("Info del usuario logueado >> ", dataUserInfo.me)
			if(dataUserInfo.me){
				dispatch(setUser(dataUserInfo.me))
			}
            setRefreshing(false)
		},
		onError: (errorUserInfo) => {
            setRefreshing(false)
			console.log("Error Info User >> ", errorUserInfo)
		},
		fetchPolicy: "no-cache"
	})

    const [addressUpdate, { loadingAddressUpdate, errorAddressUpdate, dataAddressUpdate }] = useMutation(ADDRESS_UPDATE, {
        onCompleted: (dataAddressUpdate) => {
            console.log("Actualizo la direccion >> ", dataAddressUpdate.accountAddressUpdate.user)
            setUpdatingAddress(false)
            dispatch(setUserAddresses(dataAddressUpdate.accountAddressUpdate.user.addresses))
            setEditAddressModal(false)
            if (Platform.OS === 'android') {
                ToastAndroid.show('Dirección actualizada correctamente.', ToastAndroid.LONG)
            }
        },
        onError: (errorAddressUpdate, dataAddressUpdate) => {
            setUpdatingAddress(false)
            if (Platform.OS === 'android') {
                ToastAndroid.show(`Error actualizando dirección. ${errorAddressUpdate.message}`, ToastAndroid.LONG)
            }
            //console.log('ERROR CARRIER REGISTER >> ', JSON.stringify(errorCarrierRegister, null, 2))
            console.log('ERROR Actualizando direccion >> ', errorAddressUpdate)
            console.log('ERROR actualizando direccion dataCarrierRegister>> ', dataAddressUpdate)
        },
        fetchPolicy: "no-cache"
    })

    const [addressCreate, { loadingAddressCreate, errorAddressCreate, dataAddressCreate }] = useMutation(ADDRESS_CREATE, {
        onCompleted: (dataAddressCreate) => {
            console.log("Creando la direccion >> ", dataAddressCreate.accountAddressCreate.user)
            setUpdatingAddress(false)
            dispatch(setUserAddresses(dataAddressCreate.accountAddressCreate.user.addresses))
            setEditAddressModal(false)
            if (Platform.OS === 'android') {
                ToastAndroid.show('Dirección creada correctamente.', ToastAndroid.LONG)
            }
        },
        onError: (errorAddressCreate, dataAddressCreate) => {
            setUpdatingAddress(false)
            if (Platform.OS === 'android') {
                ToastAndroid.show(`Error actualizando dirección. ${errorAddressCreate.message}`, ToastAndroid.LONG)
            }
            //console.log('ERROR CARRIER REGISTER >> ', JSON.stringify(errorCarrierRegister, null, 2))
            console.log('ERROR Creando direccion >> ', JSON.stringify(errorAddressCreate, null, 2))
            console.log('ERROR Creando direccion dataCarrierRegister>> ', dataAddressCreate)
        },
        fetchPolicy: "no-cache"
    })

    const autoLoad = () => {
        setLoadingZones(true)

        setLoadingZonesError(false)
        getDeliveryZones({ variables: { after: '', before: '' } })
    }


    useEffect(() => {
        setUserInfo(user_state)
    }, [user_state])

    //console.log("userInfo.addresses > ", userInfo.addresses)

    useEffect(() => {
        setAvatar(userInfo.avatar
            ? {
                uri: userInfo.avatar.url,
            }
            : require('../../../assets/user_avatar.png'))
        if (allDeliveryAreasStorage.length == 0) {// no ha cargado todas las zonas todavia
            setLoadingZones(true)
            autoLoad()
            /* setLoadingZonesError(false)
            getDeliveryZones({ variables: { after: '', before: '' } }) */
        } else { // ya los cargo estane l localstorage
            setProvinciasList(allDeliveryAreasStorage)
        }
    }, [])

    useEffect(() => {
        setAvatar(userInfo.avatar
            ? {
                uri: userInfo.avatar.url,
            }
            : require('../../../assets/user_avatar.png'))
    }, [userInfo.avatar])

    useEffect(() => {
        if ((containsOnlyNumbers(phone) && phone.length == 8) || phone.length == 0) {
            setErrors(pre => pre.filter((key) => key != 'phone'))
        }
    }, [phone])

    const openEdit = (address) => {
        let indexCountry = COUNTRIES.findIndex(obj => obj.code == address.country.code)
        let goodPhone = address.phone
        console.log("goodPhone >> ", goodPhone)
        console.log("address.country.code >> ", address.country)
        console.log("address.phone >> ", address.phone)
        console.log("indexCountry >> ", indexCountry)
        if (address.phone.includes(COUNTRIES[indexCountry].mobileCode)) {
            goodPhone = address.phone.substring(COUNTRIES[indexCountry].mobileCode, COUNTRIES[indexCountry].mobileCode.length)
        }
        setActionToDo('EDIT')
        setCodigoTelefono(indexCountry)
        setSelectedAddress(address)
        setFirstName(address.firstName)
        setLastName(address.lastName)
        setCountry(address.country.country)
        setCountryCode(address.country.code)
        setCountryArea(address.countryArea) // provincia
        setCity(address.city) // municipio
        setCityArea(address.cityArea)
        setAddress(address.streetAddress1)
        setAddress2(address.streetAddress2)
        setPostalCode(address.postalCode)
        setPhone(goodPhone)
        setCompanyName(address.companyName)
        let indexProv = provinciasList.findIndex(obj => obj.name == address.countryArea)
        if (indexProv == -1) {
            setInvalidProv(true)
            setSelectedInvalidProv(true)
            setCountryAreaIndex(0)
            setCityIndex(0)
        } else {
            let indexMun = provinciasList[indexProv].municipios.findIndex(obj => obj.node.name == address.city)
            setCountryAreaIndex(indexProv)
            setCityIndex(indexMun)
            setSelectedInvalidProv(false)
        }
        setEditAddressModal(true)
    }

    const updateAddress = () => {
        let error_data = []
        if (phone != '') {
            if (!containsOnlyNumbers(phone) || phone.length != 8) {
                error_data.push('phone')
            }
        }

        if (error_data.length > 0) {
            setErrors(error_data)
        } else {
            
            if (actionToDo == 'EDIT') {
                console.log("A editar invalidMun >> ", invalidMun)
                console.log("A editar invalidProv >> ", invalidProv)
                if (invalidProv) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show(`La provincia seleccionada no es válida.`, ToastAndroid.LONG)
                    }
                } else {
                    if (invalidMun) {
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(`El municipio seleccionado no es válido.`, ToastAndroid.LONG)
                        }
                    } else {
                        setUpdatingAddress(true)
                        addressUpdate({
                            variables: {
                                id: selectedAddress.id,
                                input: {
                                    firstName: firstName,
                                    lastName: lastName,
                                    companyName: companyName,
                                    streetAddress1: address,
                                    streetAddress2: address2,
                                    city: city,
                                    postalCode: postalCode,
                                    country: countryCode,
                                    countryArea: countryArea,
                                    phone: phone == '' ? '' : COUNTRIES[codigoTelefono].mobileCode + phone,
                                }
                            }
                        })
                    }

                }
            } else if (actionToDo == 'CREATE') {
                setUpdatingAddress(true)
                addressCreate({
                    variables: {
                        input: {
                            firstName: firstName,
                            lastName: lastName,
                            companyName: companyName,
                            streetAddress1: address,
                            streetAddress2: address2,
                            city: city,
                            postalCode: postalCode,
                            country: countryCode,
                            countryArea: countryArea,
                            phone: phone == '' ? '' : COUNTRIES[codigoTelefono].mobileCode + phone,
                        }
                    }
                })
            }
        }
    }

    const actionIcon = (name) => {
        return (
            <>
                <MaterialCommunityIcons
                    name={name}
                    size={25}
                    color={colors.SURFACE}
                />
            </>
        )
    }

    const actionsTrash = [
        {
            text: "Eliminar",
            icon: actionIcon('notebook-plus-outline'),
            name: "add_address",
            position: 2,
            color: Colors.COLORS.PRIMARY
        }
    ];

    const doAddAddress = () => {
        setAddress('')
        setAddress2('')
        setFirstName('')
        setLastName('')
        setPhone('')
        setCompanyName('')
        setPostalCode('')
        setCountryCode('CU')
        setCountry('Cuba')
        setCodigoTelefono(57)
        setCountryAreaIndex(0)
        setCity(provinciasList[0]?.municipios[0].node.name)
        setCityIndex(0)
        setCountryArea(provinciasList[0]?.name)
        setActionToDo('CREATE')
        setEditAddressModal(true)
    }

    const doAction = (action) => {
        switch (action) {
            case 'add_address':
                doAddAddress()
                break;
        }
    }

    const onRefresh = () => {
        setRefreshing(true)
        //getUserInfo({ variables: { id: user_state.id } })
        getLogedUserInfo()
        //tokenVerify({ variables: { token: user_state.token } })
    }


    return (
        <>
            <View style={{ padding: 16 }}>
                <View style={[styles.card, { backgroundColor: colors.SURFACE }]}>
                    <ProfilePhoto avatar={avatar} setAvatar={() => setAvatar()} />
                    <ProfileUpdate />
                </View>
            </View>

            <ScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        colors={[Colors.COLORS.PRIMARY]}
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }
            >

                {
                    loadingZones ? (
                        <ActivityIndicator size='large' color={Colors.COLORS.PRIMARY} />
                    ) : (
                        loadingZonesError ? (
                            <View style={{
                                //backgroundColor: 'red',
                            }}>
                                <NetworkError mTop={20} accion={autoLoad} />
                            </View>
                        ) : (
                            userInfo.addresses.map((address, index) =>
                                <AddressCard
                                    key={address.id}
                                    openEdit={openEdit}
                                    address={address}
                                    addressCount={userInfo.addresses.length}
                                />)
                        )
                    )
                }
                <Typography></Typography>
                <Typography></Typography>
                <Typography></Typography>
                <Typography></Typography>
                <Typography></Typography>
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
                                <Picker
                                    themeVariant={'dark'}
                                    selectedValue={countryCode}
                                    style={[
                                        //styles.select,
                                        {
                                            color: colors.ON_BACKGROUND,
                                            padding: 0,
                                            marginLeft: -14,
                                        },
                                    ]}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setCountryCode(itemValue)
                                        let result = COUNTRIES.find(obj => {
                                            return obj.code == itemValue
                                        })
                                        setCountry(result.name)
                                        setCodigoTelefono(itemIndex)
                                    }
                                    }>
                                    {
                                        COUNTRIES.map((item, index) => {
                                            return <Picker.Item key={item} themeVariant={'dark'} label={item.name} value={item.code} />
                                        })
                                    }
                                </Picker>
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
                                <Picker
                                    themeVariant={'dark'}
                                    selectedValue={countryArea}
                                    style={[
                                        //styles.select,
                                        {
                                            color: colors.ON_BACKGROUND,
                                            padding: 0,
                                            marginLeft: -14,
                                        },
                                    ]}
                                    onValueChange={(itemValue, itemIndex) => {
                                        console.log("itemIndex >> ", itemIndex)
                                        console.log("provinciasList.length >> ", provinciasList.length)

                                        if (itemIndex == provinciasList.length) { // es el valor no valido
                                            console.log("No hacer nada no es validp")
                                            setCountryArea(itemValue)
                                            setInvalidProv(true)
                                        } else {
                                            setInvalidProv(false)
                                            setCountryArea(itemValue)
                                            let result = provinciasList.find(obj => {
                                                return obj.name == itemValue
                                            })
                                            setCountryAreaIndex(itemIndex)
                                            setInvalidMun(false)
                                            setCity(result.municipios[0].node.name)
                                            setCityIndex(0)
                                        }
                                    }
                                    }>
                                    {
                                        provinciasList.map((item, index) => {
                                            return <Picker.Item key={index} themeVariant={'dark'} label={item.name} value={item.name} />
                                        })
                                    }
                                    {selectedInvalidProv ? (
                                        <Picker.Item key={provinciasList.length + 1} themeVariant={'dark'} label={selectedAddress?.countryArea} value={selectedAddress?.countryArea} />
                                    ) : (null)}
                                </Picker>
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
                                <CustomPicker
                                    setInvalidMun={setInvalidMun}
                                    selectedValue={city}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setCity(itemValue.node.name)
                                    }}
                                    values={provinciasList[countryAreaIndex]?.municipios}
                                />
                                {/* <TextInput
                                    value={city}
                                    style={[
                                        styles.input,
                                        hasErrors('lastName'),
                                        { color: colors.ON_BACKGROUND },
                                    ]}
                                    placeholder='Apellidos'
                                    onChangeText={(text) => setCity(text)}
                                /> */}
                                {/* <Picker
                                        themeVariant={'dark'}
                                        selectedValue={city}
                                        style={[
                                            //styles.select,
                                            {
                                                color: colors.ON_BACKGROUND,
                                                padding: 0,
                                                marginLeft: -14,
                                            },
                                        ]}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setCity(itemValue)
                                        }
                                        }>
                                        {
                                            provinciasList[countryAreaIndex]?.municipios.map((item, index) => {
                                                return <Picker.Item key={index} themeVariant={'dark'} label={item.node.name} value={item.node.name} />
                                            })
                                        }
                                    </Picker> */}
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
                                    color={hasErrors('phone') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                                //style={{ marginVertical: 10 }}
                                >
                                    Número de teléfono
                                </Typography>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography
                                        style={{
                                            fontSize: 16,
                                            marginTop: 11,
                                            paddingRight: 5,
                                            borderBottomColor: '#8E8E8E',
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                        }}>
                                        {COUNTRIES[codigoTelefono].mobileCode}
                                    </Typography>
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
                        {
                            updatingAddress ? (
                                <ActivityIndicator color={Colors.COLORS.PRIMARY} />
                            ) : (
                                <TouchableOpacity
                                    onPress={() => updateAddress()}
                                    style={{
                                        paddingVertical: 5,
                                        paddingHorizontal: 8,
                                    }}
                                >
                                    <Typography bold color={Colors.COLORS.PRIMARY}>Guardar</Typography>
                                </TouchableOpacity>
                            )
                        }

                    </View>
                </View>
            </Modal>
            <FloatingAction
                color={Colors.COLORS.PRIMARY}
                floatingIcon={actionIcon('notebook-plus-outline')}
                overrideWithAction={true}
                actions={actionsTrash}
                onPressItem={name => {
                    doAction(name)
                }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    hasErrors: {
        borderBottomColor: '#CF6679',
    },
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