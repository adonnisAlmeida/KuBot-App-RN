import { useTheme } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Linking, Platform, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { FloatingActionButton, Loading, Typography } from '../../components'
import moment from 'moment'
import { ACCEPT_ORDER, ACCEPT_ORDER_ID } from '../../graphql/orders'
import { NetworkStatus, useLazyQuery, useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { removeAcceptShipping } from '../../redux/accept_shipping/accept_shippingSlice'
import AwesomeAlert from 'react-native-awesome-alerts'
import { MONTH_NAMES, DAY_NAMES } from '../../constants/Other'
import { getCurrencySimbol, printCreated } from '../../utils/CommonFunctions'
import { FloatingAction } from 'react-native-floating-action'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Colors from '../../constants/Colors'


moment.locale('es')

const AcceptShippingDetails = ({ route, navigation, ...props }) => {
    const { colors } = useTheme()
    let order_id = route.params?.order_id
    const dispatch = useDispatch()
    const [orderDetails, setOrderDetails] = useState(null)
    const [displayLoading, setDisplayLoading] = useState(false)
    const [showAlertAw, setShowAlert] = useState(false)

    const [getOrderDetail, { loadingOrder, errorOrder, dataOrder, networkStatus }] = useLazyQuery(ACCEPT_ORDER_ID, {
        onCompleted: (dataOrder) => {
            setOrderDetails(dataOrder)
        },
        onError: () => {
            console.log('Error Cargando detalles de la orden Orden >> ', errorOrder)
        },
        fetchPolicy: "no-cache"
    })

    /* const printCreated = (date) => {
        let output = 'ff'
        let dateObject = new Date(date)
        output = DAY_NAMES[dateObject.getDay()] +
            ' ' + dateObject.getDate() +
            ' de ' + MONTH_NAMES[dateObject.getMonth()] +
            ' del ' + dateObject.getFullYear()

        return output
    } */

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
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Error aceptado envío.', ToastAndroid.LONG)
                    }
                } else {
                    if (data.orderAcceptedCarrier.order) {
                        if (data.orderAcceptedCarrier.order.shippingStatus == 'ACCEPTED_CARRIER') {
                            dispatch(removeAcceptShipping(orderDetails.order.id))
                            setDisplayLoading(false)
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Envío aceptado correctamente. Ahora puede acceder a los detalles de la orden desde el menú “Mis pedidos”', ToastAndroid.LONG)
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

    const acceptShipping = () => {
        setShowAlert(false)
        setDisplayLoading(true)
        /* setTimeout(() => {
            setDisplayLoading(false)
        }, 2000); */
        acceptOrder({ variables: { id: orderDetails.order.id } })
    }

    if (networkStatus === NetworkStatus.error)
        return <NetworkError accion={autoLoad} />
    if (loadingOrder || errorOrder) return <Loading />
    if (orderDetails == undefined || orderDetails == null) return <Loading />

    const actionIcon = (name) => {
		return (
			<FontAwesome
				name={name}
				size={22}
				color={colors.SURFACE}
			/>
		)
	}

    const actionsAccept = [
		{
			text: "Aceptar",
			icon: actionIcon('check-square-o'),
			name: "bt_accept",
			position: 1,
			color: Colors.COLORS.PRIMARY
		}
	];

    const doAction = (action) => {
		switch (action) {
			case 'bt_accept':
				setShowAlert(true)
				break;
		}
	}

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {orderDetails ? (
                    <>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <View>
                                <Typography
                                    bold h3
                                    color={colors.ON_SURFACE}
                                    style={{ marginBottom: 8 }}
                                >
                                    Orden # {orderDetails.order.number}
                                </Typography>
                                <Typography>Estado del pago {orderDetails.order.paymentStatus}</Typography>
                                <Typography bold h3 style={{ marginVertical: 10 }}>
                                    Dirección de Envío
                                </Typography>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        País:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {orderDetails.order.defaultPickupAddress.country.country}
                                    </Typography>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        Municipio:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {orderDetails.order.defaultPickupAddress.countryArea}
                                    </Typography>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        Ciudad:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {orderDetails.order.defaultPickupAddress.city}
                                    </Typography>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                        Código postal:
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {orderDetails.order.defaultPickupAddress.postalCode}
                                    </Typography>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <Typography bold h3 style={{ marginVertical: 6 }}>
                                Creada el:
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {printCreated(orderDetails.order.created)}
                            </Typography>
                        </View>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <Typography bold h3 style={{ marginBottom: 10 }}>
                                Distancia (kms):
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {orderDetails.order.getDistance}
                            </Typography>
                        </View>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <Typography bold h3 style={{ marginBottom: 10 }}>
                                Costo de envío:
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {orderDetails.order.shippingPrice.gross.amount} {getCurrencySimbol(orderDetails.order.shippingPrice.gross.currency)}
                            </Typography>
                        </View>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <Typography bold h3 style={{ marginBottom: 10 }}>
                                Peso Total:
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
                        <Typography></Typography>
                    </>
                ) : (null)}
            </ScrollView>
            {displayLoading ? (
                <View style={styles.loadingAccept}>
                    <ActivityIndicator size={50} color={colors.PRIMARY} />
                </View>
            ) : (null)}
            <FloatingAction
                color={Colors.COLORS.PRIMARY}
                overrideWithAction={true}
                actions={actionsAccept}
                onPressItem={name => {
                    doAction(name)
                }}
            />
            {/* <FloatingActionButton
                color={colors.primary}
                icon={'check-square-o'}
                onPress={() => setShowAlert(true)}
            /> */}
            <AwesomeAlert
                show={showAlertAw}
                title="Aceptar Envío"
                message="¿Está seguro de aceptar este envío?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Cancelar"
                confirmText="Aceptar"
                confirmButtonColor={Colors.COLORS.PRIMARY}
                onCancelPressed={() => {
                    setShowAlert(false)
                }}
                onDismiss={() => {
                    setShowAlert(false)
                }}
                onConfirmPressed={() => {
                    acceptShipping()
                }}
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