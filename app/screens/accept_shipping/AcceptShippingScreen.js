import { View, Text } from 'react-native'
import React from 'react'
import { Loading, NetworkError, Typography } from '../../components'
import AcceptShippingList from './components/AcceptShippingList'
import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ACCEPT_ORDERS_LIST, ORDERS_LIST } from '../../graphql/orders'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { setAcceptShipping } from '../../redux/accept_shipping/accept_shippingSlice'
import { FloatingAction } from 'react-native-floating-action'
import Colors from '../../constants/Colors'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'
import { carrierInfo } from '../../redux/userlogin/userLoginSlice'


const AcceptShippingScreen = ({ route, navigation }) => {
    const [loadingApp, setLoadingApp] = useState(false)
    const [orders, setOrders] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [loadingScroll, setLoadingScroll] = useState(false)
    const [onVacation, setOnVacation] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [endCursor, setEndCursor] = useState("")
    const dispatch = useDispatch()
    const acceptShippingStore = useSelector(state => state.accepShipping)
    const carrier_info = useSelector(carrierInfo)
    const { colors } = useTheme()

    const [getOrdersList, { loading, error, data }] = useLazyQuery(ACCEPT_ORDERS_LIST, {
        onCompleted: (data) => {
            if (data.orders.pageInfo.hasNextPage) {
                setHasNextPage(data.orders.pageInfo.hasNextPage)
                setEndCursor(data.orders.pageInfo.endCursor)
            } else {
                setHasNextPage(false)
            }
            if (loadingApp || refreshing) {
                let elementos = []
                data.orders.edges.map((edges) => elementos.push(edges.node))
                setOrders(elementos)
                dispatch(setAcceptShipping(elementos))
            } else {
                let elementos = []
                data.orders.edges.map((edges) => elementos.push(edges.node))
                setOrders([...orders, ...elementos])
                dispatch(setAcceptShipping(elementos))
            }
            /* let elementos = []
            data.orders.edges.map((edges) => elementos.push(edges.node))
            setMyOrders(elementos) */
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)

        },
        onError: (error, data) => {
            console.log('ERROR cargando ordenes >> ', JSON.stringify(error, null, 2))
            console.log('ERROR cargando ordenes data var >> ', data)
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)
        },
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        setLoadingApp(true)
        if (carrier_info?.onVacation) {
            setOnVacation(true)
            setLoadingApp(false)
        } else {
            setOnVacation(false)
            getOrdersList({ variables: { /* carrier: carrierID, */ after: '', before: '' } })
        }
    }, [])

    useEffect(() => {
        setOrders(acceptShippingStore.listado)
    }, [acceptShippingStore.listado])

    useEffect(() => {
        setLoadingApp(true)
        if (carrier_info?.onVacation) {
            setOnVacation(true)
            setLoadingApp(false)
        } else {
            setOnVacation(false)
            getOrdersList({ variables: { /* carrier: carrierID, */ after: '', before: '' } })
        }
        console.log('CAMBIO EL ESTAO DEL CARRIER', carrier_info?.onVacation)
    }, [carrier_info])

    const renderLoader = () => {
        return loadingScroll ? <Loading /> : null
    }

    const loadMore = () => {
        if (hasNextPage) {
            setLoadingScroll(true)
            getOrdersList({ variables: { /* carrier: carrierID, */  after: endCursor, before: '' } })
        } else {
            console.log(`No hay datos para cargar`)
        }
    }

    const reloadApp = () => {
        setLoadingApp(true)
        getOrdersList({ variables: { /* carrier: carrierID, */ after: '', before: '' } })
    }

    const doRefresh = () => {
        setRefreshing(true)
        getOrdersList({ variables: { /* carrier: carrierID, */ after: '', before: '' } })
    }

    const actionIcon = (name) => {
        return (
            <FontAwesome
                name={name}
                size={25}
                color={colors.SURFACE}
            />
        )
    }

    const actionsRefresh = [
        {
            text: "Actualizar",
            icon: actionIcon('refresh'),
            name: "bt_update",
            position: 1,
            color: Colors.COLORS.PRIMARY
        }
    ];

    const doAction = (action) => {
        switch (action) {
            case 'bt_update':
                doRefresh()
                break;
        }
    }

    if (loadingApp) return <Loading />

    return (
        <View style={{ flex: 1 }}>
            {error ?
                (
                    error.message == "on_vacation" ?
                        (
                            <View
                                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15, }}
                            >
                                <Typography bold h3 color={colors.ON_BACKGROUND}>
                                    No puede aceptar envíos.
                                </Typography>
                                <Typography color={colors.ON_BACKGROUND}>
                                    Usted está de vacaciones o las planificó a partir de mañana.
                                </Typography>
                                <FloatingAction
                                    color={Colors.COLORS.PRIMARY}
                                    overrideWithAction={true}
                                    actions={actionsRefresh}
                                    onPressItem={name => {
                                        doAction(name)
                                    }}
                                />
                            </View>
                        ) : (
                            <NetworkError accion={reloadApp} />
                        )
                ) :
                (
                    onVacation ? (
                        <View
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15, }}
                        >
                            <Typography bold h3 color={colors.ON_BACKGROUND}>
                                No puede aceptar envíos.
                            </Typography>
                            <Typography color={colors.ON_BACKGROUND}>
                                Usted está de vacaciones o las planificó a partir de mañana.
                            </Typography>
                            <FloatingAction
                                color={Colors.COLORS.PRIMARY}
                                overrideWithAction={true}
                                actions={actionsRefresh}
                                onPressItem={name => {
                                    doAction(name)
                                }}
                            />
                        </View>
                    ) : (
                        <>
                            <AcceptShippingList
                                navigation={navigation}
                                orders_list={orders}
                                doRefresh={doRefresh}
                                loadMore={loadMore}
                                renderLoader={renderLoader}
                                refreshing={refreshing}
                            />
                            <FloatingAction
                                color={Colors.COLORS.PRIMARY}
                                overrideWithAction={true}
                                actions={actionsRefresh}
                                onPressItem={name => {
                                    doAction(name)
                                }}
                            />
                        </>
                    )

                )}
        </View >
    )
}

export default AcceptShippingScreen