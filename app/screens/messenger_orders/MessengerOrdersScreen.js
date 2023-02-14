import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useLazyQuery } from '@apollo/client'
import { FloatingAction } from "react-native-floating-action";
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { messenger_orders } from '../../constants/mock'
import { Loading, NetworkError } from '../../components'
import MessengerOrdersList from './components/MessengerOrdersList'

import { ORDERS_LIST } from '../../graphql/orders'
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../../constants/Colors';
import { useTheme } from '@react-navigation/native';
import { setMessengerOrders } from '../../redux/messenger_orders/messenger_ordersSlice';

export default function MessengerOrdersScreen({ navigation }) {
	const { dark, colors } = useTheme()
	const [loadingApp, setLoadingApp] = useState(false)
	const [myOrders, setMyOrders] = useState([])
	const [refreshing, setRefreshing] = useState(false)
	const [loadingScroll, setLoadingScroll] = useState(false)
	const [hasNextPage, setHasNextPage] = useState(false)
	const [refreshingOtro, setRefreshingOtro] = useState(false)
	const [endCursor, setEndCursor] = useState("")
	const userStore = useSelector(state => state.userlogin)
	const messengerOrdersRedux = useSelector(state => state.messengerOrders)
	const dispatch = useDispatch()
	const carrierID = userStore.carrierInfo.serverId;

	console.log("messengerOrdersRedux.listado.length >> ", messengerOrdersRedux.listado.length)


	const [getOrdersList, { loading, error, data }] = useLazyQuery(ORDERS_LIST, {
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
				setMyOrders(elementos)
				dispatch(setMessengerOrders(elementos))
			} else {
				let elementos = []
				data.orders.edges.map((edges) => elementos.push(edges.node))
				setMyOrders([...myOrders, ...elementos])
				dispatch(setMessengerOrders([...myOrders, ...elementos]))
			}
			/* let elementos = []
			data.orders.edges.map((edges) => elementos.push(edges.node))
			setMyOrders(elementos) */
			setLoadingApp(false)
			setRefreshing(false)
			setLoadingScroll(false)
		},
		onError: () => {
			console.log('ERROR cargando ordenes >> ', error)
			console.log('ERROR cargando ordenes data var >> ', data)
			setLoadingApp(false)
			setRefreshing(false)
			setLoadingScroll(false)
		},
		fetchPolicy: "no-cache"
	})

	useEffect(() => {
		setLoadingApp(true)
		getOrdersList({ variables: { carrier: carrierID, after: '', before: '' } })
	}, [])

	useEffect(() => {
		setMyOrders(messengerOrdersRedux.listado)
	}, [messengerOrdersRedux.listado])

	/* useEffect(() => {
		if (data) {
			let elementos = []
			data.orders.edges.map((edges) => elementos.push(edges.node))
			setMyOrders(elementos)
			setLoadingApp(false)
		}
	}, [data]) */

	const renderLoader = () => {
		return loadingScroll ? <Loading /> : null
	}

	const loadMore = () => {
		if (hasNextPage) {
			setLoadingScroll(true)
			console.log(`CARGA MAS DATOSSS con endCursor > ${endCursor}`)
			getOrdersList({ variables: { carrier: carrierID, after: endCursor, before: '' } })
		} else {
			console.log(`No hay datos para cargar`)
		}
	}

	const reloadApp = () => {
		setLoadingApp(true)
		getOrdersList({ variables: { carrier: carrierID, after: '', before: '' } })
	}

	const doRefresh = () => {
		setRefreshing(true)
		getOrdersList({ variables: { carrier: carrierID, after: '', before: '' } })
	}

	/* setTimeout(() => {
		if (loadingApp) setLoadingApp(false)
	}, 2000) */

	const delete_messenger_orders = (ids) => {
		const list = messenger_orders.filter((list) => !ids.includes(list.id))
		messenger_orders.length = 0
		messenger_orders.push(...list)
	}

	const doAction = (action) => {
		switch (action) {
			case 'filtro_fecha':
				console.log('A ORDENAR POR LA FECHA')
				break;
			case 'filtro_envio':
				console.log('A ORDENAR POR EL ESTADO DE ENVIO DE LA ORDEN')
				break;
		}
	}

	const actionIcon = (name) => {
		return (
			<FontAwesome
				name={name}
				size={18}
				color={colors.SURFACE}
			/>
		)
	}

	const actionsButton = [
		{
			text: "Ordenar por Fecha",
			icon: actionIcon('calendar'),
			name: "filtro_fecha",
			position: 2,
			color: Colors.COLORS.PRIMARY
		},
		{
			text: "Ordenar por Estado de Envío",
			icon: actionIcon('truck'),
			name: "filtro_envio",
			position: 1,
			color: Colors.COLORS.PRIMARY
		}
	];

	if (loadingApp) return <Loading />

	return (
		<View style={{ flex: 1 }}>
			{error ?
				(
					<NetworkError accion={reloadApp} />
				) :
				(
					<>
						<MessengerOrdersList
							navigation={navigation}
							messenger_orders_list={myOrders}
							delete_messenger_orders={delete_messenger_orders}
							doRefresh={doRefresh}
							loadMore={loadMore}
							renderLoader={renderLoader}
							refreshing={refreshing}
						/>
						{/* <FloatingAction
							floatingIcon={<FontAwesome name='list-ol' size={25} color={colors.SURFACE} />}
							color={Colors.COLORS.PRIMARY}
							actions={actionsButton}
							onPressItem={name => {
								doAction(name)
							}}
						/> */}
					</>
				)
			}
		</View>
	)
}
