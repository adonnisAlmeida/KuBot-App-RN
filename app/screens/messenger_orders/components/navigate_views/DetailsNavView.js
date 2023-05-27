import { View, Image, Dimensions, ScrollView, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, ToastAndroid, Platform} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Typography } from '../../../../components'
import { useTheme } from '@react-navigation/native'
import moment from 'moment'
import { orderShippingStatusDisplay, orderStatusDisplay } from '../../../../utils/CommonFunctions'
import Colors from '../../../../constants/Colors'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { FloatingAction } from 'react-native-floating-action'
import { useMutation } from '@apollo/client'
import { ORDER_LOST, ORDER_TRANSIT } from '../../../../graphql/orders'
import { useDispatch } from 'react-redux'
import { setOrderShippingStatus, setSelectedOrderShippingStatus } from '../../../../redux/messenger_orders/messenger_ordersSlice'
import ModalRejected from './components/ModalRejected'
import ModalDelivered from './components/ModalDelivered'

moment.locale('es')

const DetailsNavView = ({ navigation, route }) => {
    let data = route.params?.data
    const [sellers, setSellers] = useState([])
    const [actionsButton, setActionsButton] = useState([])
    const [displayLoading, setDisplayLoading] = useState(false)
    const [shippingStatus, setShippingStatus] = useState(data.order.shippingStatus)
    const [gifSource, setGifSource] = useState(null)
    const [showModalRejected, setShowModalRejected] = useState(false)
    const [showModalDelivered, setShowModalDelivered] = useState(false)
    let hasNote = false
    const { colors } = useTheme()


    const dispatch = useDispatch()

    const [orderTransit, { loadingTransit, errorTransit, dataTransit }] = useMutation(ORDER_TRANSIT, {
        onCompleted: (dataTransit) => {
            if (dataTransit.orderInTransit.errors) {
                if (dataTransit.orderInTransit.errors.length > 0) {
                    console.log("ERROR ACEPTANDO ENVIO EL ENVIO >> ", dataTransit)
                } else {
                    if (dataTransit.orderInTransit.order) {
                        if (dataTransit.orderInTransit.order.shippingStatus == 'IN_TRANSIT') {
                            data.order.shippingStatus = 'IN_TRANSIT'
                            setShippingStatus('IN_TRANSIT')
                            setDisplayLoading(false)
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Estado de la Envío actualizado correctamente.', ToastAndroid.LONG)
                            }
                            const parametros = {
                                "id": data.order.id,
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
                            data.order.shippingStatus = 'LOST'
                            setShippingStatus('LOST')
                            setDisplayLoading(false)
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Estado de la Envío actualizado correctamente.', ToastAndroid.LONG)
                            }
                            const parametros = {
                                "id": data.order.id,
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

    useEffect(() => {
        if (data) {
            let temp = []
            data.order.sellers.map((seller) => {
                if (!temp.includes(seller)) {
                    temp.push(seller)
                }
            })
            setSellers(temp)
            switch (data.order.shippingStatus) {
                case 'ACCEPTED_CARRIER':
                    setGifSource(require('../../../../../assets/product.gif'))
                    setActionsButton([
                        /* {
                            text: "En tránsito",
                            icon: actionIcon('truck-moving'),
                            name: "in_transit",
                            position: 2,
                            color: Colors.COLORS.PRIMARY
                        },
                        {
                            text: "Perdida",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        } */
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
                        {
                            text: "Perdida",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        }
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
                        /* {
                            text: "Rechazado",
                            icon: actionIcon('handshake-slash'),
                            name: "rejected",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        }, */
                        {
                            text: "Perdida",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        }
                    ])
                    break;
                case 'DELIVERED':
                    setGifSource(require('../../../../../assets/open-box.gif'))
                    setActionsButton([
                        {
                            text: "Rechazado",
                            icon: actionIcon('handshake-slash'),
                            name: "rejected",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        },
                    ])
                    break;
                case 'REJECTED':
                    setGifSource(require('../../../../../assets/unsubscribed.gif'))
                    setActionsButton([
                        /* {
                            text: "Perdida",
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
                    /* {
                        text: "En tránsito",
                        icon: actionIcon('truck-moving'),
                        name: "in_transit",
                        position: 2,
                        color: Colors.COLORS.PRIMARY
                    },
                    {
                        text: "Perdida",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    } */
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
                    {
                        text: "Perdida",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    }
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
                    /* {
                        text: "Rechazado",
                        icon: actionIcon('handshake-slash'),
                        name: "rejected",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    }, */
                    {
                        text: "Perdida",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    }
                ])
                break;
            case 'DELIVERED':
                setGifSource(require('../../../../../assets/open-box.gif'))
                setActionsButton([
                    {
                        text: "Rechazado",
                        icon: actionIcon('handshake-slash'),
                        name: "rejected",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    },
                ])
                break;
            case 'REJECTED':
                setGifSource(require('../../../../../assets/unsubscribed.gif'))
                setActionsButton([
                    /* {
                        text: "Perdida",
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
                setDisplayLoading(true)
                console.log('Cambiar estado a TRANSPORTANDOCE')
                orderTransit({ variables: { id: data.order.id } })
                break;
            case 'rejected':
                setShowModalRejected(true)
                break;
            case 'lost':
                console.log('Cambiar estado a PERDIDA')
                setDisplayLoading(true)
                orderLost({ variables: { id: data.order.id } })
                break;
            case 'delivered':
                setShowModalDelivered(true)
                break;
        }
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
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography h3 style={{ marginBottom: 10 }}>
                            Envío #{data.order.number}
                        </Typography>
                        <Typography color={Colors.COLORS.INFO} style={{ marginBottom: 10 }}>
                            {orderStatusDisplay(data.order.status).toUpperCase()}
                        </Typography>
                    </View>
                    {/* <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                        <Typography h3 style={{ marginVertical: 6 }}>
                            Creada el:
                        </Typography>
                        <Typography color={colors.ON_SURFACE}>
                            {printCreated(data.order.created)}
                        </Typography>
                    </View> */}
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
                            <Image backgroundColor='white' source={gifSource} style={{ height: 30, width: 30, position: 'relative', marginTop: 10 }} />
                        </View>
                    </View>
                </View>
                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <Typography h3 style={{ marginBottom: 10 }}>
                        Cliente
                    </Typography>
                    {data.order.user ? (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ClientDetails', { client: data.order.user })}
                        >
                            <Typography color={colors.primary}>
                                {data.order.user.firstName ? (
                                    data.order.user.firstName + ' ' + data.order.user.lastName
                                ) : (
                                    data.order.user.userName
                                )}
                            </Typography>
                        </TouchableOpacity>
                    ) : (
                        <Typography color={colors.ON_SURFACE}>
                            Invitado
                        </Typography>
                    )}
                    <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                        <Typography h3 style={{ marginVertical: 10 }}>
                            Dirección de Envío
                        </Typography>
                        <Typography color={colors.ON_SURFACE}>
                            {data.order.shippingAddress.firstName} {data.order.shippingAddress.lastName}
                        </Typography>
                        <Typography color={colors.ON_SURFACE}>
                            {data.order.shippingAddress.streetAddress1}
                        </Typography>
                        <View style={{ flexDirection: 'row' }}>
                            <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                País:
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {data.order.shippingAddress.country.country}
                            </Typography>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                Ciudad:
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {data.order.shippingAddress.city}
                            </Typography>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                Código postal:
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {data.order.shippingAddress.postalCode}
                            </Typography>
                        </View>
                    </View>
                    <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                        <Typography h3 style={{ marginVertical: 10 }}>
                            Teléfono
                        </Typography>
                        {
                            data.order.shippingAddress.phone ?
                                (
                                    <Typography color={Colors.COLORS.INFO} onPress={() => llamar(data.order.shippingAddress.phone)}>
                                        {data.order.shippingAddress.phone}  <Feather
                                            name="phone-call"
                                            color={Colors.COLORS.INFO}
                                            size={15}
                                        />
                                    </Typography>
                                ) : (
                                    <Typography color={colors.ON_SURFACE}>
                                        'No especificado'
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
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigation.navigate('SellerDetails', { seller: seller.user })}
                        >
                            <Typography color={colors.primary}>
                                {seller.user.firstName + ' ' + seller.user.lastName}
                            </Typography>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <Typography h3 style={{ marginBottom: 10 }}>
                        Peso Total
                    </Typography>
                    <Typography color={colors.ON_SURFACE}>
                        {parseFloat(data.order.weight.value).toFixed(2)} {data.order.weight.unit}
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
                        {data.order.allDimensions}
                    </Typography>
                </View>
                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <Typography h3 style={{ marginBottom: 10 }}>
                        Nota del Cliente
                    </Typography>
                    {data.order.customerNote ?
                        (
                            <Typography color={colors.ON_SURFACE}>
                                {data.order.customerNote}
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
                    {data.order.events.map((event, index) => {
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
                <Typography></Typography>
            </ScrollView >

            {
                (data.order.shippingStatus === 'LOST' || data.order.shippingStatus === 'NO_STATUS' ||
                    shippingStatus === 'LOST' || shippingStatus === 'NO_STATUS' ||
                    shippingStatus === 'REJECTED' || shippingStatus === 'ACCEPTED_CARRIER') ? null :
                    (
                        <FloatingAction
                            color={Colors.COLORS.PRIMARY}
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