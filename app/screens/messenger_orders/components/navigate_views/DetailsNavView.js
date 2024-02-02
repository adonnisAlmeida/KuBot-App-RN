import { View, Image as RNImage, Dimensions, ScrollView, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, ToastAndroid, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Typography } from '../../../../components'
import { useTheme } from '@react-navigation/native'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import moment from 'moment'
import { orderShippingStatusDisplay, orderStatusDisplay, pagoAmigable } from '../../../../utils/CommonFunctions'
import Colors from '../../../../constants/Colors'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { FloatingAction } from 'react-native-floating-action'
import { useLazyQuery, useMutation } from '@apollo/client'
import { ORDER_LOST, ORDER_TRANSIT } from '../../../../graphql/orders'
import { useDispatch, useSelector } from 'react-redux'
import { setOrderShippingStatus, setSelectedOrderShippingStatus } from '../../../../redux/messenger_orders/messenger_ordersSlice'
import ModalRejected from './components/ModalRejected'
import ModalDelivered from './components/ModalDelivered'
import AwesomeAlert from 'react-native-awesome-alerts'
import PackageInfo from './components/PackageInfo'
import PaymentInfo from './components/PaymentInfo'
import { MY_CONVERSATIONS } from '../../../../graphql/messages'
import { conversations, setConversations } from '../../../../redux/messages/messagesSlice'

moment.locale('es')

const DetailsNavView = ({ navigation, route }) => {
    let data = route.params?.data
    const [sellers, setSellers] = useState([])
    const [actionsButton, setActionsButton] = useState([])
    const [displayLoading, setDisplayLoading] = useState(false)
    const [shippingStatus, setShippingStatus] = useState(data.orderById.shippingStatus)
    const [gifSource, setGifSource] = useState(null)
    const [showModalRejected, setShowModalRejected] = useState(false)
    const [showModalDelivered, setShowModalDelivered] = useState(false)
    const [showAlertAw, setShowAlert] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pickedDate, setPickedDate] = useState('')
    const [sellerContact, setSellerContact] = useState('')
    let hasNote = false
    const { colors } = useTheme()
    const conversation_reducer = useSelector(conversations)


    const dispatch = useDispatch()

    const [orderTransit, { loadingTransit, errorTransit, dataTransit }] = useMutation(ORDER_TRANSIT, {
        onCompleted: (dataTransit) => {
            if (dataTransit.orderInTransit.errors) {
                if (dataTransit.orderInTransit.errors.length > 0) {
                    console.log("ERROR ACEPTANDO ENVIO EL ENVIO >> ", dataTransit)
                } else {
                    if (dataTransit.orderInTransit.order) {
                        if (dataTransit.orderInTransit.order.shippingStatus == 'IN_TRANSIT') {
                            data.orderById.shippingStatus = 'IN_TRANSIT'
                            setShippingStatus('IN_TRANSIT')
                            setDisplayLoading(false)
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Estado del Envío actualizado correctamente.', ToastAndroid.LONG)
                            }
                            const parametros = {
                                "id": data.orderById.id,
                                "status": 'IN_TRANSIT'
                            }
                            dispatch(setOrderShippingStatus(parametros))
                            dispatch(setSelectedOrderShippingStatus('IN_TRANSIT'))
                            console.log("CAMBIO EL ESTADOOO")
                        }
                    }
                }
            }
            setDisplayLoading(false)
        },
        onError: () => {
            console.log('Error CAMBIOANDO ESTADO A TRANSITANDO Envío >> ', error)
            setDisplayLoading(false)
        }
    })

    const [orderLost, { loadingLost, errorLost, dataLost }] = useMutation(ORDER_LOST, {
        onCompleted: (dataLost) => {
            if (dataLost.orderLost.errors) {
                if (dataLost.orderLost.errors.length > 0) {
                    console.log("ERROR PERDIENDO ENVIO EL ENVIO >> ", dataLost.orderLost.errors)
                } else {
                    if (dataLost.orderLost.order) {
                        if (dataLost.orderLost.order.shippingStatus == 'LOST') {
                            data.orderById.shippingStatus = 'LOST'
                            setShippingStatus('LOST')
                            setDisplayLoading(false)
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Estado del Envío actualizado correctamente.', ToastAndroid.LONG)
                            }
                            const parametros = {
                                "id": data.orderById.id,
                                "status": 'LOST'
                            }
                            dispatch(setOrderShippingStatus(parametros))
                            dispatch(setSelectedOrderShippingStatus('LOST'))
                            console.log("CAMBIO EL ESTADOOO")
                        }
                    }
                }
            }
            setDisplayLoading(false)
        },
        onError: () => {
            console.log('Error CAMBIOANDO ESTADO A LOST Envío >> ', error)
            setDisplayLoading(false)
        }
    })

    const [getConversations, { loadingConversations, errorConversations, dataConversations }] = useLazyQuery(MY_CONVERSATIONS, {
        onCompleted: (dataConversations) => {
            dispatch(setConversations(dataConversations.myConversations.edges))
            setLoading(false)
            let flag = false
            dataConversations.myConversations.edges.forEach(conv => {
                if (conv.node.conversationUser.serverId == sellerContact.user.serverId) {
                    flag = true
                    navigation.navigate('MessagesChatScreen', { message: conv.node })
                }
            })
            if (!flag) {
                navigation.navigate('WriteMessageScreen', { selecteds: [sellerContact.user], goBack: true })
            }
        },
        onError: (errorConversations) => {
            setLoading(false)
            console.log('Error Cargando Conversaciones >> ', errorConversations)
        },
        fetchPolicy: "no-cache"
    })

    const contactMessage = (seller) => {
        let flag = false
        if (conversation_reducer.length > 0) {
            conversation_reducer.forEach(conv => {
                if (conv.node.conversationUser.serverId == seller.user.serverId) {
                    flag = true
                    navigation.navigate('MessagesChatScreen', { message: conv.node })
                }
            })
            if (!flag) {
                navigation.navigate('WriteMessageScreen', { selecteds: [seller.user], goBack: true })
            }
        } else {
            setLoading(true)
            setSellerContact(seller)
            getConversations()
        }
    }

    useEffect(() => {
        if (data) {
            let temp = []
            data.orderById.sellers.map((seller) => {
                if (!temp.includes(seller)) {
                    temp.push(seller)
                }
            })
            setSellers(temp)
            switch (data.orderById.shippingStatus) {
                case 'ACCEPTED_CARRIER':
                    setGifSource(require('../../../../../assets/product.gif'))
                    setActionsButton([

                    ])
                    break;
                case 'PICKED_UP_CARRIER':
                    data.orderById.events.map((event) => {
                        if (event.type == 'PICKED_UP_CARRIER')
                            setPickedDate(event.date)
                    })
                    setGifSource(require('../../../../../assets/product.gif'))
                    setActionsButton([
                        {
                            text: "En tránsito",
                            icon: actionIcon('truck-moving'),
                            name: "in_transit",
                            position: 2,
                            color: Colors.COLORS.PRIMARY
                        },
                        /* {
                            text: "Perdido",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        } */
                    ])
                    break;
                case 'IN_TRANSIT':
                    data.orderById.events.map((event) => {
                        if (event.type == 'PICKED_UP_CARRIER')
                            setPickedDate(event.date)
                    })
                    setGifSource(require('../../../../../assets/delivery.gif'))
                    setActionsButton([
                        {
                            text: "Entregado",
                            icon: actionIcon('handshake'),
                            name: "delivered",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        },
                        {
                            text: "Rechazado",
                            icon: actionIcon('handshake-slash'),
                            name: "rejected",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        },
                        /* {
                            text: "Perdido",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        } */
                    ])
                    break;
                case 'DELIVERED':
                    setGifSource(require('../../../../../assets/open-box.gif'))
                    setActionsButton([
                        /* {
                            text: "Rechazado",
                            icon: actionIcon('handshake-slash'),
                            name: "rejected",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        }, */
                    ])
                    break;
                case 'REJECTED':
                    setGifSource(require('../../../../../assets/unsubscribed.gif'))
                    setActionsButton([
                        /* {
                            text: "Perdido",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        } */
                    ])
                    break;
                case 'LOST':
                    setGifSource(require('../../../../../assets/warning-2.gif'))
                    break;
                default:
                    break;
            }
        }
    }, [])

    useEffect(() => {
        switch (shippingStatus) {
            case 'ACCEPTED_CARRIER':
                setGifSource(require('../../../../../assets/product.gif'))
                setActionsButton([

                ])
                break;
            case 'PICKED_UP_CARRIER':
                setGifSource(require('../../../../../assets/product.gif'))
                setActionsButton([
                    {
                        text: "En tránsito",
                        icon: actionIcon('truck-moving'),
                        name: "in_transit",
                        position: 2,
                        color: Colors.COLORS.PRIMARY
                    },
                    /* {
                        text: "Perdido",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    } */
                ])
                break;
            case 'IN_TRANSIT':
                setGifSource(require('../../../../../assets/delivery.gif'))
                setActionsButton([
                    {
                        text: "Entregado",
                        icon: actionIcon('handshake'),
                        name: "delivered",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    },
                    {
                        text: "Rechazado",
                        icon: actionIcon('handshake-slash'),
                        name: "rejected",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    },
                    /* {
                        text: "Perdido",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    } */
                ])
                break;
            case 'DELIVERED':
                setGifSource(require('../../../../../assets/open-box.gif'))
                setActionsButton([
                    /* {
                        text: "Rechazado",
                        icon: actionIcon('handshake-slash'),
                        name: "rejected",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    }, */
                ])
                break;
            case 'REJECTED':
                setGifSource(require('../../../../../assets/unsubscribed.gif'))
                setActionsButton([
                    /* {
                        text: "Perdido",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    } */
                ])
                break;
            case 'LOST':
                setGifSource(require('../../../../../assets/warning-2.gif'))
                break;
            default:
                break;
        }
    }, [shippingStatus])

    const actionIcon = (name) => {
        return (
            <FontAwesome5
                name={name}
                size={20}
                color={colors.SURFACE}
            />
        )
    }

    const doAction = (action) => {
        switch (action) {
            case 'in_transit':
                setShowAlert(true)
                break;
            case 'rejected':
                setShowModalRejected(true)
                break;
            case 'lost':
                setShowAlert(true)
                break;
            case 'delivered':
                setShowModalDelivered(true)
                break;
        }
    }

    const statusToLost = () => {
        setDisplayLoading(true)
        setShowAlert(false)
        orderLost({ variables: { id: data.orderById.id } })
    }

    const statusToInTransit = () => {
        setDisplayLoading(true)
        setShowAlert(false)
        orderTransit({ variables: { id: data.orderById.id } })
    }

    const llamar = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`)
    }

    return (
        <>
            <ModalRejected
                showModalRejected={showModalRejected}
                setShowModalRejected={setShowModalRejected}
                envio={data}
                setShippingStatus={setShippingStatus}
            />
            <ModalDelivered
                showModalDelivered={showModalDelivered}
                setShowModalDelivered={setShowModalDelivered}
                envio={data}
                setShippingStatus={setShippingStatus}
            />

            <ScrollView showsVerticalScrollIndicator={false}/*  style={styles.container} */>
                {
                    (data.orderById.paymentStatus == 'NOT_CHARGED'
                        && data.orderById.shippingStatus != 'LOST'
                        && data.orderById.shippingStatus != 'REJECTED'
                        && data.orderById.shippingStatus != 'DELIVERED') ? (
                        <PaymentInfo />
                    ) : (null)
                }
                {
                    ((data.orderById.shippingStatus == 'PICKED_UP_CARRIER'
                        || data.orderById.shippingStatus == 'IN_TRANSIT')
                        && pickedDate != '') ? (
                        <PackageInfo pickedDate={pickedDate} />
                    ) : (null)
                }
                <View style={styles.container}>
                    <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Typography h3 style={{ marginBottom: 10 }}>
                                Envío #{data.orderById.number}
                            </Typography>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                            <View>
                                <Typography h3 style={{ marginVertical: 10 }}>
                                    Estado de procesamiento
                                </Typography>
                                <Typography color={Colors.COLORS.INFO}>
                                    {orderStatusDisplay(data.orderById.status).toUpperCase()}
                                </Typography>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                            <View>
                                <Typography h3 style={{ marginVertical: 10 }}>
                                    Estado del envío
                                </Typography>
                                <Typography color={Colors.COLORS.INFO}>
                                    {orderShippingStatusDisplay(shippingStatus).toUpperCase()}
                                </Typography>
                            </View>
                            <View>
                                <RNImage backgroundColor='white' source={gifSource} style={{ height: 30, width: 30, position: 'relative', marginTop: 10 }} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                            <View>
                                <Typography h3 style={{ marginVertical: 10 }}>
                                    Estado del pago
                                </Typography>
                                <Typography color={Colors.COLORS.INFO}>
                                    {pagoAmigable(data.orderById.paymentStatus)}
                                </Typography>
                            </View>
                            {data.orderById.paymentStatus == 'NOT_CHARGED' ? (
                                <View>
                                    <RNImage backgroundColor='white' source={require('../../../../../assets/outline-error-solid.gif')} style={{ height: 40, width: 40, position: 'relative', marginTop: 10 }} />
                                </View>
                            ) : null}

                        </View>
                    </View>
                    <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                        <Typography h3 style={{ marginBottom: 10 }}>
                            Cliente
                        </Typography>
                        {data.orderById.user ? (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ClientDetails', { client: data.orderById.user })}
                            >
                                <Typography color={colors.primary}>
                                    {data.orderById.user.firstName ? (
                                        data.orderById.user.firstName + ' ' + data.orderById.user.lastName
                                    ) : (
                                        data.orderById.user.userName
                                    )}
                                </Typography>
                            </TouchableOpacity>
                        ) : (
                            <Typography color={colors.ON_SURFACE}>
                                Invitado
                            </Typography>
                        )}
                        {data.orderById.defaultPickupAddress ? (
                            <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                                <Typography h3 style={{ marginVertical: 10 }}>
                                    Dirección de Recogida
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {data.orderById.defaultPickupAddress.firstName} {data.orderById.defaultPickupAddress.lastName}
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {data.orderById.defaultPickupAddress.streetAddress1}
                                </Typography>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        Ciudad:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {data.orderById.defaultPickupAddress.city}
                                    </Typography>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        Provincia:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {data.orderById.defaultPickupAddress.countryArea}
                                    </Typography>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        País:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {data.orderById.defaultPickupAddress.country.country}
                                    </Typography>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        Código postal:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {data.orderById.defaultPickupAddress.postalCode}
                                    </Typography>
                                </View>
                            </View>
                        ) : (
                            <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                                <Typography h3 style={{ marginVertical: 10 }}>
                                    Dirección de Recogida
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    Dirección de recogida no encontrada
                                </Typography>
                            </View>
                        )}
                        <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                            <Typography h3 style={{ marginVertical: 10 }}>
                                Dirección de Entrega
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {data.orderById.shippingAddress.firstName} {data.orderById.shippingAddress.lastName}
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {data.orderById.shippingAddress.streetAddress1}
                            </Typography>

                            <View style={{ flexDirection: 'row' }}>
                                <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                    Ciudad:
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {data.orderById.shippingAddress.city}
                                </Typography>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                    Provincia:
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {data.orderById.shippingAddress.countryArea}
                                </Typography>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                    País:
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {data.orderById.shippingAddress.country.country}
                                </Typography>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                    Código postal:
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {data.orderById.shippingAddress.postalCode}
                                </Typography>
                            </View>
                        </View>
                        <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                            <Typography h3 style={{ marginVertical: 10 }}>
                                Teléfono
                            </Typography>
                            {
                                data.orderById.shippingAddress.phone ?
                                    (
                                        <Typography color={Colors.COLORS.INFO} onPress={() => llamar(data.orderById.shippingAddress.phone)}>
                                            {data.orderById.shippingAddress.phone}  <Feather
                                                name="phone-call"
                                                color={Colors.COLORS.INFO}
                                                size={15}
                                            />
                                        </Typography>
                                    ) : (
                                        <Typography color={colors.ON_SURFACE}>
                                            No especificado
                                        </Typography>
                                    )
                            }
                        </View>
                    </View>
                    <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                        <Typography h3 style={{ marginBottom: 10 }}>
                            Vendedor
                        </Typography>
                        {sellers.map((seller, index) => (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                                key={index}
                            >
                                <View>
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => navigation.navigate('SellerDetails', { seller: seller })}
                                    >
                                        <Typography color={colors.primary}>
                                            {seller.user.firstName + ' ' + seller.user.lastName}
                                        </Typography>
                                    </TouchableOpacity>
                                    <Typography>
                                        {seller.user.userName}
                                    </Typography>
                                </View>
                                <TouchableOpacity onPress={() => contactMessage(seller)}>
                                    <Typography color={colors.primary}>CONTACTAR</Typography>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                        <Typography h3 style={{ marginBottom: 10 }}>
                            Peso Total
                        </Typography>
                        <Typography color={colors.ON_SURFACE}>
                            {parseFloat(data.orderById.weight.value).toFixed(2)} {data.orderById.weight.unit}
                        </Typography>
                    </View>
                    <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                        <Typography h3 style={{ marginBottom: 10 }}>
                            Dimensiones del pedido
                        </Typography>
                        <Typography color={colors.ON_SURFACE}>
                            Largo x Ancho x Alto
                        </Typography>
                        <Typography color={colors.ON_SURFACE}>
                            {data.orderById.allDimensions}
                        </Typography>
                    </View>
                    <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                        <Typography h3 style={{ marginBottom: 10 }}>
                            Nota del Cliente
                        </Typography>
                        {data.orderById.customerNote ?
                            (
                                <Typography color={colors.ON_SURFACE}>
                                    {data.orderById.customerNote}
                                </Typography>
                            ) :
                            (
                                <Typography color={colors.ON_SURFACE}>
                                    No hay nota del cliente asociado con este pedido.
                                </Typography>
                            )}
                    </View>
                    <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                        <Typography h3 style={{ marginBottom: 10 }}>
                            Nota del Pedido
                        </Typography>
                        {data.orderById.events.map((event, index) => {
                            if (event.type == 'NOTE_ADDED') {
                                hasNote = true
                                return (
                                    <View key={index}>
                                        <Typography small color={colors.ON_SURFACE}>
                                            {event.user.firstName && ' - '}{moment(event.date).format('YYYY-MM-DD')}
                                        </Typography>
                                        <Typography color={colors.ON_SURFACE}>
                                            {event.message}
                                        </Typography>
                                    </View>
                                )
                            }
                        })}
                        {
                            !hasNote &&
                            (
                                <Typography color={colors.ON_SURFACE}>
                                    No hay notas asociadas con este pedido.
                                </Typography>
                            )
                        }
                    </View>
                    { // imagenes de devolucion del paquete
                        (data.orderById.shippingStatus == 'RETURN_REQUEST' || data.orderById.shippingStatus == 'RETURN_APPROVED' ||
                            data.orderById.shippingStatus == 'RETURN_DISAPPROVED') ? (
                            <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                                <Typography h3 style={{ marginBottom: 10 }}>
                                    Solicitud de devolución de envío
                                </Typography>
                                <Typography h4 style={{ marginBottom: 10 }}>
                                    <Typography bold>Motivo: </Typography>{data.orderById.returnedOrder.reason}
                                </Typography>
                                {data.orderById.returnedOrder.returnStatus == "PENDING" ? (null) : (
                                    data.orderById.returnedOrder.returnStatus == "DISAPPROVED" ? (
                                        <Typography h4 style={{ marginBottom: 10 }}>
                                            <Typography bold color={Colors.COLORS.ERROR}>Desaprobada: </Typography>
                                            {data.orderById.returnedOrder.reasonDisapproved}
                                        </Typography>
                                    ) : (
                                        <Typography bold color={Colors.COLORS.PRIMARY} h4 style={{ marginBottom: 10 }}>
                                            La solicitud de devolución fue aprobada
                                        </Typography>
                                    )
                                )}
                                <Typography h4 style={{ marginBottom: 10 }}>
                                    Imágenes de evidencia:
                                </Typography>
                                <ScrollView
                                    showsHorizontalScrollIndicator={true}
                                    horizontal={true}
                                >
                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        {data.orderById.returnedOrder ? (
                                            data.orderById.returnedOrder.returnImg.length > 0 ? (
                                                data.orderById.returnedOrder.returnImg.map((photo, index) => {
                                                    return (
                                                        <View key={photo.id} style={{ paddingHorizontal: 5 }}>
                                                            <Image
                                                                source={{ uri: photo.image.url }}
                                                                indicator={Progress.Pie}
                                                                indicatorProps={{
                                                                    color: Colors.COLORS.PRIMARY,
                                                                    borderWidth: 0,
                                                                }}
                                                                imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                                                            />
                                                        </View>
                                                    )
                                                })
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography>
                                                No tiene este valor
                                            </Typography>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                        ) : (null)
                    }
                    { // imagenes de rechazo del paquete
                        (data.orderById.shippingStatus == 'REJECTED') ? (
                            <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                                <Typography h3 style={{ marginBottom: 10 }}>
                                    Envío Rechazado
                                </Typography>
                                <Typography h4 style={{ marginBottom: 10 }}>
                                    <Typography bold>Motivo: </Typography>{data.orderById.rejectedOrder.reason}
                                </Typography>
                                <Typography h4 style={{ marginBottom: 10 }}>
                                    Imágenes de evidencia:
                                </Typography>
                                <ScrollView
                                    showsHorizontalScrollIndicator={true}
                                    horizontal={true}
                                >
                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        {data.orderById.rejectedOrder ? (
                                            data.orderById.rejectedOrder.signImg.length > 0 ? (
                                                data.orderById.rejectedOrder.signImg.map((photo, index) => {
                                                    return (
                                                        <View key={photo.id} style={{ paddingHorizontal: 5 }}>
                                                            <Image
                                                                source={{ uri: photo.image.url }}
                                                                indicator={Progress.Pie}
                                                                indicatorProps={{
                                                                    color: Colors.COLORS.PRIMARY,
                                                                    borderWidth: 0,
                                                                }}
                                                                imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                                                            />
                                                        </View>
                                                    )
                                                })
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography>
                                                No tiene este valor
                                            </Typography>
                                        )}
                                    </View>
                                </ScrollView>
                                <Typography h4 style={{ marginBottom: 10 }}>
                                    Imágenes de paquete:
                                </Typography>
                                <ScrollView
                                    showsHorizontalScrollIndicator={true}
                                    horizontal={true}
                                >
                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        {data.orderById.rejectedOrder ? (
                                            data.orderById.rejectedOrder.shipImg.length > 0 ? (
                                                data.orderById.rejectedOrder.shipImg.map((photo, index) => (
                                                    <View key={photo.id} style={{ paddingHorizontal: 5 }}>
                                                        <Image
                                                            source={{ uri: photo.image.url }}
                                                            indicator={Progress.Pie}
                                                            indicatorProps={{
                                                                color: Colors.COLORS.PRIMARY,
                                                                borderWidth: 0,
                                                            }}
                                                            imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                                                        />
                                                    </View>
                                                ))
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography>
                                                No tiene este valor
                                            </Typography>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                        ) : (null)
                    }
                    { // imagenes de entrega del paquete
                        (data.orderById.shippingStatus == 'DELIVERED' || data.orderById.shippingStatus == 'RETURN_REQUEST' ||
                            data.orderById.shippingStatus == 'RETURN_DISAPPROVED' || data.orderById.shippingStatus == 'RETURN_APPROVED') ? (
                            <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                                <Typography h3 style={{ marginBottom: 10 }}>
                                    Imágenes de entrega
                                </Typography>
                                <Typography h4 style={{ marginBottom: 10 }}>
                                    Imágenes de firma:
                                </Typography>
                                <ScrollView
                                    showsHorizontalScrollIndicator={true}
                                    horizontal={true}
                                >
                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        {data.orderById.signatureImagesDelivery ? (
                                            data.orderById.signatureImagesDelivery.length > 0 ? (
                                                data.orderById.signatureImagesDelivery.map((photo, index) => {
                                                    return (
                                                        <View key={photo.id} style={{ paddingHorizontal: 5 }}>
                                                            <Image
                                                                source={{ uri: photo.image.url }}
                                                                indicator={Progress.Pie}
                                                                indicatorProps={{
                                                                    color: Colors.COLORS.PRIMARY,
                                                                    borderWidth: 0,
                                                                }}
                                                                imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                                                            />
                                                        </View>
                                                    )
                                                })
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography>
                                                No tiene este valor
                                            </Typography>
                                        )}
                                    </View>
                                </ScrollView>
                                <Typography h4 style={{ marginBottom: 10 }}>
                                    Imágenes de paquete:
                                </Typography>
                                <ScrollView
                                    showsHorizontalScrollIndicator={true}
                                    horizontal={true}
                                >
                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        {data.orderById.packageImagesDelivery ? (
                                            data.orderById.packageImagesDelivery.length > 0 ? (
                                                data.orderById.packageImagesDelivery.map((photo, index) => (
                                                    <View key={photo.id} style={{ paddingHorizontal: 5 }}>
                                                        <Image
                                                            source={{ uri: photo.image.url }}
                                                            indicator={Progress.Pie}
                                                            indicatorProps={{
                                                                color: Colors.COLORS.PRIMARY,
                                                                borderWidth: 0,
                                                            }}
                                                            imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                                                        />
                                                    </View>
                                                ))
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography>
                                                No tiene este valor
                                            </Typography>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                        ) : (null)
                    }
                    {
                        data.orderById.shippingStatus != 'ACCEPTED_CARRIER' ? (
                            <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                                <Typography h3 style={{ marginBottom: 10 }}>
                                    Imágenes de recogida
                                </Typography>
                                <Typography h4 style={{ marginBottom: 10 }}>
                                    Imágenes de firma:
                                </Typography>
                                <ScrollView
                                    showsHorizontalScrollIndicator={true}
                                    horizontal={true}
                                >
                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        {data.orderById.signatureImagesPickup ? (
                                            data.orderById.signatureImagesPickup.length > 0 ? (
                                                data.orderById.signatureImagesPickup.map((photo, index) => {
                                                    return (
                                                        <View key={photo.id} style={{ paddingHorizontal: 5 }}>
                                                            <Image
                                                                source={{ uri: photo.image.url }}
                                                                indicator={Progress.Pie}
                                                                indicatorProps={{
                                                                    color: Colors.COLORS.PRIMARY,
                                                                    borderWidth: 0,
                                                                }}
                                                                imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                                                            />
                                                        </View>
                                                    )
                                                })
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography>
                                                No tiene este valor
                                            </Typography>
                                        )}
                                    </View>
                                </ScrollView>
                                <Typography h4 style={{ marginBottom: 10 }}>
                                    Imágenes de paquete:
                                </Typography>
                                <ScrollView
                                    showsHorizontalScrollIndicator={true}
                                    horizontal={true}
                                >
                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        {data.orderById.packageImagesPickup ? (
                                            data.orderById.packageImagesPickup.length > 0 ? (
                                                data.orderById.packageImagesPickup.map((photo, index) => (
                                                    <View key={photo.id} style={{ paddingHorizontal: 5 }}>
                                                        <Image
                                                            source={{ uri: photo.image.url }}
                                                            indicator={Progress.Pie}
                                                            indicatorProps={{
                                                                color: Colors.COLORS.PRIMARY,
                                                                borderWidth: 0,
                                                            }}
                                                            imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                                                        />
                                                    </View>
                                                ))
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography>
                                                No tiene este valor
                                            </Typography>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                        ) : (null)
                    }
                    { // imagenes de recogida del paquete
                        ((data.orderById.shippingStatus == 'PICKED_UP_CARRIER'
                            || data.orderById.shippingStatus == 'IN_TRANSIT')
                            && pickedDate != '') ? (
                            <View style={{ paddingVertical: 40 }}><Typography></Typography></View>
                        ) : (<Typography></Typography>)
                    }

                </View>
            </ScrollView >
            {
                (data.orderById.shippingStatus === 'LOST' || data.orderById.shippingStatus === 'NO_STATUS' ||
                    shippingStatus === 'LOST' || shippingStatus === 'NO_STATUS' ||
                    shippingStatus === 'RETURN_REQUEST' || shippingStatus === 'RETURN_DISAPPROVED' ||
                    shippingStatus === 'REJECTED' || shippingStatus === 'ACCEPTED_CARRIER' ||
                    shippingStatus === 'DELIVERED' || shippingStatus === 'RETURN_APPROVED') ? null :
                    (
                        <FloatingAction
                            color={Colors.COLORS.PRIMARY}
                            floatingIcon={
                                <MaterialCommunityIcons
                                    name='state-machine'
                                    size={26}
                                    color='#fff'
                                />
                            }
                            actions={actionsButton}
                            onPressItem={name => {
                                doAction(name)
                            }}
                        />
                    )
            }
            {
                displayLoading ? (
                    <View style={styles.loadingAccept}>
                        <ActivityIndicator size={50} color={colors.PRIMARY} />
                    </View>
                ) : (null)
            }
            <AwesomeAlert
                show={showAlertAw}
                title="Cambio de estado"
                message="¿Está seguro de cambiar el estado de la orden a 'Transportándose'?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Cancelar"
                confirmText="Aceptar"
                confirmButtonColor={Colors.COLORS.WARNING}
                onCancelPressed={() => {
                    setShowAlert(false)
                }}
                onDismiss={() => {
                    setShowAlert(false)
                }}
                onConfirmPressed={() => statusToInTransit()}
            />
        </>
    )
}

const styles = StyleSheet.create({
    aIndicator: {
        position: 'absolute',
        right: 14,
        top: 9,
    },
    cancelIcon: {
        //position: 'absolute',
        /* left: 16,
        top: 16, */
        //marginLeft: 16,
        //marginTop: 16,
        zIndex: 5,
        //backgroundColor: 'red'
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    okIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    okInputIcon: {
        position: 'absolute',
        right: 10,
        top: 6,
    },
    textInputContainer: {
        width: '100%',
        //marginBottom: -100
        //backgroundColor: 'blue',
    },
    commentInput: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 100,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        height: 55,
        color: '#fff',
        paddingRight: 60,
    },
    vistaPrevia: {
        marginTop: 10,
        //marginHorizontal: 10,
        height: Dimensions.get('window').height * 0.75,
        width: '100%'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    selectModal: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        width: 80,
        height: 100,
        backgroundColor: '#fff',
        margin: 42,
        borderRadius: 12,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
    },
    loadingAccept: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        zIndex: 5,
        elevation: 3,
    },
    myCard: {
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        padding: 15,
        elevation: 4,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        flexDirection: 'column',
        borderColor: 'transparent',
        borderRadius: 8,
        marginVertical: 5,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 8,
    },
})

export default DetailsNavView