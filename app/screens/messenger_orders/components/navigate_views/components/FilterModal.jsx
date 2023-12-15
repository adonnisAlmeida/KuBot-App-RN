import { ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { DELIVERY_ZONES } from '../../../../../graphql/deliveryAreas'
import { useDispatch, useSelector } from 'react-redux'
import { allDeliveryAreas, setAllDeliveryAreas } from '../../../../../redux/deliveryareas/deliveryareasSlice'
import Colors from '../../../../../constants/Colors'
import { Typography } from '../../../../../components'
import { Picker } from '@react-native-picker/picker'
import { COUNTRIES, height } from '../../../../../constants/Other'
import { sellers, setSellersByUser } from '../../../../../redux/sellers/sellersSlice'
import { MY_CLIENTS, MY_SELLERS } from '../../../../../graphql/clients'
import { setClientsByUser } from '../../../../../redux/clients/clientsSlice'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useRef } from 'react'
import { orderShippingStatusDisplay } from '../../../../../utils/CommonFunctions'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import moment from 'moment'
moment.locale('es')

const FilterModal = (
    {
        comeFromHeader,
        setComeFromHeader,
        activeView,
        setActiveView,
        applyFilters,
        showFilter,
        provinciaIndex,
        setProvinciaIndex,
        clearFilters,
        setShowFilter,
        filterOptions,
        setFilterOptions,
        activeFilters,
        setActiveFilters
    }) => {
    const [loadingZones, setLoadingZones] = useState(false)
    const [countrySearch, setCountrySearch] = useState('')
    const [loadingSellers, setLoadingSellers] = useState(false)
    const [loadingClient, setLoadingClient] = useState(false)
    const [loadingZonesError, setLoadingZonesError] = useState(false)
    const [fromDate, setFromDate] = useState(false)
    const [toDate, setToDate] = useState(false)
    const [provinciasList, setProvinciasList] = useState([])
    const [mySellers, setMySellers] = useState([])
    const [myClients, setMyClients] = useState([])
    const [provinciasListTemp, setProvinciasListTemp] = useState([])
    const refOrderNumberInput = useRef();
    const dispatch = useDispatch()
    const allDeliveryAreasStorage = useSelector(allDeliveryAreas)

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

    const [getMySellers, { loadingMySellers, errorMySellers, dataMySellers }] = useLazyQuery(MY_SELLERS, {
        onCompleted: (dataMySellers) => {
            let elementos = []
            dataMySellers.mySellers.edges.map((edges) => elementos.push(edges.node))
            setMySellers([...mySellers, ...elementos])
            dispatch(setSellersByUser([...mySellers, ...elementos]))
            if (dataMySellers.mySellers.pageInfo.hasNextPage) {
                getMySellers({ variables: { after: dataMySellers.mySellers.pageInfo.endCursor, before: '' } })
            }
            setLoadingSellers(false)
        },
        onError: (errorMySellers) => {
            setLoadingSellers(false)
            console.log('Error cargando lista de vendedores ', errorMySellers)
        },
        fetchPolicy: "no-cache"
    })

    const [getMyClients, { loadingMyClients, errorMyClients, dataMyClients }] = useLazyQuery(MY_CLIENTS, {
        onCompleted: (dataMyClients) => {
            let elementos = []
            dataMyClients.myClients.edges.map((edges) => elementos.push(edges.node))
            setMyClients([...myClients, ...elementos])
            dispatch(setClientsByUser([...myClients, ...elementos]))
            if (dataMyClients.myClients.pageInfo.hasNextPage) {
                getMyClients({ variables: { after: dataMyClients.myClients.pageInfo.endCursor, before: '' } })
            }
            setLoadingClient(false)
        },
        onError: (errorMyClients) => {
            setLoadingClient(false)
            console.log('Error cargando lista de clientes ', errorMyClients)
        },
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        if (allDeliveryAreasStorage.length == 0) {// no ha cargado todas las zonas todavia
            setLoadingZones(true)
            getDeliveryZones({ variables: { after: '', before: '' } })
        } else { // ya los cargo estane l localstorage
            setProvinciasList(allDeliveryAreasStorage)
        }
        setMySellers([])
        setMyClients([])
        setLoadingSellers(true)
        setLoadingClient(true)
        getMySellers({ variables: { after: '', before: '' } }) // siempre carga vendedores y clientes
        getMyClients({ variables: { after: '', before: '' } }) // siempre carga vendedores y clientes

    }, [])

    useEffect(() => {
        if (activeView == 2) {
            setTimeout(() => {
                refOrderNumberInput.current.focus()
            }, 200);
        }
    }, [activeView])

    const requestClose = () => {
        setActiveView(1)
        setShowFilter(false)
    }

    const sellerLabel = (seller) => {
        if (seller == null)
            return ''

        if (seller?.user) {
            if (seller.user.firstName) {
                return seller.user.firstName + " " + seller.user.lastName
            } else {
                return seller.user.userName
            }
        } else {
            return "Invitado"
        }
    }

    const clientLabel = (client) => {
        if (client == null)
            return ''

        if (client) {
            if (client.firstName) {
                return client.firstName + " " + client.lastName
            } else {
                return client.userName
            }
        } else {
            return "Invitado"
        }
    }

    const dateLabel = () => {
        if (!activeFilters.date) {
            return ''
        }
        if (filterOptions.from && filterOptions.to) {
            return moment(filterOptions.from).format("YYYY-MM-DD") + " - " + moment(filterOptions.to).format("YYYY-MM-DD")
        } else if (filterOptions.to && filterOptions.from == null) {
            return "Hasta: " + moment(filterOptions.to).format("YYYY-MM-DD")
        } else if (filterOptions.to == null && filterOptions.from) {
            return "Desde: " + moment(filterOptions.from).format("YYYY-MM-DD")
        }
    }

    const headerTitle = () => {
        switch (activeView) {
            case 1:
                return (
                    <>
                        <Typography size={15}>Filtrar pedidos</Typography>
                        {(activeFilters.number || activeFilters.country || activeFilters.province || activeFilters.municipality
                            || activeFilters.state || activeFilters.seller || activeFilters.client || activeFilters.date) ? (
                            <TouchableOpacity
                                onPress={() => clearFilters()}
                            >
                                <Typography color={Colors.COLORS.WEB_BUTTON}>RESTABLECER</Typography>
                            </TouchableOpacity>
                        ) : (<Typography color='#b9b9b9'>RESTABLECER</Typography>)}

                    </>
                )
            case 2:
                return (
                    <>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
                            {comeFromHeader ? (null) : (
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => setActiveView(1)}
                                >
                                    <Ionicons
                                        name='arrow-back'
                                        size={24}
                                        color='#575757'
                                    />
                                </TouchableOpacity>
                            )}
                            <Typography size={15}>Número de pedido</Typography>
                        </View>
                        {activeFilters.number ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (comeFromHeader) {
                                        setActiveFilters({ ...activeFilters, number: false })
                                        setFilterOptions({ ...filterOptions, number: null })
                                        setComeFromHeader(false)
                                        setShowFilter(false)
                                        setActiveView(1)
                                        applyFilters({ from: 'number', value: null })
                                    } else {
                                        setActiveFilters({ ...activeFilters, number: false })
                                        setFilterOptions({ ...filterOptions, number: null })
                                    }
                                }}
                            >
                                <Typography color={Colors.COLORS.WEB_BUTTON}>RESTABLECER</Typography>
                            </TouchableOpacity>
                        ) : (<Typography color='#b9b9b9'>RESTABLECER</Typography>)}

                    </>
                )
            case 3:
                return (
                    <>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
                            {comeFromHeader ? (null) : (
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => setActiveView(1)}
                                >
                                    <Ionicons
                                        name='arrow-back'
                                        size={24}
                                        color='#575757'
                                    />
                                </TouchableOpacity>
                            )}
                            <Typography size={15}>País</Typography>
                        </View>
                        {activeFilters.country ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (comeFromHeader) {
                                        setActiveFilters({ ...activeFilters, country: false })
                                        setFilterOptions({ ...filterOptions, country: null, countryCode: null })
                                        setComeFromHeader(false)
                                        setShowFilter(false)
                                        setActiveView(1)
                                        applyFilters({ from: 'country', value: null })
                                    } else {
                                        setActiveFilters({ ...activeFilters, country: false })
                                        setFilterOptions({ ...filterOptions, country: null, countryCode: null })
                                    }
                                }}
                            >
                                <Typography color={Colors.COLORS.WEB_BUTTON}>RESTABLECER</Typography>
                            </TouchableOpacity>
                        ) : (<Typography color='#b9b9b9'>RESTABLECER</Typography>)}

                    </>
                )
            case 4:
                return (
                    <>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
                            {comeFromHeader ? (null) : (
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => setActiveView(1)}
                                >
                                    <Ionicons
                                        name='arrow-back'
                                        size={24}
                                        color='#575757'
                                    />
                                </TouchableOpacity>
                            )}
                            <Typography size={15}>Provincia</Typography>
                        </View>
                        {activeFilters.province ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (comeFromHeader) {
                                        setActiveFilters({ ...activeFilters, province: false })
                                        setFilterOptions({ ...filterOptions, province: null })
                                        setProvinciaIndex(-1)
                                        setComeFromHeader(false)
                                        setShowFilter(false)
                                        setActiveView(1)
                                        applyFilters({ from: 'province', value: null })
                                    } else {
                                        setActiveFilters({ ...activeFilters, province: false })
                                        setFilterOptions({ ...filterOptions, province: null })
                                        setProvinciaIndex(-1)
                                    }
                                }}
                            >
                                <Typography color={Colors.COLORS.WEB_BUTTON}>RESTABLECER</Typography>
                            </TouchableOpacity>
                        ) : (<Typography color='#b9b9b9'>RESTABLECER</Typography>)}
                    </>
                )
            case 5:
                return (
                    <>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
                            {comeFromHeader ? (null) : (
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => setActiveView(1)}
                                >
                                    <Ionicons
                                        name='arrow-back'
                                        size={24}
                                        color='#575757'
                                    />
                                </TouchableOpacity>
                            )}
                            <Typography size={15}>Municipio</Typography>
                        </View>
                        {activeFilters.municipality ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (comeFromHeader) {
                                        setActiveFilters({ ...activeFilters, municipality: false })
                                        setFilterOptions({ ...filterOptions, municipality: null })
                                        setComeFromHeader(false)
                                        setShowFilter(false)
                                        setActiveView(1)
                                        applyFilters({ from: 'municipality', value: null })
                                    } else {
                                        setActiveFilters({ ...activeFilters, municipality: false })
                                        setFilterOptions({ ...filterOptions, municipality: null })
                                    }
                                }}
                            >
                                <Typography color={Colors.COLORS.WEB_BUTTON}>RESTABLECER</Typography>
                            </TouchableOpacity>
                        ) : (<Typography color='#b9b9b9'>RESTABLECER</Typography>)}
                    </>
                )
            case 6:
                return (
                    <>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
                            {comeFromHeader ? (null) : (
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => setActiveView(1)}
                                >
                                    <Ionicons
                                        name='arrow-back'
                                        size={24}
                                        color='#575757'
                                    />
                                </TouchableOpacity>
                            )}
                            <Typography size={15}>Estado de envío</Typography>
                        </View>
                        {activeFilters.state ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (comeFromHeader) {
                                        setActiveFilters({ ...activeFilters, state: false })
                                        setFilterOptions({ ...filterOptions, state: null })
                                        setComeFromHeader(false)
                                        setShowFilter(false)
                                        setActiveView(1)
                                        applyFilters({ from: 'shippingStatus', value: null })
                                    } else {
                                        setActiveFilters({ ...activeFilters, state: false })
                                        setFilterOptions({ ...filterOptions, state: null })
                                    }
                                }}
                            >
                                <Typography color={Colors.COLORS.WEB_BUTTON}>RESTABLECER</Typography>
                            </TouchableOpacity>
                        ) : (<Typography color='#b9b9b9'>RESTABLECER</Typography>)}
                    </>
                )
            case 7:
                return (
                    <>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
                            {comeFromHeader ? (null) : (
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => setActiveView(1)}
                                >
                                    <Ionicons
                                        name='arrow-back'
                                        size={24}
                                        color='#575757'
                                    />
                                </TouchableOpacity>
                            )}
                            <Typography size={15}>Vendedores</Typography>
                        </View>
                        {activeFilters.seller ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (comeFromHeader) {
                                        setActiveFilters({ ...activeFilters, seller: false })
                                        setFilterOptions({ ...filterOptions, seller: null })
                                        setComeFromHeader(false)
                                        setShowFilter(false)
                                        setActiveView(1)
                                        applyFilters({ from: 'seller', value: null })
                                    } else {
                                        setActiveFilters({ ...activeFilters, seller: false })
                                        setFilterOptions({ ...filterOptions, seller: null })
                                    }
                                }}
                            >
                                <Typography color={Colors.COLORS.WEB_BUTTON}>RESTABLECER</Typography>
                            </TouchableOpacity>
                        ) : (<Typography color='#b9b9b9'>RESTABLECER</Typography>)}
                    </>
                )
            case 8:
                return (
                    <>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
                            {comeFromHeader ? (null) : (
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => setActiveView(1)}
                                >
                                    <Ionicons
                                        name='arrow-back'
                                        size={24}
                                        color='#575757'
                                    />
                                </TouchableOpacity>
                            )}
                            <Typography size={15}>Clientes</Typography>
                        </View>
                        {activeFilters.client ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (comeFromHeader) {
                                        setActiveFilters({ ...activeFilters, client: false })
                                        setFilterOptions({ ...filterOptions, client: null })
                                        setComeFromHeader(false)
                                        setShowFilter(false)
                                        setActiveView(1)
                                        applyFilters({ from: 'client', value: null })
                                    } else {
                                        setActiveFilters({ ...activeFilters, client: false })
                                        setFilterOptions({ ...filterOptions, client: null })
                                    }
                                }}
                            >
                                <Typography color={Colors.COLORS.WEB_BUTTON}>RESTABLECER</Typography>
                            </TouchableOpacity>
                        ) : (<Typography color='#b9b9b9'>RESTABLECER</Typography>)}
                    </>
                )
            case 9:
                return (
                    <>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
                            {comeFromHeader ? (null) : (
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => setActiveView(1)}
                                >
                                    <Ionicons
                                        name='arrow-back'
                                        size={24}
                                        color='#575757'
                                    />
                                </TouchableOpacity>
                            )}
                            <Typography size={15}>Fecha</Typography>
                        </View>
                        {activeFilters.date ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (comeFromHeader) {
                                        setActiveFilters({ ...activeFilters, date: false })
                                        setFilterOptions({ ...filterOptions, from: null, to: null })
                                        setComeFromHeader(false)
                                        setShowFilter(false)
                                        setActiveView(1)
                                        applyFilters({ from: 'date', value: null })
                                    } else {
                                        setActiveFilters({ ...activeFilters, date: false })
                                        setFilterOptions({ ...filterOptions, from: null, to: null })
                                    }
                                }}
                            >
                                <Typography color={Colors.COLORS.WEB_BUTTON}>RESTABLECER</Typography>
                            </TouchableOpacity>
                        ) : (<Typography color='#b9b9b9'>RESTABLECER</Typography>)}
                    </>
                )

            default:
                return (<Typography size={15}>Filtrar pedidos</Typography>)
        }
    }

    const avatar = (user) => {
        if (user.avatar !== null) {
            return {
                uri: user.avatar.url
            }
        } else {
            return require('../../../../../../assets/user_avatar.png')
        }
    }

    return (
        <Modal
            visible={showFilter}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
                if (comeFromHeader) {
                    requestClose()
                } else {
                    requestClose()
                    applyFilters()
                }
            }}
        >
            <TouchableOpacity
                style={{ backgroundColor: 'rgba(0,0,0,0.4)', flex: 1 }}
                onPressOut={() => {
                    if (comeFromHeader) {
                        requestClose()
                    } else {
                        requestClose()
                        applyFilters()
                    }
                }}
            >
            </TouchableOpacity>
            <View style={styles.modalContent}>
                {loadingZones || loadingSellers || loadingClient ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size='large' color={Colors.COLORS.PRIMARY} />
                    </View>
                ) : (
                    <>
                        <View style={styles.header}>
                            {headerTitle()}
                        </View>
                        <View style={styles.mainContent}>
                            {activeView == 1 ? (
                                <View>
                                    <View
                                        style={{
                                            marginVertical: 5,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                            }}
                                            onPress={() => {
                                                setActiveView(2)
                                                setTimeout(() => {
                                                    refOrderNumberInput.current.focus()
                                                }, 200);
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                //backgroundColor: 'green'
                                            }}>
                                                <View style={{
                                                    backgroundColor: '#dfdfdf',
                                                    padding: 10,
                                                    paddingHorizontal: 11,
                                                    borderRadius: 50,
                                                }}>
                                                    <Octicons
                                                        name='hash'
                                                        size={24}
                                                        color='#575757'
                                                    />
                                                </View>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Typography bold color='#575757' size={16}>Número de pedido</Typography>
                                                    <Typography color='#575757' >{filterOptions.number}</Typography>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}>
                                            {activeFilters.number ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setActiveFilters({ ...activeFilters, number: false })
                                                        setFilterOptions({ ...filterOptions, number: null })
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            marginVertical: 5,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                            }}
                                            onPress={() => {
                                                setActiveView(3)
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                //backgroundColor: 'green'
                                            }}>
                                                <View style={{
                                                    backgroundColor: '#dfdfdf',
                                                    padding: 10,
                                                    paddingHorizontal: 12,
                                                    borderRadius: 50,
                                                }}>
                                                    <Octicons
                                                        name='location'
                                                        size={24}
                                                        color='#575757'
                                                    />
                                                </View>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Typography bold color='#575757' size={16}>País</Typography>
                                                    <Typography color='#575757' >{filterOptions.country}</Typography>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}>
                                            {activeFilters.country ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setActiveFilters({ ...activeFilters, country: false })
                                                        setFilterOptions({ ...filterOptions, country: null, countryCode: null })
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            marginVertical: 5,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                            }}
                                            onPress={() => {
                                                setActiveView(4)
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                //backgroundColor: 'green'
                                            }}>
                                                <View style={{
                                                    backgroundColor: '#dfdfdf',
                                                    padding: 10,
                                                    paddingHorizontal: 8,
                                                    borderRadius: 50,
                                                }}>
                                                    <Fontisto
                                                        name='map'
                                                        size={24}
                                                        color='#575757'
                                                    />
                                                </View>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Typography bold color='#575757' size={16}>Provincia</Typography>
                                                    <Typography color='#575757'>{filterOptions.province}</Typography>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}>
                                            {activeFilters.province ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setActiveFilters({ ...activeFilters, province: false, municipality: false })
                                                        setFilterOptions({ ...filterOptions, province: null, municipality: null })
                                                        setProvinciaIndex(-1)
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            marginVertical: 5,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                            }}
                                            onPress={() => {
                                                setActiveView(5)
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                //backgroundColor: 'green'
                                            }}>
                                                <View style={{
                                                    backgroundColor: '#dfdfdf',
                                                    padding: 10,
                                                    paddingHorizontal: 10,
                                                    borderRadius: 50,
                                                }}>
                                                    <MaterialCommunityIcons
                                                        name='home-city-outline'
                                                        size={24}
                                                        color='#575757'
                                                    />
                                                </View>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Typography bold color='#575757' size={16}>Municipio</Typography>
                                                    <Typography color='#575757' >{filterOptions.municipality}</Typography>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}>
                                            {activeFilters.municipality ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setActiveFilters({ ...activeFilters, municipality: false })
                                                        setFilterOptions({ ...filterOptions, municipality: null })
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            marginVertical: 5,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                            }}
                                            onPress={() => {
                                                setActiveView(6)
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                //backgroundColor: 'green'
                                            }}>
                                                <View style={{
                                                    backgroundColor: '#dfdfdf',
                                                    padding: 10,
                                                    paddingHorizontal: 10,
                                                    borderRadius: 50,
                                                }}>
                                                    <MaterialCommunityIcons
                                                        name='graph-outline'
                                                        size={24}
                                                        color='#575757'
                                                    />
                                                </View>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Typography bold color='#575757' size={16}>Estado de envío</Typography>
                                                    <Typography color='#575757' >{orderShippingStatusDisplay(filterOptions.state)}</Typography>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}>
                                            {activeFilters.state ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setActiveFilters({ ...activeFilters, state: false })
                                                        setFilterOptions({ ...filterOptions, state: null })
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            marginVertical: 5,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                            }}
                                            onPress={() => {
                                                setActiveView(7)
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                //backgroundColor: 'green'
                                            }}>
                                                <View style={{
                                                    backgroundColor: '#dfdfdf',
                                                    padding: 10,
                                                    paddingHorizontal: 12,
                                                    borderRadius: 50,
                                                }}>
                                                    <Fontisto
                                                        name='person'
                                                        size={24}
                                                        color='#575757'
                                                    />
                                                </View>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Typography bold color='#575757' size={16}>Vendedor</Typography>
                                                    <Typography color='#575757' >{sellerLabel(filterOptions.seller)}</Typography>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}>
                                            {activeFilters.seller ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setActiveFilters({ ...activeFilters, seller: false })
                                                        setFilterOptions({ ...filterOptions, seller: null })
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            marginVertical: 5,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                            }}
                                            onPress={() => {
                                                setActiveView(8)
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                //backgroundColor: 'green'
                                            }}>
                                                <View style={{
                                                    backgroundColor: '#dfdfdf',
                                                    padding: 9,
                                                    paddingHorizontal: 10,
                                                    borderRadius: 50,
                                                }}>
                                                    <Ionicons
                                                        name='people-outline'
                                                        size={25}
                                                        color='#575757'
                                                    />
                                                </View>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Typography bold color='#575757' size={16}>Cliente</Typography>
                                                    <Typography color='#575757' >{clientLabel(filterOptions.client)}</Typography>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}>
                                            {activeFilters.client ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setActiveFilters({ ...activeFilters, client: false })
                                                        setFilterOptions({ ...filterOptions, client: null })
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            marginVertical: 5,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                            }}
                                            onPress={() => {
                                                setActiveView(9)
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                //backgroundColor: 'green'
                                            }}>
                                                <View style={{
                                                    backgroundColor: '#dfdfdf',
                                                    padding: 10,
                                                    paddingHorizontal: 10,
                                                    borderRadius: 50,
                                                }}>
                                                    <MaterialCommunityIcons
                                                        name='calendar-month-outline'
                                                        size={24}
                                                        color='#575757'
                                                    />
                                                </View>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Typography bold color='#575757' size={16}>Fecha</Typography>
                                                    <Typography color='#575757' >{dateLabel()}</Typography>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}>
                                            {activeFilters.date ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setActiveFilters({ ...activeFilters, date: false })
                                                        setFilterOptions({ ...filterOptions, from: null, to: null })
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)}
                                        </View>
                                    </View>
                                </View>
                            ) : activeView == 2 ? (
                                <View>
                                    <TextInput
                                        ref={refOrderNumberInput}
                                        keyboardType='numeric'
                                        autoCapitalize='none'
                                        caretHidden={false}
                                        placeholder='Número de pedido'
                                        value={filterOptions.number}
                                        style={[
                                            styles.input,
                                            {
                                                //color: colors.ON_BACKGROUND,
                                                borderBottomColor: '#8E8E8E',
                                                borderBottomWidth: StyleSheet.hairlineWidth,
                                            },
                                        ]}
                                        onChangeText={(value) => {
                                            if (value.length == 0) {
                                                setFilterOptions({ ...filterOptions, number: null })
                                                setActiveFilters({ ...activeFilters, number: false })
                                            } else {
                                                setFilterOptions({ ...filterOptions, number: value })
                                                //setActiveFilters({ ...activeFilters, number: true })
                                            }

                                        }}
                                        onSubmitEditing={(event) => {
                                            /* setFilterOptions({ ...filterOptions, number: event.nativeEvent.text }) */
                                            setActiveFilters({ ...activeFilters, number: true })
                                            if (comeFromHeader) {
                                                setComeFromHeader(false)
                                                setShowFilter(false)
                                                setActiveView(1)
                                                applyFilters({ from: 'number', value: event.nativeEvent.text })
                                            } else {
                                                setActiveView(1)
                                            }
                                        }}
                                    />
                                </View>
                            ) : activeView == 3 ? (
                                <View
                                    style={{
                                        height: height / 2
                                    }}
                                >
                                    <FlatList
                                        data={COUNTRIES}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                index={index}
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                    paddingVertical: 8,
                                                }}
                                                onPress={() => {
                                                    setActiveFilters({ ...activeFilters, country: true })
                                                    setFilterOptions({ ...filterOptions, country: item.name, countryCode: item.code })
                                                    if (comeFromHeader) {
                                                        setComeFromHeader(false)
                                                        setShowFilter(false)
                                                        setActiveView(1)
                                                        applyFilters({ from: 'country', value: item.code })
                                                    } else {
                                                        setActiveView(1)
                                                    }
                                                }}
                                            >
                                                <Typography size={16}>{item.name}</Typography>
                                                {(filterOptions.country == item.name && activeFilters.country) ? (
                                                    <FontAwesome
                                                        name='check-circle'
                                                        size={22}
                                                        color={Colors.COLORS.PRIMARY}
                                                    />
                                                ) : (null)}

                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            ) : activeView == 4 ? (
                                <View
                                    style={{
                                        height: height / 2
                                    }}
                                >
                                    <FlatList
                                        data={provinciasList}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                    paddingVertical: 8,
                                                }}
                                                onPress={() => {
                                                    setActiveFilters({ ...activeFilters, province: true, municipality: false })
                                                    setFilterOptions({ ...filterOptions, province: item.name, municipality: null })
                                                    setProvinciaIndex(index)
                                                    if (comeFromHeader) {
                                                        setComeFromHeader(false)
                                                        setShowFilter(false)
                                                        setActiveView(1)
                                                        applyFilters({ from: 'province', value: item.name })
                                                    } else {
                                                        setActiveView(1)
                                                    }
                                                }}
                                            >
                                                <Typography size={16}>{item.name}</Typography>
                                                {(filterOptions.province == item.name && activeFilters.province) ? (
                                                    <FontAwesome
                                                        name='check-circle'
                                                        size={22}
                                                        color={Colors.COLORS.PRIMARY}
                                                    />
                                                ) : (null)}

                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            ) : activeView == 5 ? (
                                <View
                                    style={{
                                        height: (provinciasList[provinciaIndex] && provinciasList[provinciaIndex].length >= 10) ? height / 2 : 'auto'
                                    }}
                                >
                                    {provinciasList[provinciaIndex] ? (
                                        <FlatList
                                            data={provinciasList[provinciaIndex]?.municipios}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item, index }) => (

                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignContent: 'center',
                                                        alignItems: 'center',
                                                        paddingVertical: 8,
                                                    }}
                                                    onPress={() => {
                                                        setActiveFilters({ ...activeFilters, municipality: true })
                                                        setFilterOptions({ ...filterOptions, municipality: item.node.name })
                                                        if (comeFromHeader) {
                                                            setComeFromHeader(false)
                                                            setShowFilter(false)
                                                            setActiveView(1)
                                                            applyFilters({ from: 'municipality', value: item.node.name })
                                                        } else {
                                                            setActiveView(1)
                                                        }
                                                    }}
                                                >
                                                    <Typography size={16}>{item.node.name}</Typography>
                                                    {(filterOptions.municipality == item.node.name && activeFilters.municipality) ? (
                                                        <FontAwesome
                                                            name='check-circle'
                                                            size={22}
                                                            color={Colors.COLORS.PRIMARY}
                                                        />
                                                    ) : (null)}

                                                </TouchableOpacity>
                                            )}
                                        />
                                    ) : (
                                        <View style={{ paddingVertical: 10 }}>
                                            <Typography>No ha seleccionado una provincia aún.</Typography>
                                        </View>

                                    )}
                                </View>
                            ) : activeView == 6 ? (
                                <View
                                    style={{
                                        height: 'auto'
                                    }}
                                >
                                    <FlatList
                                        data={
                                            [
                                                "NO_STATUS",
                                                "ACCEPTED_CARRIER",
                                                "PICKED_UP_CARRIER",
                                                "IN_TRANSIT",
                                                "DELIVERED",
                                                "REJECTED",
                                                "ACCEPTED",
                                                "RETURN_APPROVED",
                                                "RETURN_REQUEST",
                                                "RETURN_DISAPPROVED",
                                                "LOST"
                                            ]
                                        }
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => (

                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                    paddingVertical: 8,
                                                }}
                                                onPress={() => {
                                                    setActiveFilters({ ...activeFilters, state: true })
                                                    setFilterOptions({ ...filterOptions, state: item })
                                                    if (comeFromHeader) {
                                                        setComeFromHeader(false)
                                                        setShowFilter(false)
                                                        setActiveView(1)
                                                        applyFilters({ from: 'shippingStatus', value: item })
                                                    } else {
                                                        setActiveView(1)
                                                    }
                                                }}
                                            >
                                                <Typography size={16}>{orderShippingStatusDisplay(item)}</Typography>
                                                {(filterOptions.state == item && activeFilters.state) ? (
                                                    <FontAwesome
                                                        name='check-circle'
                                                        size={22}
                                                        color={Colors.COLORS.PRIMARY}
                                                    />
                                                ) : (null)}

                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            ) : activeView == 7 ? (
                                <View
                                    style={{
                                        height: (mySellers && mySellers.length >= 10) ? height / 2 : 'auto'
                                    }}
                                >
                                    <FlatList
                                        data={mySellers}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => (

                                            <TouchableOpacity
                                                key={item.serverId}
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                    paddingVertical: 8,
                                                }}
                                                onPress={() => {
                                                    setActiveFilters({ ...activeFilters, seller: true })
                                                    setFilterOptions({ ...filterOptions, seller: item })
                                                    if (comeFromHeader) {
                                                        setComeFromHeader(false)
                                                        setShowFilter(false)
                                                        setActiveView(1)
                                                        applyFilters({ from: 'seller', value: item?.serverId })
                                                    } else {
                                                        setActiveView(1)
                                                    }
                                                }}
                                            >
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                    <Image
                                                        source={avatar(item.user)}
                                                        imageStyle={styles.image}
                                                        indicator={Progress.Pie}
                                                        indicatorProps={{
                                                            color: Colors.COLORS.PRIMARY,
                                                            borderWidth: 0,
                                                        }}
                                                    />
                                                    <Typography size={16}>{sellerLabel(item)}</Typography>
                                                </View>

                                                {(filterOptions.seller?.serverId == item.serverId && activeFilters.seller) ? (
                                                    <FontAwesome
                                                        name='check-circle'
                                                        size={22}
                                                        color={Colors.COLORS.PRIMARY}
                                                    />
                                                ) : (null)}

                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            ) : activeView == 8 ? (
                                <View
                                    style={{
                                        height: (myClients && myClients.length >= 10) ? height / 2 : 'auto'
                                    }}
                                >
                                    <FlatList
                                        data={myClients}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => (

                                            <TouchableOpacity
                                                key={item.serverId}
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                    paddingVertical: 8,
                                                }}
                                                onPress={() => {
                                                    setActiveFilters({ ...activeFilters, client: true })
                                                    setFilterOptions({ ...filterOptions, client: item })
                                                    if (comeFromHeader) {
                                                        setComeFromHeader(false)
                                                        setShowFilter(false)
                                                        setActiveView(1)
                                                        applyFilters({ from: 'client', value: item?.serverId })
                                                    } else {
                                                        setActiveView(1)
                                                    }
                                                }}
                                            >
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                    <Image
                                                        source={avatar(item)}
                                                        imageStyle={styles.image}
                                                        indicator={Progress.Pie}
                                                        indicatorProps={{
                                                            color: Colors.COLORS.PRIMARY,
                                                            borderWidth: 0,
                                                        }}
                                                    />

                                                    < Typography size={16}>{clientLabel(item)}</Typography>
                                                </View>
                                                {(filterOptions.client?.serverId == item.serverId && activeFilters.client) ? (
                                                    <FontAwesome
                                                        name='check-circle'
                                                        size={22}
                                                        color={Colors.COLORS.PRIMARY}
                                                    />
                                                ) : (null)}

                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            ) : activeView == 9 ? (
                                <View>
                                    <DateTimePickerModal
                                        isVisible={fromDate}
                                        mode={'date'}
                                        date={filterOptions.form != null ? filterOptions.form : new Date()}
                                        maximumDate={filterOptions.to != null ? filterOptions.to : new Date()}
                                        onCancel={() => {
                                            console.log('onCancel')
                                            setFromDate(false)
                                        }}
                                        onConfirm={(date) => {
                                            console.log('onConfirm >>> ', date)
                                            setFromDate(false)
                                            setActiveFilters({ ...activeFilters, date: true })
                                            setFilterOptions({ ...filterOptions, from: date })
                                            if (comeFromHeader) {
                                                setComeFromHeader(false)
                                                setShowFilter(false)
                                                setActiveView(1)
                                                applyFilters({ from: 'from', value: date })
                                            } /* else {
                                                setActiveView(1)
                                            } */
                                        }}
                                        //themeVariant='dark'
                                        positiveButtonLabel='ok'
                                        style={{
                                            textColor: '#CF1212',
                                            accentColor: '#CF1212'
                                        }}
                                    />
                                    <DateTimePickerModal
                                        isVisible={toDate}
                                        mode={'date'}
                                        date={filterOptions.to != null ? filterOptions.to : new Date()}
                                        maximumDate={new Date()}
                                        minimumDate={filterOptions.from != null ? filterOptions.from : null}
                                        onCancel={() => {
                                            console.log('onCancel')
                                            setToDate(false)
                                        }}
                                        onConfirm={(date) => {
                                            console.log('onConfirm >>> ', date)
                                            setToDate(false)
                                            setActiveFilters({ ...activeFilters, date: true })
                                            setFilterOptions({ ...filterOptions, to: date })
                                            if (comeFromHeader) {
                                                setComeFromHeader(false)
                                                setShowFilter(false)
                                                setActiveView(1)
                                                applyFilters({ from: 'to', value: date })
                                            }/*  else {
                                                setActiveView(1)
                                            } */
                                        }}
                                        positiveButtonLabel='ok'
                                        style={{
                                            textColor: '#CF1212',
                                            accentColor: '#CF1212'
                                        }}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignContent: 'center',
                                                alignItems: 'center',
                                                paddingVertical: 12,
                                                flex: 1,
                                            }}
                                            onPress={() => {
                                                setToDate(true)
                                            }}
                                        >
                                            < Typography color='#575757' bold={filterOptions.to} size={16}>Hasta</Typography>
                                            {(filterOptions.to && activeFilters.date) ? (
                                                <Typography color='#575757' size={16} bold>{moment(filterOptions.to).format("YYYY-MM-DD")}</Typography>
                                            ) : (null)}

                                        </TouchableOpacity>
                                        {
                                            (filterOptions.to && activeFilters.date) ? (
                                                <TouchableOpacity
                                                    style={{ marginLeft: 10 }}
                                                    onPress={() => {
                                                        if (filterOptions.from == null) {
                                                            setActiveFilters({ ...activeFilters, date: false })
                                                        }
                                                        setFilterOptions({ ...filterOptions, to: null })
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)
                                        }
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignContent: 'center',
                                                alignItems: 'center',
                                                paddingVertical: 12,
                                                flex: 1,
                                            }}
                                            onPress={() => {
                                                setFromDate(true)
                                            }}
                                        >
                                            < Typography color='#575757' bold={filterOptions.from} size={16}>Desde</Typography>
                                            {(filterOptions.from && activeFilters.date) ? (
                                                <Typography color='#575757' size={16} bold>{moment(filterOptions.from).format("YYYY-MM-DD")}</Typography>
                                            ) : (null)}

                                        </TouchableOpacity>
                                        {
                                            (filterOptions.from && activeFilters.date) ? (
                                                <TouchableOpacity
                                                    style={{ marginLeft: 10 }}
                                                    onPress={() => {
                                                        if (filterOptions.to == null) {
                                                            setActiveFilters({ ...activeFilters, date: false })
                                                        }
                                                        setFilterOptions({ ...filterOptions, from: null })
                                                    }}
                                                >
                                                    <Ionicons
                                                        name='close-circle'
                                                        size={26}
                                                        color='#575757'
                                                    />
                                                </TouchableOpacity>
                                            ) : (null)
                                        }
                                    </View>
                                </View>
                            ) : (null)}
                        </View>
                        {activeView == 1 ? (
                            <View style={styles.footer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        applyFilters()
                                        requestClose()
                                    }}
                                >
                                    <Typography color={Colors.COLORS.PRIMARY} bold size={16}>Mostrar resultados</Typography>
                                </TouchableOpacity>
                            </View>
                        ) : (null)}
                    </>

                )}
            </View>

        </Modal>
    )
}

export default FilterModal

const styles = StyleSheet.create({
    image: {
        position: 'relative',
        height: 40,
        width: 40,
        backgroundColor: '#F7F7FF',
        borderRadius: 100,
        marginRight: 10,
    },
    header: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        //borderBottomWidth: 1,
        //borderBottomColor: '#000',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    filterOption: {
        marginTop: 15,
    },
    footer: {
        /* borderTopWidth: 1,
        borderTopColor: '#9E9E9E', */
        marginTop: 10,
        backgroundColor: '#fff',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.57,
        shadowRadius: 15.19,

        elevation: 23,
    },
    input: {
        borderRadius: 0,
        borderWidth: 0,
        height: 45,
        fontSize: 16,
    },
    mainContent: {
        paddingHorizontal: 20,
    },
    modalContent: {
        //borderWidth: 1,
        //borderColor: '#000',
        borderBottomWidth: 0,
        //padding: 20,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        //height: '50%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
})