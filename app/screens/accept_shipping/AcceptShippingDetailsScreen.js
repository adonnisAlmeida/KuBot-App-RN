import { useTheme } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Linking, Platform, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { FloatingActionButton, Loading, Typography } from '../../components'
import moment from 'moment'
import { ACCEPT_ORDER, ORDER_ID } from '../../graphql/orders'
import { NetworkStatus, useLazyQuery, useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { removeAcceptShipping } from '../../redux/accept_shipping/accept_shippingSlice'


moment.locale('es')

const AcceptShippingDetails = ({ route, navigation, ...props }) => {
    const { colors } = useTheme()
    let order_id = route.params?.order_id
    const [sellers, setSellers] = useState([])
    const dispatch = useDispatch()
    const [orderDetails, setOrderDetails] = useState(null)
    const [displayLoading, setDisplayLoading] = useState(false)
    let hasNote = false

    const [getOrderDetail, { loadingOrder, errorOrder, dataOrder, networkStatus }] = useLazyQuery(ORDER_ID, {
        onCompleted: (dataOrder) => {
            let temp = []
            dataOrder.order.sellers.map((seller) => {
                if (!temp.includes(seller)) {
                    temp.push(seller)
                }
            })
            setSellers(temp)
            setOrderDetails(dataOrder)
        },
        onError: () => {
            console.log('Error Cargando detalles de la orden Orden >> ', errorOrder)
        },
        fetchPolicy: "no-cache"
    })

    const autoLoad = () => {
        getOrderDetail({
            variables: { id: order_id },
        })
    }

    const [acceptOrder, { loading, error, data }] = useMutation(ACCEPT_ORDER, {
        onCompleted: (data) => {
            if (data.orderAcceptedCarrier.errors) {
                if (data.orderAcceptedCarrier.errors.length > 0) {
                    console.log("ERROR ACEPTANDO ENVIO EL ENVIO >> ", data)
                } else {
                    if (data.orderAcceptedCarrier.order) {
                        if (data.orderAcceptedCarrier.order.shippingStatus == 'ACCEPTED_CARRIER') {
                            dispatch(removeAcceptShipping(orderDetails.order.id))
                            setDisplayLoading(false)
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Envío aceptado correctamente.', ToastAndroid.LONG)
                            }
                            navigation.goBack()
                        }
                    }
                }
            }
            setDisplayLoading(false)
        },
        onError: () => {
            console.log('Error Aceptando Orden >> ', error)
            setDisplayLoading(false)
        },
    })

    useEffect(() => {
        autoLoad()
    }, [])

    const llamar = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`)
    }

    const acceptShipping = () => {
        setDisplayLoading(true)
        acceptOrder({ variables: { id: orderDetails.order.id } })
    }

    if (networkStatus === NetworkStatus.error)
        return <NetworkError accion={autoLoad} />
    if (loadingOrder || errorOrder) return <Loading />
    if (orderDetails == undefined || orderDetails == null) return <Loading />

    console.log("orderDetails >> ", orderDetails)

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {orderDetails ? (
                    <>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <Typography bold h3 style={{ marginBottom: 10 }}>
                                Cliente
                            </Typography>
                            {orderDetails.order.user ? (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('ClientDetails', { client: orderDetails.order.user })}
                                >
                                    <Typography color={colors.primary}>
                                        {orderDetails.order.user.firstName + ' ' + orderDetails.order.user.lastName}
                                    </Typography>
                                </TouchableOpacity>
                            ) : (
                                <Typography color={colors.ON_SURFACE}>
                                    Invitado
                                </Typography>
                            )}
                            <View>
                                <Typography bold h3 style={{ marginVertical: 10 }}>
                                    Dirección de Envío
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {orderDetails.order.shippingAddress.firstName} {orderDetails.order.shippingAddress.lastName}
                                </Typography>
                                <Typography color={colors.ON_SURFACE}>
                                    {orderDetails.order.shippingAddress.streetAddress1}
                                </Typography>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        País:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {orderDetails.order.shippingAddress.country.country}
                                    </Typography>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        Ciudad:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {orderDetails.order.shippingAddress.city}
                                    </Typography>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        Código postal:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {orderDetails.order.shippingAddress.postalCode}
                                    </Typography>
                                </View>
                            </View>
                            <View>
                                <Typography bold h3 style={{ marginVertical: 10 }}>
                                    Teléfono
                                </Typography>
                                {
                                    orderDetails.order.shippingAddress.phone ?
                                        (
                                            <TouchableOpacity onPress={() => llamar(orderDetails.order.shippingAddress.phone)}>
                                                <Typography color={colors.primary}>
                                                    {orderDetails.order.shippingAddress.phone}
                                                </Typography>
                                            </TouchableOpacity>

                                        ) : (
                                            <Typography color={colors.ON_SURFACE}>
                                                'No especificado'
                                            </Typography>
                                        )
                                }
                            </View>
                        </View>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <Typography bold h3 style={{ marginBottom: 10 }}>
                                Vendedor
                            </Typography>
                            {sellers.map((seller, index) => (
                                <TouchableOpacity
                                    style={{ marginBottom: 6 }}
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
                            <Typography bold h3 style={{ marginBottom: 10 }}>
                                Peso Total
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {parseFloat(orderDetails.order.weight.value).toFixed(2)} {orderDetails.order.weight.unit}
                            </Typography>
                        </View>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <Typography bold h3 style={{ marginBottom: 10 }}>
                                Dimensiones del pedido
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                Largo x Ancho x Alto
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {orderDetails.order.allDimensions}
                            </Typography>
                        </View>

                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <Typography bold h3 style={{ marginBottom: 10 }}>
                                Nota del Cliente
                            </Typography>
                            {orderDetails.order.customerNote ?
                                (
                                    <Typography color={colors.ON_SURFACE}>
                                        {orderDetails.order.customerNote}
                                    </Typography>
                                ) :
                                (
                                    <Typography color={colors.ON_SURFACE}>
                                        No hay nota del cliente asociado con esta pedido.
                                    </Typography>
                                )}
                        </View>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <Typography bold h3 style={{ marginBottom: 10 }}>
                                Nota del Pedido
                            </Typography>
                            {orderDetails.order.events.map((event, index) => {
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
                    </>
                ) : (null)}
            </ScrollView>
            {displayLoading ? (
                <View style={styles.loadingAccept}>
                    <ActivityIndicator size={50} color={colors.PRIMARY} />
                </View>
            ) : (null)}


            <FloatingActionButton
                color={colors.primary}
                icon={'check-square-o'}
                onPress={() => acceptShipping()}
            />
        </>
    )
}

export default AcceptShippingDetails

const styles = StyleSheet.create({
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