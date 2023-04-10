import React from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { useLazyQuery, NetworkStatus } from '@apollo/client'
import moment from 'moment'

import { ORDER_ID } from '../../graphql/orders'
import { Loading, Typography } from '../../components'
import { NetworkError } from '../../components'
import MessengerOrdersDetailNav from './components/MessengerOrdersDetailNav'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedOrder } from '../../redux/messenger_orders/messenger_ordersSlice'
import { useState } from 'react'
import { useEffect } from 'react'

moment.locale('es')

export default function MessengerOrdersDetailScreen({ route, navigation, ...props }) {
	const [orderDetails, setOrderDetails] = useState({})
	const dispatch = useDispatch()
	const messengerOrdersRedux = useSelector(state => state.messengerOrders)

	let messenger_orders_id = route.params?.messenger_orders_id

	const [getOrderDetail, { loading, error, data, networkStatus }] = useLazyQuery(ORDER_ID, {
		onCompleted: (data) => {
			setOrderDetails(data)
			dispatch(setSelectedOrder(data))
			//console.log('On complete >> ', data)
		},
		onError: () => {
			console.log('ERROR cargando orden >> ', error.errors)
			console.log('ERROR cargando orden data var >> ', data)
			console.log('ERROR cargando orden networkStatus >> ', networkStatus)
		},
		fetchPolicy: "no-cache"
	})

	const autoLoad = () => {
		getOrderDetail({
			variables: { id: messenger_orders_id },
		})
	}

	useEffect(() => {
		autoLoad()
	}, [])

	useEffect(() => {
		setOrderDetails(messengerOrdersRedux.selectedOrder)
	}, [messengerOrdersRedux.selectedOrder])

	if (networkStatus === NetworkStatus.error)
		return <NetworkError accion={autoLoad} />
	if (loading || error) return <Loading />
	if (data == undefined) return <Loading />
	if (Object.keys(orderDetails).length == 0) return <Loading />

	navigation.setOptions({
		title: `Orden # ` + orderDetails.order.number,
	})
	/* console.log("a mostar >> ", orderDetails.order.number)
	console.log("a mostar estado >> ", messengerOrdersRedux.selectedOrder.order.number) */
	return (
		<MessengerOrdersDetailNav data={data} />
	)
}

const styles = StyleSheet.create({
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
	avatar: {
		alignSelf: 'center',
		width: 124,
		height: 124,
		borderRadius: 50,
		borderWidth: 0,
	},
})
